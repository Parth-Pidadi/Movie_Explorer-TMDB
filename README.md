# 🎬 Movie Explorer

**🚀 Live Demo:** [https://movie-explorer-av62.vercel.app](https://movie-explorer-av62.vercel.app)

A modern web application for searching movies, viewing details, and managing your favorite films with personal ratings and notes.
## 📋 Features

- 🔍 **Search Movies** - Search by title using TMDB API
- 📋 **Movie Details** - View comprehensive information including runtime, overview, and posters
- ❤️ **Favorites Management** - Add/remove movies to your favorites list
- ⭐ **Personal Ratings** - Rate movies from 1-5 stars
- 📝 **Notes** - Add personal notes to your favorite movies
- 💾 **Persistent Storage** - Favorites saved to localStorage (survives page refresh)
- 🚀 **Fast & Responsive** - Built with Next.js 14 and Tailwind CSS

## 🛠 Tech Stack

- **Frontend:** Next.js 14 (App Router), React 18, TypeScript
- **Styling:** Tailwind CSS
- **API:** TMDB (The Movie Database) API
- **Storage:** LocalStorage for favorites persistence
- **Deployment:** Vercel-ready

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- A TMDB API key (get one at https://www.themoviedb.org/settings/api)

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   
   Edit the `.env.local` file and add your TMDB API key:
   ```env
   TMDB_API_KEY=your_actual_tmdb_api_key_here
   TMDB_BASE_URL=https://api.themoviedb.org/3
   ```

   **To get your TMDB API Key:**
   - Go to https://www.themoviedb.org/
   - Create an account or log in
   - Go to Settings → API
   - Request an API key (choose "Developer")
   - Copy your API Key (v3 auth)

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
movie-explorer/
├── src/
│   ├── app/
│   │   ├── api/              # Server-side API routes
│   │   │   ├── search/       # Search endpoint
│   │   │   └── movie/[id]/   # Details endpoint
│   │   ├── page.tsx          # Main page component
│   │   ├── layout.tsx        # Root layout
│   │   └── globals.css       # Global styles
│   ├── components/           # React components
│   │   ├── SearchBar.tsx
│   │   ├── MovieCard.tsx
│   │   ├── MovieDetailsModal.tsx
│   │   └── FavoritesList.tsx
│   ├── hooks/                # Custom React hooks
│   │   └── useFavorites.ts
│   └── types/                # TypeScript interfaces
│       └── index.ts
├── .env.local                # Environment variables
├── package.json              # Dependencies
├── next.config.mjs           # Next.js configuration
├── tailwind.config.ts        # Tailwind CSS configuration
└── tsconfig.json             # TypeScript configuration
```

## 🔧 Technical Decisions & Tradeoffs

### Architecture

**Next.js App Router with API Routes**
- **Why:** Keeps API keys secure on the server side, preventing exposure in client-side code
- **Benefit:** Single codebase for frontend and backend, automatic optimization
- **Tradeoff:** Slightly more complex than pure client-side, but essential for security

**TypeScript**
- **Why:** Type safety reduces bugs and improves developer experience
- **Benefit:** Autocomplete, compile-time error detection, better refactoring

### State Management

**React Hooks with Custom Hook**
- **Why:** Project scope is small enough that complex state management would be overkill
- **Benefit:** Simple, readable, no additional dependencies

**Custom useFavorites Hook**
- **Why:** Encapsulates localStorage logic and provides clean API
- **Benefit:** Reusable, testable, handles hydration issues with SSR
- **Tradeoff:** For larger apps, would need centralized state management

### Persistence

**LocalStorage (Client-Side)**
- **Why:** Met the baseline requirement, zero backend infrastructure needed
- **Benefit:** Instant setup, no database costs, works offline
- **Tradeoff:** Data is device-specific, not synced across devices
- **Production Alternative:** Would use PostgreSQL/MongoDB with user authentication

### API Integration

**Server-Side Proxy Pattern**
- **Why:** TMDB API key must never be exposed to the browser
- **Implementation:** Two API routes:
  - `/api/search` - Search movies by title
  - `/api/movie/[id]` - Get detailed movie info (including runtime)

**Why Two Endpoints?**
- TMDB's search API doesn't return `runtime`
- Details endpoint fetches full movie data including runtime
- This fulfills the "show runtime" requirement

### UI/UX Design

**Tailwind CSS**
- **Why:** Rapid development, consistent design system
- **Benefit:** No CSS files to manage, responsive design utilities

**Dark Theme**
- **Why:** Modern aesthetic, reduces eye strain, makes posters pop
- **Colors:** Slate background with amber accents

**Modal for Details**
- **Choice:** Modal instead of separate route
- **Why:** Preserves search context, faster UX
- **Tradeoff:** Could use route `/movie/[id]` for shareable URLs

## 🧪 Testing

After setup, test these features:

- [ ] Search for "Inception" works
- [ ] Click movie card shows details modal
- [ ] **Runtime displays in modal** (key requirement!)
- [ ] Heart icon adds to favorites
- [ ] Favorites tab shows saved movies
- [ ] Can add 1-5 star rating
- [ ] Can add personal notes
- [ ] Refresh page - favorites persist
- [ ] Remove from favorites works

## 🚢 Deployment to Vercel

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin your-github-repo-url
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Add environment variables:
     - `TMDB_API_KEY`: Your TMDB API key
     - `TMDB_BASE_URL`: `https://api.themoviedb.org/3`
   - Click "Deploy"

## 🔒 Security

- API keys are stored server-side only (never exposed to browser)
- All TMDB requests go through Next.js API routes
- `.env.local` is excluded from git via `.gitignore`

## 🎯 Known Limitations & Future Improvements

### Current Limitations

1. **No User Authentication** - Favorites are device-specific
2. **LocalStorage Only** - Data lost if browser data cleared
3. **Basic Search** - Only searches by title, no filters
4. **No Pagination** - Single page of results

### With More Time

#### High Priority
- User Authentication (NextAuth.js)
- Database Persistence (PostgreSQL with Prisma)
- Advanced Search Filters (genre, year, rating)
- Pagination for search results

#### Medium Priority
- Multiple Lists/Collections
- Social Features (share favorites)
- Watch Later Queue
- Export/Import favorites

#### Nice to Have
- Offline Mode with service workers
- Animations and transitions
- Dark/Light theme toggle
- Movie Trailers (YouTube embeds)

## 📝 License

This project is for educational/interview purposes.

TMDB API is used under their terms of service.

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**
