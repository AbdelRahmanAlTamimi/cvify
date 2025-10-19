# CV Storage and Management

## Overview

The application now stores generated CVs as PDF files in the `uploads/cvs` directory and maintains metadata in the database.

## Database Schema

### CVs Table

```prisma
model CVs {
  id             Int      @id @default(autoincrement())
  userId         Int
  user           Users    @relation(fields: [userId], references: [id], onDelete: Cascade)
  jobDescription String   @db.Text
  pdfPath        String
  cvData         Json
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}
```

**Fields:**

- `id`: Unique identifier for the CV
- `userId`: Reference to the user who generated the CV
- `jobDescription`: The job description used to tailor the CV
- `pdfPath`: Relative path to the stored PDF file
- `cvData`: JSON object containing the optimized CV data used to generate the PDF
- `createdAt`: Timestamp when the CV was created
- `updatedAt`: Timestamp when the CV was last updated

## API Endpoints

### POST `/cvs/generate`

Generate a new CV and save it to the database.

**Request Body:**

```json
{
  "userId": 1,
  "jobDescription": "Full Stack Developer position requiring expertise in Node.js, React, and PostgreSQL..."
}
```

**Response:**

- Returns the PDF file as a downloadable attachment
- Saves the PDF to `uploads/cvs/cv_{userId}_{timestamp}.pdf`
- Creates a database record with the CV metadata

### GET `/cvs`

Get all generated CVs with user information.

**Response:**

```json
[
  {
    "id": 1,
    "userId": 1,
    "jobDescription": "Full Stack Developer position...",
    "pdfPath": "uploads/cvs/cv_1_1729321234567.pdf",
    "cvData": {
      /* optimized CV data */
    },
    "createdAt": "2025-10-19T05:20:34.567Z",
    "updatedAt": "2025-10-19T05:20:34.567Z",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "fullName": "John Doe"
    }
  }
]
```

### GET `/cvs/:id`

Get a specific CV by ID.

**Response:**

```json
{
  "id": 1,
  "userId": 1,
  "jobDescription": "Full Stack Developer position...",
  "pdfPath": "uploads/cvs/cv_1_1729321234567.pdf",
  "cvData": {
    /* optimized CV data */
  },
  "createdAt": "2025-10-19T05:20:34.567Z",
  "updatedAt": "2025-10-19T05:20:34.567Z",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "fullName": "John Doe"
  }
}
```

### GET `/cvs/user/:userId`

Get all CVs for a specific user.

**Response:**

```json
[
  {
    "id": 1,
    "userId": 1,
    "jobDescription": "Full Stack Developer position...",
    "pdfPath": "uploads/cvs/cv_1_1729321234567.pdf",
    "cvData": {
      /* optimized CV data */
    },
    "createdAt": "2025-10-19T05:20:34.567Z",
    "updatedAt": "2025-10-19T05:20:34.567Z"
  }
]
```

### GET `/cvs/:id/download`

Download a previously generated CV as a PDF file.

**Response:**

- Returns the PDF file as a downloadable attachment

### DELETE `/cvs/:id`

Delete a CV record and its associated PDF file.

**Response:**

```json
{
  "id": 1,
  "userId": 1,
  "jobDescription": "Full Stack Developer position...",
  "pdfPath": "uploads/cvs/cv_1_1729321234567.pdf",
  "cvData": {
    /* optimized CV data */
  },
  "createdAt": "2025-10-19T05:20:34.567Z",
  "updatedAt": "2025-10-19T05:20:34.567Z"
}
```

## File Storage

- **Directory**: `uploads/cvs/`
- **Naming Convention**: `cv_{userId}_{timestamp}.pdf`
- **Path Storage**: Relative paths are stored in the database (e.g., `uploads/cvs/cv_1_1729321234567.pdf`)

## Features

1. **Persistent Storage**: CVs are saved as PDF files and can be downloaded later
2. **Metadata Tracking**: Job description, user information, and CV data are stored
3. **History**: Users can view all their previously generated CVs
4. **Cleanup**: Deleting a CV record also removes the associated PDF file
5. **Automatic Directory Creation**: The uploads directory is created automatically on service initialization

## Implementation Details

- The `CvsService` ensures the uploads directory exists on initialization
- PDF files are saved using `fs.writeFileSync()` with a unique timestamp-based filename
- The database stores the relative path to enable easy file retrieval
- The `getPdfBuffer()` method reads the PDF file from disk for download
- The `remove()` method deletes both the database record and the physical file

## Error Handling

- User not found: Throws an error if the specified user doesn't exist
- File not found: Returns `null` if the PDF file is missing when trying to download
- CV not found: Throws an error when trying to delete a non-existent CV
