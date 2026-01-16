# 📁 WatchParty - Complete Project Structure

```
WatchParty/
│
├── 📄 README.md                      # Main documentation
├── 📄 QUICKSTART.md                  # Quick start guide (5-min setup)
├── 📄 SETUP.md                       # Detailed setup instructions
├── 📄 API.md                         # Complete API documentation
├── 📄 ARCHITECTURE.md                # System architecture & design
├── 📄 CONTRIBUTING.md                # Contribution guidelines
│
├── 📄 package.json                   # Root package.json (scripts)
├── 📄 .gitignore                     # Git ignore rules
├── 📄 docker-compose.yml             # Docker orchestration
│
├── 📁 server/                        # Backend Application
│   ├── 📄 package.json               # Server dependencies
│   ├── 📄 Dockerfile                 # Server Docker config
│   ├── 📄 .env.example               # Environment template
│   ├── 📄 index.js                   # Server entry point
│   │
│   ├── 📁 config/
│   │   └── database.js               # MongoDB connection
│   │
│   ├── 📁 models/
│   │   ├── User.js                   # User schema & methods
│   │   └── Party.js                  # Party schema & methods
│   │
│   ├── 📁 routes/
│   │   ├── auth.js                   # Authentication endpoints
│   │   ├── user.js                   # User management endpoints
│   │   └── party.js                  # Party management endpoints
│   │
│   ├── 📁 middleware/
│   │   └── auth.js                   # JWT authentication
│   │
│   └── 📁 socket/
│       └── socketHandler.js          # WebSocket event handlers
│
└── 📁 client/                        # Frontend Application
    ├── 📄 package.json               # Client dependencies
    ├── 📄 Dockerfile                 # Client Docker config
    ├── 📄 nginx.conf                 # Nginx configuration
    ├── 📄 .env.example               # Environment template
    │
    ├── 📁 public/
    │   ├── index.html                # HTML template
    │   └── manifest.json             # PWA manifest
    │
    └── 📁 src/
        ├── 📄 index.js               # React entry point
        ├── 📄 index.css              # Global styles
        ├── 📄 App.js                 # Root component
        │
        ├── 📁 pages/
        │   ├── LandingPage.js        # Home/landing page
        │   ├── LandingPage.css
        │   ├── LoginPage.js          # User login
        │   ├── RegisterPage.js       # User registration
        │   ├── AuthPages.css         # Auth pages styling
        │   ├── DashboardPage.js      # User dashboard
        │   ├── DashboardPage.css
        │   ├── PartyPage.js          # Party room (main feature)
        │   └── PartyPage.css
        │
        ├── 📁 store/
        │   ├── authStore.js          # Auth state management
        │   └── partyStore.js         # Party state management
        │
        └── 📁 utils/
            └── api.js                # API client & interceptors
```

## File Count Summary

- **Backend Files**: 11 files
- **Frontend Files**: 16 files
- **Documentation**: 6 files
- **Configuration**: 4 files
- **Total**: 37 files

## Key Files Explained

### Backend (Node.js + Express + Socket.IO)

| File | Purpose |
|------|---------|
| `server/index.js` | Main server file, initializes Express and Socket.IO |
| `server/config/database.js` | MongoDB connection setup |
| `server/models/User.js` | User data model with authentication methods |
| `server/models/Party.js` | Party data model with video state |
| `server/routes/auth.js` | Login, register, get current user |
| `server/routes/party.js` | Create, join, leave, update party |
| `server/routes/user.js` | User profile and streaming services |
| `server/middleware/auth.js` | JWT verification middleware |
| `server/socket/socketHandler.js` | Real-time video sync logic |

### Frontend (React + Socket.IO Client)

| File | Purpose |
|------|---------|
| `client/src/App.js` | Main app component with routing |
| `client/src/pages/LandingPage.js` | Marketing/landing page |
| `client/src/pages/LoginPage.js` | User authentication page |
| `client/src/pages/RegisterPage.js` | User registration page |
| `client/src/pages/DashboardPage.js` | Party management dashboard |
| `client/src/pages/PartyPage.js` | Live party with video player |
| `client/src/store/authStore.js` | Global auth state (Zustand) |
| `client/src/store/partyStore.js` | Global party state (Zustand) |
| `client/src/utils/api.js` | Axios API client with interceptors |

### Documentation

| File | Purpose |
|------|---------|
| `README.md` | Main project documentation |
| `QUICKSTART.md` | 5-minute setup guide |
| `SETUP.md` | Detailed setup with troubleshooting |
| `API.md` | Complete API & WebSocket documentation |
| `ARCHITECTURE.md` | System design & architecture |
| `CONTRIBUTING.md` | How to contribute to the project |

### Configuration

| File | Purpose |
|------|---------|
| `package.json` (root) | Development scripts for the monorepo |
| `docker-compose.yml` | Multi-container Docker setup |
| `server/.env.example` | Backend environment template |
| `client/.env.example` | Frontend environment template |

## Technologies by Layer

### Backend Stack
```
Node.js (Runtime)
  └── Express.js (Web Framework)
      ├── Socket.IO (WebSocket Server)
      ├── Mongoose (MongoDB ODM)
      ├── JWT (Authentication)
      ├── Bcrypt (Password Hashing)
      ├── CORS (Cross-Origin)
      ├── Helmet (Security)
      └── Rate Limiter (Protection)
```

### Frontend Stack
```
React 18 (UI Library)
  ├── React Router (Navigation)
  ├── Zustand (State Management)
  ├── Axios (HTTP Client)
  ├── Socket.IO Client (WebSocket)
  ├── React Player (Video Player)
  ├── React Icons (Icons)
  └── React Hot Toast (Notifications)
```

### Database
```
MongoDB (NoSQL Database)
  └── Collections
      ├── users (User accounts)
      └── parties (Watch parties)
```

## API Endpoints Summary

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Party Management
- `POST /api/party/create` - Create new party
- `POST /api/party/join` - Join party by code
- `GET /api/party/:code` - Get party details
- `POST /api/party/:code/leave` - Leave party
- `PUT /api/party/:code/content` - Update video
- `GET /api/party/user/active` - Get active parties

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `POST /api/user/streaming-service` - Add streaming auth
- `GET /api/user/streaming-services` - Get services

## WebSocket Events

### Client → Server
- `join-party` - Join a party room
- `video-play` - Play video
- `video-pause` - Pause video
- `video-seek` - Seek to time
- `request-sync` - Request sync
- `leave-party` - Leave party

### Server → Client
- `party-state` - Initial state
- `video-play` - Play broadcast
- `video-pause` - Pause broadcast
- `video-seek` - Seek broadcast
- `video-sync` - Sync response
- `user-joined` - User joined
- `user-left` - User left

## Development Commands

```bash
# Install all dependencies
npm run install:all

# Run development mode (both server & client)
npm run dev

# Run server only
cd server && npm run dev

# Run client only
cd client && npm start

# Build client for production
cd client && npm run build

# Docker deployment
docker-compose up --build
```

## Security Features

✅ JWT-based authentication  
✅ Password hashing with bcrypt  
✅ Rate limiting on API  
✅ CORS protection  
✅ Helmet security headers  
✅ Input validation  
✅ WebSocket authentication  
✅ Environment-based secrets  

## Future Expansion Areas

The codebase is structured to easily add:
- 📱 Mobile apps (React Native)
- 💬 Chat functionality (WebSocket ready)
- 🎤 Voice chat integration
- 📹 Screen sharing
- 🎨 Theme customization
- 📊 Analytics dashboard
- 🔔 Push notifications
- 🌍 i18n (Internationalization)

---

This structure follows industry best practices:
- ✅ Separation of concerns
- ✅ Scalable architecture
- ✅ Easy to maintain
- ✅ Well-documented
- ✅ Docker-ready
- ✅ Production-ready
