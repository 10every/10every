#!/bin/bash

# Deployment script for 10every
echo "🚀 Preparing 10every for deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit"
fi

# Check environment variables
echo "🔍 Checking environment variables..."
if [ ! -f ".env.local" ]; then
    echo "⚠️  Warning: .env.local not found. Please create it with:"
    echo "   ADMIN_=your_secure_password"
    echo "   SPOTIFY_CLIENT_ID=your_spotify_client_id"
    echo "   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🎯 Ready for deployment!"
    echo ""
    echo "Next steps:"
    echo "1. Push to GitHub: git push origin main"
    echo "2. Deploy to Vercel: https://vercel.com"
    echo "3. Add environment variables in Vercel dashboard"
    echo "4. Access admin at: https://your-app.vercel.app/admin?password=your_password"
else
    echo "❌ Build failed. Please fix errors before deploying."
    exit 1
fi
