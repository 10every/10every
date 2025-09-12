import SpotifyWebApi from 'spotify-web-api-node';

const spotify = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: 'https://10every.com/callback', // Match your Spotify app settings
});

// Get access token
export async function getSpotifyAccessToken() {
  try {
    const data = await spotify.clientCredentialsGrant();
    spotify.setAccessToken(data.body['access_token']);
    return data.body['access_token'];
  } catch (error) {
    console.error('Error getting Spotify access token:', error);
    throw error;
  }
}

// Extract Spotify track ID from URL
export function extractSpotifyTrackId(url: string): string | null {
  const match = url.match(/\/track\/([a-zA-Z0-9]+)/);
  return match ? match[1] : null;
}

// Fetch track details from Spotify
export async function fetchTrackDetails(spotifyUrl: string) {
  try {
    await getSpotifyAccessToken();
    
    const trackId = extractSpotifyTrackId(spotifyUrl);
    if (!trackId) {
      throw new Error('Invalid Spotify URL');
    }

    const trackData = await spotify.getTrack(trackId);
    const track = trackData.body;

    return {
      spotify_id: track.id,
      title: track.name,
      artist: track.artists.map(artist => artist.name).join(', '),
      album: track.album.name,
      album_art_url: track.album.images[0]?.url || null,
      duration_ms: track.duration_ms,
      preview_url: track.preview_url,
      external_urls: JSON.stringify(track.external_urls),
    };
  } catch (error) {
    console.error('Error fetching track details:', error);
    
    // If Spotify API fails, extract basic info from URL and return fallback data
    const trackId = extractSpotifyTrackId(spotifyUrl);
    if (trackId) {
      return {
        spotify_id: trackId,
        title: 'Track Title',
        artist: 'Unknown Artist',
        album: 'Unknown Album',
        album_art_url: null,
        duration_ms: 180000, // 3 minutes default
        preview_url: null,
        external_urls: JSON.stringify({ spotify: spotifyUrl }),
      };
    }
    
    throw error;
  }
}
