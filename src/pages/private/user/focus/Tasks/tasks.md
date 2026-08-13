# Tasks Board — MVP, Rules, Flow, and Figma (Pixel-Perfect Contract)

Status: Frontend mock implementation complete; backend integration not started  
Primary route: `/user/tasks`  
Frontend module: `src/pages/private/user/focus/Tasks/`

Same contract style as Habits (`focus/Habits/habits.md`) and Planner (`planng/DailyPlan/planner.md`).

**Source brief (authentic):** PIXEL-PERFECT FIX — Tasks Board Flow — MVP + RULES + FLOW + FIGMA UI.  
**Do not invent. Do not remove Figma controls. Change only what the Fix requires.**

---

## Fix ONLY

Tasks Board Flow: Check the **MVP**, **RULES**, **FLOW**, and **FIGMA UI** pixel perfect.

## Do NOT touch

Figma UI design — if you need to update Figma, you can; do not invent controls that remove approved Figma affordances without product confirmation.

---

## MVP

### AI Assistant (Chat) — Global Rule (all boards)

> *"AI Assistant is available on the detail pages of Tasks, Habits, and Goals. AI can only change: title, description, category, linked tasks, and linked habits. AI must NOT change: due date, status, priority, reminder time, or any field that affects the planning structure and calendar. This applies to all boards in MVP."*

### Navigation / chrome (MVP)

> Navigation items (Tools & Main section, Create button), settings, profile, Go to, Board/List toggle - non-functional and non-visible in MVP.

---

## RULES

### 1. Ghost cards — empty state

> Ghost cards appear only when the board is empty. On hover: due date fades out, footer appears with 'AI suggested based on your profile' + Accept button.

### 2. Three dots menu — ghost card

> On hover shows ⋯ button. Menu has 2 items only: Regenerate suggestion, Dismiss.

### 3. Three dots menu — regular card

> Menu has 3 groups: 1) Edit, 2) Break into subtasks, Improve description, 3) Delete. AI actions marked with ✦ icon.

### 4. Subtitle typewriter animation

> Subtitle text rotates between AI hint phrases every 3 seconds. Text types in, then deletes character by character, then the next phrase types in. Same animation used in all AI-related inputs and chat placeholders across the product.

### 5. AI popup — Generate button

> The generate button is inactive until the user types text. Placeholder text rotates between example prompts — types in, deletes, next example types in.

### 6. AI popup — skeleton while generating

> Show skeleton on title and description only. Due date, category, and time stay visible. Fields appear one by one: title → description → tags. 100-150ms delay between each.

### 7. New card appears on the board

> After clicking 'Add to Board' — card slides up + fade in. Opacity 0→100%, 300ms ease-out.

### 8. Subtasks AI button

> No subtasks → AI generates automatically based on task title, no popup. Has subtasks → shows confirm below the header: 'Regenerate all subtasks?' Yes / Cancel.

### 9. Linked Goal + button

> On click — shows dropdown with user's existing goals. First item marked as 'AI recommended' based on task category. Last item: '+ Create new goal'.

### 10. Skeleton animation

> Skeleton shown while AI processes request. Content appears with stagger: title → description → subtasks, 100-150ms delay between each. In the future: reverse typewriter on old text + typewriter on new text.

### 11. Filters — dropdown options

| Filter | Options (exact) |
|--------|-----------------|
| Status | All Statuses / To Do / In Progress / Done |
| Priority | All Priorities / Urgent / High / Medium / Low |
| Category | All Categories / Career / Health / Finance / Personal / Education |
| Source | All Sources / Created by AI / Created manually |
| Date | All Dates / Today / Tomorrow / This week / This month / Overdue |

### 12. Manual popup — field options

| Field | Options / behavior (exact) |
|-------|----------------------------|
| Priority | All Priorities / Low / Medium / High / Urgent |
| Category | All Categories / Career / Health / Finance / Personal / Education |
| Status | All Statuses / To Do / In Progress / Done |
| Due Time | 12h format |
| Est. Minutes | number input, no limit |
| Linked Goal | dropdown with user goals, first item AI recommended, last item "+ Create new goal" |

---

## Figma nodes

File: [Elyxa.Ai — Phase 2](https://www.figma.com/design/VwgJovqBGtb90CEfNXkk2T/Elyxa.Ai--Phase-2---Copy-)

| Frame | Link |
|-------|------|
| Task Board (1440) - 1 - Empty States (Ghost cards) | https://www.figma.com/design/VwgJovqBGtb90CEfNXkk2T/Elyxa.Ai--Phase-2---Copy-?node-id=1182-749&m=dev |
| Task Board (1440) - 2 - Empty States (Ghost cards) | https://www.figma.com/design/VwgJovqBGtb90CEfNXkk2T/Elyxa.Ai--Phase-2---Copy-?node-id=1213-16933&m=dev |
| Task Board (1440) - 2 - Hover | https://www.figma.com/design/VwgJovqBGtb90CEfNXkk2T/Elyxa.Ai--Phase-2---Copy-?node-id=1200-8575&m=dev |
| Task Board (1440) - 2.1 - Hover | https://www.figma.com/design/VwgJovqBGtb90CEfNXkk2T/Elyxa.Ai--Phase-2---Copy-?node-id=1213-17364&m=dev |
| Task Board (1440) - 3 | https://www.figma.com/design/VwgJovqBGtb90CEfNXkk2T/Elyxa.Ai--Phase-2---Copy-?node-id=1172-738&m=dev |
| Task Board (1440) - 3 - Hover | https://www.figma.com/design/VwgJovqBGtb90CEfNXkk2T/Elyxa.Ai--Phase-2---Copy-?node-id=1213-16473&m=dev |
| Task Board (1440) - 3.1 - Hover | https://www.figma.com/design/VwgJovqBGtb90CEfNXkk2T/Elyxa.Ai--Phase-2---Copy-?node-id=1215-17723&m=dev |
| Task Board (1440) - 3 - Filter | https://www.figma.com/design/VwgJovqBGtb90CEfNXkk2T/Elyxa.Ai--Phase-2---Copy-?node-id=1217-4147&m=dev |
| Task Board (1440) - 4 | https://www.figma.com/design/VwgJovqBGtb90CEfNXkk2T/Elyxa.Ai--Phase-2---Copy-?node-id=1182-1206&m=dev |
| Task Board (1440) - 4.1 | https://www.figma.com/design/VwgJovqBGtb90CEfNXkk2T/Elyxa.Ai--Phase-2---Copy-?node-id=1202-9654&m=dev |
| Task Board (1440) - 4.2 - Edit Pop up | https://www.figma.com/design/VwgJovqBGtb90CEfNXkk2T/Elyxa.Ai--Phase-2---Copy-?node-id=1224-4613&m=dev |
| Task Board (1440) - 5 | https://www.figma.com/design/VwgJovqBGtb90CEfNXkk2T/Elyxa.Ai--Phase-2---Copy-?node-id=1202-11206&m=dev |
| Task Board (1440) - 6 | https://www.figma.com/design/VwgJovqBGtb90CEfNXkk2T/Elyxa.Ai--Phase-2---Copy-?node-id=1008-335&m=dev |
| Task Board (1440) - 6.1 - Empty | https://www.figma.com/design/VwgJovqBGtb90CEfNXkk2T/Elyxa.Ai--Phase-2---Copy-?node-id=1224-5132&m=dev |
| Task Board (1440) - 7 | https://www.figma.com/design/VwgJovqBGtb90CEfNXkk2T/Elyxa.Ai--Phase-2---Copy-?node-id=1019-3114&m=dev |
| Task Board (1440) - 7.1 - Checked Subtasks | https://www.figma.com/design/VwgJovqBGtb90CEfNXkk2T/Elyxa.Ai--Phase-2---Copy-?node-id=1229-8463&m=dev |
| Task Board (1440) - 7.1 - Checked Subtasks | https://www.figma.com/design/VwgJovqBGtb90CEfNXkk2T/Elyxa.Ai--Phase-2---Copy-?node-id=1250-10871&m=dev |
| Task Board (1440) - 8 | https://www.figma.com/design/VwgJovqBGtb90CEfNXkk2T/Elyxa.Ai--Phase-2---Copy-?node-id=1020-3534&m=dev |
| Task Board (1440) - 8 - Animation | https://www.figma.com/design/VwgJovqBGtb90CEfNXkk2T/Elyxa.Ai--Phase-2---Copy-?node-id=1230-9627&m=dev |

Node IDs: `1182:749`, `1213:16933`, `1200:8575`, `1213:17364`, `1172:738`, `1213:16473`, `1215:17723`, `1217:4147`, `1182:1206`, `1202:9654`, `1224:4613`, `1202:11206`, `1008:335`, `1224:5132`, `1019:3114`, `1229:8463`, `1250:10871`, `1020:3534`, `1230:9627`.

---

## FLOW — how to verify in the app

Build must flow from **Figma + MVP + Rules**. Verify full flow before done.

| Step | URL / action | Matches |
|------|----------------|---------|
| Empty ghosts | Delete all real tasks on `/user/tasks`, or DEV `/user/tasks?empty=1` | Frame 1 / 2. Ghosts from `GET /onboarding/suggestions?type=TASK&status=pending`. |

Ghost card fields from GET `suggestions[]` only (no extra UI):

| Ghost UI | API |
|----------|-----|
| Priority | `proposedTask.priority` |
| Title | `proposedTask.title` |
| Description | `proposedTask.description` |
| Category tag | `proposedTask.category` |
| Goal tag | `proposedGoal.title` — hidden when `proposedGoal` is `null` |
| Minutes tag | `proposedTask.estimatedMinutes` |
| Steps tag | `proposedTasks.length` as `0/N Steps` — hidden when empty |
| Due | `proposedTask.dueDate` |
| Footer | `message` |
| AI badge | UI only |
| Accept / Regenerate / Dismiss | `suggestionId` |
| Ghost hover | Same → hover ghost | Frame 2 — Hover (due fades; Accept footer) |
| Ghost ⋯ | Hover → ⋯ | Frame 2.1 — Regenerate / Dismiss only |
| Populated | `/user/tasks` | Frame 3 |
| Card hover / ⋯ | Populated → hover → ⋯ | Frame 3 / 3.1 — Edit / AI / Delete groups |
| Filters | Open filter dropdowns | Frame 3 — Filter (Rule 11 options) |
| New Task AI | **+ New Task** → AI path | Frame 4 / 4.1 (Rules 5–7) |
| Edit popup | Edit task | Frame 4.2 |
| Detail drawer | Open task | Frame 6 / 6.1 / 7 / 7.1 |
| Full page + AI | Expand detail + chat | Frame 8 |
| AI apply shimmer | Yes, apply | Frame 8 — Animation (Rule 10) |
| MVP chrome | Tools / Create / settings / profile / Go to / Board·List | Non-functional **and** non-visible |
| MVP AI chat | Detail AI Assistant | Allowlist only (global rule) |

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
| `TasksBoard.jsx` (and board entry) | Board, fixtures, empty vs populated |
| Ghost task card | Empty AI cards (Rules 1–2) |
| `TaskCard.jsx` | Real cards + ⋯ menu (Rule 3) |
| Subtitle / typewriter | Rule 4 |
| `TaskFormModal.jsx` | AI + Manual create/edit (Rules 5–7, 12) |
| `TaskDetailPanel.jsx` | Drawer / page / subtasks / Linked Goal / AI chat (Rules 8–10, MVP) |
| `TaskFilters.jsx` | Rule 11 |
| `tasks.md` | This file |
| `tasks_specification.md` | Short pointer |

Dev URLs:

| URL | Purpose |
|-----|---------|
| `/user/tasks` | Populated board (Frame 3+) |
| `/user/tasks?empty=1` | Empty board + ghost cards (Frames 1 / 2 / 2.1) |

---

## Traceability checklist

- [x] Fix ONLY + Do NOT touch present **same wording**  
- [x] MVP AI Assistant global rule present **same wording**  
- [x] MVP Navigation chrome present **same wording** (non-functional and non-visible)  
- [x] Rules 1–12 present **same wording** / exact option lists  
- [x] All Figma node links present (including both 7.1 nodes)  
- [x] FLOW table for app verification  
- [x] Agent rules from brief  
