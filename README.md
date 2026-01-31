# ROA - Roots Online Academy

A subscription-based online martial arts learning platform (similar to Submeta.io/Teachable) built with Next.js 14+, featuring multi-creator support, HD video courses, and Stripe subscriptions.

## Features

- **Multi-Creator Support**: Coaches can create and manage their own courses
- **Subscription-Based Access**: Weekly (€5) and Yearly (€99) plans via Stripe
- **Three Disciplines**: MMA, Kickboxing, and Grappling categories
- **HD Video Player**: Secure video playback with Cloudinary signed URLs
- **Progress Tracking**: Track lesson completion and watch history
- **Modern UI**: Clean, responsive design with Tailwind CSS and shadcn/ui
- **Role-Based Access**: Student, Coach, and Admin roles via Clerk

## Tech Stack

- **Framework**: Next.js 14+ (App Router, TypeScript)
- **Styling**: Tailwind CSS + shadcn/ui components
- **Authentication**: Clerk (social login, user management, roles)
- **Database**: PostgreSQL + Prisma ORM
- **Payments**: Stripe (subscriptions, checkout, webhooks)
- **Video Hosting**: Cloudinary (uploads, streaming, signed URLs)
- **State Management**: Zustand

## Prerequisites

Before you begin, you'll need:

1. Node.js 18+ installed
2. A PostgreSQL database (local or cloud like Neon, Supabase, etc.)
3. [Clerk](https://clerk.com) account for authentication
4. [Stripe](https://stripe.com) account for payments
5. [Cloudinary](https://cloudinary.com) account for video hosting

## Getting Started

### 1. Clone and Install

```bash
git clone <repository-url>
cd RootsOnline
npm install
```

### 2. Environment Setup

Copy the example env file and fill in your values:

```bash
cp .env.example .env.local
```

Required environment variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/roots_online"

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Stripe
STRIPE_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
STRIPE_MONTHLY_PRICE_ID=price_xxxxx
STRIPE_YEARLY_PRICE_ID=price_xxxxx

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=xxxxx
CLOUDINARY_API_SECRET=xxxxx

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Database Setup

**Option A: Using Prisma (recommended)**

Push the schema to your database:

```bash
npm run db:push
```

**Option B: Using SQL directly (Neon)**

If you're using Neon and prefer to run SQL directly:

1. Open your Neon dashboard
2. Go to the SQL Editor
3. Copy and paste the contents of `scripts/setup-database.sql`
4. Run the SQL

**Seed sample data (optional)**

After setting up the tables, seed with demo courses:

```bash
npm run db:seed
```

### 4. Stripe Configuration

1. Create two subscription products in Stripe Dashboard:
   - Weekly: €5/week
   - Yearly: €99/year

2. Copy the Price IDs to your `.env.local`

3. Set up the webhook endpoint in Stripe Dashboard:
   - URL: `https://your-domain.com/api/stripe/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.*`, `invoice.*`

4. For local development, use Stripe CLI:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── coach/         # Coach course management APIs
│   │   ├── stripe/        # Stripe webhook & checkout
│   │   └── user/          # User sync API
│   ├── coach/             # Coach dashboard pages
│   ├── courses/           # Course browsing & learning
│   ├── dashboard/         # Student dashboard
│   └── ...
├── components/
│   ├── course/            # Course-related components
│   ├── layout/            # Header, Footer
│   ├── providers/         # Context providers
│   ├── ui/                # shadcn/ui components
│   └── video/             # Video player components
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities and configurations
│   ├── auth.ts           # Auth helpers
│   ├── cloudinary.ts     # Cloudinary config
│   ├── prisma.ts         # Prisma client
│   ├── stripe.ts         # Stripe helpers
│   └── utils.ts          # General utilities
├── store/                 # Zustand stores
└── types/                 # TypeScript types
prisma/
├── schema.prisma          # Database schema
└── seed.ts               # Seed data script
```

## User Roles

- **Student** (default): Can browse courses and watch content with active subscription
- **Coach**: Can create and manage courses (set via Clerk metadata or admin)
- **Admin**: Full platform access

To make a user a Coach or Admin, update their role in the database or through Clerk's user metadata.

## Key Features Implementation

### Subscription Paywall

- Middleware (`middleware.ts`) protects routes requiring authentication
- Server components check `hasActiveSubscription()` before rendering premium content
- API routes verify subscription status before returning signed video URLs

### Video Security

- Videos uploaded to Cloudinary with `type: "authenticated"`
- Signed URLs generated server-side with 1-hour expiration
- Free preview lessons bypass subscription check

### Course Management (Coaches)

- Create courses with title, description, discipline
- Add modules and lessons
- Toggle free preview on lessons
- Publish/unpublish courses

## Deployment (Vercel)

1. Push your code to GitHub
2. Import project in Vercel
3. Add all environment variables
4. Deploy

**Important**: Set up the Stripe webhook with your production URL after deploying.

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:push      # Push schema to database
npm run db:migrate   # Run migrations
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed database with sample data
```

## Future Enhancements

- [ ] Video upload UI in coach dashboard
- [ ] Course progress percentage calculation
- [ ] Student analytics for coaches
- [ ] Comments and community features
- [ ] Certificate generation
- [ ] Mobile app (React Native)

## License

Private - All rights reserved.

