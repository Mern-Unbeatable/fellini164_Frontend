# Goals Board — Rules, Flow, and Figma (Pixel-Perfect Contract)

Status: Frontend mock in progress; backend integration not started  
Primary route: `/user/goals`  
Detail route: `/user/goals/:goalId`  
Frontend module: `src/pages/private/user/focus/Goals/`

Same contract style as Tasks (`focus/Tasks/tasks.md`), Habits (`focus/Habits/habits.md`), and Planner (`planng/DailyPlan/planner.md`).

**Source brief (authentic):** PIXEL-PERFECT FIX — Goals Board Flow — RULES + FLOW + FIGMA UI.  
**Do not invent. Do not remove Figma controls. Change only what the Fix requires.**

---

## Fix ONLY

Goals Board Flow: Check the **RULES**, **FLOW**, and **FIGMA UI** pixel perfect.

## Do NOT touch

Figma UI design — if you need to update Figma, you can; do not invent controls that remove approved Figma affordances without product confirmation.

---

## MVP

> **no MVP**

(Board-local MVP content is empty per brief. Product still follows RULES below, including **Rule 9 — Non-MVP elements**.)

---

## RULES

### Goals Board — Developer Annotations

### 1. Ghost goal cards — empty state

> *"Ghost cards appear only when the board is empty. Opacity 50%, dashed border. Counter shows ✦ 3. On hover: footer appears with 'AI suggested based on your profile' + Accept button. Same mechanics as Task Board ghost cards."*

### 2. Three dots menu — goal card

> *"Menu has 3 groups: 1) Edit goal, 2) ✦ Improve goal, 3) Pause goal / Delete."*

### 3. New Goal popup — AI Generation

> *"AI generates only the goal itself: title, description, priority, category, due date. Tasks and habits are NOT generated or linked during goal creation. Users link tasks and habits manually after a goal is created on the detailed page."*

### 4. New Goal popup — Linked Tasks and Linked Habits

> *"Both fields support multiple selections. On click, it opens a dropdown with checkboxes. First item marked as '✦ AI Suggested' based on goal title and category. Selected items shown as tags with × to remove inside the field."*

### 5. Goal preview popup

> *"Same structure as Task and Habit preview popups. Shows only AI-generated fields: title, description, priority, category, due date, progress bar. No linked tasks or habits shown in preview."*

### 6. Empty state — Linked Tasks and Linked Habits on the detail page

> *"Show simple text: 'No linked tasks yet' / 'No linked habits yet'. Same visual style as empty states on the Task Board side panel. Plus and AI buttons are always visible."*

### 7. Subtitle typewriter animation

> *"Subtitle text rotates between predefined phrases every 3 seconds with typewriter animation. Texts are hardcoded. Suggested phrases: 'Set your goals and let AI build the path' / 'Track progress across tasks and habits' / 'AI helps you stay on track every day'."*

### 8. Filters — dropdown options

| Filter | Options (exact) |
|--------|-----------------|
| All Statuses | Active / Paused / Completed |
| All Progress | Any / 0-25% / 26-50% / 51-75% / 76-100% |
| All Priorities | All Priorities / Urgent / High / Medium / Low |
| All Categories | All Categories / Career / Health / Finance / Personal / Education |
| All Sources | All Sources / Created by AI / Created manually |
| All Dates | All Dates / Today / Tomorrow / This week / This month / Overdue |

### 9. Non-MVP elements

> *"The following elements are visible in design for context only and should NOT be implemented in MVP: Create button, Dashboard, Announcements, AI Coach, Activity, Notification, Go to, Settings, Profile."*

---

## Figma nodes

File: [Elyxa.Ai — Phase 2](https://www.figma.com/design/VwgJovqBGtb90CEfNXkk2T/Elyxa.Ai--Phase-2---Copy-)

| Frame | Link |
|-------|------|
| Goals Board (1440) - 1 - Empty States | https://www.figma.com/design/VwgJovqBGtb90CEfNXkk2T/Elyxa.Ai--Phase-2---Copy-?node-id=1250-6857&m=dev |
| Goals Board (1440) - 1 - Empty States - Hover | https://www.figma.com/design/VwgJovqBGtb90CEfNXkk2T/Elyxa.Ai--Phase-2---Copy-?node-id=1250-7794&m=dev |
| Goals Board (1440) - 1 | https://www.figma.com/design/VwgJovqBGtb90CEfNXkk2T/Elyxa.Ai--Phase-2---Copy-?node-id=1250-8499&m=dev |
| Goals Board (1440) - 1.1 - hover | https://www.figma.com/design/VwgJovqBGtb90CEfNXkk2T/Elyxa.Ai--Phase-2---Copy-?node-id=1250-10104&m=dev |
| Goals Board (1440) - 2 | https://www.figma.com/design/VwgJovqBGtb90CEfNXkk2T/Elyxa.Ai--Phase-2---Copy-?node-id=1250-13064&m=dev |
| Goals Board (1440) - 2.1 | https://www.figma.com/design/VwgJovqBGtb90CEfNXkk2T/Elyxa.Ai--Phase-2---Copy-?node-id=1250-13797&m=dev |
| Goals Board (1440) - 2.1 - Selected Tasks & Habits | https://www.figma.com/design/VwgJovqBGtb90CEfNXkk2T/Elyxa.Ai--Phase-2---Copy-?node-id=1251-14605&m=dev |
| Goals Board (1440) - 3 | https://www.figma.com/design/VwgJovqBGtb90CEfNXkk2T/Elyxa.Ai--Phase-2---Copy-?node-id=1253-15636&m=dev |
| Goals Board (1440) - 4 | https://www.figma.com/design/VwgJovqBGtb90CEfNXkk2T/Elyxa.Ai--Phase-2---Copy-?node-id=1253-18744&m=dev |
| Goals Board (1440) - 4.1 | https://www.figma.com/design/VwgJovqBGtb90CEfNXkk2T/Elyxa.Ai--Phase-2---Copy-?node-id=1255-19596&m=dev |
| Goals Board (1440) - 5 | https://www.figma.com/design/VwgJovqBGtb90CEfNXkk2T/Elyxa.Ai--Phase-2---Copy-?node-id=1253-16470&m=dev |
| Goals Board (1440) - 5.1 | https://www.figma.com/design/VwgJovqBGtb90CEfNXkk2T/Elyxa.Ai--Phase-2---Copy-?node-id=1256-20770&m=dev |

Node IDs: `1250:6857`, `1250:7794`, `1250:8499`, `1250:10104`, `1250:13064`, `1250:13797`, `1251:14605`, `1253:15636`, `1253:18744`, `1255:19596`, `1253:16470`, `1256:20770`.

---

## FLOW — how to verify in the app

Build must flow from **Figma + Rules** (MVP = none). Verify full flow before done.

| Step | URL / action | Matches |
|------|----------------|---------|
| Empty ghosts | `/user/goals?empty=1` | Frame 1 — Empty States (opacity 50%, dashed, ✦ 3) |
| Ghost hover | Same → hover ghost | Frame 1 — Empty States - Hover (AI footer + Accept) |
| Populated | `/user/goals` | Frame 1 |
| Card ⋯ | Hover → ⋯ | Frame 1.1 — Edit / ✦ Add Task / ✦ Add Habit / Complete / Pause / Delete |
| New Goal | **+ New Goal** | Frame 2 |
| New Goal fields | Linked Tasks / Habits multi-select | Frame 2.1 / 2.1 Selected |
| Preview | AI generate → preview | Frame 3 — goal fields only, no links |
| Detail empty links | Open detail with no links | Frame 4 — “No linked tasks/habits yet” |
| Detail with links | Linked items present | Frame 4.1 |
| Detail variants | Full detail states | Frames 5 / 5.1 |
| Filters | Toolbar dropdowns | Rule 8 options |
| Typewriter | Board subtitle | Rule 7 phrases |
| Non-MVP chrome | Create / Dashboard / Announcements / AI Coach / Activity / Notification / Go to / Settings / Profile | Rule 9 — do **not** implement |

---

## Agent rules (from brief)

- Build must flow yourself from Figma + MVP + Rules  
- Change only Fix ONLY  
- Do not invent  
- Do not remove any Figma control  
- Verify full flow before done  

---

## Implementation map

| File | Role |
|------|------|
| `ActiveGoals.jsx` | Board, ghosts, filters, card menus |
| `goalsData.js` | Fixtures |
| `components/NewGoalModal.jsx` | New Goal AI/Manual + preview (Rules 3–5) |
| `components/GoalDetailPanel.jsx` | Side drawer |
| `GoalDetailPage.jsx` | Full detail + linked empty states (Rule 6) |
| `components/GoalAiAssistant.jsx` | Detail AI chat shell |
| `goals.md` | This file |
| `goals_specification.md` | Short pointer |

Dev URLs:

| URL | Purpose |
|-----|---------|
| `/user/goals` | Populated board (Frame 1+) |
| `/user/goals?empty=1` | Empty board + ghost cards (Frames 1 / Hover) — DEV |
| `/user/goals/:goalId` | Detail (Frames 4 / 4.1 / 5 / 5.1) |

---

## Traceability checklist

- [x] Fix ONLY + Do NOT touch present  
- [x] MVP = **no MVP** (exact)  
- [x] Rules 1–9 present **same wording** / exact filter lists  
- [x] All 12 Figma node links present  
- [x] FLOW table for app verification  
- [x] Agent rules from brief  
