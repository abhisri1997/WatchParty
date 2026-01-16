const Party = require('../models/Party');
const jwt = require('jsonwebtoken');

// Store active socket connections
const activeConnections = new Map();

const initializeSocketHandlers = (io) => {
  
  // Middleware to authenticate socket connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userId;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.userId}`);
    
    // Store connection
    activeConnections.set(socket.userId, socket.id);

    // Join a party room
    socket.on('join-party', async (data) => {
      try {
        const { partyCode } = data;
        
        const party = await Party.findOne({ partyCode })
          .populate('host', 'username avatar')
          .populate('members.user', 'username avatar');

        if (!party) {
          socket.emit('error', { message: 'Party not found' });
          return;
        }

        // Check if user is a member
        const isMember = party.members.some(m => m.user._id.toString() === socket.userId);
        if (!isMember) {
          socket.emit('error', { message: 'Not a member of this party' });
          return;
        }

        // Join the socket room
        socket.join(partyCode);
        socket.currentParty = partyCode;

        console.log(`👥 User ${socket.userId} joined party: ${partyCode}`);

        // Notify others in the party
        socket.to(partyCode).emit('user-joined', {
          userId: socket.userId,
          partyCode
        });

        // Send current party state to the joined user
        socket.emit('party-state', {
          party,
          videoState: party.videoState,
          currentContent: party.currentContent,
          members: party.members
        });

      } catch (error) {
        console.error('Error joining party:', error);
        socket.emit('error', { message: 'Failed to join party' });
      }
    });

    // Video control events
    socket.on('video-play', async (data) => {
      try {
        const { partyCode, currentTime } = data;
        
        const party = await Party.findOne({ partyCode });
        
        if (!party) return;

        // Check if user has control permission
        if (!party.settings.allowMemberControl && party.host.toString() !== socket.userId) {
          socket.emit('error', { message: 'Only host can control playback' });
          return;
        }

        party.videoState = {
          isPlaying: true,
          currentTime,
          lastUpdated: Date.now(),
          lastUpdatedBy: socket.userId
        };

        await party.save();

        // Broadcast to all members in the party
        io.to(partyCode).emit('video-play', {
          currentTime,
          timestamp: Date.now(),
          userId: socket.userId
        });

        console.log(`▶️ Play event in party ${partyCode} at ${currentTime}s`);

      } catch (error) {
        console.error('Error handling play:', error);
      }
    });

    socket.on('video-pause', async (data) => {
      try {
        const { partyCode, currentTime } = data;
        
        const party = await Party.findOne({ partyCode });
        
        if (!party) return;

        if (!party.settings.allowMemberControl && party.host.toString() !== socket.userId) {
          socket.emit('error', { message: 'Only host can control playback' });
          return;
        }

        party.videoState = {
          isPlaying: false,
          currentTime,
          lastUpdated: Date.now(),
          lastUpdatedBy: socket.userId
        };

        await party.save();

        io.to(partyCode).emit('video-pause', {
          currentTime,
          timestamp: Date.now(),
          userId: socket.userId
        });

        console.log(`⏸️ Pause event in party ${partyCode} at ${currentTime}s`);

      } catch (error) {
        console.error('Error handling pause:', error);
      }
    });

    socket.on('video-seek', async (data) => {
      try {
        const { partyCode, currentTime } = data;
        
        const party = await Party.findOne({ partyCode });
        
        if (!party) return;

        if (!party.settings.allowMemberControl && party.host.toString() !== socket.userId) {
          socket.emit('error', { message: 'Only host can control playback' });
          return;
        }

        party.videoState = {
          ...party.videoState,
          currentTime,
          lastUpdated: Date.now(),
          lastUpdatedBy: socket.userId
        };

        await party.save();

        io.to(partyCode).emit('video-seek', {
          currentTime,
          timestamp: Date.now(),
          userId: socket.userId
        });

        console.log(`⏩ Seek event in party ${partyCode} to ${currentTime}s`);

      } catch (error) {
        console.error('Error handling seek:', error);
      }
    });

    // Request sync
    socket.on('request-sync', async (data) => {
      try {
        const { partyCode } = data;
        
        const party = await Party.findOne({ partyCode });
        
        if (!party) return;

        socket.emit('video-sync', {
          currentTime: party.videoState.currentTime,
          isPlaying: party.videoState.isPlaying,
          timestamp: Date.now()
        });

        console.log(`🔄 Sync requested in party ${partyCode}`);

      } catch (error) {
        console.error('Error handling sync request:', error);
      }
    });

    // Chat message
    socket.on('send-message', async (data) => {
      try {
        const { partyCode, message } = data;
        
        io.to(partyCode).emit('new-message', {
          userId: socket.userId,
          message,
          timestamp: Date.now()
        });

      } catch (error) {
        console.error('Error handling message:', error);
      }
    });

    // Leave party
    socket.on('leave-party', (data) => {
      const { partyCode } = data;
      
      socket.leave(partyCode);
      socket.to(partyCode).emit('user-left', {
        userId: socket.userId,
        partyCode
      });

      console.log(`👋 User ${socket.userId} left party: ${partyCode}`);
    });

    // Disconnect
    socket.on('disconnect', () => {
      activeConnections.delete(socket.userId);
      
      if (socket.currentParty) {
        socket.to(socket.currentParty).emit('user-left', {
          userId: socket.userId,
          partyCode: socket.currentParty
        });
      }

      console.log(`❌ User disconnected: ${socket.userId}`);
    });
  });
};

module.exports = { initializeSocketHandlers };
