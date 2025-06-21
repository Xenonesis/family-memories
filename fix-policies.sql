-- Drop existing policies that cause infinite recursion
DROP POLICY IF EXISTS "Users can view vault memberships" ON vault_members;
DROP POLICY IF EXISTS "Vault admins can manage members" ON vault_members;

-- Create new policies without circular references
CREATE POLICY "Users can view their own memberships" ON vault_members
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can view memberships in vaults they own" ON vault_members
  FOR SELECT USING (
    vault_id IN (
      SELECT id FROM vaults WHERE created_by = auth.uid()
    )
  );

CREATE POLICY "Vault creators can manage members" ON vault_members
  FOR INSERT WITH CHECK (
    vault_id IN (
      SELECT id FROM vaults WHERE created_by = auth.uid()
    )
  );

CREATE POLICY "Vault creators can update members" ON vault_members
  FOR UPDATE USING (
    vault_id IN (
      SELECT id FROM vaults WHERE created_by = auth.uid()
    )
  );

CREATE POLICY "Vault creators can delete members" ON vault_members
  FOR DELETE USING (
    vault_id IN (
      SELECT id FROM vaults WHERE created_by = auth.uid()
    )
  );