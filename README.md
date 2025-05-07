# Momentum - Professional Networking Platform

A professional networking and appointment scheduling platform built with Node.js, Express, and MongoDB.

## Features

- User Authentication
- Professional Profiles
- Appointment Scheduling
- Chat Rooms
- Posts/Content Sharing
- Resource Management

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd momentum
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration values.

## Development

Start the development server:
```bash
npm run dev
```

## Production

Build and start the production server:
```bash
npm start
```

## Testing

Run tests:
```bash
npm test
```

## Code Quality

- Lint code:
```bash
npm run lint
```

- Format code:
```bash
npm run format
```

## API Documentation

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- GET /api/auth/me - Get current user

### Professionals
- GET /api/professionals - Get all professionals
- GET /api/professionals/:id - Get professional by ID
- POST /api/professionals - Create professional profile
- PUT /api/professionals/:id - Update professional profile
- DELETE /api/professionals/:id - Delete professional profile

### Appointments
- GET /api/appointments - Get all appointments
- POST /api/appointments - Create appointment
- PUT /api/appointments/:id - Update appointment
- DELETE /api/appointments/:id - Delete appointment

### Chat Rooms
- GET /api/chatrooms - Get all chat rooms
- POST /api/chatrooms - Create chat room
- GET /api/chatrooms/:id - Get chat room by ID
- POST /api/chatrooms/:id/messages - Send message to chat room

### Posts
- GET /api/posts - Get all posts
- POST /api/posts - Create post
- PUT /api/posts/:id - Update post
- DELETE /api/posts/:id - Delete post

### Resources
- GET /api/resources - Get all resources
- POST /api/resources - Create resource
- PUT /api/resources/:id - Update resource
- DELETE /api/resources/:id - Delete resource

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the ISC License. 