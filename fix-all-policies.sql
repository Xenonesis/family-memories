-- Drop all problematic policies
DROP POLICY IF EXISTS "Users can view vaults they are members of" ON vaults;
DROP POLICY IF EXISTS "Users can view vault memberships" ON vault_members;
DROP POLICY IF EXISTS "Vault admins can manage members" ON vault_members;

-- Simple vault policies without circular references
CREATE POLICY "Users can view their own vaults" ON vaults
  FOR SELECT USING (created_by = auth.uid());

-- Simple vault_members policies without circular references  
CREATE POLICY "Users can view their own memberships" ON vault_members
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Vault creators can manage members" ON vault_members
  FOR ALL USING (
    vault_id IN (
      SELECT id FROM vaults WHERE created_by = auth.uid()
    )
  );