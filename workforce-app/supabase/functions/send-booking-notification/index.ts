
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const supabaseStr = Deno.env.get('SUPABASE_URL') ?? '';
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

        // Log for debugging if env vars are missing
        if (!supabaseStr || !supabaseKey) {
            console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
            // We might return an error, but let's try to proceed or just log.
        }

        const supabase = createClient(supabaseStr, supabaseKey);

        const { booking_id } = await req.json();

        if (!booking_id) {
            throw new Error('Missing booking_id');
        }

        // 1. Fetch Booking Details
        const { data: booking, error: bookingError } = await supabase
            .from('bookings')
            .select(`
            *,
            service:services(name, price, duration),
            client:clients(name, email, phone)
        `)
            .eq('id', booking_id)
            .single();

        if (bookingError || !booking) {
            console.error('Error fetching booking:', bookingError);
            throw new Error('Booking not found');
        }

        // 2. Fetch Organization Owner Email
        const { data: profiles, error: profileError } = await supabase
            .from('profiles')
            .select('email')
            .eq('organization_id', booking.organization_id)
            // .eq('role', 'Owner') // Assuming role exists. If not, just take the first user.
            .limit(1);

        let ownerEmail = 'admin@example.com';
        let ownerFound = false;

        if (profiles && profiles.length > 0) {
            ownerEmail = profiles[0].email;
            ownerFound = true;
        }

        // 3. Send Email (Mocked)
        console.log(`[Email Notification] To: ${ownerEmail}`);
        console.log(`[Email Notification] Subject: New Booking: ${booking.service?.name}`);
        console.log(`[Email Notification] Body: You have a new booking from ${booking.client?.name} for ${booking.service?.name} at ${booking.booking_datetime}.`);

        if (!ownerFound) {
            console.warn(`[Email Notification] No owner found for org ${booking.organization_id}. Using default.`);
        }

        return new Response(
            JSON.stringify({ message: "Notification sent (logged)", booking_id }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );

    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
});
