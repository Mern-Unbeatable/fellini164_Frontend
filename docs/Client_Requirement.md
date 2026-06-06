# 🚀 Project Overview: Pulse AI ("Your AI Life Autopilot")

## Goal

Build a modular, scalable AI SaaS that generates daily/weekly life plans, tracks habits, and acts as a life coach.

## Tech Stack

- **Frontend**: Next.js
- **Backend**: Node.js
- **Database**: MongoDB
- **AI**: OpenAI API
- **Payments**: Stripe + PayPal

## Timeline

- **MVP Launch**: 3–5 Weeks
- **Full Completion**: 10 Weeks (70 Days)

---

## 1. Database & Architecture (The Foundation)

Based on the "19-Point Technical Requirement List."

### System Architecture

**Modular Design**: You must isolate functions. If the Payment module crashes, the AI Chat must still work.

**Background Jobs (Cron/Queue)**: Use BullMQ or Celery to handle:

- Daily plan generation (at 4 AM user local time)
- Reminders/Notifications
- Subscription renewal checks

**Security**:

- Rate limiting (prevent API abuse)
- CSRF protection
- JWT Authentication
- Audit Logs for every major user action

### Database Schema (MongoDB)

You need these 14 specific collections from Day 1 to allow scalability:

1. **Users** (Auth, Profile, Settings)
2. **Goals** (Long term objectives)
3. **DailyPlans** (AI generated schedule)
4. **WeeklyPlans**
5. **MonthlyPlans**
6. **Habits** (Streak tracking)
7. **Tasks** (To-do items)
8. **AIChatLogs** (History for context)
9. **AIRecommendations**
10. **PaymentRecords** (Stripe/PayPal mixed data)
11. **Notifications**
12. **Settings** (Global preferences)
13. **ActivityLogs** (Audit trail)
14. **SupportConversations** (Customer service AI logs)

---

## 2. The Core Features (Module by Module)

### Module A: Onboarding & User Profile

**The Flow**: Signup → Email Verify → "Welcome Sequence" (Design provided by client)

**Data Collection**:

- Sleep/Wake times
- Productivity hours
- Main focus
- Motivation style

**Global Settings**: Users set their preferred "AI Personality" (Strict, Friendly, Therapist) here.

### Module B: The AI Engine (OpenAI)

**The "Life Coach"**: A chatbot that has access to the user's Goals and Habit data.

**Logic**:

- **Context Awareness**: If a user skips a task, the AI asks why and adjusts the difficulty (Behavioral Learning).
- **"Magic Sync" Button**: Trigger a re-fetch of the daily plan to rebalance tasks instantly.
- **Content Filter**: Prevent unsafe/illegal queries.
- **Support Bot**: A separate AI instance trained on FAQs to answer billing/dashboard questions.

### Module C: Dashboard & Tracker

**Views**: Daily, Weekly, Monthly

**Habits**: Visual streak tracking

**Analytics**: Show the user their own data (Productivity score, Plan completion rate)

### Module D: Payments (The Complex Part)

You must support two gateways simultaneously.

**Stripe**: Handles Credit Cards, Apple Pay, Google Pay

- Must manage: Trials, Upgrades, Downgrades, Proration

**PayPal**:

- Option 1: Monthly Subscription
- Option 2: One-time payment for 30-day access

**Access Logic**: If a payment fails on either, the system must downgrade the user to "Free" automatically.

### Module E: Admin Panel

**User Management**: View all users, manual Upgrade/Downgrade override, Refund button

**CMS**: Ability to post "Announcements" to the user dashboard

**Logs**: View chat logs and audit trails for debugging

**Pricing Control**: Ability to edit Plan Prices without deploying new code

---

## 3. Subscription Tiers (Permissions)

| Feature     | FREE    | STARTER ($9/mo) | PRO ($19/mo)         | ULTIMATE ($39/mo)        |
| ----------- | ------- | --------------- | -------------------- | ------------------------ |
| Daily Plans | Limited | Basic           | Automated            | Full "Blueprint"         |
| AI Chat     | Limited | Unlimited       | Priority Access      | Voice Coach Support      |
| Analysis    | None    | Basic           | In-depth             | Deep Life Analysis       |
| Reports     | None    | None            | Weekly Review        | Routine Optimizer        |
| Scope       | --      | --              | Weekly/Monthly Plans | Productivity Automations |

---

## 4. Growth & Analytics Features

**Referral System**: User shares link → Friend joins → User gets free days/premium features

**Upsells**: Strategic prompts inside the free tier (e.g., "Unlock Weekly Planning to see this")

**External Analytics**: Integrate Mixpanel or PostHog to track:

- Daily Active Users (DAU)
- Conversion rate (Free to Paid)
- Churn rate

---

## 5. Development Phase Strategy (How to survive the timeline)

The client wants an MVP in 3-5 Weeks but the full specs are huge. Here is how you build it:

### Phase 1: The MVP (Weeks 1–5)

**Focus**: Core Auth, Database Setup, Stripe Integration (No PayPal yet), Daily Plan Generation, Basic Chatbot

**Goal**: User can sign up, pay via Card, and get a plan

### Phase 2: The "Smart" Features (Weeks 6–8)

**Focus**: Add PayPal, build "Magic Sync," implement the "AI Learning" (historical context), and the Referral System

### Phase 3: Admin & Polish (Weeks 9–10)

**Focus**: Advanced Admin tools, Email automation (SendGrid flows), Voice Coach integration, and comprehensive testing

---

## Critical Technical Risks (Watch out for these)

1. **AI Cost**: Storing "Chat Logs" and feeding them back into the AI to make it "learn" increases token usage massively. Monitor costs.

2. **Timezones**: "Daily Plans" must reset at the user's 4 AM, not the server's time. You need robust timezone handling in your Cron jobs.

3. **PayPal Subscriptions**: These are harder to manage than Stripe. Ensure you listen to PayPal Webhooks (IPN) correctly to handle cancellations.
