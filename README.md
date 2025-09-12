# 10every - Music Discovery Platform

A daily music discovery platform where users submit tracks and the first 10 submissions get featured anonymously.

## Features

- **Track Submission**: Users can submit Spotify tracks via URL
- **Daily Selection**: First 10 submissions each day get featured
- **Anonymous Discovery**: Tracks appear without artist names initially
- **Interactive Experience**: Users must listen to 10% before revealing artist
- **Admin Dashboard**: Select which tracks to feature each day
- **Real Spotify Integration**: Fetches track metadata and album covers

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Spotify API Setup

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Copy your Client ID and Client Secret
4. Update `.env.local`:

```env
SPOTIFY_CLIENT_ID=your_spotify_client_id_here
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here
```

### 3. Database Setup

The app uses SQLite with better-sqlite3. The database will be created automatically at `data/submissions.db`.

To seed with sample data:
```bash
npx tsx scripts/seed-database.ts
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the app.

## Usage

### For Users
1. Click "submit" button
2. Paste a Spotify track URL
3. Track gets submitted for consideration

### For Admins
1. Visit `http://localhost:3000/admin`
2. Select 10 tracks to feature today
3. Click "Save Featured Tracks"

## API Endpoints

- `POST /api/submissions` - Submit a new track
- `GET /api/submissions` - Get all submissions
- `GET /api/featured-tracks` - Get today's featured tracks
- `POST /api/featured-tracks` - Set today's featured tracks
- `GET /api/admin/submissions` - Get all submissions for admin

## Database Schema

### submissions
- `id` - Primary key
- `spotify_url` - Original Spotify URL
- `spotify_id` - Spotify track ID
- `title` - Track title
- `artist` - Artist name
- `album` - Album name
- `album_art_url` - Album cover URL
- `duration_ms` - Track duration in milliseconds
- `preview_url` - Spotify preview URL
- `submitted_at` - Submission timestamp
- `featured` - Whether track has been featured
- `featured_date` - Date when track was featured

### daily_tracks
- `id` - Primary key
- `submission_id` - Reference to submissions table
- `track_order` - Order in the daily selection (1-10)
- `date` - Date of the selection

## Development

The app is built with:
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- SQLite (better-sqlite3)
- Spotify Web API

## Production Deployment

### Quick Deploy to Vercel

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard:
     - `ADMIN_PASSWORD` - Your secure admin password
     - `SPOTIFY_CLIENT_ID` - Your Spotify app client ID
     - `SPOTIFY_CLIENT_SECRET` - Your Spotify app client secret
   - Deploy!

3. **Access Admin**:
   - Visit `https://your-app.vercel.app/admin?password=your_admin_password`
   - Or use the password prompt that appears

### Environment Variables

Required for production:
- `ADMIN_PASSWORD` - Password to access admin dashboard
- `SPOTIFY_CLIENT_ID` - Spotify API client ID
- `SPOTIFY_CLIENT_SECRET` - Spotify API client secret

### Security Features

- ✅ **Admin Authentication**: Password-protected admin routes
- ✅ **Environment-based Config**: Different settings for dev/prod
- ✅ **Secure Database**: SQLite with proper file permissions

### Production Considerations

For larger scale, consider:
- Using PostgreSQL instead of SQLite
- Implementing proper user authentication
- Adding rate limiting
- Setting up error monitoring
- Using a CDN for static assets