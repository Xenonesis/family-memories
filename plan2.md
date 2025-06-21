# 📂 Family Vault: Legacy Memory Vault - Plan

## 🏠 Project Overview
**Family Vault** is a secure, shared digital vault for families to preserve and access their cherished memories. Built with Next.js, Supabase, ShadCN UI, and Framer Motion, it enables multi-user collaboration with strong media handling, privacy, and personalization.

---

## 🔑 Core Features (Must-Have)

### 👥 Shared Vault Access
- Users can create, join, and contribute to a shared family vault.
- Vaults can have multiple members with access control.

### 🔥 Upload & View Memories
- Members can upload and browse images.
- Uploaded media is visible to all vault members.

### ❖ Safe Delete Mechanism
- Users can delete their own uploads.
- Admin can manage deletion for the vault.
- Optional: Implement democratic deletion systems.

### 🌺 Vault Personalization
- Families can customize the vault name, cover photo, and theme color.

---

## ✨ Bonus Features (Optional — For Extra Points)

### 📊 Voting-Based Deletion
- Photos can only be deleted after a majority vote from vault members.

### 🔐 Media Verification Flow
- Uploaded content goes into a "pending" state.
- Admin approval required before making content public in the vault.

### 🎥 Support for Audio & Video
- Extend media uploads to include audio recordings and home videos.

### ⏲️ Memory Timeline
- Chronologically organize uploads for easy browsing of family history.

### 📝 Legacy Notes
- Allow users to write and attach meaningful notes for future generations.

---

## 🖐 Judging Criteria

### 🌟 Functionality
- Support seamless upload, viewing, and management of media.

### 🧑‍🤝‍🧑 User Experience
- Ensure intuitive UX for all age groups.

### 🧬 Technical Design
- Secure and efficient media handling.
- Optional features (like deletion logic and encryption) thoughtfully implemented.

### 🏰 Bonus Innovation
- Are features like voting, legacy notes, and encryption designed meaningfully?

---

## ⚙️ Tech Stack
- **Frontend**: Next.js, ShadCN UI, Framer Motion
- **Backend**: Supabase (Auth, Realtime Database, Storage, Row-Level Security)
- **Security**: Optional client-side encryption, safe delete flags

---

## 📊 Implementation Phases

### Phase 1: Core Features
- [ ] Shared vault creation, join, invite flow
- [ ] Image upload, listing, viewing
- [ ] Delete & admin control flow
- [ ] Vault personalization

### Phase 2: Bonus Features
- [ ] Voting-based deletion system
- [ ] Media verification workflow
- [ ] Support audio/video uploads
- [ ] Memory timeline view
- [ ] Legacy notes writing & storage

### Phase 3: Polish
- [ ] Add animations using Framer Motion
- [ ] Responsive and accessible UI
- [ ] Performance optimization and testing

---

## 📊 Future Scope
- AI tagging and face recognition (e.g. auto-grouping photos)
- Sentiment detection for legacy notes
- Offline access & syncing
