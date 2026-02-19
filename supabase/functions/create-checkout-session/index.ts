import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
    httpClient: Stripe.createFetchHttpClient(),
});

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
        );

        const { data: { user } } = await supabaseClient.auth.getUser();

        if (!user) throw new Error('Unauthenticated');

        const { tier } = await req.json();

        // Get organization ID from profile
        const { data: profile, error: profileError } = await supabaseClient
            .from('profiles')
            .select('organization_id')
            .eq('id', user.id)
            .single();

        if (profileError || !profile?.organization_id) {
            throw new Error('Organization not found');
        }

        // Get organization details
        const { data: org, error: orgError } = await supabaseClient
            .from('organizations')
            .select('stripe_customer_id, business_name')
            .eq('id', profile.organization_id)
            .single();

        if (orgError || !org) throw new Error('Organization not found');

        let customerId = org.stripe_customer_id;

        if (!customerId) {
            const customer = await stripe.customers.create({
                email: user.email,
                name: org.business_name,
                metadata: {
                    org_id: profile.organization_id,
                },
            });
            customerId = customer.id;

            await supabaseClient
                .from('organizations')
                .update({ stripe_customer_id: customerId })
                .eq('id', profile.organization_id);
        }

        const priceId = tier === 'business' ? Deno.env.get('STRIPE_PRICE_BUSINESS') : Deno.env.get('STRIPE_PRICE_SOLO');

        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            line_items: [{ price: priceId, quantity: 1 }],
            mode: 'subscription',
            success_url: `${req.headers.get('origin')}/dashboard/settings?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.get('origin')}/dashboard/settings`,
            metadata: {
                org_id: profile.organization_id,
                tier: tier,
            },
        });

        return new Response(JSON.stringify({ url: session.url }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        });
    }
});
