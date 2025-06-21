-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create vaults table
CREATE TABLE vaults (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  color VARCHAR(50) DEFAULT 'bg-blue-500',
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vault_members table
CREATE TABLE vault_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  vault_id UUID REFERENCES vaults(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(20) DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(vault_id, user_id)
);

-- Create photos table
CREATE TABLE photos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  vault_id UUID REFERENCES vaults(id) ON DELETE CASCADE,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(100),
  status VARCHAR(20) DEFAULT 'approved',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create photo_likes table
CREATE TABLE photo_likes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  photo_id UUID REFERENCES photos(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(photo_id, user_id)
);

-- Enable RLS on all tables
ALTER TABLE vaults ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE photo_likes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for vaults
CREATE POLICY "Users can view vaults they are members of" ON vaults
  FOR SELECT USING (
    id IN (
      SELECT vault_id FROM vault_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create vaults" ON vaults
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Vault creators can update their vaults" ON vaults
  FOR UPDATE USING (auth.uid() = created_by);

-- RLS Policies for vault_members
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

-- RLS Policies for photos
CREATE POLICY "Users can view photos in their vaults" ON photos
  FOR SELECT USING (
    vault_id IN (
      SELECT vault_id FROM vault_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Vault members can upload photos" ON photos
  FOR INSERT WITH CHECK (
    vault_id IN (
      SELECT vault_id FROM vault_members WHERE user_id = auth.uid()
    ) AND auth.uid() = uploaded_by
  );

CREATE POLICY "Users can update their own photos" ON photos
  FOR UPDATE USING (auth.uid() = uploaded_by);

CREATE POLICY "Users can delete their own photos" ON photos
  FOR DELETE USING (auth.uid() = uploaded_by);

-- RLS Policies for photo_likes
CREATE POLICY "Users can view likes on photos in their vaults" ON photo_likes
  FOR SELECT USING (
    photo_id IN (
      SELECT id FROM photos WHERE vault_id IN (
        SELECT vault_id FROM vault_members WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can like photos in their vaults" ON photo_likes
  FOR INSERT WITH CHECK (
    photo_id IN (
      SELECT id FROM photos WHERE vault_id IN (
        SELECT vault_id FROM vault_members WHERE user_id = auth.uid()
      )
    ) AND auth.uid() = user_id
  );

CREATE POLICY "Users can remove their own likes" ON photo_likes
  FOR DELETE USING (auth.uid() = user_id);

-- Function to automatically add vault creator as admin
CREATE OR REPLACE FUNCTION add_vault_creator_as_admin()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO vault_members (vault_id, user_id, role)
  VALUES (NEW.id, NEW.created_by, 'admin');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER add_vault_creator_as_admin_trigger
  AFTER INSERT ON vaults
  FOR EACH ROW
  EXECUTE FUNCTION add_vault_creator_as_admin();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add update triggers
CREATE TRIGGER update_vaults_updated_at
  BEFORE UPDATE ON vaults
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_photos_updated_at
  BEFORE UPDATE ON photos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_vault_members_user_id ON vault_members(user_id);
CREATE INDEX idx_vault_members_vault_id ON vault_members(vault_id);
CREATE INDEX idx_photos_vault_id ON photos(vault_id);
CREATE INDEX idx_photos_created_at ON photos(created_at DESC);
CREATE INDEX idx_photo_likes_photo_id ON photo_likes(photo_id);

-- Create storage bucket for photos
INSERT INTO storage.buckets (id, name, public) VALUES ('photos', 'photos', true);

-- Storage policies
CREATE POLICY "Users can upload photos to their vaults" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'photos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'photos');

CREATE POLICY "Users can delete their own photos" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'photos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );