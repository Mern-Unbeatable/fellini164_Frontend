# Technical Implementation Guide

## Frontend Architecture

### Framework: React + Vite

**Current Setup:**

- React 18
- Vite for build tooling
- Redux Toolkit for state management
- React Router for navigation
- Tailwind CSS for styling

### Folder Structure:

```
src/
├── components/
│   ├── common/       # Shared components
│   ├── layout/       # Layout wrappers
│   └── ui/          # UI primitives
├── features/        # Redux slices
├── pages/           # Route pages
├── router/          # Route configuration
├── services/        # API services
├── utils/           # Helper functions
└── config/          # Configuration files
```

---

## Backend Architecture

### Recommended: Node.js + Express

**Tech Stack:**

- Node.js (v18+)
- Express.js framework
- MongoDB with Mongoose
- JWT for authentication
- OpenAI SDK
- Stripe SDK
- PayPal SDK

### API Structure:

```
/api/v1/
├── auth/           # Authentication endpoints
├── users/          # User management
├── goals/          # Goals CRUD
├── plans/          # Daily/weekly/monthly plans
├── habits/         # Habit tracking
├── tasks/          # Task management
├── ai/             # AI chat & generation
├── subscriptions/  # Payment & billing
├── admin/          # Admin operations
├── waitlist/       # Waitlist management
├── referrals/      # Referral system
└── support/        # Support chatbot
```

---

## Database Schema (MongoDB)

### Users Collection:

```javascript
{
  _id: ObjectId,
  email: String (unique, required),
  password: String (hashed, required),
  firstName: String,
  lastName: String,
  emailVerified: Boolean,
  verificationToken: String,
  resetToken: String,
  resetTokenExpiry: Date,
  subscription: {
    plan: String, // 'free', 'starter', 'pro', 'ultimate'
    status: String, // 'active', 'canceled', 'past_due'
    stripeCustomerId: String,
    paypalSubscriptionId: String,
    currentPeriodEnd: Date,
    cancelAtPeriodEnd: Boolean
  },
  settings: {
    wakeTime: String,
    sleepTime: String,
    productivityHours: [String],
    workSchedule: Object,
    reminderPreferences: Object,
    aiTone: String, // 'strict', 'friendly', 'therapist', 'coach'
    darkMode: Boolean
  },
  onboarding: {
    completed: Boolean,
    step: Number,
    goals: [String],
    focus: String,
    lifestyle: String
  },
  referralCode: String,
  referredBy: ObjectId,
  createdAt: Date,
  updatedAt: Date,
  lastLogin: Date
}
```

### Goals Collection:

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: Users),
  category: String, // 'health', 'habits', 'money', 'relationships', 'productivity'
  title: String,
  description: String,
  priority: Number,
  status: String, // 'active', 'completed', 'archived'
  targetDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Plans Collection:

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: Users),
  type: String, // 'daily', 'weekly', 'monthly', 'blueprint'
  date: Date,
  goals: [ObjectId] (ref: Goals),
  content: {
    morning: [Object],
    afternoon: [Object],
    evening: [Object],
    tasks: [Object],
    habits: [Object]
  },
  aiGenerated: Boolean,
  regenerationCount: Number,
  lastModified: Date,
  createdAt: Date
}
```

### Habits Collection:

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: Users),
  name: String,
  category: String,
  frequency: String, // 'daily', 'weekly', 'custom'
  difficulty: Number, // 1-5, AI adjusts
  streak: Number,
  longestStreak: Number,
  completions: [{
    date: Date,
    completed: Boolean,
    note: String
  }],
  aiSuggested: Boolean,
  createdAt: Date
}
```

### Tasks Collection:

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: Users),
  planId: ObjectId (ref: Plans),
  title: String,
  description: String,
  priority: String, // 'high', 'medium', 'low'
  estimatedTime: Number, // minutes
  completed: Boolean,
  completedAt: Date,
  dueDate: Date,
  category: String,
  aiGenerated: Boolean,
  createdAt: Date
}
```

### AI Chat Logs Collection:

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: Users),
  messages: [{
    role: String, // 'user', 'assistant'
    content: String,
    timestamp: Date
  }],
  sessionId: String,
  persona: String, // 'coach', 'therapist', 'mentor', etc.
  tokensUsed: Number,
  createdAt: Date
}
```

### Subscriptions Collection:

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: Users),
  provider: String, // 'stripe', 'paypal'
  externalId: String, // stripe subscription ID or paypal subscription ID
  plan: String,
  status: String,
  currentPeriodStart: Date,
  currentPeriodEnd: Date,
  canceledAt: Date,
  trialEnd: Date,
  payments: [{
    amount: Number,
    currency: String,
    status: String,
    date: Date,
    invoiceId: String
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Referrals Collection:

```javascript
{
  _id: ObjectId,
  referrerId: ObjectId (ref: Users),
  referredUserId: ObjectId (ref: Users),
  referralCode: String,
  status: String, // 'pending', 'completed', 'rewarded'
  reward: {
    type: String, // 'days', 'messages', 'feature'
    value: Number,
    applied: Boolean
  },
  createdAt: Date
}
```

### Waitlist Collection:

```javascript
{
  _id: ObjectId,
  email: String (unique),
  firstName: String,
  referredBy: String, // referral code
  position: Number,
  invited: Boolean,
  invitedAt: Date,
  referralCode: String,
  referralCount: Number,
  createdAt: Date
}
```

### Notifications Collection:

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: Users),
  type: String, // 'reminder', 'achievement', 'system', 'streak'
  title: String,
  message: String,
  read: Boolean,
  actionUrl: String,
  createdAt: Date
}
```

### Activity Logs Collection:

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: Users),
  action: String, // 'login', 'plan_created', 'habit_completed', etc.
  details: Object,
  ipAddress: String,
  userAgent: String,
  createdAt: Date
}
```

### Support Conversations Collection:

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: Users),
  messages: [{
    sender: String, // 'user', 'ai', 'admin'
    message: String,
    timestamp: Date
  }],
  status: String, // 'open', 'resolved', 'escalated'
  category: String,
  aiHandled: Boolean,
  createdAt: Date,
  resolvedAt: Date
}
```

---

## API Endpoints

### Authentication (`/api/v1/auth`)

```
POST   /signup              # Register new user
POST   /login               # Login user
POST   /verify-email        # Verify email with token
POST   /forgot-password     # Request password reset
POST   /reset-password      # Reset password with token
POST   /logout              # Logout user
GET    /me                  # Get current user
```

### Users (`/api/v1/users`)

```
GET    /profile             # Get user profile
PUT    /profile             # Update profile
GET    /settings            # Get user settings
PUT    /settings            # Update settings
DELETE /account             # Delete account
GET    /export              # Export user data (GDPR)
```

### Goals (`/api/v1/goals`)

```
POST   /                    # Create goal
GET    /                    # Get all user goals
GET    /:id                 # Get single goal
PUT    /:id                 # Update goal
DELETE /:id                 # Delete goal
PATCH  /:id/status          # Update goal status
```

### Plans (`/api/v1/plans`)

```
POST   /generate/daily      # Generate daily plan
POST   /generate/weekly     # Generate weekly plan
POST   /generate/monthly    # Generate monthly plan
POST   /generate/blueprint  # Generate life blueprint (Ultimate only)
GET    /daily/:date         # Get daily plan
GET    /weekly/:date        # Get weekly plan
GET    /monthly/:date       # Get monthly plan
PUT    /:id                 # Update plan
POST   /:id/regenerate      # Regenerate plan
POST   /magic-sync          # Magic sync button
```

### Habits (`/api/v1/habits`)

```
POST   /                    # Create habit
GET    /                    # Get all habits
GET    /:id                 # Get single habit
PUT    /:id                 # Update habit
DELETE /:id                 # Delete habit
POST   /:id/complete        # Mark habit completed
GET    /:id/stats           # Get habit statistics
```

### Tasks (`/api/v1/tasks`)

```
POST   /                    # Create task
GET    /                    # Get all tasks
GET    /:id                 # Get single task
PUT    /:id                 # Update task
DELETE /:id                 # Delete task
PATCH  /:id/complete        # Toggle task completion
GET    /today               # Get today's tasks
```

### AI (`/api/v1/ai`)

```
POST   /chat                # Chat with AI
POST   /analyze-progress    # Analyze user progress
POST   /suggest-habits      # AI suggest habits
POST   /optimize-routine    # Optimize user routine
GET    /personas            # Get available AI personas
POST   /set-persona         # Set active persona
```

### Subscriptions (`/api/v1/subscriptions`)

```
POST   /stripe/checkout     # Create Stripe checkout
POST   /stripe/portal       # Access billing portal
POST   /paypal/create       # Create PayPal subscription
POST   /paypal/cancel       # Cancel PayPal subscription
GET    /current             # Get current subscription
POST   /upgrade             # Upgrade plan
POST   /downgrade           # Downgrade plan
POST   /cancel              # Cancel subscription
```

### Admin (`/api/v1/admin`)

```
GET    /users               # List all users
GET    /users/:id           # Get user details
PATCH  /users/:id/plan      # Manually change user plan
GET    /subscriptions       # List all subscriptions
GET    /analytics           # Get analytics dashboard
POST   /announcements       # Send announcement
GET    /payments            # List all payments
POST   /refund              # Issue refund
```

### Waitlist (`/api/v1/waitlist`)

```
POST   /join                # Join waitlist
GET    /position            # Get waitlist position
POST   /invite              # Invite friend (referral)
GET    /stats               # Get waitlist stats
```

### Referrals (`/api/v1/referrals`)

```
GET    /my-code             # Get user's referral code
GET    /stats               # Get referral statistics
POST   /apply-reward        # Apply referral reward
```

### Support (`/api/v1/support`)

```
POST   /chat                # AI support chat
POST   /ticket              # Create support ticket
GET    /tickets             # Get user tickets
GET    /tickets/:id         # Get ticket details
```

---

## OpenAI Integration

### Configuration:

```javascript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
```

### Plan Generation:

```javascript
async function generateDailyPlan(userId, date, goals) {
  const systemPrompt = `You are Elyxa, an AI life coach...`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Generate daily plan for ${date}...` },
    ],
    temperature: 0.7,
    max_tokens: 2000,
  });

  return response.choices[0].message.content;
}
```

### AI Chat Implementation:

```javascript
async function aiChat(userId, message, persona, history) {
  const systemPrompt = getPersonaPrompt(persona);

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history,
    { role: 'user', content: message },
  ];

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages,
    temperature: 0.8,
    max_tokens: 500,
  });

  // Track usage
  await trackAIUsage(userId, response.usage.total_tokens);

  return response.choices[0].message.content;
}
```

### AI Personas:

```javascript
const personas = {
  strict: 'You are a strict, no-nonsense productivity coach...',
  friendly: 'You are a warm, encouraging friend...',
  therapist: 'You are a compassionate therapist...',
  mentor: 'You are a wise mentor...',
  fitness: 'You are an energetic fitness coach...',
};
```

---

## Stripe Integration

### Setup:

```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
```

### Create Checkout Session:

```javascript
async function createCheckoutSession(userId, plan) {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: plan.stripePriceId,
        quantity: 1,
      },
    ],
    success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/pricing`,
    subscription_data: {
      trial_period_days: 7,
    },
  });

  return session.url;
}
```

### Webhook Handling:

```javascript
app.post('/api/v1/webhooks/stripe', async (req, res) => {
  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutComplete(event.data.object);
        break;
      case 'customer.subscription.updated':
        await handleSubscriptionUpdate(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionCancel(event.data.object);
        break;
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
    }

    res.json({ received: true });
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});
```

---

## PayPal Integration

### Setup:

```javascript
const paypal = require('@paypal/checkout-server-sdk');

const environment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_CLIENT_SECRET
);

const client = new paypal.core.PayPalHttpClient(environment);
```

### Create Subscription:

```javascript
async function createPayPalSubscription(userId, planId) {
  const request = new paypal.subscriptions.SubscriptionsCreateRequest();

  request.requestBody({
    plan_id: planId,
    application_context: {
      return_url: `${baseUrl}/paypal/success`,
      cancel_url: `${baseUrl}/paypal/cancel`,
    },
  });

  const response = await client.execute(request);
  return response.result;
}
```

---

## Email System (SendGrid)

### Configuration:

```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
```

### Email Templates:

```javascript
const emailTemplates = {
  welcome: (name) => ({
    subject: 'Welcome to Elyxa!',
    html: `<h1>Hi ${name}!</h1><p>Welcome to your AI life coach...</p>`,
  }),
  verification: (token) => ({
    subject: 'Verify your email',
    html: `<p>Click to verify: ${baseUrl}/verify?token=${token}</p>`,
  }),
  // ... more templates
};
```

---

## Cron Jobs (node-cron)

### Daily Reminders:

```javascript
const cron = require('node-cron');

// Every day at 8 AM
cron.schedule('0 8 * * *', async () => {
  const users = await User.find({ 'settings.dailyReminder': true });

  for (const user of users) {
    await sendDailyReminderEmail(user.email);
  }
});
```

---

## Environment Variables

```env
# Database
MONGODB_URI=mongodb://localhost:27017/elyxa

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d

# OpenAI
OPENAI_API_KEY=sk-...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# PayPal
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...

# SendGrid
SENDGRID_API_KEY=SG...

# URLs
BASE_URL=https://elyxa.com
FRONTEND_URL=https://app.elyxa.com

# Redis (for sessions)
REDIS_URL=redis://localhost:6379
```

---

**Last Updated:** January 6, 2026
