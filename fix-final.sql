-- Drop ALL existing policies
DROP POLICY IF EXISTS "Users can view vaults they are members of" ON vaults;
DROP POLICY IF EXISTS "Users can view their own vaults" ON vaults;
DROP POLICY IF EXISTS "Users can view vault memberships" ON vault_members;
DROP POLICY IF EXISTS "Users can view their own memberships" ON vault_members;
DROP POLICY IF EXISTS "Users can view memberships in vaults they own" ON vault_members;
DROP POLICY IF EXISTS "Vault admins can manage members" ON vault_members;
DROP POLICY IF EXISTS "Vault creators can manage members" ON vault_members;
DROP POLICY IF EXISTS "Vault creators can update members" ON vault_members;
DROP POLICY IF EXISTS "Vault creators can delete members" ON vault_members;

-- Create clean policies
CREATE POLICY "vault_select" ON vaults FOR SELECT USING (created_by = auth.uid());
CREATE POLICY "member_select" ON vault_members FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "member_manage" ON vault_members FOR ALL USING (
  vault_id IN (SELECT id FROM vaults WHERE created_by = auth.uid())
);