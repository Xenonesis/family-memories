# 🧠 Full AI Prompt: Build Legacy – A Family Vault for Memories (AHH-1001)

You are a highly skilled AI full-stack developer assistant. I want you to build a complete full-stack project titled:

📛 **Project Name**: Legacy – A Family Vault for Memories  
🏷️ **Challenge ID**: AHH-1001  
💡 **Theme**: #FullStack #MediaHandling #FamilyArchive

---

## 🎯 Objective

Create a private, secure, and beautifully designed family memory vault application. The goal is to allow families to upload, store, and view precious memories (primarily photos) in a shared digital space. Think of it as a personalized, invite-only memory vault that preserves family history and strengthens connections across generations.

---

## 🛠️ Tech Stack

- **Frontend Framework**: Next.js 14+ (App Router, TypeScript)
- **UI Components**: ShadCN UI (with Tailwind CSS)
- **Animations**: Framer Motion for fluid interactions
- **Backend Platform**: Supabase (Authentication, PostgreSQL Database, Storage)
- **Deployment**: Vercel (for frontend) + Supabase (for backend services)
- **State Management**: React Context + Hooks
- **Form Handling**: React Hook Form with Zod validation
- **Image Processing**: Sharp.js for optimized uploads

---

## 🔐 Authentication Requirements (Supabase)

- Email/password sign up and login with strong validation
- Social login support (Google, optional GitHub)
- Magic link authentication for passwordless login
- Multi-factor authentication option for enhanced security
- Auth-protected routes in Next.js with server-side validation
- Session management with refresh tokens
- On login, fetch the user's associated vaults with role-based permissions

---

## 🧩 Feature Breakdown

### 1. Vault Management
- Users can create multiple vaults (name, description, theme color, cover photo)
- Vaults have an `owner_id` (creator) with special privileges
- Custom vault organization with tags/categories
- Vault statistics (member count, memory count, last activity)
- Vaults can have multiple members with different permission levels

### 2. Shared Vault Access
- Vault members are stored in a `vault_members` table with relationship metadata
- Roles: `owner` (full control), `admin` (can delete any upload), `contributor` (can add/edit/delete own), or `viewer` (read-only)
- Invite members via email, invite link, or QR code
- Pending invites expire after 7 days
- Activity log of member actions

### 3. Upload & View Memories
- Members can upload photos to Supabase Storage with proper MIME type validation
- Support for multiple image formats (JPEG, PNG, WEBP, HEIC)
- Automatic image optimization for faster loading
- Memories are linked to vaults and include:
  - `image_url` (with thumbnail and full resolution versions)
  - `uploaded_by` (user reference)
  - `title` and `description` (with rich text support)
  - `location_data` (optional geotag)
  - `created_at` (when photo was taken)
  - `uploaded_at` (when added to vault)
  - `tags` (searchable keywords)
- Memories are shown in a responsive image grid with multiple view options
  - Masonry layout for visual appeal
  - List view for detail-oriented browsing
  - Timeline/calendar view for chronological exploration
- Clicking on a memory shows a full preview modal with:
  - High-resolution image with zoom capability
  - Image metadata and description
  - Comments section
  - Sharing options (within vault members)

### 4. Safe Delete Mechanism
- Members can delete their own uploads with confirmation
- Admins can delete any memory after review
- Soft delete system with 30-day recovery period
- Democratic delete: add a `deletion_votes` table to require majority vote before deletion is accepted
- Audit log of deletion attempts and approvals

### 5. Vault Personalization
- Families can:
  - Rename their vault and add detailed description
  - Change theme color and visual aesthetics
  - Upload a custom cover photo
  - Set privacy preferences
  - Create custom categories for organizing memories
- Store this metadata in the `vaults` and `vault_settings` tables
- Custom display preferences per user

---

## 🗃️ Supabase Database Schema (in SQL)

```sql
-- Users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  display_name TEXT,
  avatar_url TEXT,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  
  -- User preferences
  theme_preference TEXT DEFAULT 'light',
  notification_settings JSONB DEFAULT '{"email": true, "push": false}'::jsonb
);

-- Vaults table
CREATE TABLE vaults (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  owner_id UUID REFERENCES users(id) NOT NULL,
  cover_photo_url TEXT,
  theme_color TEXT DEFAULT '#4F46E5',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  is_archived BOOLEAN DEFAULT false,
  
  -- Vault configuration
  settings JSONB DEFAULT '{"privacy_level": "invite_only", "allow_comments": true}'::jsonb
);

-- Vault members relationship table
CREATE TABLE vault_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vault_id UUID REFERENCES vaults(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('owner', 'admin', 'contributor', 'viewer')) DEFAULT 'contributor',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  invited_by UUID REFERENCES users(id),
  last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- Enforce unique membership
  UNIQUE (vault_id, user_id)
);

-- Pending invitations
CREATE TABLE vault_invitations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vault_id UUID REFERENCES vaults(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  invited_by UUID REFERENCES users(id),
  invitation_code TEXT UNIQUE NOT NULL,
  role TEXT CHECK (role IN ('admin', 'contributor', 'viewer')) DEFAULT 'contributor',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_accepted BOOLEAN DEFAULT false
);

-- Memories (photos and videos)
CREATE TABLE memories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vault_id UUID REFERENCES vaults(id) ON DELETE CASCADE NOT NULL,
  uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
  title TEXT,
  description TEXT,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  original_filename TEXT,
  file_type TEXT,
  file_size INTEGER,
  storage_path TEXT NOT NULL,
  
  -- Metadata
  taken_at TIMESTAMP WITH TIME ZONE,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  location_data JSONB,
  tags TEXT[],
  is_favorite BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0
);

-- Memory comments
CREATE TABLE memory_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  memory_id UUID REFERENCES memories(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Democratic deletion voting system
CREATE TABLE deletion_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  memory_id UUID REFERENCES memories(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  vote_type TEXT CHECK (vote_type IN ('keep', 'delete')) NOT NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  
  -- Each user can vote only once per memory
  UNIQUE (memory_id, user_id)
);

-- Activity log for audit purposes
CREATE TABLE activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vault_id UUID REFERENCES vaults(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create relevant indexes
CREATE INDEX idx_memories_vault_id ON memories(vault_id);
CREATE INDEX idx_memories_uploaded_by ON memories(uploaded_by);
CREATE INDEX idx_memories_tags ON memories USING GIN(tags);
CREATE INDEX idx_vault_members_vault_id ON vault_members(vault_id);
CREATE INDEX idx_vault_members_user_id ON vault_members(user_id);
CREATE INDEX idx_activity_logs_vault_id ON activity_logs(vault_id);
```

-- RLS Policies for security
```sql
-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE vaults ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE deletion_votes ENABLE ROW LEVEL SECURITY;

-- User profile access policies
CREATE POLICY user_read_own_profile ON users
  FOR SELECT USING (auth.uid() = id);
  
CREATE POLICY user_update_own_profile ON users
  FOR UPDATE USING (auth.uid() = id);

-- Vault access policies
CREATE POLICY vault_read_access ON vaults
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM vault_members 
      WHERE vault_members.vault_id = vaults.id 
      AND vault_members.user_id = auth.uid()
    ) OR owner_id = auth.uid()
  );

-- Memory access policies
CREATE POLICY memory_read_access ON memories
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM vault_members 
      WHERE vault_members.vault_id = memories.vault_id 
      AND vault_members.user_id = auth.uid()
    )
  );
```

---

## 🧱 Enhanced Folder Structure (Next.js App Router)

```
/app/
  layout.tsx              # Root layout with providers
  page.tsx                # Landing/marketing page
  error.tsx               # Global error handling
  loading.tsx             # Global loading state
  /auth/
    layout.tsx            # Auth layout
    login/
      page.tsx            # Login form
    signup/
      page.tsx            # Registration form
    verify/
      page.tsx            # Email verification
    reset-password/
      page.tsx            # Password reset flow
  /dashboard/
    layout.tsx            # Dashboard layout with navigation
    page.tsx              # Main dashboard with vault list
    profile/
      page.tsx            # User profile settings
    activity/
      page.tsx            # Recent activity across vaults
  /vault/
    [id]/
      layout.tsx          # Vault layout with vault header
      page.tsx            # Memory grid view
      settings/
        page.tsx          # Vault settings
        members/
          page.tsx        # Member management
        appearance/
          page.tsx        # Visual customization
      upload/
        page.tsx          # Upload interface
      memory/
        [memoryId]/
          page.tsx        # Single memory view

/components/
  ui/                     # ShadCN components
    button.tsx
    card.tsx
    dialog.tsx
    dropdown-menu.tsx
    form.tsx
    input.tsx
    toast.tsx
    # and other UI primitives
  layout/
    Header.tsx
    Footer.tsx
    Sidebar.tsx
    PageContainer.tsx
  auth/
    LoginForm.tsx
    SignupForm.tsx
    OAuthButtons.tsx
    PasswordField.tsx
  dashboard/
    VaultCard.tsx
    VaultGrid.tsx
    QuickStats.tsx
    RecentActivity.tsx
  vault/
    MemoryGrid.tsx        # Responsive image grid
    MemoryList.tsx        # Alternative list view
    MemoryCard.tsx        # Individual memory preview 
    MemoryView.tsx        # Full-screen memory viewer
    UploadMemory.tsx      # Upload form with preview
    DeleteModal.tsx       # Confirmation with voting UI
    InviteModal.tsx       # Member invitation form
    MemberList.tsx        # Member management
    VaultHeader.tsx       # Vault title and actions
    VaultSettings.tsx     # Settings panel
  common/
    EmptyState.tsx        # Empty state placeholder
    LoadingSpinner.tsx    # Loading indicator
    ErrorBoundary.tsx     # Error handling
    ImageOptimizer.tsx    # Image processing component
    SearchInput.tsx       # Reusable search field
    Pagination.tsx        # Pagination controls
    Breadcrumbs.tsx       # Navigation breadcrumbs
    
/lib/
  /api/
    memory.ts             # Memory CRUD operations
    vault.ts              # Vault management functions
    user.ts               # User profile functions
    invite.ts             # Invitation handling
  /hooks/
    useVault.ts           # Vault data and operations
    useMemories.ts        # Memory fetching and filtering
    useUpload.ts          # File upload with progress
    useAuth.ts            # Authentication state
    useMediaQuery.ts      # Responsive behavior
  /contexts/
    AuthContext.tsx       # Authentication state provider
    VaultContext.tsx      # Active vault context
    ThemeContext.tsx      # Theme preferences
  /utils/
    supabase.ts           # Supabase client initialization
    storage.ts            # Storage helper functions
    dates.ts              # Date formatting utilities
    validation.ts         # Form validation schemas
    imageProcessing.ts    # Image optimization functions
    security.ts           # Permission checking helpers
  /types/
    index.ts              # Type definitions
    supabase.ts           # Database type definitions
    
/styles/
  globals.css             # Global styles and Tailwind imports
  animations.css          # Custom animation keyframes
  theme.css               # Theme variables

/public/
  images/
    logo.svg
    hero-image.jpg
    placeholders/
      vault-placeholder.jpg
      memory-placeholder.jpg
      avatar-placeholder.png
  icons/
    favicon.ico
    apple-touch-icon.png
    
.env.example              # Environment variable template
tailwind.config.ts        # Tailwind configuration
next.config.js            # Next.js configuration
tsconfig.json             # TypeScript configuration
middleware.ts             # Auth and route middleware
```

---

## 🖼️ Pages and Functionality (Detailed)

### `/` - Landing Page
- Hero section with app value proposition
- Feature showcase with animations
- Testimonial carousel
- Security and privacy commitments
- Pricing tiers (if applicable)
- CTA buttons to login/register
- Footer with links and legal information

### `/auth/*` - Authentication Flow
- Login/signup with email validation
- Social login providers integration
- Password strength requirements
- Account recovery process
- Email verification steps
- Terms of service acceptance
- Privacy-first onboarding

### `/dashboard` - User Hub
- Welcome message with personalized greeting
- Quick stats (vaults owned, memories stored)
- List of vaults with:
  - Cover image preview
  - Last update timestamp
  - Member count indicator
  - Quick-access buttons
- Create new vault button with guided setup
- Activity feed showing recent actions
- Search across all accessible vaults
- Filter vaults by ownership, role, or activity

### `/vault/[id]` - Vault View
- Header with vault name, description, and actions
- Memory display with multiple view options:
  - Grid view (masonry layout)
  - List view (with metadata)
  - Timeline view (chronological sorting)
- Filter controls:
  - By date range
  - By uploader
  - By tags/categories
  - By media type
- Sort options:
  - Newest first
  - Oldest first
  - Most viewed
  - Recently added
- Memory upload button with:
  - Drag-and-drop interface
  - Multi-file selection
  - Progress indicators
  - EXIF data extraction
  - Optional metadata fields

### `/vault/[id]/memory/[memoryId]` - Memory Detail
- Full-screen image view with:
  - Image zoom controls
  - Next/previous navigation
  - Download button
  - Share options (within vault)
  - Edit metadata option
- Memory information panel:
  - Upload date
  - Taken date (if available)
  - Location data
  - Equipment used (from EXIF)
  - Tags
- Comment section with:
  - Threaded conversations
  - Emoji reactions
  - @mentions for other members

### `/vault/[id]/settings` - Vault Administration
- General settings:
  - Vault name and description
  - Cover photo selection
  - Theme customization
  - Privacy configuration
- Member management:
  - List of current members with roles
  - Invite new members interface
  - Role modification controls
  - Remove member option
  - Pending invitation management
- Storage management:
  - Usage statistics
  - Cleanup recommendations
  - Content organization tools
- Advanced settings:
  - Democratic deletion configuration
  - Notification preferences
  - Archive/deletion options
  - Export functionality

---

## 🎨 UI / UX Design Specifications

- **Design System**: 
  - Use **ShadCN UI** for consistent component styling
  - Design token system for colors, spacing, typography
  - Dark/light mode with smooth transitions
  - Responsive breakpoints for all screen sizes

- **Layout & Navigation**:
  - Multi-level responsive navigation
  - Persistent sidebar on larger screens
  - Bottom navigation on mobile
  - Breadcrumbs for deep navigation paths
  - Context-aware action buttons

- **Interactive Elements**:
  - Use **Framer Motion** for:
    - Page transitions (slide, fade, scale patterns)
    - Image hover effects with zoom/info reveal
    - Modal animations with backdrop blur
    - List item enter/exit animations
    - Loading state animations
    - Scroll-triggered reveal effects
  - Microinteractions for feedback:
    - Button press effects
    - Success/error animations
    - Upload progress indicators
    - Toast notifications

- **Visual Hierarchy**:
  - Card-based design for vault representations
  - Clear visual distinction between interactive elements
  - Typography scale with clear heading hierarchy
  - Color coding for status and categories
  - Empty states with helpful guidance

- **Accessibility**:
  - WCAG AA compliance minimum
  - Keyboard navigation support
  - Screen reader compatibility
  - Sufficient color contrast ratios
  - Focus indicators
  - Alternative text for all images
  - Reduced motion preferences

---

## ⚙️ Backend Services & Functions

### Authentication Services
```typescript
// auth.ts
export async function signUpUser(email: string, password: string, displayName: string): Promise<AuthResponse> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName,
      },
    },
  });
  
  if (error) throw new AuthError(error.message);
  
  // Create user profile
  if (data.user) {
    await createUserProfile(data.user.id, displayName, email);
  }
  
  return { user: data.user, session: data.session };
}

export async function signInUser(email: string, password: string): Promise<AuthResponse> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw new AuthError(error.message);
  return { user: data.user, session: data.session };
}

export async function signInWithProvider(provider: 'google' | 'github'): Promise<void> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  
  if (error) throw new AuthError(error.message);
}
```

### Vault Management
```typescript
// vault.ts
export async function createVault(
  name: string, 
  description: string, 
  ownerId: string, 
  themeColor: string = '#4F46E5',
  coverPhotoFile?: File
): Promise<Vault> {
  // Upload cover photo if provided
  let coverPhotoUrl = null;
  if (coverPhotoFile) {
    coverPhotoUrl = await uploadVaultCoverPhoto(ownerId, coverPhotoFile);
  }
  
  // Create vault record
  const { data: vault, error } = await supabase
    .from('vaults')
    .insert({
      name,
      description,
      owner_id: ownerId,
      theme_color: themeColor,
      cover_photo_url: coverPhotoUrl,
    })
    .select('*')
    .single();
  
  if (error) throw new VaultError(error.message);
  
  // Add owner as a vault member with owner role
  await addVaultMember(vault.id, ownerId, 'owner', ownerId);
  
  // Log vault creation activity
  await logActivity({
    vaultId: vault.id,
    userId: ownerId,
    actionType: 'vault_created',
    entityType: 'vault',
    entityId: vault.id,
    details: { name, description }
  });
  
  return vault;
}

export async function getVaultsByUser(userId: string): Promise<Vault[]> {
  // Get all vaults where user is a member
  const { data: memberships, error: memberError } = await supabase
    .from('vault_members')
    .select('vault_id, role')
    .eq('user_id', userId);
  
  if (memberError) throw new VaultError(memberError.message);
  
  if (!memberships || memberships.length === 0) {
    return [];
  }
  
  // Get full vault details
  const vaultIds = memberships.map(m => m.vault_id);
  const { data: vaults, error: vaultError } = await supabase
    .from('vaults')
    .select(`
      *,
      owner:users!vaults_owner_id_fkey(display_name, avatar_url),
      _count:vault_members(count),
      memory_count:memories(count)
    `)
    .in('id', vaultIds)
    .eq('is_archived', false);
  
  if (vaultError) throw new VaultError(vaultError.message);
  
  // Merge role information with vault data
  return vaults.map(vault => ({
    ...vault,
    userRole: memberships.find(m => m.vault_id === vault.id)?.role
  }));
}
```

### Media Management
```typescript
// memory.ts
export async function uploadMemory(
  vaultId: string,
  userId: string,
  file: File,
  metadata: MemoryMetadata
): Promise<Memory> {
  // Process image for optimization
  const { optimizedFile, thumbnail } = await processImageForUpload(file);
  
  // Extract EXIF data
  const exifData = await extractImageMetadata(file);
  
  // Create unique storage path
  const storageFilename = `${uuidv4()}-${sanitizeFilename(file.name)}`;
  const storagePath = `vaults/${vaultId}/memories/${storageFilename}`;
  
  // Upload to Supabase Storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('memories')
    .upload(storagePath, optimizedFile);
  
  if (uploadError) throw new UploadError(uploadError.message);
  
  // Upload thumbnail
  const thumbPath = `vaults/${vaultId}/thumbnails/${storageFilename}`;
  await supabase.storage
    .from('memories')
    .upload(thumbPath, thumbnail);
  
  // Get public URLs
  const imageUrl = getPublicUrl('memories', storagePath);
  const thumbnailUrl = getPublicUrl('memories', thumbPath);
  
  // Create database record
  const { data: memory, error } = await supabase
    .from('memories')
    .insert({
      vault_id: vaultId,
      uploaded_by: userId,
      title: metadata.title || file.name,
      description: metadata.description,
      image_url: imageUrl,
      thumbnail_url: thumbnailUrl,
      original_filename: file.name,
      file_type: file.type,
      file_size: file.size,
      storage_path: storagePath,
      taken_at: exifData.dateTaken || new Date().toISOString(),
      location_data: exifData.gpsData || null,
      tags: metadata.tags || []
    })
    .select('*')
    .single();
  
  if (error) throw new DatabaseError(error.message);
  
  // Log upload activity
  await logActivity({
    vaultId,
    userId,
    actionType: 'memory_uploaded',
    entityType: 'memory',
    entityId: memory.id,
    details: { title: memory.title }
  });
  
  return memory;
}

export async function getMemoriesByVault(
  vaultId: string,
  options?: {
    page?: number,
    limit?: number,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc',
    filters?: Record<string, any>
  }
): Promise<{ memories: Memory[], total: number }> {
  // Default pagination and sorting
  const page = options?.page || 1;
  const limit = options?.limit || 24;
  const offset = (page - 1) * limit;
  const sortBy = options?.sortBy || 'uploaded_at';
  const sortOrder = options?.sortOrder || 'desc';
  
  // Base query
  let query = supabase
    .from('memories')
    .select(`
      *,
      uploader:users!memories_uploaded_by_fkey(display_name, avatar_url),
      comments:memory_comments(count),
      _count
    `, { count: 'exact' })
    .eq('vault_id', vaultId);
  
  // Apply filters
  if (options?.filters) {
    const { dateRange, uploaderId, tags } = options.filters;
    
    if (dateRange?.from) {
      query = query.gte('taken_at', dateRange.from);
    }
    if (dateRange?.to) {
      query = query.lte('taken_at', dateRange.to);
    }
    if (uploaderId) {
      query = query.eq('uploaded_by', uploaderId);
    }
    if (tags && tags.length > 0) {
      query = query.overlaps('tags', tags);
    }
  }
  
  // Apply sorting and pagination
  const { data, error, count } = await query
    .order(sortBy, { ascending: sortOrder === 'asc' })
    .range(offset, offset + limit - 1);
  
  if (error) throw new DatabaseError(error.message);
  
  return {
    memories: data || [],
    total: count || 0
  };
}
```

### Member Management
```typescript
// members.ts
export async function inviteUserToVault(
  vaultId: string,
  email: string,
  role: 'admin' | 'contributor' | 'viewer',
  invitedBy: string
): Promise<VaultInvitation> {
  // Generate unique invitation code
  const invitationCode = generateInvitationCode();
  
  // Set expiration (7 days from now)
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  
  // Create invitation record
  const { data: invitation, error } = await supabase
    .from('vault_invitations')
    .insert({
      vault_id: vaultId,
      email,
      invited_by: invitedBy,
      invitation_code: invitationCode,
      role,
      expires_at: expiresAt.toISOString()
    })
    .select()
    .single();
  
  if (error) throw new InvitationError(error.message);
  
  // Send invitation email
  await sendInvitationEmail(email, vaultId, invitationCode);
  
  return invitation;
}

export async function acceptInvitation(
  invitationCode: string,
  userId: string
): Promise<VaultMember> {
  // Find and validate invitation
  const { data: invitation, error: inviteError } = await supabase
    .from('vault_invitations')
    .select('*, vault:vaults(*)')
    .eq('invitation_code', invitationCode)
    .single();
  
  if (inviteError || !invitation) {
    throw new InvitationError('Invalid or expired invitation');
  }
  
  if (new Date(invitation.expires_at) < new Date()) {
    throw new InvitationError('Invitation has expired');
  }
  
  // Check if user is already a member
  const { data: existingMember } = await supabase
    .from('vault_members')
    .select('*')
    .eq('vault_id', invitation.vault_id)
    .eq('user_id', userId)
    .maybeSingle();
  
  if (existingMember) {
    throw new InvitationError('You are already a member of this vault');
  }
  
  // Add user as vault member
  const { data: member, error: memberError } = await supabase
    .from('vault_members')
    .insert({
      vault_id: invitation.vault_id,
      user_id: userId,
      role: invitation.role,
      invited_by: invitation.invited_by
    })
    .select()
    .single();
  
  if (memberError) throw new DatabaseError(memberError.message);
  
  // Mark invitation as accepted
  await supabase
    .from('vault_invitations')
    .update({ is_accepted: true })
    .eq('id', invitation.id);
  
  // Log activity
  await logActivity({
    vaultId: invitation.vault_id,
    userId,
    actionType: 'member_joined',
    entityType: 'vault',
    entityId: invitation.vault_id,
    details: { role: invitation.role }
  });
  
  return member;
}
```

---

## ✅ Must-Have Deliverables (Enhanced)

- 🛠️ Complete Next.js codebase with:
  - Type-safe components with TypeScript
  - Proper error boundaries and fallbacks
  - SEO optimization for public pages
  - Responsive design for all screen sizes
  - Performance optimized loading strategies

- 💾 Supabase integration:
  - Complete SQL schema with indexes
  - Row-level security policies
  - Storage bucket configuration
  - Edge function webhooks for notifications

- 🎨 UI/UX implementation:
  - Fully styled components using ShadCN + Tailwind
  - Design tokens for theming
  - Consistent spacing and layout system
  - Responsive grid systems
  - Accessibility compliance

- 🎬 Interactive elements:
  - Animations with Framer Motion
  - Drag and drop interactions
  - Image gallery with gestures
  - Smooth transitions between states
  - Loading skeletons and indicators

- 🔐 Security features:
  - Route protection
  - Role-based access control
  - Content permission validations
  - Input sanitization
  - CSRF protection

- 📦 Deployment configuration:
  - Vercel deployment settings
  - Environment variables documentation
  - Supabase project setup guide
  - CI/CD pipeline configuration (optional)
  - Performance monitoring setup

- 📄 Documentation:
  - Detailed README.md with setup instructions
  - API documentation for backend functions
  - Component documentation for frontend
  - `.env.example` file with required variables
  - User guide for family administrators

---

## 📱 Additional Enhancements

### Responsive Design
- Mobile-first approach with progressive enhancement
- Touch-optimized interfaces for mobile users
- Adaptive layouts for different screen sizes
- Device-specific optimizations (tablet layouts)
- Custom navigation patterns for small screens

### Theme System
- Dark mode with automatic system preference detection
- Custom color scheme options per vault
- High contrast accessibility mode
- Font size adjustment options
- Custom CSS variables for theming

### Enhanced Media Features
- Timeline view with date grouping and zoom levels
- Map view for geotagged memories
- Facial recognition for organizing photos by person
- Advanced search with natural language processing
- AI-generated descriptions and tags for photos

### Social Features
- In-app notifications for new uploads and comments
- Reaction system beyond simple likes
- Comment threading with rich text support
- @mentions to notify specific members
- Activity feed with personalized updates

### Data Management
- Bulk import tools for existing photo collections
- Export functionality (zip archives, Google Photos)
- Duplicate detection when uploading
- Smart album generation based on events, dates, or locations
- Data retention policies and automatic archiving options

---

## 🗂️ Bonus Features (Optional – For Extra Points)

### ✅ Voting-Based Deletion
- Require a majority vote before deleting any photo — encouraging group trust and preservation over impulse.
- Interface for viewing pending deletion requests
- Notification for members when a deletion vote is created
- Analytics on deletion patterns

### 🔍 Media Verification Flow
- Add a "pending" state for uploaded media that must be approved by the admin before becoming visible.
- Review queue for administrators
- Content moderation tools
- Approval history tracking

### 🔊 Support for Audio & Video
- Extend the vault to handle not just photos, but full memories — like voice recordings and home videos.
- Custom players for different media types
- Thumbnails generation for videos
- Audio waveform visualization
- Transcript generation for audio/video

### ⏱️ Memory Timeline
- Organize media chronologically so families can scroll through their history visually.
- Interactive timeline navigation
- Year/month/day filtering
- Event markers for important dates
- Milestones highlighting

### 📝 Legacy Notes
- Let users leave meaningful written messages for future generations to read.
- Rich text editor for notes
- Scheduled release of messages
- Time capsule functionality
- Memory association with notes

---

## 💭 Why Build This?

Legacy is more than an app — it's a gesture of care, memory, and togetherness. Whether you're uploading old, scanned photos or recent celebrations, you're creating a digital timeline for your family's history.

In an age where photos are scattered across devices, social media, and cloud services, Legacy provides a meaningful, private alternative that brings families together around their shared memories, helping preserve the stories that matter most for generations to come.

---

👉 Now generate all required code, components, pages, API utilities, and SQL schema for this app.