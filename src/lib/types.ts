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
