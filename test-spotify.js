// Test Spotify API credentials
import SpotifyWebApi from 'spotify-web-api-node';

const spotify = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

async function testSpotifyAPI() {
  try {
    console.log('Testing Spotify API with credentials:');
    console.log('Client ID:', process.env.SPOTIFY_CLIENT_ID);
    console.log('Client Secret:', process.env.SPOTIFY_CLIENT_SECRET ? '***' + process.env.SPOTIFY_CLIENT_SECRET.slice(-4) : 'Not set');
    
    const data = await spotify.clientCredentialsGrant();
    console.log('✅ Successfully got access token!');
    console.log('Token expires in:', data.body['expires_in'], 'seconds');
    
    // Test getting a track
    spotify.setAccessToken(data.body['access_token']);
    const track = await spotify.getTrack('4QvdyQPZrCZBhQZLlFRmjz');
    console.log('✅ Successfully fetched track:', track.body.name, 'by', track.body.artists[0].name);
    
  } catch (error) {
    console.error('❌ Spotify API test failed:', error);
  }
}

testSpotifyAPI();
