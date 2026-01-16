# 🚀 WatchParty - Quick Start Guide

Get WatchParty running in under 5 minutes!

## Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js v16+ installed: `node --version`
- ✅ MongoDB v5+ installed: `mongod --version`
- ✅ npm installed: `npm --version`

## Installation (3 Steps)

### Step 1: Clone and Install
```bash
# Clone the repository
git clone https://github.com/abhisri1997/WatchParty.git
cd WatchParty

# Install all dependencies (root, server, and client)
npm run install:all
```

### Step 2: Configure Environment

**Server Configuration:**
```bash
cd server
cp .env.example .env
```

Edit `server/.env` and add:
```env
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
```

**Client Configuration:**
```bash
cd ../client
cp .env.example .env
```
The default values should work for local development.

### Step 3: Start Everything

**Option A - Run Everything (Recommended):**
```bash
# From root directory
cd ..
npm run dev
```

This will start:
- ✅ Backend server on http://localhost:5000
- ✅ Frontend app on http://localhost:3000
- ✅ WebSocket server on ws://localhost:5000

**Option B - Run Separately:**
```bash
# Terminal 1 - Start server
cd server
npm run dev

# Terminal 2 - Start client
cd client
npm start
```

## First Time Usage

### 1. Access the App
Open your browser and go to: **http://localhost:3000**

### 2. Create an Account
- Click **"Sign Up"**
- Enter username, email, and password
- Click **"Sign Up"** to register

### 3. Create Your First Party
- From the dashboard, click **"Create Party"**
- Fill in:
  - **Party Name**: "Test Party"
  - **Streaming Service**: Choose any (for now select "Custom URL")
  - **Max Members**: 10
  - **Allow member control**: ✓ (checked)
- Click **"Create Party"**

### 4. Set a Video
- Click **"Set Video URL"**
- Paste a YouTube URL, for example:
  ```
  https://www.youtube.com/watch?v=dQw4w9WgXcQ
  ```
- Click **"Set Video"**

### 5. Test Synchronization
- Open a **new incognito/private window**
- Go to http://localhost:3000
- **Register/Login** with a different account
- Click **"Join Party"**
- Enter the **party code** shown in the first window
- Click **"Join Party"**

### 6. Enjoy Synchronized Playback!
- In either window, click **Play**
- Both videos should play in sync!
- Try **pause**, **forward**, **backward** - all sync in real-time! ✨

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9
```

### MongoDB Not Running
```bash
# Linux
sudo systemctl start mongodb

# macOS
brew services start mongodb-community
```

### Connection Issues
1. Check if MongoDB is running: `mongosh`
2. Verify environment variables in `.env` files
3. Check console logs for errors

## What Can You Do?

✅ **User Management**
- Register and login
- Profile with avatar
- Multiple streaming service authentication (framework ready)

✅ **Party Features**
- Create unlimited parties
- Share party codes/links
- Join others' parties
- Host controls
- Member permissions

✅ **Video Playback**
- Real-time synchronized playback
- Play/Pause controls
- Forward/Backward (10s jumps)
- Re-sync button
- Support for YouTube, Vimeo, direct URLs

✅ **Real-Time Features**
- Instant synchronization across all users
- Member presence detection
- Video state persistence
- Connection recovery

## Supported Video Sources

The video player supports:
- 🎬 YouTube
- 📺 Vimeo
- 🎥 Facebook Videos
- 🎮 Twitch
- 📡 Direct video URLs (.mp4, .webm, etc.)
- 🎵 SoundCloud
- And many more via react-player

## Example Video URLs to Test

```
# YouTube
https://www.youtube.com/watch?v=dQw4w9WgXcQ

# Vimeo
https://vimeo.com/90509568

# Direct MP4
http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4
```

## Next Steps

📖 **Read the Documentation:**
- [README.md](README.md) - Full feature documentation
- [SETUP.md](SETUP.md) - Detailed setup guide
- [API.md](API.md) - Complete API documentation
- [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture

🔧 **Customize:**
- Add your own streaming services
- Customize the UI/themes
- Add new features

🚀 **Deploy:**
- Follow production deployment guide in [SETUP.md](SETUP.md)
- Use Docker: `docker-compose up`

## Support

Having issues? Check:
1. Console logs (browser and terminal)
2. [SETUP.md](SETUP.md) troubleshooting section
3. Environment variables are set correctly
4. MongoDB is running

## Quick Commands Reference

```bash
# Install everything
npm run install:all

# Run development (both server and client)
npm run dev

# Run only server
cd server && npm run dev

# Run only client
cd client && npm start

# Build for production
cd client && npm run build

# Check health
curl http://localhost:5000/health
```

---

Congratulations! 🎉 You're now ready to watch videos together with friends and family!

**Star the repo if you find it useful! ⭐**
