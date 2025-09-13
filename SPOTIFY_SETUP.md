# Spotify Integration Setup

## Environment Variables Required

Add these to your `.env.local` file:

```bash
# Spotify API Credentials
SPOTIFY_CLIENT_ID=be6eb8bcbfc54fc49c1e56dfe6d9cd5c
SPOTIFY_CLIENT_SECRET=cda9fe0f5d1249b0bce81ca41465554c

# Public Spotify Client ID (for frontend)
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=be6eb8bcbfc54fc49c1e56dfe6d9cd5c

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Admin Password
ADMIN_PASSWORD=10every_Admin_2025_Secure!
```

## Spotify App Configuration

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Select your app: `10every`
3. Go to "Settings"
4. Add these redirect URIs:
   - `http://localhost:3000/callback` (for development)
   - `https://10every.com/callback` (for production)

## Features Implemented

✅ **Spotify OAuth Authentication**
- Users are prompted to connect their Spotify account when they first visit
- Secure token exchange using authorization code flow
- Tokens stored in localStorage

✅ **Spotify Web Playback SDK Integration**
- Full track playback (not just 30-second previews)
- Real-time progress tracking
- Play/pause controls

✅ **10% Reveal Logic**
- Tracks reveal artwork and info after 10% of full track duration
- Works with actual Spotify track lengths
- Real-time progress updates

✅ **Error Handling**
- Graceful fallback if Spotify API fails
- User-friendly authentication flow
- Proper error messages

## How It Works

1. **First Visit**: User sees Spotify authentication modal
2. **Authentication**: User clicks "Connect with Spotify" → redirected to Spotify OAuth
3. **Callback**: After authorization, user returns to app with access token
4. **Playback**: Clicking tiles plays full tracks via Spotify Web Playback SDK
5. **Reveal**: After 10% of track duration, artwork and info are revealed
6. **Logout**: Users can disconnect their Spotify account anytime

## Testing

1. Start the development server: `npm run dev`
2. Visit `http://localhost:3000`
3. You should see the Spotify authentication modal
4. Click "Connect with Spotify" and complete the OAuth flow
5. Return to the app and click on any track tile
6. The track should play via Spotify Web Playback SDK
7. After 10% of the track duration, the artwork should be revealed

## Troubleshooting

- **Authentication fails**: Check that redirect URIs match exactly in Spotify app settings
- **Tracks don't play**: Ensure user has Spotify Premium (required for Web Playback SDK)
- **Progress not updating**: Check browser console for Web Playback SDK errors
- **Modal doesn't appear**: Check that `NEXT_PUBLIC_SPOTIFY_CLIENT_ID` is set correctly
