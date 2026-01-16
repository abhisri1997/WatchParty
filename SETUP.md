# WatchParty Setup Guide

## Prerequisites
- Node.js v16+ 
- MongoDB v5+
- npm or yarn
- Git

## Step-by-Step Setup

### 1. Database Setup

**Install MongoDB (if not already installed):**

**On Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

**On macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Verify MongoDB is running:**
```bash
mongosh
# You should see the MongoDB shell
```

### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit the .env file with your configuration
nano .env  # or use any text editor
```

**Required .env variables:**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/watchparty
JWT_SECRET=your_secure_random_string_here_minimum_32_chars
CLIENT_URL=http://localhost:3000
SESSION_SECRET=another_secure_random_string
```

**Generate secure secrets:**
```bash
# Generate JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate SESSION_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Frontend Setup

```bash
# Navigate to client directory (from root)
cd client

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit the .env file
nano .env
```

**Required .env variables:**
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_WS_URL=http://localhost:5000
```

### 4. Running the Application

**Option 1: Run everything from root (Recommended for development)**
```bash
# From the root directory
npm run install:all  # Install all dependencies
npm run dev          # Start both server and client
```

**Option 2: Run separately**

Terminal 1 (Backend):
```bash
cd server
npm run dev
```

Terminal 2 (Frontend):
```bash
cd client
npm start
```

### 5. Verify Installation

1. Backend should be running on: http://localhost:5000
   - Test: http://localhost:5000/health (should return `{"status":"OK"}`)

2. Frontend should be running on: http://localhost:3000
   - The landing page should load

3. MongoDB should be running:
   ```bash
   mongosh
   show dbs
   ```

## Common Issues and Solutions

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
sudo lsof -ti:5000 | xargs kill -9

# Kill process on port 3000 (frontend)
sudo lsof -ti:3000 | xargs kill -9
```

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
sudo systemctl status mongodb  # Linux
brew services list | grep mongodb  # macOS

# Restart MongoDB
sudo systemctl restart mongodb  # Linux
brew services restart mongodb-community  # macOS
```

### Node Modules Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### CORS Issues
Make sure `CLIENT_URL` in server/.env matches your frontend URL exactly.

## Testing the Application

### 1. Create an Account
- Go to http://localhost:3000
- Click "Sign Up"
- Fill in: username, email, password
- Login with your credentials

### 2. Create a Party
- From Dashboard, click "Create Party"
- Fill in party details
- Copy the party code

### 3. Test Video Sync
- Open another browser (or incognito window)
- Login with a different account
- Join the party using the code
- Set a video URL (try a YouTube video)
- Test play/pause/seek controls
- Both videos should stay in sync!

## Production Deployment Checklist

- [ ] Use strong JWT secrets (minimum 32 characters)
- [ ] Set `NODE_ENV=production`
- [ ] Use MongoDB Atlas or similar for database
- [ ] Enable HTTPS
- [ ] Set up proper CORS origins
- [ ] Enable rate limiting
- [ ] Set up logging and monitoring
- [ ] Use environment variables for all secrets
- [ ] Build frontend for production: `npm run build`
- [ ] Use a process manager like PM2
- [ ] Set up automatic backups for database
- [ ] Configure firewall rules
- [ ] Use CDN for static assets

## Development Tips

### Hot Reload
Both frontend and backend support hot reload during development.

### Debug Mode
Add this to server/index.js for detailed Socket.IO logs:
```javascript
const io = socketIo(server, {
  // ... existing config
  debug: true
});
```

### Database GUI
Install MongoDB Compass for a visual interface:
```bash
# Download from: https://www.mongodb.com/products/compass
```

Connection string: `mongodb://localhost:27017/watchparty`

## Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Socket.IO Documentation](https://socket.io/docs/)
- [React Documentation](https://react.dev/)
- [MongoDB Documentation](https://www.mongodb.com/docs/)
- [React Player](https://www.npmjs.com/package/react-player)

## Getting Help

If you encounter issues:
1. Check the console logs (both browser and terminal)
2. Verify all environment variables are set correctly
3. Ensure MongoDB is running
4. Check that all ports are available
5. Review the error messages carefully

Happy coding! 🎉
