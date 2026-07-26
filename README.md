# JR Gaming Club

A modern, full-stack gaming platform built with Next.js and Supabase. The platform enables users to discover, play games, manage their gaming profile, and track transactions in a beautifully designed interface.

**Live Demo:** [jrgames-two.vercel.app](https://jrgames-two.vercel.app)

## 🎮 What This Is

JR Gaming Club is a web-based gaming platform that provides:
- **Secure Authentication**: Email/password and Google OAuth sign-in via Supabase
- **Game Discovery & Gameplay**: Browse and play games in an interactive environment
- **User Profiles**: Manage personal gaming profiles and preferences
- **Transaction Tracking**: View and manage gaming transactions and rewards
- **Responsive Design**: Beautiful UI that works seamlessly across desktop and mobile devices

## ✨ Features

- 🔐 **Multiple Authentication Methods**
  - Email/password authentication
  - OTP-based sign-in
  - Google OAuth integration
  - Secure session management with cookies
  
- 🎯 **Core Functionality**
  - Game browsing and gameplay interface
  - User dashboard with gaming statistics
  - Transaction history and tracking
  - User profile management
  
- 🎨 **Modern UI/UX**
  - Dark/light theme support with `next-themes`
  - Beautiful animations using Framer Motion
  - shadcn/ui components for consistency
  - Tailwind CSS for responsive styling
  - Toast notifications with Sonner
  
- 📱 **Responsive & Accessible**
  - Mobile-first design approach
  - Adaptive sidebar navigation
  - Accessible form inputs and controls

## 🏗️ Stack

- **Language:** TypeScript (98%)
- **Framework:** Next.js (App Router)
- **Runtime:** Node.js
- **Database & Auth:** Supabase (PostgreSQL + Auth)
- **Styling:** Tailwind CSS v4
- **UI Components:** 
  - shadcn/ui (base-maia style)
  - Radix UI primitives
  - Tabler Icons
- **State & Forms:** React Hook Form with Zod/Valibot validation
- **Animations:** Framer Motion
- **Deployment:** Vercel

## 📁 How It's Organized

```
app/
  layout.tsx              Root layout with theme provider and global components
  globals.css             Global styles and CSS variables
  (marketing)/            Public landing page routes
    page.tsx              Marketing homepage with hero section
  (auth)/                 Authentication routes (public)
    auth/page.tsx         Login/signup page with email & OAuth options
  (app)/                  Protected app routes (authenticated users)
    layout.tsx            App layout with sidebar navigation
    home/                 Dashboard/home page
    game/one/             Game play interface
    profile/              User profile management
    transactions/         Transaction history and tracking
  not-found.tsx           Custom 404 error page

components/
  ui/                     Reusable shadcn/ui components
    button.tsx, card.tsx, input.tsx, tabs.tsx, etc.
  layout/
    hero.tsx              Marketing hero section with CTAs
  common/
    nav.tsx               Main navigation component
    footer.tsx            Footer component
    app-sidebar.tsx       App layout sidebar with navigation
  vendor/
    decor-icon.tsx        Decorative SVG icons
    full-width-divider.tsx Page dividers

lib/
  utils.ts                Utility functions (cn for Tailwind merge)
  supabase/
    client.ts             Client-side Supabase instance
    server.ts             Server-side Supabase instance
    proxy.ts              Auth session proxy middleware

hooks/
  use-mobile.ts           Custom hook for responsive design detection

public/
  hero.png, cover.webp    Marketing assets
  controller-full.png     Game controller imagery

Configuration Files:
  package.json            Dependencies and scripts
  next.config.ts          Next.js configuration
  tsconfig.json           TypeScript configuration
  components.json         shadcn/ui configuration
  tailwind.config.ts      Tailwind CSS configuration
  postcss.config.mjs      PostCSS configuration
  eslint.config.mjs       ESLint configuration
```

## 🔄 How It Fits Together

**Request Flow:**
1. User visits the app and hits the root layout (`app/layout.tsx`)
2. ThemeProvider wraps the app for dark/light mode support
3. Navigation (`Nav`) and Footer are rendered at top/bottom level
4. Auth proxy middleware (`lib/supabase/proxy.ts`) intercepts all requests to verify user session
5. Unauthenticated users hitting protected routes are redirected to `/auth`
6. Authenticated users access the app layout (`(app)`) with sidebar navigation
7. Routes render specific pages (home, game, profile, transactions)

**Authentication Flow:**
- Supabase SSR package manages cookies for auth state
- Server-side proxy verifies session on each request
- Client-side `createClient()` communicates directly with Supabase
- Protected routes check for valid session before rendering

**UI Flow:**
- All components use shadcn/ui for consistency
- Forms use React Hook Form + Zod for validation
- Animations use Framer Motion for smooth transitions
- Toast notifications (Sonner) provide user feedback

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ with npm or yarn
- Supabase project (free at [supabase.com](https://supabase.com))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/aman-a-dev/jrgames.git
   cd jrgames
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
   ```
   
   Get these values from your Supabase project's API settings:
   - Go to [Supabase Dashboard](https://supabase.com/dashboard)
   - Select your project
   - Navigate to Settings → API
   - Copy the project URL and publishable key

4. **Run the development server**
   ```bash
   npm run dev
   ```
   
   The app will be available at [http://localhost:3000](http://localhost:3000)

### Build & Deploy

**Build for production:**
```bash
npm run build
npm start
```

**Deploy to Vercel (recommended):**
1. Push your repository to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Add environment variables in Vercel project settings
4. Vercel will automatically deploy on every push to main

## 📝 Available Scripts

```bash
npm run dev       # Start development server on port 3000
npm run build     # Create production build
npm start         # Start production server
npm run lint      # Run ESLint to check code quality
```

## 🔒 Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL (public) |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable/anon key (public) |

> **Note:** Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. Never put secrets in these.

## 🧪 Testing

Currently, the project uses ESLint for code quality. To run linting:
```bash
npm run lint
```

## 📦 Key Dependencies

### Core
- **next**: ^latest - React framework with App Router
- **react**: ^19.0.0 - UI library
- **react-dom**: ^19.0.0 - DOM rendering

### Authentication & Database
- **@supabase/supabase-js**: ^latest - Supabase client SDK
- **@supabase/ssr**: ^latest - Server-side rendering support for Supabase

### UI & Styling
- **tailwindcss**: ^4.3.3 - Utility-first CSS framework
- **@tailwindcss/postcss**: ^4.3.3 - PostCSS plugin for Tailwind
- **shadcn/ui**: Components library (base-maia style)
- **radix-ui**: ^1.6.7 - Unstyled accessible components
- **lucide-react**: ^0.511.0 - Icon library
- **@tabler/icons-react**: ^3.45.0 - Additional icon set

### Forms & Validation
- **react-hook-form**: ^7.83.0 - Flexible form library
- **@hookform/resolvers**: ^5.4.3 - Resolvers for form validation
- **zod**: ^4.4.3 - TypeScript-first schema validation
- **valibot**: ^1.4.2 - Alternative validation library

### Utilities
- **next-themes**: ^0.4.6 - Dark/light mode management
- **motion**: ^12.42.2 - Animation library
- **sonner**: ^2.0.7 - Toast notifications
- **clsx**: ^2.1.1 - Utility for className merging
- **tailwind-merge**: ^3.3.0 - Tailwind class conflict resolver

## 🎯 Project Goals & Next Steps

- Expand game library and features
- Add multiplayer capabilities
- Implement leaderboards and achievements
- Enhanced user analytics and reporting
- Mobile app versions (React Native/Flutter)

## 🤝 Contributing

Contributions are welcome! Feel free to:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source. Check the LICENSE file for details.

## 🔗 Links

- **Live App**: [jrgames-two.vercel.app](https://jrgames-two.vercel.app)
- **Repository**: [github.com/aman-a-dev/jrgames](https://github.com/aman-a-dev/jrgames)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Next.js Docs**: [nextjs.org](https://nextjs.org)

## 💬 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing discussions
- Refer to [Supabase Documentation](https://supabase.com/docs)

---

**Built with ❤️ by aman-a-dev**
