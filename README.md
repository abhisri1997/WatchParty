# 🎬 WatchParty - Watch Together with Loved Ones

A real-time synchronized video streaming application that allows multiple users to watch content together, no matter where they are. Built with modern web technologies for a seamless watch party experience.

![Tech Stack](https://img.shields.io/badge/Stack-MERN-green)
![WebSocket](https://img.shields.io/badge/Real--time-Socket.IO-blue)

## ✨ Features

### Core Functionality
- 🔐 **User Authentication** - Secure JWT-based authentication system
- 👥 **Party/Group Management** - Create or join watch parties with unique codes
- 🎥 **Multiple Streaming Services** - Support for Netflix, Hulu, Disney+, Prime Video, HBO Max, and custom URLs
- 🔄 **Real-time Synchronization** - All participants watch in perfect sync using WebSocket technology
- ⏯️ **Playback Controls** - Play, pause, seek forward/backward controls for all members (configurable)
- 🔁 **Re-sync Feature** - Manual sync option for users experiencing lag
- 💬 **Party Chat** - Built-in communication system (WebSocket ready)
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices

### Technical Highlights
- Real-time video synchronization across multiple clients
- Host and member permission management
- Automatic video state persistence
- Connection recovery and state restoration
- Rate limiting and security best practices

## 🏗️ Architecture

### Tech Stack

**Backend:**
- Node.js + Express.js - RESTful API server
- Socket.IO - Real-time bidirectional communication
- MongoDB + Mongoose - Database and ODM
- JWT - Authentication and authorization
- Bcrypt - Password hashing

**Frontend:**
- React 18 - UI library
- React Router - Client-side routing
- Zustand - State management
- React Player - Universal video player component
- Socket.IO Client - WebSocket client
- React Hot Toast - Notifications
- React Icons - Icon library

**DevOps:**
- Docker support (coming soon)
- Environment-based configuration
- CORS and security middleware

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn

### Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/abhisri1997/WatchParty.git
cd WatchParty
```

2. **Install all dependencies**
```bash
npm run install:all
```

3. **Configure environment variables**

Backend (.env in `/server` directory):
```bash
cd server
cp .env.example .env
# Edit .env with your configuration
```

Frontend (.env in `/client` directory):
```bash
cd client
cp .env.example .env
# Edit .env with your configuration
```

4. **Start MongoDB**
```bash
# Make sure MongoDB is running
mongod
```

5. **Run the application**

For development (runs both server and client):
```bash
npm run dev
```

Or run separately:
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm start
```

6. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- WebSocket: ws://localhost:5000

## 🚀 Usage Guide

### Creating a Party

1. **Register/Login** to your account
2. Navigate to the **Dashboard**
3. Click **"Create Party"**
4. Fill in party details:
   - Party Name
   - Streaming Service (Netflix, Hulu, etc.)
   - Max Members (2-50)
   - Member Control Permissions
5. Click **"Create Party"** - You'll receive a unique party code
6. Share the party code with friends

### Joining a Party

1. **Register/Login** to your account
2. From Dashboard, click **"Join Party"**
3. Enter the 8-character party code
4. Click **"Join Party"**

### Watching Together

1. Once in the party room, the host or any member (if permitted) can set the video URL
2. Click **"Set Video URL"** and paste a valid video link:
   - YouTube: `https://www.youtube.com/watch?v=...`
   - Vimeo: `https://vimeo.com/...`
   - Direct video URLs: `.mp4`, `.webm`, etc.
3. Use playback controls to play/pause, seek forward/backward
4. If you experience lag, click the **Sync** button to re-synchronize
5. All actions are synchronized in real-time across all participants

## 📁 Project Structure

```
WatchParty/
├── server/                 # Backend application
│   ├── config/            # Configuration files
│   │   └── database.js    # MongoDB connection
│   ├── models/            # Mongoose models
│   │   ├── User.js        # User schema
│   │   └── Party.js       # Party schema
│   ├── routes/            # API routes
│   │   ├── auth.js        # Authentication routes
│   │   ├── user.js        # User routes
│   │   └── party.js       # Party routes
│   ├── socket/            # WebSocket handlers
│   │   └── socketHandler.js
│   ├── middleware/        # Custom middleware
│   │   └── auth.js        # JWT authentication
│   ├── index.js           # Server entry point
│   └── package.json
│
├── client/                # Frontend application
│   ├── public/            # Static files
│   ├── src/
│   │   ├── pages/         # React pages/routes
│   │   │   ├── LandingPage.js
│   │   │   ├── LoginPage.js
│   │   │   ├── RegisterPage.js
│   │   │   ├── DashboardPage.js
│   │   │   └── PartyPage.js
│   │   ├── store/         # Zustand state management
│   │   │   ├── authStore.js
│   │   │   └── partyStore.js
│   │   ├── utils/         # Utility functions
│   │   │   └── api.js     # API client
│   │   ├── App.js         # Main app component
│   │   └── index.js       # React entry point
│   └── package.json
│
├── package.json           # Root package.json
└── README.md
```

## 🔌 API Documentation

### Authentication Endpoints

**POST** `/api/auth/register`
- Register a new user
- Body: `{ username, email, password }`

**POST** `/api/auth/login`
- Login user
- Body: `{ email, password }`

**GET** `/api/auth/me`
- Get current user (requires authentication)

### Party Endpoints

**POST** `/api/party/create`
- Create a new party
- Body: `{ name, streamingService, maxMembers, allowMemberControl }`

**POST** `/api/party/join`
- Join an existing party
- Body: `{ partyCode }`

**GET** `/api/party/:partyCode`
- Get party details

**POST** `/api/party/:partyCode/leave`
- Leave a party

**PUT** `/api/party/:partyCode/content`
- Update party content
- Body: `{ contentId, contentTitle, contentUrl, contentType }`

**GET** `/api/party/user/active`
- Get user's active parties

### WebSocket Events

**Client → Server:**
- `join-party` - Join a party room
- `video-play` - Play video
- `video-pause` - Pause video
- `video-seek` - Seek to position
- `request-sync` - Request video sync
- `send-message` - Send chat message
- `leave-party` - Leave party room

**Server → Client:**
- `party-state` - Initial party state
- `video-play` - Play notification
- `video-pause` - Pause notification
- `video-seek` - Seek notification
- `video-sync` - Sync response
- `user-joined` - User joined notification
- `user-left` - User left notification
- `new-message` - New chat message
- `error` - Error notification

## 🔒 Security Features

- JWT-based authentication with secure token storage
- Password hashing using bcrypt (10 salt rounds)
- Rate limiting on API endpoints (100 requests per 15 minutes)
- CORS protection
- Helmet.js security headers
- Input validation using express-validator
- MongoDB injection protection via Mongoose
- Environment variable configuration

## 🎨 Customization

### Adding New Streaming Services

Edit the `streamingService` enum in:
- `/server/models/Party.js`
- `/client/src/pages/DashboardPage.js` (add icon)

### Modifying Video Player

The video player uses `react-player` which supports:
- YouTube
- Facebook
- Twitch
- SoundCloud
- Streamable
- Vimeo
- Wistia
- Mixcloud
- DailyMotion
- And more...

## 🐛 Troubleshooting

### Video not syncing
- Click the **Re-sync** button
- Check your internet connection
- Ensure the video URL is valid and accessible

### Cannot join party
- Verify the party code is correct (8 characters, case-insensitive)
- Ensure the party is still active
- Check if the party has reached max members

### WebSocket connection issues
- Verify MongoDB is running
- Check firewall settings
- Ensure correct environment variables

## 🛣️ Roadmap

- [ ] Docker containerization
- [ ] OAuth integration for streaming services
- [ ] Enhanced chat with emoji support
- [ ] Voice chat integration
- [ ] Screen sharing capability
- [ ] Party recordings
- [ ] Watch history
- [ ] User profiles with customization
- [ ] Mobile native apps (React Native)
- [ ] Browser extension for easier content selection

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Built with ❤️ by a Web Architect who has worked on projects for Netflix, Hotstar, Hulu, and other major streaming platforms.

## 🙏 Acknowledgments

- React Player for the universal video player
- Socket.IO for real-time communication
- MongoDB for flexible data storage
- The open-source community

---

**Note:** This is a demonstration project. For production use with actual streaming services, you would need to:
1. Implement proper OAuth authentication with each streaming service
2. Comply with their API terms of service
3. Handle DRM and content protection
4. Implement proper content licensing

For now, this app works best with:
- YouTube videos (public)
- Vimeo videos (public)
- Direct video file URLs
- Other publicly accessible video content
