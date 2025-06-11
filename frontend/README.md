# 🚀 SkillForge Frontend

**Modern AI-Powered Developer Skill Tracking Platform**

SkillForge is a comprehensive SaaS platform that helps developers track their technical skills, set learning goals, and receive AI-powered insights to accelerate their career growth.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3-38B2AC?style=for-the-badge&logo=tailwind-css)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-0055FF?style=for-the-badge&logo=framer)

## ✨ Features

### 🎯 Core Functionality

- **Skill Portfolio Management** - Track programming languages, frameworks, and tools
- **Learning Goals Tracking** - Set, monitor, and achieve your development objectives
- **AI-Powered Insights** - Get personalized learning recommendations from Google Gemini
- **Progress Analytics** - Visual dashboards showing your skill development journey
- **Professional UI** - Modern, responsive design with smooth animations

### 🤖 AI Assistant

- **Learning Path Generation** - Custom roadmaps based on your current skills
- **Skill Gap Analysis** - Identify areas for improvement for target roles
- **Smart Suggestions** - AI recommendations for skills to learn next
- **Career Guidance** - Insights tailored to your professional goals

### 🎨 User Experience

- **Modern Design** - Clean, professional interface with glassmorphism effects
- **Responsive Layout** - Optimized for desktop, tablet, and mobile devices
- **Smooth Animations** - Framer Motion powered transitions and micro-interactions
- **Dark Mode Support** - (Coming soon)

## 🛠️ Tech Stack

### Frontend Core

- **[Next.js 14](https://nextjs.org)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org)** - Type-safe JavaScript
- **[TailwindCSS](https://tailwindcss.com)** - Utility-first CSS framework
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library

### State Management & APIs

- **[Zustand](https://zustand-demo.pmnd.rs)** - Lightweight state management
- **[Axios](https://axios-http.com)** - HTTP client for API calls
- **Custom API Services** - Organized service layer architecture

### UI Components

- **[Lucide React](https://lucide.dev)** - Beautiful, customizable icons
- **[Headless UI](https://headlessui.com)** - Unstyled, accessible UI components
- **Custom Components** - Reusable, responsive React components

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0 or higher
- **npm**, **yarn**, **pnpm**, or **bun**
- **SkillForge Backend** running on port 5001

### Installation

1. **Clone and install dependencies:**

```bash
git clone <repository-url>
cd SkillForge/frontend
npm install
```

2. **Set up environment variables:**

```bash
# Create .env.local file
cp .env.example .env.local

# Configure API endpoint
NEXT_PUBLIC_API_URL=http://localhost:5001
```

3. **Start the development server:**

```bash
npm run dev
```

4. **Open your browser:**

```
http://localhost:3000
```

### Alternative Package Managers

```bash
# Using Yarn
yarn install && yarn dev

# Using pnpm
pnpm install && pnpm dev

# Using Bun
bun install && bun dev
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Dashboard overview
│   ├── skills/            # Skill management
│   ├── goals/             # Learning goals
│   ├── ai/                # AI assistant
│   ├── profile/           # User profile
│   └── auth/              # Authentication pages
├── components/            # Reusable React components
│   ├── ai/                # AI-specific components
│   ├── layout/            # Layout components
│   └── providers/         # Context providers
├── services/              # API service layer
├── store/                 # Zustand state management
└── styles/                # Global CSS styles
```

## 🎨 UI Design System

### Color Palette

- **Primary**: Blue gradient (`from-blue-500 to-blue-600`)
- **Secondary**: Purple gradient (`from-purple-500 to-purple-600`)
- **Success**: Green (`from-green-500 to-green-600`)
- **Warning**: Yellow (`from-yellow-500 to-yellow-600`)
- **Neutral**: Slate (`slate-50` to `slate-900`)

### Typography

- **Primary Font**: Geist Sans (Vercel's custom font)
- **Monospace**: Geist Mono (for code elements)
- **Headings**: Bold weights with gradient text effects
- **Body**: Regular weights with optimal line spacing

### Components

- **Cards**: Rounded corners with subtle shadows
- **Buttons**: Gradient backgrounds with hover animations
- **Forms**: Clean inputs with focus states
- **Navigation**: Modern sidebar with glassmorphism

## 🔧 Available Scripts

### Development

```bash
npm run dev          # Start development server
npm run build        # Build production bundle
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

### Code Quality

```bash
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier
npm run analyze      # Analyze bundle size
```

## 🌐 API Integration

### Endpoints

- **Authentication**: `/api/auth/*`
- **Skills**: `/api/skills/*`
- **Goals**: `/api/goals/*`
- **AI**: `/api/ai/*`
- **Profile**: `/api/profile/*`

### Authentication

The app uses JWT tokens stored in localStorage with automatic token refresh and secure API communication.

## 📱 Responsive Design

### Breakpoints

- **Mobile**: `< 768px`
- **Tablet**: `768px - 1024px`
- **Desktop**: `> 1024px`
- **Large**: `> 1280px`

### Features

- Responsive navigation (sidebar collapse on mobile)
- Adaptive grid layouts
- Touch-friendly interactions
- Optimized typography scaling

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Other Platforms

- **Netlify**: Configure build command as `npm run build`
- **AWS Amplify**: Use the build specifications in `amplify.yml`
- **Docker**: Use the provided `Dockerfile`

### Environment Variables

```bash
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NEXT_PUBLIC_APP_URL=https://your-app-domain.com
```

## 🤝 Contributing

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards

- **TypeScript**: Strict mode enabled
- **ESLint**: Extended from Next.js and TypeScript recommended
- **Prettier**: Consistent code formatting
- **Commits**: Conventional commit format

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **[Next.js](https://nextjs.org)** for the amazing React framework
- **[Vercel](https://vercel.com)** for hosting and font resources
- **[TailwindCSS](https://tailwindcss.com)** for the utility-first CSS framework
- **[Framer Motion](https://www.framer.com/motion/)** for smooth animations
- **[Google Gemini](https://ai.google.dev)** for AI-powered insights

---

**Built with ❤️ for developers who want to level up their skills**

For backend documentation, see [Backend README](../backend/README.md)
