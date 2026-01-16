# WatchParty - System Architecture

## Overview

WatchParty is a real-time synchronized video streaming application built on the MERN stack with WebSocket support for real-time communication.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    React Application                      │  │
│  │  ┌──────────┐  ┌──────────┐  ┌─────────────────────┐   │  │
│  │  │  Pages   │  │  Store   │  │  Components         │   │  │
│  │  │          │  │  (Zustand│  │  - Video Player     │   │  │
│  │  │ Landing  │  │  )       │  │  - Party Controls   │   │  │
│  │  │ Auth     │  │          │  │  - Member List      │   │  │
│  │  │ Dashboard│  │  Auth    │  │  - Chat (future)    │   │  │
│  │  │ Party    │  │  Party   │  │                     │   │  │
│  │  └──────────┘  └──────────┘  └─────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────┬───────────────────────┬────────────────────┘
                     │ HTTP/REST             │ WebSocket
                     │ (Axios)               │ (Socket.IO)
                     ▼                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                        SERVER LAYER                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                Express.js + Socket.IO Server              │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │  │
│  │  │  Routes  │  │Middleware│  │  Socket  │  │ Config  │ │  │
│  │  │          │  │          │  │ Handlers │  │         │ │  │
│  │  │ /auth    │  │  Auth    │  │          │  │Database │ │  │
│  │  │ /party   │  │  CORS    │  │ join     │  │         │ │  │
│  │  │ /user    │  │  Helmet  │  │ play     │  │ JWT     │ │  │
│  │  │          │  │  Rate    │  │ pause    │  │         │ │  │
│  │  │          │  │  Limiter │  │ seek     │  │         │ │  │
│  │  │          │  │          │  │ sync     │  │         │ │  │
│  │  └──────────┘  └──────────┘  └──────────┘  └─────────┘ │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────────────┘
                     │ MongoDB Driver (Mongoose)
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                       DATABASE LAYER                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                     MongoDB                               │  │
│  │  ┌──────────┐  ┌──────────┐                              │  │
│  │  │  Users   │  │ Parties  │                              │  │
│  │  │          │  │          │                              │  │
│  │  │ username │  │partyCode │                              │  │
│  │  │ email    │  │ name     │                              │  │
│  │  │ password │  │ host     │                              │  │
│  │  │ avatar   │  │ members  │                              │  │
│  │  │streaming │  │ content  │                              │  │
│  │  │Services  │  │videoState│                              │  │
│  │  └──────────┘  └──────────┘                              │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. User Authentication Flow
```
User → Register/Login → Express Route → Validate → 
Hash Password → Save to MongoDB → Generate JWT → 
Return Token → Store in LocalStorage → Use for API calls
```

### 2. Party Creation Flow
```
User → Create Party Request → Verify JWT → 
Generate Party Code → Save to MongoDB → 
Add User to Members → Return Party Data
```

### 3. Video Synchronization Flow
```
User A (Host) → Play/Pause/Seek → 
Socket.IO Event → Server validates → 
Update MongoDB State → Broadcast to Room → 
All Users Receive Event → Update Video Player → 
Synchronized Playback
```

## Component Architecture

### Frontend Components

```
App (Root)
│
├── Router
│   ├── LandingPage
│   ├── LoginPage
│   ├── RegisterPage
│   ├── DashboardPage
│   │   ├── PartyCard
│   │   ├── CreatePartyModal
│   │   └── JoinPartyModal
│   │
│   └── PartyPage
│       ├── VideoPlayer (ReactPlayer)
│       ├── VideoControls
│       ├── MembersList
│       └── PartyInfo
│
└── Global State (Zustand)
    ├── authStore (user, token, login, logout)
    └── partyStore (parties, currentParty, actions)
```

### Backend Architecture

```
Server Entry (index.js)
│
├── Express App
│   ├── Middleware
│   │   ├── CORS
│   │   ├── Helmet (Security)
│   │   ├── Rate Limiter
│   │   └── Body Parser
│   │
│   ├── Routes
│   │   ├── /api/auth (Register, Login, Me)
│   │   ├── /api/party (Create, Join, Get, Leave, Update)
│   │   └── /api/user (Profile, Streaming Services)
│   │
│   └── Error Handler
│
├── Socket.IO Server
│   ├── Authentication Middleware
│   ├── Connection Handler
│   └── Event Handlers
│       ├── join-party
│       ├── video-play
│       ├── video-pause
│       ├── video-seek
│       ├── request-sync
│       └── leave-party
│
└── Database
    ├── Connection (MongoDB)
    └── Models
        ├── User Model
        └── Party Model
```

## Real-Time Communication

### WebSocket Events Flow

```
Client A                    Server                   Client B, C, D
   │                          │                            │
   ├─ video-play ──────────►  │                            │
   │  {currentTime: 120}       │                            │
   │                          │                            │
   │                          ├─ Validate permissions      │
   │                          ├─ Update DB                 │
   │                          │                            │
   │                          ├─ video-play ─────────────► │
   │                          │  Broadcast to room         │
   │                          │                            │
   │                          │                            ├─ Update player
   │                          │                            └─ Play at 120s
   │
   └─ Confirmation ◄──────────┤
```

## Security Layers

```
┌─────────────────────────────────────────┐
│         Security Measures                │
├─────────────────────────────────────────┤
│ 1. JWT Authentication                    │
│    - 7-day expiration                    │
│    - Secure secret key                   │
│                                          │
│ 2. Password Security                     │
│    - Bcrypt hashing (10 rounds)         │
│    - Never stored in plain text         │
│                                          │
│ 3. API Protection                        │
│    - Rate limiting (100 req/15min)      │
│    - Helmet.js security headers         │
│    - CORS configuration                 │
│                                          │
│ 4. Input Validation                      │
│    - Express-validator                  │
│    - Mongoose schema validation         │
│                                          │
│ 5. WebSocket Security                    │
│    - Token-based authentication         │
│    - Room-based isolation               │
│    - Permission checking                │
└─────────────────────────────────────────┘
```

## Deployment Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    Production Setup                       │
│                                                           │
│  ┌────────────┐      ┌────────────┐     ┌────────────┐ │
│  │   Nginx    │      │   Node.js  │     │  MongoDB   │ │
│  │  (Reverse  │─────►│   Server   │────►│   Atlas    │ │
│  │   Proxy)   │      │   (PM2)    │     │  (Cloud)   │ │
│  └────────────┘      └────────────┘     └────────────┘ │
│       │                                                  │
│       │                                                  │
│  ┌────▼─────┐                                           │
│  │  React   │                                           │
│  │  Build   │                                           │
│  │  (Static)│                                           │
│  └──────────┘                                           │
│                                                          │
│  SSL/TLS Certificate (Let's Encrypt)                    │
└──────────────────────────────────────────────────────────┘
```

## Scalability Considerations

### Horizontal Scaling
- **Load Balancer**: Distribute traffic across multiple server instances
- **Redis Adapter**: Use Redis for Socket.IO in multi-server setup
- **Session Sharing**: JWT ensures stateless authentication

### Vertical Scaling
- Optimize MongoDB queries with proper indexing
- Implement caching layer (Redis)
- Use CDN for static assets
- Compress responses

### Future Enhancements
- Microservices architecture
- Message queue for async operations
- Distributed caching
- Database replication and sharding

## Technology Stack Rationale

| Technology | Why Chosen |
|-----------|------------|
| **React** | Component-based, large ecosystem, excellent for real-time UIs |
| **Node.js** | Non-blocking I/O perfect for real-time applications |
| **Express** | Minimal, flexible, widely adopted |
| **Socket.IO** | Reliable WebSocket abstraction, automatic fallbacks |
| **MongoDB** | Flexible schema, perfect for rapid development |
| **JWT** | Stateless authentication, scalable |
| **Zustand** | Simple state management, less boilerplate |
| **React Player** | Supports multiple video platforms |

## Performance Optimizations

1. **Frontend**
   - Code splitting
   - Lazy loading routes
   - Memoization of expensive components
   - Debounced video progress updates

2. **Backend**
   - Connection pooling for MongoDB
   - Efficient WebSocket room management
   - Indexed database queries
   - Rate limiting to prevent abuse

3. **Network**
   - gzip compression
   - Minimal payload size
   - WebSocket binary frames for efficiency
   - CDN for static assets

## Monitoring & Logging

```
┌─────────────────────────────────────┐
│         Monitoring Stack             │
├─────────────────────────────────────┤
│ - Winston (Logging)                 │
│ - Morgan (HTTP logs)                │
│ - PM2 (Process monitoring)          │
│ - MongoDB logs                      │
│ - Socket.IO debug mode              │
└─────────────────────────────────────┘
```

## Disaster Recovery

- Regular MongoDB backups
- Environment configuration backups
- Documentation of all critical processes
- Rollback procedures
- Health check endpoints

---

This architecture is designed to be:
- **Scalable**: Can handle increasing load
- **Maintainable**: Clean separation of concerns
- **Secure**: Multiple security layers
- **Performant**: Optimized for real-time operations
- **Resilient**: Handles failures gracefully
