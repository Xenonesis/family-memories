<div align="center">

# 💖 Family Memories
### *Preserve Your Precious Moments Forever*

<div align="center">
  <img src="https://img.shields.io/badge/Version-0.80-ff6b6b?style=for-the-badge&logo=semantic-release&logoColor=white" alt="Version 0.80">
  <img src="https://img.shields.io/badge/Release-June%202025-4ecdc4?style=for-the-badge&logo=calendar&logoColor=white" alt="Release Date">
  <img src="https://img.shields.io/badge/License-MIT-45b7d1?style=for-the-badge&logo=opensourceinitiative&logoColor=white" alt="MIT License">
</div>

---

### 🎬 **Live Demo Video**

<div align="center" style="margin: 2rem 0;">

[![Family Memories Live Demo](https://img.youtube.com/vi/eIf8IqYvoMw/maxresdefault.jpg)](https://youtu.be/eIf8IqYvoMw)

**🎥 [▶️ Watch Full Demo on YouTube](https://youtu.be/eIf8IqYvoMw) | Direct Link: https://youtu.be/eIf8IqYvoMw**

*Click the thumbnail above or use the direct link to see our Family Memories application in action!*

**✨ What you'll see in the demo:**
- 🖼️ Modern memory card layouts with smooth animations
- 🌓 Real-time dark/light mode switching
- 📱 Mobile-responsive design in action
- 🎨 3D hero sections and interactive elements
- ⚡ Fast loading and smooth navigation

</div>

---

### 📸 **Interface Preview**
<div align="center" style="margin: 2rem 0;">
  <img src="https://via.placeholder.com/800x450.png?text=Screenshot+Coming+Soon" alt="Family Memories Modern Interface" width="100%" style="border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);"/>
  <!-- TODO: Replace placeholder with actual screenshots once MCP server is functional -->
</div>

---

## 🌟 **About The Project**

**Family Memories** is a beautifully crafted, modern web application designed to help families preserve, organize, and share their most precious moments. Built with cutting-edge technologies including Next.js 15, TypeScript, and Framer Motion, it delivers a smooth, delightful user experience that makes memory sharing effortless and enjoyable.

</div>

## ✨ **Key Features**

<div align="center">

### 🎨 **Modern UI/UX Design**
</div>

* **🧭 Intuitive Navigation**
  * Persistent navigation bar with quick access to memories, add, and search
  * Smart hamburger menu for mobile devices
  * Breadcrumb navigation for deep memory exploration
  
* **🖼️ Advanced Memory Display**
  * Dynamic grid and list layout options
  * Smooth hover effects and transitions
  * Customizable detail view with modal overlays
  * Infinite scroll for large memory collections

* **📱 Mobile-First Responsive Design**
  * Touch-optimized interactions and gestures
  * Adaptive layouts for all screen sizes
  * Progressive Web App (PWA) capabilities
  * Offline viewing for cached memories

---

<div align="center">

### 🌓 **Intelligent Theme System**
</div>

* **🎨 Advanced Dark Mode**
  * Automatic system preference detection
  * Smooth transition animations between themes
  * Custom color scheme support
  * High contrast mode for accessibility

* **🎚️ Theme Customization**
  * Real-time theme preview
  * Preset color schemes (Sunset, Ocean, Forest)
  * Custom CSS variable override system
  * Export/import theme configurations

---

<div align="center">

### ⚡ **Performance & Animations**
</div>

* **✨ Fluid Animations**
  * Page transition animations with Framer Motion
  * Micro-interactions on buttons and controls
  * Smooth scroll behavior throughout the app
  * Loading skeletons for better perceived performance

* **🔄 Optimized Loading**
  * Dynamic image loading based on viewport
  * Lazy loading for better performance
  * Intelligent caching strategies
  * Progressive image enhancement

---

<div align="center">

### 🤝 **Sharing & Collaboration**
</div>

* **📤 Multi-Platform Sharing**
  * One-click social media sharing
  * Generated permalinks with rich preview metadata
  * Custom email sharing templates
  * QR code generation for easy mobile sharing

* **🔒 Privacy Controls**
  * Granular privacy settings per memory
  * Family member invitation system
  * Role-based access control
  * Secure sharing links with expiration

---

## 🚀 **Quick Start Guide**

<div align="center">

### **Prerequisites**
![Node.js](https://img.shields.io/badge/Node.js-v18%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)
![npm](https://img.shields.io/badge/npm-Latest-CB3837?style=for-the-badge&logo=npm&logoColor=white)
![Git](https://img.shields.io/badge/Git-Latest-F05032?style=for-the-badge&logo=git&logoColor=white)

</div>

### **⚡ Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/Xenonesis/family-memories.git
   cd family-memories
   ```

2. **Install dependencies**
   ```bash
   # Using npm
   npm install
   
   # Or using yarn
   yarn install
   
   # Or using pnpm
   pnpm install
   ```

3. **Setup environment variables**
   ```bash
   # Copy the example environment file
   cp .env.example .env.local
   
   # Edit .env.local with your Supabase credentials
   # Get these values from your Supabase project dashboard
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # Server will start at http://localhost:3000
   ```

5. **Build for production**
   ```bash
   npm run build
   npm start
   ```

### **🔧 Environment Variables**

The following environment variables are required:

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | ✅ Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key | ✅ Yes |

**For Netlify deployment:**
1. Go to your Netlify site dashboard
2. Navigate to Site settings → Environment variables
3. Add both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Redeploy your site

### **🛠️ Available Scripts**

| Command | Description | Usage |
|---------|-------------|--------|
| `npm run dev` | Start development server with Turbopack | Hot reload enabled |
| `npm run build` | Build optimized production bundle | Static generation |
| `npm start` | Start production server | Serve built files |
| `npm run lint` | Run ESLint code analysis | Check code quality |

### **📁 Project Structure**

```
family-memories/
├── 📂 public/                 # Static assets
│   ├── 🖼️ images/            # Image assets
│   └── 📄 *.svg               # SVG icons
├── 📂 src/
│   ├── 📂 app/                # Next.js App Router
│   │   ├── 📄 layout.tsx      # Root layout
│   │   ├── 📄 page.tsx        # Home page
│   │   ├── 📂 about/          # About page
│   │   └── 📂 contact/        # Contact page
│   ├── 📂 components/         # Reusable components
│   │   ├── 🎨 ui/             # UI primitives
│   │   ├── 🧭 navbar.tsx      # Navigation
│   │   ├── 🌓 theme-*.tsx     # Theme components
│   │   └── 📱 *.tsx           # Feature components
│   ├── 📂 hooks/              # Custom React hooks
│   └── 📂 lib/                # Utility functions
├── 📋 package.json            # Dependencies
├── ⚙️ next.config.ts          # Next.js configuration
├── 🎨 tailwind.config.js      # Tailwind CSS config
└── 📝 tsconfig.json           # TypeScript config
```

---

---

## � **Tech Stack & Architecture**

<div align="center">

### **Frontend Technologies**
[![Next.js](https://img.shields.io/badge/Next.js-15.3.4-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

### **UI & Animation Libraries**
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.18.1-FF0055?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Radix UI](https://img.shields.io/badge/Radix_UI-Latest-161618?style=for-the-badge&logo=radix-ui&logoColor=white)](https://www.radix-ui.com/)
[![Lucide React](https://img.shields.io/badge/Lucide_React-0.518.0-F56565?style=for-the-badge&logo=lucide&logoColor=white)](https://lucide.dev/)
[![Tabler Icons](https://img.shields.io/badge/Tabler_Icons-3.34.0-206BC4?style=for-the-badge&logo=tabler&logoColor=white)](https://tabler-icons.io/)

### **3D & Interactive Elements**
[![Spline](https://img.shields.io/badge/Spline_React-4.0.0-FF6B6B?style=for-the-badge&logo=spline&logoColor=white)](https://spline.design/)
[![React Icons](https://img.shields.io/badge/React_Icons-5.5.0-E91E63?style=for-the-badge&logo=react&logoColor=white)](https://react-icons.github.io/react-icons/)

### **Development Tools**
[![ESLint](https://img.shields.io/badge/ESLint-9.0-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)](https://eslint.org/)
[![PostCSS](https://img.shields.io/badge/PostCSS-8.0-DD3A0A?style=for-the-badge&logo=postcss&logoColor=white)](https://postcss.org/)
[![Turbopack](https://img.shields.io/badge/Turbopack-Latest-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://turbo.build/pack)

</div>

### **🏗️ Architecture Overview**

```
├── 🎨 Frontend Layer
│   ├── Next.js 15 (App Router + Server Components)
│   ├── TypeScript for type safety
│   ├── Tailwind CSS for utility-first styling
│   └── Framer Motion for smooth animations
│
├── 🧩 Component Architecture
│   ├── Radix UI primitives for accessibility
│   ├── Custom UI components with CVA
│   ├── 3D elements with Spline integration
│   └── Responsive design patterns
│
├── 🎯 State Management
│   ├── React Context for global state
│   ├── Next-themes for theme management
│   └── Local state with React hooks
│
└── 🚀 Performance Optimizations
    ├── Turbopack for fast development builds
    ├── Image optimization with Next.js
    ├── Code splitting and lazy loading
    └── CSS-in-JS with zero runtime overhead
```

---

## 🤝 **Contributing**

<div align="center">

### **Join Our Family of Contributors!**

[![Contributors](https://img.shields.io/badge/Contributors-Welcome-brightgreen?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Xenonesis/family-memories/contributors)
[![Issues](https://img.shields.io/badge/Issues-Open-blue?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Xenonesis/family-memories/issues)
[![Pull Requests](https://img.shields.io/badge/PRs-Welcome-ff69b4?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Xenonesis/family-memories/pulls)

</div>

We believe that great software is built by amazing communities. Your contributions make the open source ecosystem a fantastic place to learn, inspire, and create together.

### **🚀 How to Contribute**

1. **🍴 Fork the Project**
   ```bash
   git clone https://github.com/YOUR_USERNAME/family-memories.git
   ```

2. **🔧 Create your Feature Branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```

3. **💻 Make your Changes**
   * Follow our coding standards
   * Add tests for new features
   * Update documentation as needed

4. **✅ Commit your Changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```

5. **📤 Push to the Branch**
   ```bash
   git push origin feature/AmazingFeature
   ```

6. **🎉 Open a Pull Request**
   * Describe your changes clearly
   * Link any related issues
   * Request review from maintainers

### **� Contribution Guidelines**

* 🐛 **Bug Reports**: Use our issue templates
* 💡 **Feature Requests**: Describe the problem and proposed solution
* 📝 **Documentation**: Help improve our guides and examples
* 🧪 **Testing**: Add tests for new functionality
* 🎨 **Design**: Contribute UI/UX improvements

---

## �📄 **License**

<div align="center">

[![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**Distributed under the MIT License**

*See `LICENSE` file for more information*

</div>

```
MIT License

Copyright (c) 2025 Family Memories Project

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 💖 **Acknowledgements**

<div align="center">

### **Special Thanks To**

</div>

#### **🏢 Organizations**
* **[Vercel](https://vercel.com/)** - For providing an amazing deployment platform
* **[Tailwind Labs](https://tailwindcss.com/)** - For creating the best CSS framework
* **[Framer](https://www.framer.com/)** - For beautiful animation libraries
* **[Radix UI](https://www.radix-ui.com/)** - For accessible component primitives
* **[Spline](https://spline.design/)** - For 3D design tools and React integration

#### **🌟 Open Source Projects**
* **[Next.js](https://nextjs.org/)** - The React framework for production
* **[React](https://reactjs.org/)** - A JavaScript library for building user interfaces
* **[TypeScript](https://www.typescriptlang.org/)** - JavaScript with syntax for types
* **[Lucide](https://lucide.dev/)** - Beautiful & consistent icon toolkit

#### **👥 Community**
* All our **contributors** who have helped shape this project
* The **open source community** for inspiration and support
* **Family photographers** who inspired this project's vision
* **Beta testers** who provided valuable feedback

---

<div align="center">

### **🌟 Star History**

[![Star History Chart](https://api.star-history.com/svg?repos=Xenonesis/family-memories&type=Date)](https://star-history.com/#Xenonesis/family-memories&Date)<!-- Force refresh -->

### **📊 Project Stats**

![GitHub repo size](https://img.shields.io/github/repo-size/Xenonesis/family-memories?style=for-the-badge&logo=github)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/Xenonesis/family-memories?style=for-the-badge&logo=github)
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/Xenonesis/family-memories?style=for-the-badge&logo=github)

---

<div align="center">
<h3>💝 Made with Love for Families Everywhere</h3>

**Family Memories v0.75** | **June 2025**

*Preserving moments, creating connections, building legacies.*

[![GitHub](https://img.shields.io/badge/GitHub-Follow%20Us-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Xenonesis)
[![Twitter](https://img.shields.io/badge/Twitter-Follow%20Us-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/Xenonesis)

---

*Built with ❤️ by the Family Memories Team*

</div>

</div>

## 🎨 UI Components

<div align="center">



| :-------------- | :-----------------------------------: | :------------------------------------- |
|-----------------|--------------------------------------|----------------------------------------|
| Memory Card     | Grid item with image & metadata      | Hover scaling, click-to-expand        |
| Timeline View   | Vertical chronology visualization    | Scroll-triggered animations           |
| Tag Manager     | Visual tag organization interface    | Drag-and-drop sorting, color picker   |
| Search Filters  | Advanced memory search controls      | Instant results preview, saved presets|
| Family Tree     | Interactive genealogy visualization  | Zoom/pan, relationship connectors      |
</div>


---

## 📦 **Version History**

<div align="center">

### 🎉 **Latest Release - v0.80 (June 2025)**
*Enhanced UI/UX, Comprehensive Documentation & GitHub Integration*

</div>

#### ✨ **New Features**
* 🎨 **Redesigned README**: Modern, comprehensive documentation with improved visual hierarchy
* 🎬 **Live Demo Integration**: Embedded video showcasing application features
* 📋 **Complete Tech Stack Documentation**: Detailed breakdown of all technologies used
* �️ **Architecture Overview**: Visual representation of project structure
* 🚀 **Enhanced Quick Start Guide**: Step-by-step installation with multiple package managers
* 📊 **Performance Badges**: Real-time status indicators for project health

#### � **Improvements**
* 📱 **Mobile-First Documentation**: Responsive design for README viewing
* 🎯 **Better Navigation**: Organized sections with visual hierarchy
* 🌟 **Interactive Elements**: Clickable badges and enhanced formatting
* � **SEO Optimization**: Better metadata and structured content

---

### **Previous Releases**


<details>
<summary><strong>📋 v0.34 (June 2025)</strong> - UI Enhancements</summary>

* 🎉 **New**: Advanced theme customization system
* 🚀 **Improved**: Mobile navigation performance (+40%)
* 🎨 **Added**: 3 preset color schemes (Sunset, Ocean, Forest)
* 📱 **Optimized**: Touch interaction handling
* ⚡ **Enhanced**: Memory card loading speed
* 🐛 **Fixed**: Dark mode transition flicker

</details>

<details>
<summary><strong>📋 v0.25 (June 2025)</strong> - Foundation Release</summary>

* 🎉 **New**: Core application structure
* 🧩 **Added**: Component library with Radix UI
* 🎨 **Implemented**: Tailwind CSS styling system
* ⚡ **Integrated**: Framer Motion animations
* 🔧 **Setup**: TypeScript configuration
* 📱 **Built**: Responsive design framework

</details>

<details>
<summary><strong>📋 v0.10 (June 2025)</strong> - Initial Setup</summary>

* 🎉 **New**: Project initialization
* � **Setup**: Next.js 15 with App Router
* 📦 **Configured**: Essential dependencies
* 📚 **Created**: Basic project structure
* 🎯 **Planned**: Feature roadmap and architecture

</details>

---

![Project Screenshot](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAxAAAAJICAIAAAB+MZWEAAAJ0klEQVR4nO3WsRHAIBDAsJD9d34m4FxCIU3g0mtmPgAAzv7bAQAArzNMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEwBAMEwAAMEwAQAEwwQAEAwTAEAwTAAAwTABAATDBAAQDBMAQDBMAADBMAEABMMEABAMEw
