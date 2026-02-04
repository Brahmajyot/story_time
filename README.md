# StoryMagic - AI-Powered Children's Story Generator

A full-stack SaaS application that generates personalized children's stories using AI, with a freemium business model.

## 🌟 Features

- **AI-Powered Story Generation**: Creates unique 5-minute stories using Google's Gemini 1.5 Flash
- **Personalized Content**: Each story features the child's name, favorite animal, and teaches a moral lesson
- **Beautiful Illustrations**: AI-generated images via Pollinations.ai
- **Dual Pricing Model**: 
  - Free: 3 stories per user
  - Unlimited: $4.99/month subscription
  - Pay-As-You-Go: $0.99 per story
- **Modern UI**: Premium design with glassmorphism, gradient animations, and smooth transitions
- **Secure Authentication**: Powered by Clerk

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + Vite
- **Routing**: React Router v6
- **Authentication**: Clerk
- **Animations**: Framer Motion
- **Styling**: Custom CSS with modern design system
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **AI**: Google Generative AI (Gemini 1.5 Flash)
- **Images**: Pollinations.ai API
- **Payments**: Stripe
- **Webhooks**: Clerk webhooks for user sync, Stripe webhooks for payments

## 📁 Project Structure

```
child/
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # PaymentWall, etc.
│   │   ├── pages/         # Landing, Dashboard, StoryView, Stories
│   │   ├── lib/           # API client
│   │   ├── App.jsx        # Main app component
│   │   └── index.css      # Design system
│   └── package.json
│
├── backend/               # Node.js backend
│   ├── src/
│   │   ├── models/        # User, Story
│   │   ├── routes/        # stories, webhooks, payment
│   │   ├── services/      # aiService, imageService
│   │   ├── middleware/    # clerkWebhook
│   │   └── server.js      # Express server
│   └── package.json
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (free tier)
- Clerk account (free tier)
- Google AI Studio account (Gemini API key)
- Stripe account (test mode)

### Environment Variables

#### Backend (.env)
```bash
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
GEMINI_API_KEY=your_gemini_api_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

#### Frontend (.env)
```bash
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_URL=http://localhost:5000/api
```

### Installation & Running Locally

1. **Install Backend Dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Install Frontend Dependencies**:
   ```bash
   cd frontend
   npm install
   ```

3. **Start Backend Server**:
   ```bash
   cd backend
   npm run dev
   # Server runs on http://localhost:5000
   ```

4. **Start Frontend Dev Server**:
   ```bash
   cd frontend
   npm run dev
   # App runs on http://localhost:5173
   ```

## 📝 Setup Guide

### 1. MongoDB Atlas Setup
1. Create a free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a database user
3. Whitelist your IP (or 0.0.0.0/0 for development)
4. Get your connection string and add to `MONGODB_URI`

### 2. Clerk Authentication Setup
1. Create a free account at [clerk.com](https://clerk.com)
2. Create a new application
3. Copy your publishable and secret keys
4. Configure webhook endpoint: `https://your-backend-url/api/webhooks/clerk`
5. Subscribe to `user.created` and `user.updated` events

### 3. Google AI Studio Setup
1. Get a free API key at [ai.google.dev](https://ai.google.dev)
2. Add key to `GEMINI_API_KEY`

### 4. Stripe Setup
1. Create account at [stripe.com](https://stripe.com)
2. Use test mode keys for development
3. Configure webhook endpoint: `https://your-backend-url/api/payment/webhook/stripe`
4. Subscribe to these events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`

## 🌐 Deployment

### Backend (Render)
1. Connect your GitHub repo to Render
2. Create a new Web Service
3. Set build command: `cd backend && npm install`
4. Set start command: `cd backend && npm start`
5. Add all environment variables
6. Deploy!

### Frontend (Vercel)
1. Connect your GitHub repo to Vercel
2. Set root directory to `frontend`
3. Add environment variables
4. Deploy!
5. Update `FRONTEND_URL` in backend .env

## 💳 Stripe Integration (To Complete)

The PaymentWall component currently shows a placeholder. To complete Stripe integration:

1. Create Stripe products for both pricing tiers
2. Implement checkout session creation endpoint
3. Update `PaymentWall.jsx` to redirect to Stripe Checkout
4. Handle success/cancel redirects
5. Test with Stripe test cards

## 📊 API Endpoints

- `GET /api/stories/count` - Get user's story count and subscription status
- `POST /api/stories/generate` - Generate a new story
- `GET /api/stories` - Get all user stories
- `GET /api/stories/:id` - Get specific story
- `POST /api/webhooks/clerk` - Clerk webhook for user sync
- `POST /api/payment/webhook/stripe` - Stripe webhook for payments

## 🎨 Features Highlights

- **Premium UI**: Modern glassmorphism design with vibrant gradients
- **Smooth Animations**: Powered by Framer Motion
- **Responsive**: Works on all devices
- **Loading States**: Beautiful loading animations during story generation
- **Error Handling**: User-friendly error messages
- **SEO Optimized**: Proper meta tags and semantic HTML

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## ⭐ Support

If you like this project, please give it a star!

---

Made with ❤️ for parents and children everywhere
