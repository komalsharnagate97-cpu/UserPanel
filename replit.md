# Project Overview

## Overview

This is a comprehensive User Panel for a business growth platform built with React, TypeScript, Express, and PostgreSQL. The application provides complete authentication, payment processing, referral system, wallet management, and analytics tracking. It's designed to help businesses grow through automation tools and digital services with a complete backend infrastructure.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and component-based development
- **Routing**: Wouter for lightweight client-side routing with support for protected routes
- **Styling**: Tailwind CSS with custom dark theme design system (Background: #121212, Primary: #1E88E5, Accent: #F9A825, Success: #00C853, Error: #D32F2F)
- **UI Components**: Radix UI primitives with shadcn/ui component library for accessible, customizable components
- **State Management**: TanStack Query for server state management and caching with automatic authentication headers
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript for type safety across the full stack
- **Authentication**: JWT-based authentication with refresh tokens, bcrypt for password hashing
- **Payment Integration**: Razorpay and Stripe with webhook support for automated payment confirmation
- **Real-time**: Socket.IO for live notifications and broadcasts
- **Error Handling**: Centralized error handling middleware with proper HTTP status codes

### Authentication & Authorization
- **JWT Tokens**: Access tokens (15-minute expiry) and refresh tokens (7-day expiry)
- **Password Security**: Bcrypt hashing with salt rounds for secure password storage
- **Role-Based Access**: User and admin roles with middleware protection
- **Session Management**: Token-based authentication with automatic refresh on expiry

### Database & Schema
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for automatic schema synchronization
- **Tables**:
  - **users**: Full user profiles with wallet, referral code, and role
  - **payments**: Payment transactions with provider integration
  - **withdrawals**: Withdrawal requests with status tracking
  - **notifications**: User notifications with broadcast support
  - **faqs**: FAQ content organized by category
  - **analytics_events**: Event tracking for user analytics
  - **referral_commissions**: 3-level referral commission tracking

### Payment System
- **Providers**: Razorpay (INR) and Stripe (USD/International)
- **Payment Methods**: Card, UPI, QR codes, bank transfer, Binance
- **Manual Payments**: "I've Paid" flow with proof upload
- **Webhooks**: Automated payment confirmation with signature verification
- **Commission System**: Automatic 3-level referral commission distribution (10%, 5%, 3%)

### Referral System
- **Referral Codes**: Unique auto-generated codes for each user
- **3-Level Tracking**: Tracks referrals up to 3 levels deep
- **Automatic Commissions**: Distributes commissions on successful payments
  - Level 1 (Direct Referral): 10%
  - Level 2 (Indirect): 5%
  - Level 3 (Third Level): 3%
- **Wallet Integration**: Commissions automatically credited to wallet

### Wallet & Withdrawals
- **Balance Tracking**: Real-time wallet balance updates
- **Withdrawal Methods**: UPI ID and Bank Transfer support
- **Status Management**: Requested, Approved, Processed, Rejected
- **Reference IDs**: Unique reference for each payout

### Notifications
- **Real-time Delivery**: Socket.IO for instant notifications
- **Broadcast System**: Admin can send notifications to all users
- **User-Specific**: Targeted notifications for individual users
- **Read Status**: Track read/unread notifications

### Analytics
- **Event Tracking**: Video watch time, signups, payments, user actions
- **Data Export**: CSV export for user transactions and referrals
- **Metrics**: Track conversion rates, engagement, and revenue

## External Dependencies

### Database & ORM
- **Neon Database**: Serverless PostgreSQL database for production deployment
- **Drizzle ORM**: Type-safe database toolkit with automatic migrations
- **Drizzle Kit**: Schema management and migration tools

### Payment Providers
- **Razorpay**: Indian payment gateway for UPI, cards, and local payments
- **Stripe**: International payment processing with webhook support

### Authentication & Security
- **bcrypt**: Password hashing with configurable salt rounds
- **jsonwebtoken**: JWT token generation and verification
- **crypto**: Webhook signature verification

### Real-time Communication
- **Socket.IO**: WebSocket library for real-time bidirectional communication

### UI Framework & Components  
- **Radix UI**: Headless UI primitives for accessibility and customization
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **Lucide React**: Icon library for consistent iconography
- **shadcn/ui**: Pre-built component library built on Radix UI

### Development Tools
- **Vite**: Build tool with fast HMR and optimized bundling
- **TypeScript**: Static type checking across the entire codebase
- **ESBuild**: Fast JavaScript bundler for server-side code
- **PostCSS**: CSS processing for Tailwind and autoprefixing

### Runtime & Server
- **Express.js**: Web application framework for Node.js
- **TanStack Query**: Data fetching and caching library for React
- **Wouter**: Minimalist routing library for React applications
- **React Hook Form**: Form handling with validation support
- **Multer**: Multipart form data handling for file uploads

### Utilities & Validation
- **Zod**: Schema validation library for TypeScript
- **clsx & tailwind-merge**: Utility functions for conditional CSS classes
- **date-fns**: Date manipulation and formatting library

## Testing Results (October 3, 2025)

### Comprehensive Feature Testing Completed

**Authentication & User Management:**
- ✅ Signup: Successfully created test users with auto-generated referral codes
- ✅ Login: JWT-based authentication working with access and refresh tokens
- ✅ User Profile: GET /api/auth/me endpoint returning user data correctly

**Referral System:**
- ✅ Referral Code Generation: Unique codes auto-generated (e.g., REFMGAZDIQ0L1Y)
- ✅ Multi-Level Tracking: 2 referred users successfully registered
- ✅ Commission Processing: 10% commission (₹10 on ₹100 payment) credited correctly
- ✅ Referral API: GET /api/referrals and /api/referrals/users working

**Payment System:**
- ✅ Manual Payment: Successfully created pending payment via API
- ✅ Payment Completion: Status update to "completed" working
- ✅ Wallet Credit: Payment amount (₹100) credited to user wallet
- ✅ Commission Distribution: Automatic referral commission processing verified

**Products:**
- ✅ 7 Products Available: WhatsApp Automation, Wasender, Ready + Grow, Map Extractor, Digital Visiting Card, Bulk IVR Calls, Website Service
- ✅ Pricing Range: ₹999/month to ₹19,999 one-time

**Notifications:**
- ✅ Storage: 3 notifications created (user-specific + broadcast)
- ✅ API: GET /api/notifications returning correct data with emoji support

**FAQs:**
- ✅ Storage: 4 FAQs created across General, Payments, Referrals, Products categories
- ✅ API: GET /api/faqs returning all FAQs (no auth required)

**Database Verification:**
- Users: 3 accounts created
- Payments: 1 completed payment
- Commissions: 1 referral commission record
- Total Wallet Balance: ₹110 (verified)

**Application Status:**
- ✅ Server running on port 5000 with 0.0.0.0 host
- ✅ Vite HMR connected and working
- ✅ PostgreSQL database configured and operational
- ✅ All API endpoints responding correctly

## Recent Setup (October 2025)

### Comprehensive Backend Implementation
- **Database Schema**: Complete schema with 7 tables for all functionality
- **API Routes**: 30+ endpoints for authentication, payments, referrals, wallet, notifications, FAQs, and analytics
- **Authentication System**: JWT-based auth with bcrypt password hashing and refresh tokens
- **Payment Integration**: Full Razorpay and Stripe integration with webhook handlers
- **Referral System**: 3-level commission tracking with automatic wallet credits
- **Real-time Notifications**: Socket.IO integration for instant notifications
- **File Uploads**: Multer integration for payment proof uploads
- **Analytics Tracking**: Event tracking system with CSV export capability

### Environment Configuration
- **PostgreSQL Database**: Configured and connected via DATABASE_URL
- **Environment Variables**: JWT secrets, payment provider keys, webhook secrets
- **Development Server**: Running on port 5000 with host 0.0.0.0
- **Vite Configuration**: Updated to support Replit proxy with HMR over port 443
- **Deployment**: Configured for autoscale deployment with build and production commands

### Frontend Updates
- **Authentication Service**: Updated to use backend APIs instead of localStorage
- **Query Client**: Enhanced with automatic JWT token injection in headers
- **Signup Form**: Added referral code field for referral system
- **Theme Colors**: Updated to match exact requirements (Background: #121212, Primary: #1E88E5, etc.)

### Development Commands
- `npm run dev`: Start development server (port 5000)
- `npm run build`: Build for production (client + server)
- `npm start`: Run production server
- `npm run check`: TypeScript type checking
- `npm run db:push`: Push database schema changes

### Environment Variables Required

For full functionality, set these environment variables:

```
# JWT Secrets (REQUIRED - change in production)
JWT_SECRET=your-secret-key-change-in-production
JWT_REFRESH_SECRET=your-refresh-secret-key-change-in-production

# Razorpay (Optional - for Razorpay payments)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret

# Stripe (Optional - for Stripe payments)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

### API Endpoints

**Authentication**
- POST `/api/auth/signup` - Create new user account
- POST `/api/auth/login` - Login with email/password
- POST `/api/auth/refresh` - Refresh access token
- GET `/api/auth/me` - Get current user info

**Payments**
- POST `/api/payments/razorpay/create-order` - Create Razorpay order
- POST `/api/payments/stripe/create-intent` - Create Stripe payment intent
- POST `/api/payments/manual` - Submit manual payment with proof
- GET `/api/payments` - Get user's payment history
- POST `/api/webhooks/razorpay` - Razorpay webhook handler
- POST `/api/webhooks/stripe` - Stripe webhook handler

**Wallet & Withdrawals**
- GET `/api/wallet/balance` - Get wallet balance
- POST `/api/withdrawals` - Create withdrawal request
- GET `/api/withdrawals` - Get withdrawal history

**Referrals**
- GET `/api/referrals` - Get referral commissions
- GET `/api/referrals/users` - Get referred users

**Notifications**
- GET `/api/notifications` - Get user notifications
- PATCH `/api/notifications/:id/read` - Mark notification as read

**FAQs**
- GET `/api/faqs` - Get all FAQs (optional ?category filter)

**Analytics**
- POST `/api/analytics/track` - Track analytics event
- GET `/api/analytics/export` - Export user data as CSV

**Profile**
- PATCH `/api/profile` - Update user profile

### Features Implemented

✅ **Authentication System**
- Signup with JWT tokens and bcrypt password hashing
- Login with refresh token support
- Role-based access control (user/admin)
- Automatic token refresh on expiry

✅ **Payment Integration**
- Razorpay integration (orders, webhooks)
- Stripe integration (payment intents, webhooks)
- Manual payment submission with proof upload
- Automatic wallet crediting on payment success

✅ **Referral System**
- Unique referral codes for each user
- 3-level referral tracking
- Automatic commission distribution (10%, 5%, 3%)
- Real-time wallet updates

✅ **Wallet & Withdrawals**
- Real-time balance tracking
- UPI and bank transfer withdrawal support
- Status management (requested/approved/processed/rejected)
- Reference ID generation

✅ **Notifications**
- Socket.IO for real-time delivery
- Broadcast and user-specific notifications
- Read/unread status tracking
- Emoji support in notifications

✅ **FAQ System**
- Category-based organization
- Public API access (no auth required)

✅ **Analytics**
- Event tracking (video watch, signups, payments)
- CSV export for user data
- Transaction history

✅ **Security**
- HTTPS-ready code patterns
- Webhook signature verification
- Password hashing with bcrypt
- JWT token expiry and refresh

### UI/UX Features

✅ **Dark Theme**
- Background: #121212 / #212121
- Primary: #1E88E5 (Blue)
- Hover: #F9A825 (Golden Yellow)
- Success: #00C853 (Green)
- Error: #D32F2F (Red)

✅ **Responsive Design**
- Mobile-first approach
- Collapsible sidebar navigation
- Vertical stack with emoji icons

✅ **Data Test IDs**
- All interactive elements have data-testid attributes
- Consistent naming pattern (action-target)

### Notes
- Database migrations handled via `npm run db:push`
- Payment providers require API keys from respective dashboards
- Socket.IO connects automatically on authentication
- CSV exports include payments and referral data
- All dates stored in UTC with timestamps
