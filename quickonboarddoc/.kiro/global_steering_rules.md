---
inclusion: always
---
<!------------------------------------------------------------------------------------
   Add rules to this file or a short description that will apply across all your workspaces.
   
   Learn about inclusion modes: https://kiro.dev/docs/steering/#inclusion-modes
-------------------------------------------------------------------------------------> 

🤖 Kiro Global Steering Directives (My Personal Workflow)

Directive 1: Core Technology Stack (Non-Negotiable)

Framework: All new applications MUST use Next.js with the App Router structure.

Language: MUST use TypeScript (--ts).

Styling: MUST use Tailwind CSS (--tailwind).

Animation: For any necessary animations, ALWAYS use the motion library (Framer Motion).

Directive 2: Database and ORM Policy

Database: The database provider MUST be PostgreSQL.

ORM: The ORM MUST be Prisma.

Schema: The schema.prisma file must be configured for the postgresql provider and MUST include the necessary models for the @auth/prisma-adapter (Account, Session, User, VerificationToken).

Test Runner: If generating any database test runner code, the file MUST include import 'dotenv/config' to correctly load environment variables.

Directive 3: Authentication Protocol (NextAuth)

System: Authentication MUST be handled by NextAuth.

Adapter: MUST use the @auth/prisma-adapter.

Security: MUST utilize bcrypt and jsonwebtoken for secure server-side logic (e.g., password hashing).

Structure: Auth logic MUST be split into the following mandatory files:

auth.ts (Core NextAuth configuration).

/app/api/auth/[...nextauth]/route.ts (The Next.js API route handler).

middleware.ts (Implemented using authMiddleware to protect routes).

Secrets: Must always instruct me to generate the NEXTAUTH_SECRET using npx auth secret and include placeholders for AUTH_GOOGLE_ID and AUTH_GOOGLE_SECRET in the .env file.

Directive 4: UI/UX & Component Library

UI Library: All reusable components MUST be built using the shadcn/ui component library standards (e.g., New York theme).

Toasts: Notifications MUST be implemented using the sonner component.

Icons: Icons MUST be sourced exclusively from lucide-react or @tabler/icons-react. Do not use external icon packs.

Directive 5: Data Fetching and State Management (TanStack Query)

State Tool: Asynchronous state and data fetching MUST use TanStack Query.

Global Setup: MUST ensure the application root is wrapped with the custom QueryProvider.tsx.

Persistence: The Query Client MUST be configured to persist the cache to window.sessionStorage for 24 hours (maxAge: 1000 * 60 * 60 * 24), as defined in the existing QueryProvider.tsx.

Performance: Default query options MUST set the retry count to retry: 1.

Hydration: MUST wait until the persistence setup is complete (ready state) before rendering application content.

Summary

This document defines my entire boilerplate. For all code generation, Kiro, adhere to this stack, structure, and these configuration preferences. If an instruction conflicts with one of these directives, the directive always takes precedence.