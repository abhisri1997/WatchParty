# WatchParty API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:** `201 Created`
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "username": "john_doe",
    "email": "john@example.com",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=john_doe"
  }
}
```

**Errors:**
- `400` - Validation errors or user already exists

---

### Login
**POST** `/auth/login`

Login to an existing account.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:** `200 OK`
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "username": "john_doe",
    "email": "john@example.com",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=john_doe",
    "streamingServices": []
  }
}
```

**Errors:**
- `401` - Invalid credentials

---

### Get Current User
**GET** `/auth/me`

Get the currently authenticated user's information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "user": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "username": "john_doe",
    "email": "john@example.com",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=john_doe",
    "streamingServices": [],
    "activeParties": [
      {
        "partyCode": "ABC12345",
        "name": "Friday Night Movies",
        "streamingService": "netflix"
      }
    ]
  }
}
```

---

## Party Endpoints

### Create Party
**POST** `/party/create`

Create a new watch party.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Friday Night Movies",
  "streamingService": "netflix",
  "maxMembers": 10,
  "allowMemberControl": true
}
```

**Response:** `201 Created`
```json
{
  "message": "Party created successfully",
  "party": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "partyCode": "ABC12345",
    "name": "Friday Night Movies",
    "streamingService": "netflix",
    "host": {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "username": "john_doe",
      "avatar": "..."
    },
    "members": [...],
    "settings": {
      "maxMembers": 10,
      "allowMemberControl": true
    },
    "videoState": {
      "isPlaying": false,
      "currentTime": 0
    }
  }
}
```

---

### Join Party
**POST** `/party/join`

Join an existing party using a party code.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "partyCode": "ABC12345"
}
```

**Response:** `200 OK`
```json
{
  "message": "Joined party successfully",
  "party": {
    // Full party object
  }
}
```

**Errors:**
- `404` - Party not found
- `400` - Already a member or party is full

---

### Get Party Details
**GET** `/party/:partyCode`

Get details of a specific party.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "party": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "partyCode": "ABC12345",
    "name": "Friday Night Movies",
    "streamingService": "netflix",
    "host": {...},
    "members": [...],
    "currentContent": {
      "contentTitle": "Movie Title",
      "contentUrl": "https://...",
      "contentType": "movie"
    },
    "videoState": {
      "isPlaying": true,
      "currentTime": 120.5,
      "lastUpdated": "2026-01-16T10:30:00.000Z"
    }
  }
}
```

---

### Leave Party
**POST** `/party/:partyCode/leave`

Leave a party.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "message": "Left party successfully"
}
```

---

### Update Party Content
**PUT** `/party/:partyCode/content`

Update the video content for a party.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "contentId": "dQw4w9WgXcQ",
  "contentTitle": "Rick Astley - Never Gonna Give You Up",
  "contentUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "contentType": "custom"
}
```

**Response:** `200 OK`
```json
{
  "message": "Content updated successfully",
  "party": {
    // Updated party object
  }
}
```

---

### Get Active Parties
**GET** `/party/user/active`

Get all active parties for the current user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "parties": [
    {
      // Party object
    }
  ]
}
```

---

## User Endpoints

### Get Profile
**GET** `/user/profile`

Get user profile information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "user": {
    // User object with populated activeParties
  }
}
```

---

### Update Profile
**PUT** `/user/profile`

Update user profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "username": "new_username",
  "avatar": "https://..."
}
```

**Response:** `200 OK`
```json
{
  "user": {
    // Updated user object
  }
}
```

---

### Add Streaming Service
**POST** `/user/streaming-service`

Authenticate with a streaming service.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "service": "netflix",
  "accessToken": "...",
  "refreshToken": "...",
  "expiresAt": "2026-12-31T23:59:59.000Z"
}
```

**Response:** `200 OK`
```json
{
  "message": "Streaming service authenticated successfully",
  "streamingServices": [...]
}
```

---

## WebSocket Events

### Client → Server

#### join-party
Join a party room.
```javascript
socket.emit('join-party', { 
  partyCode: 'ABC12345' 
});
```

#### video-play
Send play command.
```javascript
socket.emit('video-play', { 
  partyCode: 'ABC12345',
  currentTime: 120.5 
});
```

#### video-pause
Send pause command.
```javascript
socket.emit('video-pause', { 
  partyCode: 'ABC12345',
  currentTime: 120.5 
});
```

#### video-seek
Seek to a specific time.
```javascript
socket.emit('video-seek', { 
  partyCode: 'ABC12345',
  currentTime: 200.0 
});
```

#### request-sync
Request video synchronization.
```javascript
socket.emit('request-sync', { 
  partyCode: 'ABC12345' 
});
```

### Server → Client

#### party-state
Receive initial party state when joining.
```javascript
socket.on('party-state', (data) => {
  // data contains: party, videoState, currentContent, members
});
```

#### video-play
Receive play notification.
```javascript
socket.on('video-play', (data) => {
  // data contains: currentTime, timestamp, userId
});
```

#### video-pause
Receive pause notification.
```javascript
socket.on('video-pause', (data) => {
  // data contains: currentTime, timestamp, userId
});
```

#### video-seek
Receive seek notification.
```javascript
socket.on('video-seek', (data) => {
  // data contains: currentTime, timestamp, userId
});
```

#### video-sync
Receive sync response.
```javascript
socket.on('video-sync', (data) => {
  // data contains: currentTime, isPlaying, timestamp
});
```

#### user-joined
User joined notification.
```javascript
socket.on('user-joined', (data) => {
  // data contains: userId, partyCode
});
```

#### user-left
User left notification.
```javascript
socket.on('user-left', (data) => {
  // data contains: userId, partyCode
});
```

---

## Error Responses

All endpoints may return these error formats:

**Validation Error:** `400`
```json
{
  "errors": [
    {
      "msg": "Invalid email address",
      "param": "email",
      "location": "body"
    }
  ]
}
```

**Authentication Error:** `401`
```json
{
  "error": "Invalid authentication token"
}
```

**Not Found:** `404`
```json
{
  "error": "Party not found"
}
```

**Server Error:** `500`
```json
{
  "error": "Internal Server Error"
}
```

---

## Rate Limiting

- **Rate Limit:** 100 requests per 15 minutes per IP
- **Header:** `X-RateLimit-Remaining` shows remaining requests

When limit exceeded:
```json
{
  "error": "Too many requests, please try again later"
}
```
