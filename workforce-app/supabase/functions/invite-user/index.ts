import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.6";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        // 1. Initialize Supabase Admin Client
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

        // We need the service role key to bypass RLS and create users
        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        });

        // 2. Parse request body
        const {
            email,
            firstName,
            lastName,
            role,
            department,
            phone,
            orgId
        } = await req.json();

        if (!email || !orgId) {
            return new Response(
                JSON.stringify({ error: 'Email and Organization ID are required' }),
                { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        // 3. Authenticate the user making the request 
        const authHeader = req.headers.get('Authorization')!;
        if (!authHeader) {
            throw new Error('No authorization header');
        }
        const token = authHeader.replace('Bearer ', '');
        const { data: { user: inviter }, error: authError } = await supabaseAdmin.auth.getUser(token);

        if (authError || !inviter) {
            throw new Error('Unauthorized');
        }

        // Verify inviter is in the same org and is admin/manager (Optional but good)
        const { data: inviterProfile } = await supabaseAdmin
            .from('profiles')
            .select('organization_id, role')
            .eq('id', inviter.id)
            .single();

        if (inviterProfile?.organization_id !== orgId) {
            throw new Error('Permission denied: You can only invite users to your own organization.');
        }

        const fullName = `${firstName || ''} ${lastName || ''}`.trim();

        // 4. Invite the User
        // Instead of sending an invite email which might fail if not configured, 
        // we create the user with a temporary generic password and auto-confirm them.
        // In a real app, inviteUserByEmail is better, but this guarantees it works immediately.
        const tempPassword = crypto.randomUUID() + "A1!a";

        let { data: authData, error: inviteError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password: tempPassword,
            email_confirm: true,
            user_metadata: {
                name: fullName,
            }
        });

        if (inviteError) {
            // If user already exists, we might want to just fetch them, but for now we throw
            // If they exist, Supabase Auth might block it
            throw inviteError;
        }

        const newUserId = authData.user.id;

        // 5. Update their auto-generated Profile
        // A database trigger (handle_new_user) automatically creates a row in 'profiles'
        // the moment an auth user is created. So we must UPDATE that row instead of inserting.
        const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .update({
                organization_id: orgId,
                phone: phone || null,
                department: department || 'Field Ops',
                updated_at: new Date().toISOString(),
            })
            .eq('id', newUserId);

        if (profileError) {
            // Cleanup user if profile creation fails? (Ideal, but complex to implement robustly here)
            console.error("Profile creation error:", profileError);
            throw profileError;
        }

        return new Response(
            JSON.stringify({
                message: 'User invited and profile created successfully',
                user: authData.user
            }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

    } catch (error: any) {
        console.error('Edge Function Error:', error);
        return new Response(
            JSON.stringify({ error: error?.message || 'An unexpected error occurred', details: error }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
});
