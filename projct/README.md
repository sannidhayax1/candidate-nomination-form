# Candidate Nomination Form - Backend API

A Node.js/Express backend API for managing candidate nominations for Ethara AI. This system handles form submissions, document uploads, and candidate status tracking.

## Features

- ✓ Candidate form submission with validation
- ✓ Multi-file upload support (Class 10th/12th marksheets, Resume)
- ✓ MongoDB database with candidate schema
- ✓ RESTful API endpoints
- ✓ Form validation with express-validator
- ✓ File upload management with multer
- ✓ Candidate status tracking
- ✓ Admin endpoints for candidate management
- ✓ Statistics and analytics

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **File Upload**: multer
- **Validation**: express-validator
- **Environment**: dotenv

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Setup Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your configuration:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/candidate_nomination
   NODE_ENV=development
   UPLOAD_DIR=./uploads
   MAX_FILE_SIZE=10485760
   ```

3. **Start MongoDB** (if running locally):
   ```bash
   mongod
   ```

4. **Run the server:**
   - Development (with auto-reload):
     ```bash
     npm run dev
     ```
   - Production:
     ```bash
     npm start
     ```

The server will start on `http://localhost:5000`

## API Endpoints

### 1. Submit Candidate Form
**POST** `/api/candidates/submit`

Submit a new candidate nomination with document uploads.

**Request:**
- Content-Type: `multipart/form-data`

**Form Fields:**
- `fullName` (required): Full name of candidate
- `personalEmail` (required): Personal email address
- `collegeName` (required): College name
- `branch` (required): Branch of study
- `enrollmentNumber` (required): College enrollment number
- `yearOfPassing` (required): Expected year of passing
- `contactNumber` (required): 10-digit contact number
- `aadhaarNumber` (required): 12-digit Aadhaar number
- `class10Percentage` (required): Class 10th percentage (0-100)
- `class12Percentage` (required): Class 12th percentage (0-100)
- `class10Marksheet` (required): PDF/JPG/PNG file (max 10MB)
- `class12Marksheet` (required): PDF/JPG/PNG file (max 10MB)
- `resume` (optional): PDF/JPG/PNG file (max 10MB)

**Response (Success):**
```json
{
  "success": true,
  "message": "Form submitted successfully",
  "candidate": {
    "id": "candidate_id",
    "email": "user@example.com",
    "fullName": "John Doe",
    "status": "pending"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Error message"
}
```

### 2. Get All Candidates
**GET** `/api/candidates`

Retrieve all candidates with pagination and filtering.

**Query Parameters:**
- `status` (optional): Filter by status (pending, under_review, shortlisted, rejected)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Records per page (default: 10)

**Response:**
```json
{
  "success": true,
  "total": 50,
  "page": 1,
  "limit": 10,
  "totalPages": 5,
  "candidates": [
    {
      "_id": "...",
      "fullName": "John Doe",
      "email": "john@example.com",
      "status": "pending",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### 3. Get Candidate by ID
**GET** `/api/candidates/:id`

Retrieve detailed information about a specific candidate.

**Response:**
```json
{
  "success": true,
  "candidate": {
    "_id": "...",
    "fullName": "John Doe",
    "email": "john@example.com",
    "personalEmail": "john.personal@example.com",
    "collegeName": "XYZ University",
    "branch": "Computer Science",
    "enrollmentNumber": "12345678",
    "class10Percentage": 95,
    "class12Percentage": 92,
    "status": "pending",
    "class10Marksheet": {
      "filename": "1234567890-123456789.pdf",
      "url": "/uploads/1234567890-123456789.pdf"
    },
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### 4. Update Candidate Status
**PATCH** `/api/candidates/:id/status`

Update candidate status and add notes.

**Request Body:**
```json
{
  "status": "shortlisted",
  "notes": "Strong candidate with excellent scores"
}
```

**Valid Statuses:**
- `pending` - Initial submission
- `under_review` - Being reviewed
- `shortlisted` - Qualified for next round
- `rejected` - Not selected

**Response:**
```json
{
  "success": true,
  "message": "Candidate status updated",
  "candidate": { ... }
}
```

### 5. Delete Candidate
**DELETE** `/api/candidates/:id`

Remove a candidate and their associated files.

**Response:**
```json
{
  "success": true,
  "message": "Candidate deleted successfully"
}
```

### 6. Get Statistics
**GET** `/api/candidates/stats`

Get overview statistics about candidates.

**Response:**
```json
{
  "success": true,
  "statistics": {
    "totalCandidates": 150,
    "byStatus": {
      "pending": 50,
      "under_review": 40,
      "shortlisted": 35,
      "rejected": 25
    }
  }
}
```

### 7. Health Check
**GET** `/api/health`

Check server status.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## File Upload

Files are stored in the `uploads/` directory with the following specifications:

- **Supported formats**: PDF, JPG, PNG
- **Max file size**: 10 MB (configurable via `MAX_FILE_SIZE`)
- **Naming**: Timestamp + random suffix to prevent collisions
- **Accessibility**: Files served from `/uploads/` endpoint

## Database Schema

### Candidate Model

```javascript
{
  email: String (unique, required),
  fullName: String (required),
  personalEmail: String (required),
  collegeName: String (required),
  branch: String (required),
  enrollmentNumber: String (unique, required),
  yearOfPassing: Number (required),
  contactNumber: String (10 digits, required),
  aadhaarNumber: String (12 digits, unique, required),
  class10Percentage: Number (0-100, required),
  class10Marksheet: { filename, url, uploadedAt },
  class12Percentage: Number (0-100, required),
  class12Marksheet: { filename, url, uploadedAt },
  resume: { filename, url, uploadedAt },
  status: String (enum: pending/under_review/shortlisted/rejected),
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Error Handling

The API returns appropriate HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `409` - Conflict (duplicate entry)
- `500` - Server Error

All error responses include a success flag and error message.

## Development

### Run in Development Mode
```bash
npm run dev
```
This uses `nodemon` to auto-reload on file changes.

### Scripts

- `npm start` - Run production server
- `npm run dev` - Run development server with auto-reload

## Project Structure

```
├── server.js                 # Main application entry
├── package.json             # Dependencies
├── .env.example             # Environment variables template
├── .gitignore              # Git ignore rules
├── models/
│   └── Candidate.js        # MongoDB schema
├── routes/
│   └── candidates.js       # API routes
├── controllers/
│   └── candidateController.js  # Business logic
├── middleware/
│   ├── upload.js           # File upload configuration
│   └── validation.js       # Form validation
└── uploads/                # Uploaded files directory
```

## Security Considerations

1. **File Upload**: 
   - Only PDF, JPG, PNG files allowed
   - Files stored with timestamp prefix to prevent overwrites
   - Size limit enforced

2. **Data Validation**:
   - Email format validation
   - Phone number format (10 digits)
   - Aadhaar format (12 digits)
   - Percentage range checks (0-100)

3. **Database**:
   - Unique constraints on email, enrollment number, and Aadhaar
   - Prevent duplicate submissions

## Next Steps

- Add authentication/authorization
- Implement email notifications
- Add export functionality (CSV/PDF)
- Create admin dashboard
- Add rate limiting
- Implement logging
- Add unit and integration tests

## Support

For issues or questions, contact the development team.

## License

ISC

---

**Created for Ethara AI**
