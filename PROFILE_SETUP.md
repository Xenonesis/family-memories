# Profile Page Setup Instructions

## Database Setup

1. **Run the profiles schema in your Supabase SQL editor:**
   ```sql
   -- Copy and paste the contents of profiles-schema.sql into your Supabase SQL editor
   ```

2. **The schema will create:**
   - `profiles` table to store user profile information
   - RLS policies for secure access
   - Automatic profile creation trigger when users sign up

## Features Added

### Profile Page (`/profile`)
- **Personal Information:**
  - Full name editing
  - Phone number input
  - Bio/description field
  - Email display (read-only)

- **Notification Settings:**
  - Push notifications toggle
  - Email updates toggle

- **Security Settings:**
  - Two-factor authentication toggle
  - Change password button

- **Profile Summary:**
  - User avatar placeholder
  - Contact information display
  - Account details

### Database Integration
- Connects to Supabase `profiles` table
- Automatic profile creation on first visit
- Real-time updates when saving changes
- Secure RLS policies

### Navigation Updates
- `/settings` now redirects to `/profile`
- Dashboard links updated to point to profile page
- Maintains existing UI consistency

## Usage

1. Users can access the profile page at `/profile`
2. All profile data is automatically synced with Supabase
3. Settings are persisted across sessions
4. Phone number and other details are stored securely

## Files Created/Modified

- `src/app/profile/page.tsx` - Main profile page component
- `src/lib/profile.ts` - Profile management functions
- `profiles-schema.sql` - Database schema for profiles table
- `src/app/settings/page.tsx` - Updated to redirect to profile
- `src/app/dashboard/page.tsx` - Updated navigation links