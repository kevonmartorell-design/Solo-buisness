import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const { phone, clientName, employeeName, status, dateTime, serviceName } = await req.json();

        if (!phone || !clientName || !status) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID');
        const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN');
        const TWILIO_PHONE_NUMBER = Deno.env.get('TWILIO_PHONE_NUMBER');

        if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
            console.error("Missing Twilio credentials in environment variables.");
            // Fail gracefully so the app doesn't crash if secrets aren't set
            return new Response(JSON.stringify({
                error: "Twilio credentials not configured. Notification skipped."
            }), {
                status: 200, // Returning 200 so the frontend approve/deny doesn't roll back
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        // Format the date/time nicely
        const dateObj = new Date(dateTime);
        const dateStr = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        const timeStr = dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

        let messageBody = '';

        if (status === 'approved') {
            messageBody = `Hi ${clientName}, your appointment for ${serviceName || 'a service'} with ${employeeName || 'us'} on ${dateStr} at ${timeStr} has been APPROVED! See you then.`;
        } else {
            messageBody = `Hi ${clientName}, unfortunately your request for ${serviceName || 'a service'} with ${employeeName || 'us'} on ${dateStr} at ${timeStr} was DECLINED. Please reach out to reschedule.`;
        }

        // Send to Twilio API
        const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;

        const body = new URLSearchParams({
            To: phone,
            From: TWILIO_PHONE_NUMBER,
            Body: messageBody
        });

        const twilioRes = await fetch(twilioUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`)}`
            },
            body: body.toString()
        });

        if (!twilioRes.ok) {
            const errorText = await twilioRes.text();
            console.error("Twilio API Error:", errorText);
            throw new Error(`Twilio API Error: ${twilioRes.statusText}`);
        }

        return new Response(JSON.stringify({ success: true }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        });

    } catch (error: any) {
        console.error("Error in notify-client:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
        });
    }
});
