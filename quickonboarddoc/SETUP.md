# QuickOnboardDoc Setup Guide

## ✅ Installation Complete!

Dependencies have been installed. Follow these steps to get started:

## 1. Generate NEXTAUTH_SECRET

```bash
npx auth secret
```

Copy the generated secret and add it to your `.env` file.

## 2. Set up PostgreSQL Database

Update your `.env` file with your PostgreSQL connection string:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/quickonboarddoc?schema=public"
```

## 3. Run Database Migrations

```bash
npx prisma migrate dev --name init
```

This will:
- Create your database tables
- Generate the Prisma Client

## 4. (Optional) Add Google OAuth

If you want Google sign-in, add these to `.env`:

```env
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"
```

Get these from [Google Cloud Console](https://console.cloud.google.com/).

## 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎃

## Next Steps

### To Implement Full RAG Functionality:

1. **Vector Database**: Set up Pinecone, Weaviate, or Supabase Vector
2. **Document Processing**: Add chunking logic for uploaded files
3. **Embeddings**: Integrate OpenAI or Cohere for vector embeddings
4. **Gemini API**: Add your `GEMINI_API_KEY` to `.env` and implement RAG retrieval in `/app/api/chat/route.ts`
5. **File Storage**: Implement cloud storage (AWS S3, Cloudinary) in `/app/api/documents/upload/route.ts`

## Troubleshooting

### Database Connection Issues
- Make sure PostgreSQL is running
- Check your `DATABASE_URL` format
- Ensure the database exists

### Auth Issues
- Run `npx auth secret` if you haven't
- Check `NEXTAUTH_URL` matches your dev server URL

### Build Errors
- Run `npm install` again
- Clear `.next` folder: `rm -rf .next`
- Regenerate Prisma Client: `npx prisma generate`

## Project Structure

```
quickonboarddoc/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── dashboard/         # Protected pages
│   ├── login/            # Auth pages
│   └── page.tsx          # Landing page
├── components/            # React components
├── lib/                  # Utilities
├── prisma/               # Database schema
└── providers/            # React providers
```

Enjoy building with the Crypt Keeper! 🎃👻
