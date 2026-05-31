# CyberWiki

A cybersecurity knowledge base built with React. Secure, dark-themed frontend application modeled after the CyberWiki design.

## Screenshots

> Add screenshots of the running application here before submission.

**Home Page** — Central Command with search, Offense/Defense cards, Terminology of the Day, and Trending OSINT.

**Login Page** — Firebase Authentication with Login/Register tabs, Google and GitHub social auth.

**Article Page** — Detailed articles with code examples, related vectors, and analysis tools sidebar.

**Tools Page** — Interactive SVG terminology map with definition panel.

**Admin Page** — Command Center Overview with stats, moderation queue, and access control.

---

## Tech Stack

- **React 19** + **Vite**
- **React Router v7** — client-side routing for all screens
- **Firebase Authentication** — email/password, Google, GitHub
- **Hotjar** — user behavior analytics
- **Google Analytics 4** (react-ga4) — page view tracking

## Project Structure

```
src/
  components/
    Navbar.jsx            # shared navigation bar
    Footer.jsx            # shared footer
    Button.jsx            # reusable button component
    ArticleCard.jsx       # reusable article card
    AnalyticsListener.jsx # GA4 page view tracker
    ProtectedRoute.jsx    # Firebase auth guard
  pages/
    HomePage.jsx          # /
    LoginPage.jsx         # /login
    OffensePage.jsx       # /offense
    DefensePage.jsx       # /defense
    ToolsPage.jsx         # /tools
    ArticlePage.jsx       # /article/:slug
    AdminPage.jsx         # /admin (protected)
    NotFoundPage.jsx      # * 404
  data/
    articles.js           # static article content
  context/
    AuthContext.jsx       # Firebase auth context
  firebase.js             # Firebase init
  App.jsx                 # Root routing + analytics init
  main.jsx
```

## Routes

| Path | Page |
|------|------|
| `/` | HomePage |
| `/login` | LoginPage |
| `/offense` | OffensePage |
| `/defense` | DefensePage |
| `/tools` | ToolsPage (Interactive Map) |
| `/article/:slug` | ArticlePage |
| `/admin` | AdminPage (requires login) |
| `*` | NotFoundPage (404) |

## Setup

### 1. Install

```bash
npm install
```

### 2. Firebase setup

1. Create a project at [Firebase Console](https://console.firebase.google.com/)
2. Add a web app
3. Enable **Email/Password**, **Google**, and **GitHub** sign-in methods
4. Replace the placeholder values in `src/firebase.js`

### 3. Hotjar

1. Create account at [hotjar.com](https://www.hotjar.com)
2. In `src/App.jsx`, set `HOTJAR_SITE_ID` to your numeric site ID

### 4. Google Analytics

1. Create GA4 property at [analytics.google.com](https://analytics.google.com)
2. In `src/App.jsx`, set `GA_MEASUREMENT_ID` to your `G-XXXXXXXXXX` ID

### 5. Run

```bash
npm run dev
```

### 6. Build

```bash
npm run build
```

## Deploy

Deploy the `dist/` folder to any static host:

- **Vercel** — connect GitHub, auto-deploy
- **Netlify** — drag & drop `dist/`
- **Railway** — static site from `dist/`

## Hotjar Screenshots

> Add Hotjar heatmap and recording screenshots here after collecting user data.

## Google Analytics Screenshots

> Add Google Analytics dashboard screenshots here after the app receives traffic.
