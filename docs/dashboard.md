# User Dashboard — Build Spec (Figma → Code)

Status: **planning reference**, built incrementally board by board. This file is the
source of truth for the User Dashboard (Tasks, Habits, Goals, Planner) until each
section ships. Update it as decisions change — don't let it drift from the code.

Current dashboard code lives at:
- `src/pages/private/user/UserDashView.jsx` — overview/home (Welcome header, AI Coach Chat, Daily Quote)
- `src/pages/private/user/focus/Tasks/TasksBoard.jsx` — Tasks Board (kanban-style columns)
- `src/pages/private/user/focus/Habits/Habits.jsx` — Habits Board (table + mobile cards)
- `src/pages/private/user/focus/Goals/ActiveGoals.jsx` — Goals Board (grid of goal cards)
- `src/pages/private/user/planng/{DailyPlan,WeeklyPlan,MonthlyPlan}/*Planner.jsx` — Planner Board

**Current state honestly assessed:** all four boards exist only as static, non-AI
skeletons (hardcoded arrays, no ghost cards, no AI popups, no filters, no skeleton/typewriter
animation, no three-dot menus matching spec). Everything in this doc below is **not yet
implemented** unless explicitly marked "✅ done".

---

## 0. Global AI Assistant Rule (applies to every board)

> AI Assistant (chat) is available on **detail pages** of Tasks, Habits, and Goals only.

| AI may change | AI may NOT change |
|---|---|
| title | due date |
| description | status |
| category | priority |
| linked tasks | reminder time |
| linked habits | anything affecting planning structure / calendar |

This boundary must be enforced in whatever component handles the AI edit (validation on
the request payload, not just hidden UI) — if a "loosen this later" temptation comes up,
this is the line that doesn't move without an explicit spec change.

Non-functional in MVP across **all boards**: Tools & Main nav items, Create button (global
nav), Settings gear, "Go to", Board/List toggle, notification bell. **Resolved 2026-06-17:**
render these pixel-perfect per Figma (visible) but inert — no onClick/navigation. Profile is
the exception: the navbar avatar stays functional (opens a Logout action), since the app
needs a working sign-out path and Figma doesn't show one elsewhere. This is the global
private-app shell now (`src/components/layout/private/PrivateLayout.jsx`), used by every
private route — Dashboard, Tasks/Habits/Goals/Planner, Settings, Profile, Subscription,
AI Coach, Analytics, Refer a Friend — not just the Work boards.

---

## 1. Tasks Board

### Ghost cards (empty state)
- Appear **only** when the board/column is empty.
- Default: due date visible, no footer.
- On hover: due date fades out, footer appears with "AI suggested based on your profile" + **Accept** button.

### Three-dot menu — ghost card
- Visible on hover only.
- Exactly 2 items: **Regenerate suggestion**, **Dismiss**.

### Three-dot menu — regular card
- 3 groups, exactly:
  1. Edit
  2. Break into subtasks, Improve description (both marked with ✦ icon — AI actions)
  3. Delete

### Subtitle typewriter animation
- Rotates between AI hint phrases every 3s: type in → delete char-by-char → next phrase types in.
- **Reused everywhere** AI-related: chat placeholders, AI popup placeholder, board subtitle. Build this once as a shared component/hook, not per-board.

### AI popup — Generate button
- Disabled until user types text.
- Placeholder rotates through example prompts with the same typewriter animation.

### AI popup — skeleton while generating
- Skeleton shows on **title and description only**.
- Due date, category, time stay visible (not skeletonized) the whole time.
- Fields resolve one by one: title → description → tags, **100–150ms** stagger between each.

### New card appears on board
- After "Add to Board": slide up + fade in, opacity 0→100%, **300ms ease-out**.

### Subtasks AI button
- No existing subtasks → AI generates immediately on title, **no popup**.
- Has existing subtasks → show inline confirm under header: "Regenerate all subtasks?" Yes / Cancel (no popup either — inline).

### Linked Goal "+" button
- Dropdown of user's existing goals.
- First item always: **"AI recommended"** (based on task category).
- Last item always: **"+ Create new goal"**.

### Generic skeleton/stagger rule (also applies to subtasks flow)
- Title → description → subtasks, 100–150ms delay between each.
- Future (post-MVP, do not build now): reverse-typewriter the old text out, typewriter the new text in.

### Filters (dropdown values — exact strings)
- Status: All Statuses / To Do / In Progress / Done
- Priority: All Priorities / Urgent / High / Medium / Low
- Category: All Categories / Career / Health / Finance / Personal / Education
- Source: All Sources / Created by AI / Created manually
- Date: All Dates / Today / Tomorrow / This week / This month / Overdue

### Manual "New Task" popup — field values
- Priority: All Priorities / Low / Medium / High / Urgent
- Category: All Categories / Career / Health / Finance / Personal / Education
- Status: All Statuses / To Do / In Progress / Done
- Due Time: 12h format (AM/PM), not 24h
- Est. Minutes: plain number input, **no min/max limit**
- Linked Goal: dropdown, first item AI-recommended, last item "+ Create new goal" (same pattern as above)

---

## 2. Habits Board

### Habit card — overflow tags
- When tags overflow available width, hide extras and show `+N`.
- Hovering `+N` reveals all hidden tags via dropdown/tooltip — same hover pattern as the rest of the product (don't invent a new hover affordance here).
- Reference screenshots show this on a card with `Health` tag + time range + `+3`, and on a Fitness card with `3x/Day` badge.

### Habits popup
- **Times Per Day:** MVP supports exactly **one** time per day. Do not build a multi-time-per-day UI.
- **Reminder Time:** exactly one reminder, tied to the single daily time. One time picker, **12h format**.
- Not in MVP: multiple check-ins per day — habit completion is a single click/tap on the habit box.

### Filters (dropdown values — exact strings)
- Category: All Category / Career / Health / Finance / Fitness / Wellness / Productivity / Personal / Education
- Schedule: All Schedule / Daily / Weekly / Monthly / Custom
- Streak: All Streak / Active streak / No streak / Best streak
- Days Left: All Days Left / 1-7 days / 8-30 days / 30+ days

Note the Habits category list is **longer** than the Tasks/Goals category list (adds
Fitness, Wellness, Productivity) — don't copy-paste the Tasks filter list here by mistake.

---

## 3. Goals Board

### Ghost goal cards (empty state)
- Opacity 50%, dashed border.
- Counter shows `✦ 3` (or whatever the AI-suggested count is).
- On hover: footer "AI suggested based on your profile" + Accept button — same mechanics as Task ghost cards (share the component).

### Three-dot menu — goal card
- 3 groups: 1) Edit goal · 2) ✦ Improve goal · 3) Pause goal / Delete.

### New Goal popup — AI generation scope
- AI generates **only**: title, description, priority, category, due date.
- AI does **not** generate or link tasks/habits at creation time.
- Linking tasks/habits to a goal happens **manually**, only after the goal exists, from the goal's detail page.

### New Goal popup — Linked Tasks / Linked Habits fields
- Both support multi-select.
- Click opens a checkbox dropdown.
- First item: "✦ AI Suggested" (based on goal title + category).
- Last item: not specified as "+Create new" here (unlike Tasks' Linked Goal field) — selected items render as removable tags (`×`) inside the field.

### Goal preview popup
- Same structural pattern as Task/Habit preview popups.
- Shows only AI-generated fields: title, description, priority, category, due date, progress bar.
- Does **not** show linked tasks/habits in preview.

### Empty state — Linked Tasks/Habits on goal detail page
- Plain text: "No linked tasks yet" / "No linked habits yet".
- Same visual style as Task Board side-panel empty states.
- Plus button and AI button stay visible even when empty (don't hide them on empty state).

### Subtitle typewriter (Goals-specific copy)
- Same animation as global rule. Hardcoded phrase pool, suggested:
  - "Set your goals and let AI build the path"
  - "Track progress across tasks and habits"
  - "AI helps you stay on track every day"

### Filters (dropdown values — exact strings)
- Status: Active / Paused / Completed
- Progress: Any / 0-25% / 26-50% / 51-75% / 76-100%
- Priority: All Priorities / Urgent / High / Medium / Low
- Category: All Categories / Career / Health / Finance / Personal / Education
- Source: All Sources / Created by AI / Created manually
- Date: All Dates / Today / Tomorrow / This week / This month / Overdue

### Non-MVP (visible in Figma for context only — do not implement)
Create button, Dashboard (presumably the global nav item, not this board), Announcements,
AI Coach, Activity, Notification, Go to, Settings, Profile.

---

## 4. Planner Board

### Scope boundary (critical — easy to get wrong)
Planner AI **only** rearranges. It must never touch task/habit *content*.

| Planner AI can | Planner AI can NOT |
|---|---|
| reorder tasks/habits | edit titles |
| rebalance workload | edit descriptions |
| move items to different time slots | edit subtasks |
| optimize schedule timing | edit categories |
| reduce overload | edit habit structure/content |
| create focus spacing | |

Content management (title/description/subtasks/category) belongs to the Tasks/Habits AI
systems, not the Planner. If a planner action needs to change content, that's out of scope
— the planner should only move/resize/reorder the existing item.

### Primary interaction model
- Main interaction is the **AI chat panel on the right side** of the board.
- For MVP: plan generation, schedule changes, rebalance, overload reduction, optimization,
  accept/dismiss suggestions, and undo — **all happen through chat**, not separate popups.
- AI responses update the planner in real time.

### Views
- Daily (most detailed interaction level), Weekly, Monthly (both simplified overview states, less interactive than Daily).

### "AI Actions" button
- On click, AI posts a chat message listing exactly 3 options:
  1. Recalibrate my day
  2. Reduce overload
  3. Optimize schedule
- User picks one **in the chat**, AI continues from there. No separate menu/popup for this.

### Visual feedback for MVP
- Skeleton loading states
- Shimmer/wireframe generation states
- Live card appearance animations
- AI labels and adaptive states

Post-MVP (do not build now): replacing some chat flows with dedicated popups / deeper contextual interactions.

---

## 5. Typography system (applies to all boards)

The project ships a CSS-variable based heading system in `src/index.css` (`h1`–`h6` use
`clamp()` for fluid sizing) but the dashboard pages currently **bypass it** and use raw
Tailwind text utilities (`text-sm`, `text-base md:text-lg`, etc.) directly on arbitrary
elements (e.g. `TasksBoard.jsx` puts `text-base font-semibold ... md:text-lg` on an `<h3>`
inside a card). For dashboard work, standardize on **Tailwind utility classes**, mapped to
a fixed scale, rather than mixing in the `clamp()` h1–h6 system (that system is tuned for
the marketing/public site's display headings, not dense dashboard UI).

### Confirmed scale (mobile → desktop, Tailwind classes)

| Role | Mobile | md (≥768px) | lg (≥1024px) | Notes |
|---|---|---|---|---|
| Page title (H1) | `text-xl` (20px) | `text-2xl` (24px) | `text-2xl`/`text-3xl` | one per board, e.g. "Tasks Board" |
| Section/card title (H2/H3) | `text-base` (16px) | `text-lg` (18px) | `text-lg`/`text-xl` | card titles, modal headers |
| Body / paragraph | `text-base` (16px) fixed | `text-base` | `text-base` | **per your instruction: body text stays 16px at all breakpoints, not scaled down** |
| Secondary / meta text | `text-sm` (14px) | `text-sm` | `text-sm` | dates, tags, helper text |
| Micro / badges | `text-xs` (12px) | `text-xs` | `text-xs` | pills, counters, timestamps |

Rules:
1. Never go below `text-xs` (12px) — anything smaller fails accessibility/readability on mobile.
2. Body copy is always `text-base` regardless of breakpoint — don't shrink it to `text-sm` on mobile to "fit"; fix the layout instead.
3. Headings scale up with breakpoint (mobile-first `text-base md:text-lg lg:text-xl` pattern), body and meta text don't need to scale — only headings do.
4. Use `font-semibold`/`font-medium` for weight differentiation instead of jumping a whole size step when you just need emphasis.
5. Keep line-height at Tailwind defaults (`leading-normal`/`leading-relaxed`) — don't override unless a specific Figma spec calls for tighter/looser leading.

### Breakpoints (Tailwind defaults, confirmed in `src/index.css` `@theme`)
`sm: 640px` · `md: 768px` · `lg: 1024px` · `xl: 1280px` · `2xl: 1536px`

---

## 6. Potential mistakes to avoid (review before writing code)

1. **Scope creep on AI edit permissions** — easy to let the AI chat on a task/habit detail page also touch due date/status/priority/reminder "just this once" for convenience. The global rule in §0 is absolute for MVP.
2. **Planner AI touching content** — a rebalance/reorder action must not rewrite a task's title/description as a side effect. Keep planner mutations limited to position/time/order fields.
3. **Wrong category list per board** — Tasks/Goals categories (Career/Health/Finance/Personal/Education) are a different, shorter list than Habits categories (adds Fitness/Wellness/Productivity). Copy-pasting one filter set into the other board is the most likely bug.
4. **Ghost cards showing when board has content** — spec says ghost cards only render on a fully empty board, not "below the real cards" as filler.
5. **Three-dot menu item count drift** — ghost card menu = 2 items, regular card menu = 3 groups. Don't merge them into one shared menu component without a variant prop.
6. **Building multi-time-per-day habits** — MVP is strictly one time + one reminder per day. Don't add an "add another time" affordance even if it seems like an obvious enhancement.
7. **24h time format** — all time pickers (habits, tasks) must be 12h AM/PM, matching spec explicitly. Don't default to native `<input type="time">` which is often 24h depending on locale — needs a controlled 12h picker.
8. **Est. Minutes field with a min/max** — spec explicitly says "no limit." Don't add a default `max` because it "seems reasonable."
9. **Skeleton scope too broad** — only title + description skeleton during AI generation; due date/category/time must stay visible/interactive, not skeletonized.
10. **Animation timing drift** — 100–150ms stagger for field reveal, 300ms ease-out for new card insert. These are specific enough to be testable; don't substitute a generic 200ms/500ms default.
11. **Wiring up non-MVP nav items** — Create button, Settings gear, Go to, Board/List toggle, Dashboard/Announcements/AI Coach/Activity/Notification render visually (per the 2026-06-17 decision in §0) but must stay inert — no onClick, no navigation, no real notification/search logic behind them.
12. **Reusing the marketing site's `clamp()` h1–h6 system on dashboard pages** — those headings are tuned for hero/landing sections (2.5rem–3.75rem h1) and will look oversized in dense dashboard cards. Use the fixed Tailwind scale in §5 instead.
13. **Mismatched "AI Suggested" vs "AI recommended" labeling** — Tasks' Linked Goal first item is "AI recommended", Goals' Linked Tasks/Habits first item is "✦ AI Suggested" (with icon). Keep these as spec'd per board, don't standardize them to one string without checking the source annotation again.
14. **Filter "Source" values reused correctly** — "All Sources / Created by AI / Created manually" appears in both Tasks and Goals filters — fine to share a component for that one field only.

## 7. Open questions to confirm with you before coding starts

- Is `docs/dashboard.md` (this file) the right home, or should this live in Figma/another tracker once boards ship? I'll keep it updated either way unless told otherwise.
- For the typography table in §5 — do you want Page Title to cap at `text-2xl` or go to `text-3xl` on large desktop (≥1024px)? Figma crops didn't show a wide-desktop reference.
- Confirm: per-board build order — Tasks → Habits → Goals → Planner, or a different priority?
- Confirm: should ghost-card and three-dot-menu components be built once as shared primitives (used by both Tasks and Goals boards) given the spec explicitly says "same mechanics," or do you want them board-local for now and unified later?
