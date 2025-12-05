# QuickOnboardDoc 🎃

AI-powered RAG chatbot for new hire onboarding. Get instant, accurate answers from your company documentation with the Crypt Keeper aesthetic.

## Test Account Credentials
- **Username**: kirotester@tester.com
- **Password**: KiroTester@@27

for more info for testing go to /.kiro/ kiro-team-onboarding-guide.md for the instructions 
---


## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Violet/Crypt Keeper theme)
- **Animation**: Framer Motion
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth v5 with Prisma Adapter
- **State Management**: TanStack Query with sessionStorage persistence
- **UI Components**: shadcn/ui (New York theme)
- **Icons**: Tabler Icons & Lucide React
- **Notifications**: Sonner

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- pnpm/npm/yarn

### Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Set up your environment variables:

```bash
cp .env.example .env
```

Edit `.env` and add:
- `DATABASE_URL`: Your PostgreSQL connection string
- `NEXTAUTH_SECRET`: Generate with `npx auth secret`
- `AUTH_GOOGLE_ID` & `AUTH_GOOGLE_SECRET`: Google OAuth credentials (optional)
- `GEMINI_API_KEY`: Your Gemini API key for RAG functionality

3. Set up the database:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

4. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Features

### Implemented

- ✅ Dark-mode-first Crypt Keeper theme with violet color scheme
- ✅ NextAuth authentication (credentials + Google OAuth)
- ✅ Multi-workspace support
- ✅ User onboarding flow
- ✅ Document storage management
- ✅ RAG chatbot interface with welcome message
- ✅ Notifications system
- ✅ Contact form
- ✅ Fully responsive design
- ✅ SEO optimization (metadata, robots.txt, sitemap)

### To Implement

- 🔨 File upload to cloud storage (S3, Cloudinary, etc.)
- 🔨 Vector embeddings for documents
- 🔨 RAG retrieval logic with vector search
- 🔨 Gemini API integration for grounded responses
- 🔨 Document processing pipeline
- 🔨 Workspace switching UI
- 🔨 User management & invitations

## Project Structure

```
├── app/
│   ├── api/              # API routes
│   ├── dashboard/        # Protected dashboard pages
│   ├── login/            # Login page
│   ├── signup/           # Signup page
│   ├── onboarding/       # Workspace creation
│   └── page.tsx          # Landing page
├── components/
│   ├── ui/               # shadcn/ui components
│   └── dashboard/        # Dashboard-specific components
├── lib/                  # Utilities
├── prisma/               # Database schema
└── providers/            # React providers (TanStack Query)
```

## Database Schema

Multi-workspace architecture with:
- Users (with NextAuth models)
- Workspaces
- WorkspaceMembers (join table)
- Documents
- Notifications

## Next Steps

1. **Generate NEXTAUTH_SECRET**:
   ```bash
   npx auth secret
   ```

2. **Set up cloud storage** for document uploads (AWS S3, Cloudinary, etc.)

3. **Implement RAG pipeline**:
   - Document chunking
   - Vector embeddings (OpenAI, Cohere, etc.)
   - Vector database (Pinecone, Weaviate, Supabase Vector)
   - Gemini API integration

4. **Deploy** to Vercel or your preferred platform

## License

MIT
