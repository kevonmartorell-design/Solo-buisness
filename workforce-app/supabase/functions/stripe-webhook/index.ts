import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
    httpClient: Stripe.createFetchHttpClient(),
});

Deno.serve(async (req) => {
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
        return new Response('No signature', { status: 400 });
    }

    const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    let event;

    try {
        const body = await req.text();
        event = await stripe.webhooks.constructEventAsync(body, signature, endpointSecret || '');
    } catch (err) {
        return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }

    const supabaseAdmin = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const session = event.data.object as any;

    switch (event.type) {
        case 'checkout.session.completed':
        case 'customer.subscription.updated':
        case 'customer.subscription.deleted': {
            const subscriptionId = session.subscription || session.id;
            const subscription = await stripe.subscriptions.retrieve(subscriptionId);

            const customerId = subscription.customer as string;
            const status = subscription.status;
            const periodEnd = new Date(subscription.current_period_end * 1000).toISOString();

            // Get the price/product to determine tier
            const priceId = subscription.items.data[0].price.id;
            let tier = 'free';
            if (priceId === Deno.env.get('STRIPE_PRICE_BUSINESS')) tier = 'business';
            else if (priceId === Deno.env.get('STRIPE_PRICE_SOLO')) tier = 'solo';

            // Update organization
            const { error } = await supabaseAdmin
                .from('organizations')
                .update({
                    subscription_status: status,
                    subscription_period_end: periodEnd,
                    stripe_subscription_id: subscriptionId,
                    tier: tier
                })
                .eq('stripe_customer_id', customerId);

            if (error) console.error('Error updating org via webhook:', error);
            break;
        }
    }

    return new Response(JSON.stringify({ received: true }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
    });
});
