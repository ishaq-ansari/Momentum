// Chat service implementation using Socket.io
const ChatRoom = require('../models/ChatRoom');
const User = require('../models/User');

/**
 * Initializes Socket.io chat service with the HTTP server
 * @param {http.Server} server - HTTP server instance
 */
function initChatService(server) {
  const io = require('socket.io')(server);
  
  // Store active users with their socket IDs
  const activeUsers = new Map();
  
  // Middleware for authentication
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication token required'));
    }
    
    try {
      // Verify token (using your existing JWT verification)
      const jwt = require('jsonwebtoken');
      const config = require('../config/config');
      const decoded = jwt.verify(token, config.JWT_SECRET);
      
      // Attach user to socket
      socket.userId = decoded.id;
      
      // Get user data
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return next(new Error('User not found'));
      }
      
      socket.user = user;
      console.log(`User authenticated: ${user.username} (${user._id})`);
      return next();
    } catch (err) {
      console.error('Authentication error:', err.message);
      return next(new Error('Invalid token'));
    }
  });
  
  // Handle connection
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.username} (ID: ${socket.userId})`);
    
    // Add user to active users map
    activeUsers.set(socket.userId, {
      socketId: socket.id,
      user: socket.user
    });
    
    // Broadcast online status update
    io.emit('userStatusChange', {
      userId: socket.userId,
      status: 'online'
    });
    
    // Join user's personal room for direct messages
    socket.join(`user:${socket.userId}`);
    
    // Handle user requesting their chat rooms
    socket.on('getChatRooms', async () => {
      try {
        console.log(`Fetching chat rooms for user: ${socket.user.username}`);
        
        // Find chat rooms the user is part of
        const chatRooms = await ChatRoom.find({
          users: socket.userId
        }).populate({
          path: 'users',
          select: 'username userType'
        }).populate({
          path: 'messages.userId',
          select: 'username'
        });
        
        console.log(`Found ${chatRooms.length} chat rooms for ${socket.user.username}`);
        socket.emit('chatRoomsList', chatRooms);
      } catch (err) {
        console.error('Error fetching chat rooms:', err.message);
        socket.emit('error', { message: 'Error fetching chat rooms' });
      }
    });
    
    // Handle user joining a chat room
    socket.on('joinChatRoom', async (roomId) => {
      try {
        // Validate that the room exists
        const room = await ChatRoom.findById(roomId);
        if (!room) {
          socket.emit('error', { message: 'Chat room not found' });
          return;
        }
        
        // Check if the user is part of the room
        if (!room.users.includes(socket.userId)) {
          socket.emit('error', { message: 'You are not a member of this chat room' });
          return;
        }
        
        // Join the room
        socket.join(`room:${roomId}`);
        console.log(`${socket.user.username} joined room: ${roomId}`);
        
        // Get the messages for this room
        const chatRoom = await ChatRoom.findById(roomId)
          .populate({
            path: 'messages.userId',
            select: 'username'
          });
          
        // Emit joined room event with messages
        socket.emit('joinedRoom', { 
          roomId,
          messages: chatRoom.messages 
        });
      } catch (err) {
        console.error('Error joining room:', err.message);
        socket.emit('error', { message: 'Error joining chat room' });
      }
    });
    
    // Handle new messages
    socket.on('sendMessage', async (data) => {
      try {
        const { roomId, message } = data;
        
        if (!message || !roomId) {
          socket.emit('error', { message: 'Invalid message data' });
          return;
        }
        
        console.log(`Message from ${socket.user.username} in room ${roomId}: ${message}`);
        
        // Save message to database
        const chatRoom = await ChatRoom.findById(roomId);
        if (!chatRoom) {
          return socket.emit('error', { message: 'Chat room not found' });
        }
        
        // Check if user is part of this chat room
        if (!chatRoom.users.some(userId => userId.toString() === socket.userId)) {
          return socket.emit('error', { message: 'User not authorized to message in this room' });
        }
        
        // Add message to chat room
        const newMessage = {
          userId: socket.userId,
          text: message,
          createdAt: new Date()
        };
        
        chatRoom.messages.push(newMessage);
        
        await chatRoom.save();
        
        // Broadcast message to all users in the room
        io.to(`room:${roomId}`).emit('newMessage', {
          roomId,
          message: {
            userId: socket.userId,
            username: socket.user.username,
            text: message,
            createdAt: new Date()
          }
        });
      } catch (err) {
        console.error('Error sending message:', err.message);
        socket.emit('error', { message: 'Error sending message' });
      }
    });
    
    // Handle creating a new chat room with a peer
    socket.on('createPeerChat', async (peerId) => {
      try {
        console.log(`Creating chat: ${socket.user.username} -> Peer ID: ${peerId}`);
        
        // Validate the peer ID
        if (!peerId) {
          socket.emit('error', { message: 'Invalid peer ID' });
          return;
        }
        
        // Check if the peer exists
        const peer = await User.findById(peerId).select('username userType');
        if (!peer) {
          console.error(`Peer not found with ID: ${peerId}`);
          socket.emit('error', { message: 'Peer not found' });
          return;
        }
        
        console.log(`Found peer: ${peer.username} (${peer._id})`);
        
        // Check if chat already exists between these users
        const existingChat = await ChatRoom.findOne({
          users: { $all: [socket.userId, peerId] },
          // This ensures only these two users are in the room (for direct chat)
          $expr: { $eq: [{ $size: '$users' }, 2] }
        }).populate({
          path: 'users',
          select: 'username userType'
        });
        
        if (existingChat) {
          console.log(`Chat already exists: ${existingChat._id}`);
          // Chat already exists, return existing
          socket.emit('chatCreated', existingChat);
          socket.join(`room:${existingChat._id}`);
          return;
        }
        
        // Create a new chat room
        const newChatRoom = new ChatRoom({
          name: `Chat with ${peer.username}`,
          description: `Direct chat with ${peer.username}`,
          users: [socket.userId, peerId],
          messages: []
        });
        
        await newChatRoom.save();
        console.log(`New chat room created: ${newChatRoom._id}`);
        
        // Get the populated chat room to return
        const populatedChatRoom = await ChatRoom.findById(newChatRoom._id)
          .populate({
            path: 'users',
            select: 'username userType'
          });
        
        // Join the room
        socket.join(`room:${newChatRoom._id}`);
        
        // If peer is online, make them join too
        const peerSocket = activeUsers.get(peerId);
        if (peerSocket) {
          io.to(peerSocket.socketId).emit('newChatInvitation', {
            roomId: newChatRoom._id,
            fromUser: {
              id: socket.userId,
              username: socket.user.username
            }
          });
        }
        
        socket.emit('chatCreated', populatedChatRoom);
      } catch (err) {
        console.error('Error creating chat room:', err);
        socket.emit('error', { message: `Error creating chat room: ${err.message}` });
      }
    });
    
    // Handle peer search
    socket.on('searchPeers', async (query) => {
      try {
        const peers = await User.find({
          userType: 'peer',
          username: { $regex: query, $options: 'i' }
        }).select('username userType');
        
        socket.emit('peerSearchResults', peers);
      } catch (err) {
        socket.emit('error', { message: 'Error searching peers' });
      }
    });
    
    // Handle user typing
    socket.on('typing', (roomId) => {
      socket.to(`room:${roomId}`).emit('userTyping', {
        userId: socket.userId,
        username: socket.user.username
      });
    });
    
    // Handle user stopped typing
    socket.on('stopTyping', (roomId) => {
      socket.to(`room:${roomId}`).emit('userStoppedTyping', {
        userId: socket.userId
      });
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user?.username || socket.userId}`);
      
      // Remove from active users
      activeUsers.delete(socket.userId);
      
      // Broadcast offline status
      io.emit('userStatusChange', {
        userId: socket.userId,
        status: 'offline'
      });
    });
  });
  
  return io;
}

module.exports = { initChatService };