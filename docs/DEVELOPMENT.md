# Development Guide

## Setup Development Environment

### Prerequisites

- Bun installed
- PostgreSQL running (Docker or local)
- Code editor (VS Code recommended)

### Initial Setup

```bash
# Clone repository
git clone <repository-url>
cd cvify

# Install dependencies
bun install

# Setup environment
cp .env.example .env
# Edit .env and add your GROQ_API_KEY

# Generate Prisma Client
bunx prisma generate

# Run migrations
bunx prisma migrate dev

# Start development server
bun run start:dev
```

## Project Structure Explained

```
src/
├── main.ts                    # App entry point
├── app.module.ts              # Root module
├── app.controller.ts          # Root controller
├── app.service.ts             # Root service
│
├── profiles/                  # Profile management
│   ├── profiles.module.ts
│   ├── profiles.controller.ts # REST endpoints
│   ├── profiles.service.ts    # Business logic
│   └── dto/                   # Data validation
│       ├── create-profile.dto.ts
│       └── update-profile.dto.ts
│
├── cvs/                       # CV generation
│   ├── cvs.module.ts
│   ├── cvs.controller.ts      # REST endpoints
│   ├── cvs.service.ts         # CV logic
│   ├── pdf-generator.ts       # PDF creation
│   └── dto/
│       └── generate-cv.dto.ts
│
├── groq/                      # AI service
│   ├── groq.module.ts
│   ├── groq.service.ts        # API integration
│   └── prompt.md              # AI prompt template
│
├── prisma/                    # Database
│   ├── prisma.module.ts
│   └── prisma.service.ts      # DB connection
│
└── middleware/
    └── logger.middleware.ts   # HTTP logging
```

## Adding New Features

### 1. Add New Profile Field

**Step 1:** Update Prisma schema

```prisma
// prisma/schema.prisma
model Profiles {
  // ... existing fields
  newField String?
}
```

**Step 2:** Create migration

```bash
bunx prisma migrate dev --name add_new_field
```

**Step 3:** Update DTO (if needed)

```typescript
// src/profiles/dto/update-profile.dto.ts
export class UpdateProfileDto {
  // ... existing fields
  newField?: string;
}
```

### 2. Add New API Endpoint

**Step 1:** Add to controller

```typescript
// src/profiles/profiles.controller.ts
@Get('custom')
customEndpoint() {
  return this.profilesService.customMethod();
}
```

**Step 2:** Add to service

```typescript
// src/profiles/profiles.service.ts
customMethod() {
  return this.prisma.profiles.findMany({
    // custom query
  });
}
```

### 3. Create New Module

```bash
# Using NestJS CLI (if installed)
nest generate module feature-name
nest generate controller feature-name
nest generate service feature-name
```

**Manual creation:**

```typescript
// src/feature/feature.module.ts
import { Module } from '@nestjs/common';
import { FeatureController } from './feature.controller';
import { FeatureService } from './feature.service';

@Module({
  controllers: [FeatureController],
  providers: [FeatureService],
  exports: [FeatureService],
})
export class FeatureModule {}
```

## Working with Prisma

### Common Operations

```typescript
// Find all
await prisma.profiles.findMany();

// Find one
await prisma.profiles.findUnique({ where: { id: 1 } });

// Create
await prisma.profiles.create({
  data: { profileName: 'Test', email: 'test@example.com' },
});

// Update
await prisma.profiles.update({
  where: { id: 1 },
  data: { fullName: 'John Doe' },
});

// Delete
await prisma.profiles.delete({ where: { id: 1 } });

// With relations
await prisma.profiles.findUnique({
  where: { id: 1 },
  include: { cvs: true },
});
```

### Prisma Studio

```bash
bunx prisma studio
```

Opens GUI at http://localhost:5555

## Customizing AI Prompts

Edit `src/groq/prompt.md`:

```markdown
You are a technical recruiter...

Job Description:
{{jobDescription}}

Profile:
{{profile}}

Instructions:

- Customize these instructions
- Add new requirements
- Change output format
```

## PDF Customization

Edit `src/cvs/pdf-generator.ts`:

```typescript
// Change fonts, colors, layout, etc.
const styles = {
  header: {
    fontSize: 20,
    bold: true,
    color: '#2c3e50',
  },
  // ... more styles
};
```

## Testing

### Manual Testing

```bash
# Start dev server
bun run start:dev

# Use frontend at http://localhost:3000
# Or use API client (Postman, curl, etc.)
```

### Example API Tests

```bash
# Create profile
curl -X POST http://localhost:3000/profiles \
  -H "Content-Type: application/json" \
  -d '{"profileName":"Test","email":"test@example.com"}'

# Get profiles
curl http://localhost:3000/profiles

# Generate CV
curl -X POST http://localhost:3000/cvs/generate \
  -H "Content-Type: application/json" \
  -d '{"profileId":1,"jobDescription":"We need a developer..."}' \
  --output cv.pdf
```

## Debugging

### Enable Debug Logging

```typescript
// src/middleware/logger.middleware.ts
console.log('Request:', req.method, req.url);
console.log('Body:', req.body);
```

### Check Database

```bash
# Connect to database
docker compose exec postgres psql -U cvify -d cvify_db

# Run queries
SELECT * FROM "Profiles";
SELECT * FROM "CVs";
```

### Debug Groq Responses

```typescript
// src/groq/groq.service.ts
console.log('AI Response:', completion.choices[0]?.message?.content);
```

## Code Style

### Formatting

```bash
# Format code
bun run format

# Lint code
bun run lint
```

### Conventions

- Use camelCase for variables/functions
- Use PascalCase for classes
- Use kebab-case for file names
- Add types to all functions
- Write descriptive variable names

## Frontend Development

Frontend is in `public/` folder:

- `index.html` - Structure
- `app.js` - Logic
- `styles.css` - Styling

### Making Changes

1. Edit files in `public/`
2. Refresh browser (no build needed)
3. Test functionality

### Adding New View

```javascript
// In app.js

// 1. Add view to HTML in index.html
<div id="newView" class="view">
  <!-- content -->
</div>

// 2. Register in views object
const views = {
  // ... existing views
  newView: document.getElementById('newView'),
};

// 3. Create show function
function showNewView() {
  showView('newView');
}
```

## Common Issues

### Prisma Client Not Found

```bash
bunx prisma generate
```

### Port Already in Use

```bash
# Change port in .env
PORT=3001
```

### Migration Failed

```bash
# Reset database
bunx prisma migrate reset
```

### AI Not Responding

- Check GROQ_API_KEY in .env
- Check internet connection
- Check Groq API status

## Performance Tips

1. **Database Indexes** - Add for frequently queried fields
2. **Pagination** - For large lists
3. **Caching** - Cache AI responses if needed
4. **Async Operations** - Use async/await properly
5. **Connection Pooling** - Prisma handles this automatically

## Environment Variables

```env
# Required
GROQ_API_KEY=gsk_your_key_here

# Optional
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://user:pass@localhost:5432/db

# AI Settings (can add)
GROQ_MODEL=llama-3.1-8b-instant
GROQ_TEMPERATURE=0.7
```

## Resources

- [NestJS Docs](https://docs.nestjs.com)
- [Prisma Docs](https://www.prisma.io/docs)
- [Groq API Docs](https://console.groq.com/docs)
- [PDFMake Docs](https://pdfmake.github.io/docs/)
- [Bun Docs](https://bun.sh/docs)
