
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zieqeknyzporeqdkqhqb.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppZXFla255enBvcmVxZGtxaHFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0MjIxODgsImV4cCI6MjA4NTk5ODE4OH0.EyAmLujuco19xau28w9zDBuz0JR1H0F-cZ-HRPFygsc';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
    console.log('Starting Backend Verification...');

    // 1. Auth / Setup
    const email = `test_verify_${Date.now()}@example.com`;
    const password = 'password123';

    console.log(`Creating test user: ${email}`);
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
    });

    if (authError) {
        console.error('Auth Error:', authError);
        return;
    }

    const userId = authData.user?.id;
    if (!userId) {
        console.error('No user ID returned');
        return;
    }
    console.log(`User created: ${userId}`);

    // Wait a bit for triggers to create profile/org if any
    await new Promise(r => setTimeout(r, 2000));

    // Get Organization ID
    const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', userId)
        .single();

    let orgId = profile?.organization_id;

    if (!orgId) {
        console.log('No organization found, creating one...');
        const { data: org, error: orgError } = await supabase
            .from('organizations')
            .insert([{ name: 'Test Org', tier: 'business' }])
            .select()
            .single();

        if (orgError) {
            console.error('Org Creation Error:', orgError);
            return;
        }
        orgId = org.id;

        // Update profile
        await supabase
            .from('profiles')
            .update({ organization_id: orgId })
            .eq('id', userId);

        console.log(`Created Org: ${orgId}`);
    } else {
        console.log(`Found Org: ${orgId}`);
    }

    // 2. Financials Test
    console.log('\n--- Testing Financials (Expenses) ---');
    const expenseData = {
        organization_id: orgId,
        amount: 100.50,
        description: 'Verification Script Expense',
        category: 'Office',
        date: new Date().toISOString()
    };

    const { data: expense, error: expenseError } = await supabase
        .from('expenses')
        .insert([expenseData])
        .select()
        .single();

    if (expenseError) {
        console.error('Expense Insert Failed:', expenseError);
    } else {
        console.log('Expense Inserted:', expense.id, expense.amount);

        // Verify Read
        const { data: readExpense } = await supabase
            .from('expenses')
            .select('*')
            .eq('id', expense.id)
            .single();

        if (readExpense?.description === 'Verification Script Expense') {
            console.log('Expense Read Verified √');
        } else {
            console.error('Expense Read Failed');
        }

        // Cleanup
        await supabase.from('expenses').delete().eq('id', expense.id);
        console.log('Expense Cleaned up');
    }

    // 3. Vault Test
    console.log('\n--- Testing Vault ---');
    const fileName = `test_doc_${Date.now()}.txt`;
    const filePath = `${orgId}/${fileName}`;
    const fileContent = 'This is a test document content.';

    // Upload
    const { data: uploadData, error: uploadError } = await supabase.storage
        .from('vault_documents')
        .upload(filePath, fileContent);

    if (uploadError) {
        console.error('Storage Upload Failed:', uploadError);
    } else {
        console.log('Storage Upload Success:', uploadData.path);

        // Insert Meta
        const { data: vaultDoc, error: vaultError } = await supabase
            .from('vault_documents')
            .insert([{
                organization_id: orgId,
                name: 'Test Document',
                type: 'Contract',
                file_path: filePath,
                status: 'Verified',
                file_size: '30 bytes'
            }])
            .select()
            .single();

        if (vaultError) {
            console.error('Vault Meta Insert Failed:', vaultError);
        } else {
            console.log('Vault Record Inserted:', vaultDoc.id);

            // Signed URL
            const { data: signedUrl } = await supabase.storage
                .from('vault_documents')
                .createSignedUrl(filePath, 60);

            if (signedUrl?.signedUrl) {
                console.log('Signed URL Generated √');
            } else {
                console.error('Signed URL Generation Failed');
            }

            // Cleanup
            await supabase.from('vault_documents').delete().eq('id', vaultDoc.id);
            await supabase.storage.from('vault_documents').remove([filePath]);
            console.log('Vault Cleaned up');
        }
    }

    console.log('\nVerification Complete.');
}

main().catch(console.error);
