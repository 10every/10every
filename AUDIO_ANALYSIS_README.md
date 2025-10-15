# Edgar Audio Analysis System

This system provides real audio analysis for the Edgar AI music assistant, replacing the previous mock analysis with actual audio feature extraction and mixing/mastering feedback.

## Architecture

### Components

1. **Python Audio Analysis Service** (`audio_api.py`)
   - FastAPI service running on port 8001
   - Handles audio file uploads and analysis
   - Returns detailed audio features and feedback

2. **Audio Analysis Engine** (`audio_analysis_service.py`)
   - Core audio processing using librosa and essentia
   - Extracts spectral, dynamic, and stereo features
   - Generates mixing/mastering recommendations

3. **Next.js API Integration** (`app/api/edgar/`)
   - Updated upload and analyze routes
   - Calls Python service for real analysis
   - Fallback to mock data if service unavailable

## Features Analyzed

### Spectral Analysis
- **Spectral Centroid**: Brightness of the track
- **Spectral Rolloff**: High-frequency content
- **Zero Crossing Rate**: Noise/percussion content
- **MFCC**: Timbre characteristics
- **Spectral Bandwidth**: Frequency spread

### Dynamics Analysis
- **RMS Energy**: Perceived loudness
- **Peak Levels**: Clipping detection
- **Dynamic Range**: Compression analysis
- **LUFS Approximation**: Streaming loudness

### Stereo Image Analysis
- **Stereo Width**: Channel separation
- **Phase Correlation**: Mono compatibility
- **Channel Balance**: Left/right balance

### Frequency Balance
- **Low End**: Bass presence and mud detection
- **Mid Range**: Vocal clarity and congestion
- **High End**: Air and harshness detection

## Setup Instructions

### 1. Install Python Dependencies

```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install requirements
pip install -r requirements.txt
```

### 2. Start Audio Analysis Service

```bash
# Make script executable
chmod +x start_audio_service.sh

# Start the service
./start_audio_service.sh
```

The service will be available at `http://localhost:8001`

### 3. Start Next.js Development Server

```bash
npm run dev
```

## API Endpoints

### Python Service (Port 8001)

- `GET /` - Service status
- `GET /health` - Health check
- `POST /analyze` - Upload and analyze audio file

### Next.js API

- `POST /api/edgar/upload` - Upload audio and get analysis
- `POST /api/edgar/analyze` - Get AI feedback on analysis

## Usage

1. **Upload Audio**: Users upload audio files through the Edgar interface
2. **Real Analysis**: Python service extracts audio features using librosa
3. **AI Feedback**: System generates mixing/mastering recommendations
4. **Chat Interface**: Users can ask follow-up questions about their analysis

## Supported Audio Formats

- WAV, MP3, FLAC, M4A, OGG
- Maximum file size: 50MB
- Automatic format conversion to WAV for analysis

## Analysis Output

The system provides:

- **Mixing Notes**: Frequency balance, dynamics, stereo image feedback
- **Mastering Notes**: Loudness, compression, limiting recommendations
- **Overall Score**: 0-100 rating based on analysis
- **Priority Issues**: Critical problems to address first

## Fallback System

If the Python service is unavailable, the system automatically falls back to mock analysis data to ensure the interface remains functional.

## Development

### Adding New Features

1. **Audio Features**: Add new feature extraction in `audio_analysis_service.py`
2. **Feedback Logic**: Update feedback generation in `audio_api.py`
3. **API Integration**: Modify Next.js routes to handle new data

### Testing

```bash
# Test Python service directly
python audio_analysis_service.py path/to/audio/file.wav

# Test API endpoint
curl -X POST -F "file=@audio.wav" http://localhost:8001/analyze
```

## Performance Considerations

- Audio processing is CPU-intensive
- Large files may take 10-30 seconds to analyze
- Consider implementing async processing for production
- Temporary files are automatically cleaned up

## Future Enhancements

- **Real-time Analysis**: Stream processing for live feedback
- **Reference Comparison**: Compare against professional tracks
- **Genre-Specific Feedback**: Tailored recommendations by music style
- **Machine Learning**: Train models on professional mixes
- **Cloud Processing**: Scale analysis with cloud services







