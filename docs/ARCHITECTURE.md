# Architecture

## Project Structure

```
cvify/
├── src/                    # Backend source code
│   ├── app.module.ts      # Main application module
│   ├── main.ts            # Application entry point
│   ├── profiles/          # Profile management module
│   ├── cvs/               # CV generation module
│   ├── groq/              # AI service module
│   ├── prisma/            # Database service
│   └── middleware/        # HTTP logger
├── prisma/                # Database schema and migrations
├── public/                # Frontend files (HTML, CSS, JS)
├── uploads/cvs/          # Generated PDF files
└── docs/                  # Documentation
```

## Backend Architecture

### Modules

1. **App Module** - Main application module that imports all other modules
2. **Profiles Module** - Manages user profile data
3. **CVs Module** - Handles CV generation and storage
4. **Groq Module** - Connects to AI service
5. **Prisma Module** - Database connection

### Module Details

#### Profiles Module

- **Controller**: REST API endpoints for CRUD operations
- **Service**: Business logic for profile management
- **DTOs**: Data validation objects

#### CVs Module

- **Controller**: CV generation and retrieval endpoints
- **Service**: CV generation logic
- **PDF Generator**: Creates PDF files
- **DTOs**: Generation request validation

#### Groq Module

- **Service**: Communicates with Groq AI API
- **Prompt**: AI prompt template

## Database Schema

### Profiles Table

```
- id (Primary Key)
- profileName (Unique)
- email
- fullName
- title
- phone
- location
- summary
- skills (Array)
- links (JSON)
- education (JSON)
- experiences (JSON)
- projects (JSON)
- activities (JSON)
- volunteering (JSON)
- timestamps
```

### CVs Table

```
- id (Primary Key)
- profileId (Foreign Key → Profiles)
- jobDescription (Text)
- pdfPath (String)
- cvData (JSON)
- timestamps
```

## Frontend Architecture

### Single Page Application (SPA)

**Files:**

- `index.html` - Main HTML structure
- `app.js` - JavaScript logic (view management, API calls)
- `styles.css` - Styling

**Views:**

1. Profiles List
2. Create Profile
3. Profile Detail
4. Edit Profile
5. Generate CV
6. History

**State Management:**

- Simple JavaScript state
- No framework (vanilla JS)

## Deployment Architecture

```
Docker Compose
    ├── PostgreSQL Container (Port 5432)
    └── App Container (Port 3000)
        ├── NestJS Backend
        └── Static Frontend
```

## Security Notes

- No authentication system (single user app)
- CORS enabled for development
- Database credentials in environment variables
- API key stored in `.env` file
