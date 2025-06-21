-- Drop existing restrictive vault policy
DROP POLICY IF EXISTS "vault_select" ON vaults;

-- Allow all logged in users to view vaults
CREATE POLICY "vault_select" ON vaults FOR SELECT USING (auth.uid() IS NOT NULL);