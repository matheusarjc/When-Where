# 🌍 When & Where - Intelligent Travel Planner

A modern and elegant travel planner with multi-language support, photo galleries, time capsules, and comprehensive trip management features.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test

# Build for production
npm run build
```

## ✨ Core Features

### 📋 Trip Management
- **Create and organize trips** with dates, locations, and custom cover images
- **Timeline of events** with complete details (flights, hotels, activities, restaurants)
- **Real-time countdown** for upcoming trips
- **Automatic status**: Upcoming, In Progress, Completed

### 💾 Memories System
- **3 memory types**: Notes, Photos, and Tips
- **Advanced search** across all memories
- **Intelligent filters** by type (notes, photos, tips, capsules)
- **Photo upload** with captions and Firebase Storage integration

### 🕰️ Time Capsules
- Transform memories into **time capsules**
- Set future opening dates
- Content locked until chosen date
- Visual badge indicating status (open/locked)

### 📸 Photo Gallery
- **Masonry Grid** responsive photo display
- **Lightbox** with keyboard navigation (← →)
- Enlarged view with details
- Photo counter and Firebase Storage integration

### 🌐 Internationalization (i18n)
- **3 supported languages**:
  - 🇧🇷 Portuguese (Brazil)
  - 🇺🇸 English (United States)
  - 🇪🇸 Spanish (Spain)
- Complete interface translation
- Localized date formatting

### 🎨 Customization
- **4 color themes**:
  - Teal (Default)
  - Purple
  - Blue
  - Pink
- **Initial onboarding** to configure preferences
- **Settings** accessible at any time

### 🔗 Sharing
- **Public links** for trips
- **Export .ics** to add to calendar
- Cinematic preview page
- One-click link copying

## 🛠️ Technology Stack

### Frontend Core
- **React 18** with **TypeScript** - Type safety and modern React features
- **Next.js 14** - Full-stack React framework with App Router
- **Tailwind CSS v4.0** - Utility-first CSS framework for rapid UI development
- **shadcn/ui** - High-quality, accessible component library

### State Management & Data
- **React Context API** - Global state management for auth and user preferences
- **Firebase Authentication** - Google OAuth and email/password authentication
- **Firebase Firestore** - NoSQL database for real-time data synchronization
- **Firebase Storage** - File storage for trip covers and memory photos

### UI/UX & Animation
- **Motion (Framer Motion)** - Smooth animations and micro-interactions
- **Lucide Icons** - Consistent icon system
- **React Responsive Masonry** - Responsive photo grid layout

### Testing & Quality
- **Vitest** - Fast unit testing framework
- **React Testing Library** - Component testing utilities
- **Jest DOM** - Custom DOM matchers for testing

### Development Tools
- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking

## 🏗️ Architecture Decisions

### Why Firebase?
**Firebase was chosen over other NoSQL solutions** for several strategic reasons:

1. **Rapid Development**: Firebase provides a complete backend-as-a-service solution, allowing us to focus on frontend development without backend infrastructure concerns.

2. **Real-time Capabilities**: Firestore's real-time listeners are perfect for travel planning where users expect instant updates across devices.

3. **Authentication Integration**: Firebase Auth seamlessly integrates with Google OAuth, providing secure authentication with minimal setup.

4. **File Storage**: Firebase Storage handles image uploads for trip covers and memories, with built-in CDN and optimization.

5. **Cost Efficiency**: For a portfolio project, Firebase's generous free tier and pay-as-you-scale model are ideal.

6. **TypeScript Support**: Excellent TypeScript integration with strongly typed Firestore queries and data models.

**Alternatives Considered**: 
- **Supabase**: Great option but requires more backend setup
- **MongoDB Atlas**: More complex for simple CRUD operations
- **PlanetScale**: Overkill for this use case

### Why Next.js over Create React App?
- **App Router**: Modern routing with layouts and nested routes
- **Server Components**: Better performance and SEO
- **Built-in optimizations**: Image optimization, font loading, etc.
- **Full-stack capabilities**: API routes for future backend features

### Why Tailwind CSS?
- **Rapid prototyping**: Utility classes speed up development
- **Consistency**: Design system enforced through utilities
- **Performance**: Purged CSS results in smaller bundle sizes
- **Maintainability**: No CSS-in-JS complexity

### Why Vitest over Jest?
- **Speed**: Faster test execution with Vite's native ESM support
- **Modern**: Better TypeScript support out of the box
- **Compatibility**: Jest-compatible API for easy migration
- **Bundle size**: Smaller footprint for testing

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
├── components/             # Reusable UI components
│   ├── ui/                # shadcn/ui base components
│   └── media/             # Media-specific components
├── lib/                   # Utility functions and configurations
│   ├── firebase.ts        # Firebase configuration
│   ├── auth.ts           # Authentication utilities
│   ├── user.ts           # User management
│   ├── trips.ts          # Trip data operations
│   └── i18n.ts           # Internationalization
├── tests/                 # Unit tests
└── styles/               # Global styles
```

## 🔧 Environment Variables

Create a `.env.local` file with the following variables:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test -- --watch

# Run tests with coverage
npm run test -- --coverage
```

**Test Coverage**:
- ✅ Authentication utilities
- ✅ User management functions
- ✅ Trip data operations
- ✅ UI components (Button, Countdown, ImageWithFallback)
- ✅ Firebase service mocking

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Deploy to Vercel
npx vercel

# Or connect GitHub repository for automatic deployments
```

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## 📊 Performance Metrics

- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)
- **Bundle Size**: ~200KB gzipped (main bundle)
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s

## 🔒 Security Considerations

- **Firebase Security Rules**: Implemented for Firestore and Storage
- **Input Validation**: Client and server-side validation
- **XSS Protection**: React's built-in XSS protection
- **HTTPS Only**: All production traffic encrypted
- **Environment Variables**: Sensitive data not exposed to client

## 🌟 Future Enhancements

- [ ] **PWA Features**: Offline support, push notifications
- [ ] **Collaboration**: Multi-user trip planning
- [ ] **Maps Integration**: Interactive trip maps
- [ ] **Weather API**: Real-time weather for destinations
- [ ] **PDF Export**: Trip itinerary generation
- [ ] **Advanced Search**: Full-text search with Algolia
- [ ] **Analytics**: User behavior tracking
- [ ] **Dark/Light Mode**: Theme switching

## 📄 License

MIT License - feel free to use in your projects!

## 📖 Product Analysis & Documentation

For detailed product analysis, UX research, technical architecture diagrams, and design decisions, see:
**[📋 PRODUCT_ANALYSIS.md](./PRODUCT_ANALYSIS.md)**

---

Made with ❤️ for travelers who want to preserve their memories in an elegant and organized way.