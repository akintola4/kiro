# 🤖 Kiro Projects

This directory contains all projects built with **Kiro AI** - my AI-powered development assistant and IDE.

## 📁 Projects

### QuickOnboardDoc
**Status:** 🚀 In Production  
**Description:** AI-powered employee onboarding documentation system with RAG (Retrieval-Augmented Generation) capabilities.

**Tech Stack:**
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Prisma + PostgreSQL
- NextAuth.js
- TanStack Query
- Framer Motion
- OpenAI GPT-4
- Vercel Blob Storage

**Key Features:**
- Multi-workspace support with complete data isolation
- AI chat assistant for documentation queries
- Document upload and processing with vector embeddings
- Team collaboration and role-based access
- Real-time notifications
- PWA support for offline access
- Workspace switching with ghost loading animations

**Live:** [Production URL]

---

## 🛠️ Development Standards

All projects in this directory follow these core principles:

### Technology Stack
- **Framework:** Next.js with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Database:** PostgreSQL + Prisma
- **Auth:** NextAuth.js
- **State Management:** TanStack Query
- **UI Components:** shadcn/ui (New York theme)
- **Icons:** lucide-react & @tabler/icons-react
- **Notifications:** Sonner

### Code Quality
- Type-safe with TypeScript
- Server-side rendering where possible
- Optimistic UI updates
- Proper error handling
- Loading states for all async operations
- Responsive design (mobile-first)
- Accessibility compliant

### Architecture Patterns
- API routes for backend logic
- Server components by default
- Client components only when needed
- Proper data fetching with TanStack Query
- Cookie-based session management
- Workspace/tenant isolation

---

## 🚀 Getting Started with a New Project

### Prerequisites
```bash
node >= 18.x
npm or yarn
PostgreSQL database
```

### Standard Setup
```bash
# Create new Next.js project
npx create-next-app@latest project-name --typescript --tailwind --app

# Install core dependencies
npm install @prisma/client @tanstack/react-query framer-motion
npm install next-auth @auth/prisma-adapter bcrypt jsonwebtoken
npm install sonner lucide-react @tabler/icons-react

# Install dev dependencies
npm install -D prisma @types/bcrypt @types/jsonwebtoken

# Initialize Prisma
npx prisma init

# Setup shadcn/ui
npx shadcn-ui@latest init
```

### Environment Variables Template
```env
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="" # Generate with: npx auth secret

# OAuth (Optional)
AUTH_GOOGLE_ID=""
AUTH_GOOGLE_SECRET=""
```

---

## 📝 Project Structure

```
project-name/
├── app/
│   ├── api/              # API routes
│   ├── (auth)/           # Auth pages (login, signup)
│   ├── dashboard/        # Protected dashboard pages
│   └── layout.tsx        # Root layout
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── providers/        # Context providers
│   └── [feature]/        # Feature-specific components
├── lib/
│   ├── prisma.ts         # Prisma client
│   ├── auth.ts           # Auth configuration
│   └── utils.ts          # Utility functions
├── prisma/
│   └── schema.prisma     # Database schema
├── public/               # Static assets
├── .env                  # Environment variables
└── README.md             # Project documentation
```

---

## 🎯 Common Patterns

### API Route Template
```typescript
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Your logic here
    
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

### TanStack Query Hook
```typescript
const { data, isLoading } = useQuery({
  queryKey: ["resource"],
  queryFn: async () => {
    const response = await fetch("/api/resource");
    if (!response.ok) throw new Error("Failed to fetch");
    return response.json();
  },
});
```

### Server Component with Auth
```typescript
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();
  
  if (!session) {
    redirect("/login");
  }
  
  return <div>Protected content</div>;
}
```

---

## 🔧 Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Database
npx prisma generate      # Generate Prisma client
npx prisma db push       # Push schema to database
npx prisma studio        # Open Prisma Studio
npx prisma migrate dev   # Create migration

# Deployment
vercel                   # Deploy to Vercel
vercel --prod            # Deploy to production
```

---

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [TanStack Query Documentation](https://tanstack.com/query)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Kiro AI Documentation](https://kiro.dev/docs)

---

## 🤝 Contributing

All projects are built with Kiro AI assistance. When making changes:

1. Follow the established patterns
2. Maintain type safety
3. Write clear commit messages
4. Test thoroughly before deploying
5. Update documentation as needed

---

## 📄 License

Each project may have its own license. Check individual project directories for details.

---

## 🎉 Built with Kiro

These projects showcase the power of AI-assisted development with Kiro. From initial scaffolding to complex features, Kiro helps maintain consistency, quality, and best practices across all projects.

**Happy coding! 🚀**
