export interface PhotoCount {
    count: number;
}

export interface VaultFromMember {
    id: string;
    name: string;
    description?: string;
    color: string;
    created_at: string;
    created_by: string;
    photos: PhotoCount[];
}

export interface VaultMember {
    role: string;
    vaults: VaultFromMember[];
}

export interface UserVaultResponse {
    role: string;
    vaults: {
        id: string;
        name: string;
        description?: string;
        color: string;
        created_at: string;
        created_by: string;
        photos: PhotoCount[];
    };
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name?: string;
          phone_number?: string;
          bio?: string;
          gender?: string;
          avatar_url?: string;
          notifications_enabled: boolean;
          email_updates_enabled: boolean;
          two_factor_enabled: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string;
          phone_number?: string;
          bio?: string;
          gender?: string;
          avatar_url?: string;
          notifications_enabled?: boolean;
          email_updates_enabled?: boolean;
          two_factor_enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          full_name?: string;
          phone_number?: string;
          bio?: string;
          gender?: string;
          avatar_url?: string;
          notifications_enabled?: boolean;
          email_updates_enabled?: boolean;
          two_factor_enabled?: boolean;
          updated_at?: string;
        };
      };
      vaults: {
        Row: {
          id: string;
          name: string;
          description?: string;
          color: string;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string;
          color: string;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          description?: string;
          color?: string;
          updated_at?: string;
        };
      };
      photos: {
        Row: {
          id: string;
          vault_id: string;
          uploaded_by: string;
          title: string;
          description?: string;
          file_url: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          vault_id: string;
          uploaded_by: string;
          title: string;
          description?: string;
          file_url: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          description?: string;
          file_url?: string;
          updated_at?: string;
        };
      };
    };
  };
};