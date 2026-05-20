<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Candidate Nomination Form - Backend API

This is a Node.js/Express backend project for managing candidate nominations for Ethara AI.

### Project Overview

- **Type**: Node.js/Express REST API
- **Database**: MongoDB
- **Main Entry**: server.js
- **Port**: 5000 (default)

### Key Technologies

- Express.js - Web framework
- MongoDB - NoSQL database with Mongoose ODM
- Multer - File upload handling
- Express-validator - Input validation
- Dotenv - Environment configuration

### Project Structure

```
├── server.js                    # Express app and server setup
├── package.json                # Dependencies
├── .env.example                # Environment template
├── models/                     # MongoDB schemas
│   └── Candidate.js            # Candidate model
├── routes/                     # API endpoints
│   └── candidates.js           # Candidate routes
├── controllers/                # Business logic
│   └── candidateController.js  # Candidate operations
├── middleware/                 # Express middleware
│   ├── upload.js              # File upload config
│   └── validation.js          # Form validation
└── uploads/                   # Uploaded files storage
```

### Setup Instructions

1. Install dependencies: `npm install`
2. Copy environment: `cp .env.example .env`
3. Update MongoDB URI in .env file
4. Start MongoDB service
5. Run development: `npm run dev` or production: `npm start`

### API Endpoints

- **POST** `/api/candidates/submit` - Submit nomination form
- **GET** `/api/candidates` - List all candidates
- **GET** `/api/candidates/:id` - Get candidate details
- **PATCH** `/api/candidates/:id/status` - Update status
- **DELETE** `/api/candidates/:id` - Delete candidate
- **GET** `/api/candidates/stats` - Get statistics
- **GET** `/api/health` - Health check

### Development Guidelines

- Use `npm run dev` for development with auto-reload
- Environment variables must be set in .env
- File uploads stored in ./uploads/ directory
- All API responses follow standard JSON format with success flag
- Validation errors returned as 400 with detailed error array

### Important Notes

- Maximum file size: 10MB per file
- Supported file types: PDF, JPG, PNG
- Contact number must be 10 digits
- Aadhaar number must be 12 digits
- Unique constraints on email, enrollment number, and Aadhaar

### Common Commands

- `npm install` - Install dependencies
- `npm run dev` - Start with nodemon (development)
- `npm start` - Start production server
- See package.json for all available scripts
