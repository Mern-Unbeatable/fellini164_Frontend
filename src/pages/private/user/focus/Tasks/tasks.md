# Tasks Board — MVP, Rules, and Backend Integration Contract

Status: Frontend mock implementation complete; backend integration not started  
Primary route: `/user/tasks`  
Frontend module: `src/pages/private/user/focus/Tasks/`

This document is the canonical implementation contract for Tasks Board. Backend, frontend, AI, QA, and design teams should use it before changing Tasks behavior.

It follows the same contract style as Planner Board (`planng/DailyPlan/planner.md`).

---

## MVP

### AI Assistant (Chat) — Global Rule (all boards)

> AI Assistant is available on the detail pages of Tasks, Habits, and Goals. AI can only change: **title**, **description**, **category**, **linked tasks**, and **linked habits**. AI must NOT change: **due date**, **status**, **priority**, **reminder time**, or any field that affects the planning structure and calendar. This applies to all boards in MVP.

Tasks Board also allows AI to manage **subtasks** and **linked goal** through approved UI flows (see Rules 8–9), without violating the global denylist above.

### Navigation / chrome (MVP)

Navigation items (Tools & Main section, Create button), settings, profile, Go to, Board/List toggle — **non-functional and non-visible in MVP**.

**Frontend note:** Where Figma already shows Board/List (or similar chrome) for pixel parity, keep it **visible but non-functional** until product enables it. Do not invent behavior.

---

## RULES

### 1. Ghost cards — empty state

Ghost cards appear only when the board is empty. On hover: due date fades out, footer appears with **AI suggested based on your profile** + **Accept** button.

### 2. Three dots menu — ghost card

On hover shows ⋯ button. Menu has **2 items only**: **Regenerate suggestion**, **Dismiss**.

### 3. Three dots menu — regular card

Menu has 3 groups:

1. **Edit**
2. **Break into subtasks**, **Improve description** (AI actions marked with ✦ / sparkle icon)
3. **Delete**

### 4. Subtitle typewriter animation

Subtitle text rotates between AI hint phrases every **3 seconds**. Text types in, then deletes character by character, then the next phrase types in. Same animation used in all AI-related inputs and chat placeholders across the product.

### 5. AI popup — Generate button

The generate button is inactive until the user types text. Placeholder text rotates between example prompts — types in, deletes, next example types in.

### 6. AI popup — skeleton while generating

Show skeleton on **title and description only**. Due date, category, and time stay visible. Fields appear one by one: title → description → tags. **100–150ms** delay between each.

### 7. New card appears on the board

After clicking **Add to Board** — card slides up + fade in. Opacity **0 → 100%**, **300ms** ease-out.

### 8. Subtasks AI button

- **No subtasks** → AI generates automatically based on task title, no popup.
- **Has subtasks** → shows confirm below the header: **Regenerate all subtasks?** Yes / Cancel.

### 9. Linked Goal + button

On click — shows dropdown with user's existing goals. First item marked as **AI recommended** based on task category. Last item: **+ Create new goal**.

### 10. Skeleton animation

Skeleton shown while AI processes request. Content appears with stagger: title → description → subtasks, **100–150ms** delay between each.  
Frame **8 — Animation** uses purple AI shimmer (`skeleton-ai-shimmer` / `SkeletonBar variant="ai"`).  
In the future: reverse typewriter on old text + typewriter on new text.

### 11. Filters — dropdown options

| Filter | Options |
|--------|---------|
| Status | All Statuses / To Do / In Progress / Done |
| Priority | All Priorities / Urgent / High / Medium / Low |
| Category | All Categories / Career / Health / Finance / Personal / Education |
| Source | All Sources / Created by AI / Created manually |
| Date | All Dates / Today / Tomorrow / This week / This month / Overdue |

### 12. Manual popup — field options

| Field | Options / behavior |
|-------|--------------------|
| Priority | All Priorities / Low / Medium / High / Urgent |
| Category | All Categories / Career / Health / Finance / Personal / Education |
| Status | All Statuses / To Do / In Progress / Done |
| Due Time | 12h format |
| Est. Minutes | number input, no limit |
| Linked Goal | dropdown with user goals; first item AI recommended; last item **+ Create new goal** |

---

## 1. Product Goal

Tasks Board is the system of record for Task content and workflow status. Users create, edit, complete, and organize tasks across columns. AI Assistant may help with allowed content fields and subtasks, but it must not change planning-structure fields.

The Tasks Board supports:

- Board view with To Do / In Progress / Done columns
- Empty-state AI ghost suggestions
- Manual create / edit modal
- Task detail drawer and full-page detail
- Subtasks (manual + AI generate)
- Linked Goal selection
- Filters and board search
- AI Assistant chat on the detail page
- Purple AI loading shimmer (Frame 8 Animation)
- Accept, Dismiss, Regenerate, Undo (where specified)

## 2. Non-Negotiable MVP Boundary (summary)

See **MVP** and **RULES** sections above. Quick denylist for implementers:

AI **may**: title, description, category, linked tasks/habits/goals, subtasks (approved flows).  
AI **must not**: due date, status, priority, reminder time, calendar/planning structure.

Planner owns schedule placement. Tasks owns task content and status.

## 3. Current Frontend Scope

The current Tasks Board uses in-file fixtures (`INITIAL_COLUMNS`, `GHOST_TASKS`) to reproduce approved Figma UI before backend integration.

Mock data is a visual fixture, not permission to invent AI behavior.

Dev-only helpers:

| URL | Purpose |
|-----|---------|
| `/user/tasks` | Populated board (Frame 3+ sample data) |
| `/user/tasks?empty=1` | Empty board + ghost cards (Frame 1 / 2 / 2.1) |

Until the backend returns canonical tasks:

- Ghost suggestions must come from the AI/suggestions API (or approved empty-state payload), not permanent hardcoded product logic.
- Accept / Dismiss / Regenerate must call backend endpoints.
- Chat apply must only mutate allowlisted fields.
- Frontend must not invent due dates, status changes, or priority changes from AI chat.

## 4. Figma nodes and Interaction Rules

Reference file:

`https://www.figma.com/design/VwgJovqBGtb90CEfNXkk2T/Elyxa.Ai--Phase-2---Copy-`

| Frame | Node ID |
|-------|---------|
| 1 — Empty States (Ghost cards) | `1182:749` |
| 2 — Empty States (Ghost cards) | `1213:16933` |
| 2 — Hover | `1200:8575` |
| 2.1 — Hover | `1213:17364` |
| 3 | `1172:738` |
| 3 — Hover | `1213:16473` |
| 3.1 — Hover | `1215:17723` |
| 3 — Filter | `1217:4147` |
| 4 | `1182:1206` |
| 4.1 | `1202:9654` |
| 4.2 — Edit Pop up | `1224:4613` |
| 5 | `1202:11206` |
| 6 | `1008:335` |
| 6.1 — Empty | `1224:5132` |
| 7 | `1019:3114` |
| 7.1 — Checked Subtasks | `1229:8463` (dup `1250:10871`) |
| 8 | `1020:3534` |
| 8 — Animation | `1230:9627` |

Design guardrails:

- Do not add UI elements absent from approved requirements or Figma.
- Do not change card dimensions, gaps, typography, borders, dashed ghost states, or responsive behavior during API integration.
- Ghost cards appear **only when the board is empty** (Rule 1).
- After the first real task exists, remaining ghosts are hidden.
- Frame 3 is the **populated starting state**, not “Accept all three ghosts.”
- AI apply states use purple shimmer for Frame 8 Animation parity (Rule 10).
- Backend fields must adapt into the existing view model; API integration must not force a redesign.

### Requirement traceability — verified (frontend mock)

MVP:

- [x] Global AI allow/deny rule documented and enforced in chat apply path
- [x] Chrome non-functional for MVP (Board/List visible, non-functional where shown)

Rules 1–12:

- [x] 1 Ghost empty-only + hover Accept footer
- [x] 2 Ghost ⋯ Regenerate / Dismiss
- [x] 3 Regular card menu groups + AI sparkle actions
- [x] 4 Subtitle typewriter
- [x] 5 AI generate inactive until text + rotating placeholder
- [x] 6 Skeleton title/description only during generate
- [x] 7 Card enter animation on Add to Board
- [x] 8 Subtasks AI auto vs regenerate confirm
- [x] 9 Linked Goal dropdown AI recommended + Create new goal
- [x] 10 AI skeleton / purple shimmer on apply
- [x] 11 Filter option sets
- [x] 12 Manual popup field options

---

## 5. Clarified Control Responsibilities

### + New Task

Opens the manual / AI create modal (`TaskFormModal`).  
Label **Create** on submit for manual create (Figma). AI preview path may use **Add to Board**.

### Board / List toggle

Visible for Figma parity. Non-functional in MVP.

### Filters + board search

Client-side filtering against the current fixture/API task list.  
Filters: Status, Priority, Category, Source, Date + search string.

### Ghost card ⋯ menu

- **Regenerate suggestion** — replace that ghost with alternate suggestion content (same id slot).
- **Dismiss** — remove that ghost only.

### Ghost Accept Task

Creates a real To Do task from the ghost, removes that ghost, and ends empty-board mode (remaining ghosts hide because the board is no longer empty).

### Task card ⋯ menu

- Edit
- Break into subtasks (opens detail + AI subtasks trigger)
- Improve description
- Delete

### Detail drawer vs full page

- Drawer: Frames 6 / 6.1 / 7 / 7.1 — board remains visible behind.
- Full page: Frame 8 — board hidden; AI Assistant docked beside detail.

### AI Assistant (detail)

Chat-led proposals with confirm:

1. User prompt or quick action
2. AI proposal + plan bullets
3. **Do you want me to apply?** → Yes, apply / No, cancel
4. On Yes: purple shimmer on allowed fields → apply → Done + Undo

Quick actions:

- Break into subtasks
- Improve description

## 6. Required User Flows

### 6.1 Empty board → ghost suggestions (Frames 1 → 2 → 2.1)

1. Frontend loads tasks; if count is zero, request AI suggestions (or empty-state payload).
2. Render ghost cards (Frame 1).
3. Hover → solid card, Accept footer, ⋯ (Frame 2).
4. ⋯ → Regenerate / Dismiss (Frame 2.1).
5. Accept → create task via Tasks API; board no longer empty → hide remaining ghosts.
6. Dismiss → remove suggestion only.
7. Regenerate → replace that suggestion via suggestions API.

**How to check in mock today:** `/user/tasks?empty=1` → hover → ⋯ / Accept.

### 6.2 Populated board (Frame 3)

1. Frontend loads tasks with `status` mapped to columns.
2. Render TaskCards; no ghosts.
3. Open drawer on card select; expand to full page as designed.

**How to check in mock today:** `/user/tasks` (no `empty=1`).

### 6.3 Manual create / edit

1. User opens New Task / Edit.
2. Frontend submits allowlisted fields to Tasks API.
3. On create, place card in the status column.
4. AI generate inside modal may skeleton **title/description only**; due/category/time stay visible (Rule 6 pattern).

### 6.4 AI Assistant apply (Frame 8 + Animation)

1. User opens task full page.
2. User asks for subtasks / description improvement (or uses quick actions).
3. AI returns proposal + confirm pills.
4. User selects **Yes, apply**.
5. Frontend shows purple AI shimmer on title/description and/or subtasks block.
6. Frontend applies **only** allowlisted mutations.
7. Chat shows Done + Undo.
8. Undo restores previous allowlisted snapshot.

Forbidden: chat must not change due date, status, or priority even if the user asks.

### 6.5 Subtasks

1. Empty state shows “No Subtasks yet”.
2. Sparkles / AI chat can generate subtasks.
3. While generating/applying: purple block shimmer (`h-[164px]`, `rounded-[10px]`).
4. Checked subtasks use reduced opacity + line-through (Frame 7.1).
5. Progress footer: `Progress: n/m Steps`.

### 6.6 Linked Goal

1. `+` opens dropdown.
2. First option = AI recommended goal when available.
3. Last option = `+ Create new goal`.
4. Selecting a goal updates task linkage only (not Goal content ownership).

## 7. Canonical Domain Model

### 7.1 Task

Owned by Tasks service:

```json
{
  "id": "task_123",
  "title": "Exercise Routine",
  "description": "Follow your fitness routine or do a workout session.",
  "priority": "URGENT",
  "status": "TO_DO",
  "categoryId": "category_career",
  "dueAt": "2026-05-13T21:00:00Z",
  "durationMinutes": 60,
  "source": "AI",
  "linkedGoalId": "goal_improve_rate",
  "subtasks": [
    {
      "id": "sub_1",
      "label": "Warm Up",
      "minutes": 5,
      "completed": false,
      "order": 0
    }
  ],
  "createdAt": "2026-05-12T20:00:00Z",
  "updatedAt": "2026-05-12T20:00:00Z"
}
```

Rules:

- `status` drives board column: `TO_DO` | `IN_PROGRESS` | `DONE`.
- `priority`: `URGENT` | `HIGH` | `MEDIUM` | `LOW`.
- `source`: `AI` | `MANUAL` (display: Created by AI / Created manually).
- Display labels (`Today`, `60 Min`, `0/4 Steps`) are adapter-only; API uses structured fields.
- Planner may read Tasks for placement but must not write Task content.

### 7.2 Ghost / AI suggestion

```json
{
  "id": "suggestion_123",
  "title": "Exercise Routine",
  "description": "...",
  "priority": "URGENT",
  "categoryId": "category_career",
  "suggestedDueLabel": "Today",
  "durationMinutes": 60,
  "linkedGoalId": "goal_improve_rate",
  "suggestedSubtaskCount": 4,
  "reason": "Based on your profile"
}
```

Suggestions are not Tasks until Accept creates a Task.

### 7.3 AI apply transaction (detail chat)

```json
{
  "id": "task_ai_change_123",
  "taskId": "task_123",
  "status": "PENDING",
  "intent": "SUBTASKS",
  "proposedPatch": {
    "title": null,
    "description": null,
    "categoryId": null,
    "linkedGoalId": null,
    "subtasks": []
  },
  "forbiddenFieldsRejected": ["dueAt", "status", "priority"]
}
```

Allowed patch keys only: `title`, `description`, `categoryId`, `linkedGoalId`, `linkedHabitIds`, `subtasks`.

## 8. API Response Envelope

Use the repository's existing response convention:

```json
{
  "success": true,
  "message": "Tasks loaded",
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Validation failed",
  "error": {
    "code": "TASKS_VALIDATION_ERROR",
    "details": {}
  }
}
```

## 9. Recommended API Endpoints

All endpoints require the existing Bearer token handled by `axiosInstance`.

### List tasks

`GET /api/v1/tasks?status=&priority=&categoryId=&source=&due=&q=`

### Get task

`GET /api/v1/tasks/:taskId`

### Create task

`POST /api/v1/tasks`

### Update task

`PATCH /api/v1/tasks/:taskId`

Reject AI-originated patches that include `dueAt`, `status`, `priority`, or reminder fields when the actor is AI Assistant. User Edit modal may update those fields.

### Delete task

`DELETE /api/v1/tasks/:taskId`

### Empty-state suggestions

`GET /api/v1/tasks/suggestions`  
(or `POST /api/v1/tasks/suggestions/generate`)

Only meaningful when the user has zero tasks (or product-defined empty board).

### Accept suggestion

`POST /api/v1/tasks/suggestions/:suggestionId/accept`

Creates a Task and returns the created entity.

### Dismiss suggestion

`POST /api/v1/tasks/suggestions/:suggestionId/dismiss`

### Regenerate suggestion

`POST /api/v1/tasks/suggestions/:suggestionId/regenerate`

### AI chat propose

`POST /api/v1/tasks/:taskId/ai/propose`

```json
{
  "message": "Break this task into subtasks.",
  "intent": "SUBTASKS",
  "conversationId": "conversation_123"
}
```

### AI chat apply

`POST /api/v1/tasks/:taskId/ai/apply`

```json
{
  "proposalId": "proposal_123",
  "idempotencyKey": "apply-proposal_123-client_uuid"
}
```

Must validate allowlist and reject forbidden fields.

### AI chat undo

`POST /api/v1/tasks/:taskId/ai/changes/:changeId/undo`

### Subtasks replace / update

`PUT /api/v1/tasks/:taskId/subtasks`

## 10. Column Mapping

| API status | Column key | UI label |
|------------|------------|----------|
| `TO_DO` | `todo` | To Do |
| `IN_PROGRESS` | `inProgress` | In Progress |
| `DONE` | `done` | Done |

Frontend adapter maps API enums to current `TaskCard` / column presentation.

## 11. Frontend Integration Architecture

Use the repository's existing stack:

- Axios through `src/services/axiosInstance.js`
- HTTP helpers through `src/services/httpMethods.js`
- Redux Toolkit async thunks and slice
- Existing Bearer-token interceptor
- Existing `{ success, message, data }` envelope

Recommended new files:

```text
src/features/tasks/
  tasksAPI.js
  tasksSlice.js
  tasksSelectors.js
  tasksAdapter.js
```

### tasksAPI.js

- Call Tasks endpoints.
- Normalize errors into stable Tasks error codes.
- Never contain UI layout classes.

### tasksSlice.js

Recommended state:

```json
{
  "items": [],
  "suggestions": [],
  "selectedTaskId": null,
  "chat": [],
  "pendingProposal": null,
  "latestAiChange": null,
  "loading": {
    "list": false,
    "detail": false,
    "suggestions": false,
    "ai": false,
    "commit": false
  },
  "error": null
}
```

### tasksAdapter.js

- Map API tasks → board columns + card view model.
- Build display labels (`Today`, `0/4 Steps`, `60 Min`).
- Preserve canonical IDs.
- Never invent forbidden AI field mutations.

### Presentation components (keep presentation-focused)

- `TasksBoard.jsx`
- `TaskCard.jsx` / `GhostTaskCard`
- `TaskFormModal.jsx`
- `TaskDetailPanel.jsx` (drawer + page + AI chat)
- `TaskFilters.jsx`

## 12. Frontend Integration Steps

### Phase 1 — Contract setup

1. Agree models and endpoints in this document.
2. Confirm AI allowlist / denylist.
3. Confirm empty-board suggestion rules.
4. Confirm timezone for due dates.
5. Publish OpenAPI definitions.

### Phase 2 — Read list + detail

1. Add `tasksAPI.js` / `tasksSlice.js`.
2. Fetch tasks on `/user/tasks`.
3. Adapt into columns.
4. Keep fixtures behind DEV fallback until parity.

### Phase 3 — CRUD

1. Wire create / update / delete.
2. Preserve Edit modal ownership of status / due / priority.
3. Visual regression for card and drawer.

### Phase 4 — Suggestions

1. Load suggestions only when board empty.
2. Wire Accept / Dismiss / Regenerate.
3. Verify ghosts hide after first accepted task.

### Phase 5 — AI Assistant

1. Wire propose → confirm → apply → undo.
2. Enforce allowlist client-side and trust server rejection.
3. Purple shimmer during apply (Frame 8 Animation).

### Phase 6 — Remove mock runtime dependency

1. Confirm empty, ghost, populated, drawer, page, loading, error states.
2. Confirm responsive visual regression.
3. Remove runtime init from `INITIAL_COLUMNS` / `GHOST_TASKS` (keep test fixtures if needed).

## 13. Visual Feedback Rules

- Skeleton loading required while confirmed Tasks AI work is pending.
- Frame 8 Animation uses purple AI shimmer (`#f9f4ff` ↔ `#fff`), defined as `skeleton-ai-shimmer` in `src/index.css` and consumed via `SkeletonBar variant="ai"`.
- Title shimmer ~ `31×241`, `rounded-[8px]`; description ~ `16×295`, `rounded-[5px]`; subtasks block ~ `164px` height, `rounded-[10px]`.
- Loading must not resize or distort Figma layout.
- Ghost dashed borders must match approved empty-state styling (parity with Planner airy dashes where required by design).

## 14. Error Handling

Expected HTTP statuses:

- `200` success / no-change
- `201` created
- `400` invalid request
- `401` unauthenticated
- `403` not owned
- `404` not found
- `409` conflict / stale proposal
- `422` AI policy validation failed (forbidden fields)
- `429` AI rate limit
- `500` / `503` server / AI unavailable

Frontend rules:

- Never clear the board because an API failed.
- Never apply a partial AI patch.
- Stop shimmer on failure.
- Keep chat history.
- Show concise retry message.
- Do not invent local AI content mutations as fallback.

## 15. Security and Authorization

Backend must:

- Derive `userId` from token.
- Verify ownership of every task, suggestion, proposal, and change.
- Reject cross-user references.
- Validate AI patches against allowlist.
- Rate-limit AI endpoints.
- Audit accept/dismiss/regenerate/apply/undo.
- Avoid logging full private descriptions unless approved.

## 16. Testing Requirements

### Frontend

- Empty board shows ghosts (`?empty=1` until API).
- Hover / menu / accept / dismiss / regenerate.
- Accept one ghost hides remaining ghosts.
- Populated board has no ghosts.
- AI chat cannot change due/status/priority.
- Apply shows purple shimmer then content.
- Undo restores previous allowlisted snapshot.
- Drawer and full-page states match Figma.
- Responsive visual regression (desktop / laptop / tablet / mobile).

### Backend

- AI policy rejects forbidden fields.
- Suggestions only when empty (or product rule).
- Accept creates task atomically.
- Idempotent apply/undo.
- Ownership and auth tests.

## 17. QA Matrix

Test each state:

- Initial loading
- Empty + ghosts
- Ghost hover
- Ghost menu
- Populated board
- Filters / search
- Create / edit modal
- Drawer empty / populated
- Subtasks empty / listed / checked
- Full page + AI chat
- AI propose / confirm / apply / undo
- AI shimmer animation
- Error / conflict

For every test, verify:

- No invented status/due/priority from AI
- No ghost cards when board has tasks
- No layout distortion during shimmer
- Pixel parity with approved frames

## 18. Definition of Done

Backend integration is complete only when:

- Tasks read/write canonical entities.
- Empty suggestions follow empty-board rules.
- AI never edits forbidden fields.
- Accept / Dismiss / Regenerate / Apply / Undo are server-backed.
- Frame 1–8 visual states remain unchanged.
- Purple AI shimmer matches Frame 8 Animation.
- Responsive regression passes.
- Mock runtime data is no longer required.

## 19. Explicitly Out of Scope for MVP

- Functional Board / List toggle
- Functional Go to / Settings / Profile chrome
- AI changing due date, status, priority, or reminders
- Planner schedule edits from Tasks AI
- Drag-and-drop cross-column unless separately approved
- Local frontend AI heuristics that invent task content without backend confirmation

## 20. Integration Checklist

Before coding:

- [ ] Confirm Task API contract
- [ ] Confirm AI allowlist / denylist
- [ ] Confirm suggestions endpoints
- [ ] Confirm due-date timezone rules
- [ ] Confirm Undo eligibility

Before frontend merge:

- [ ] No forbidden AI field writes
- [ ] Empty-only ghosts
- [ ] Adapter tests
- [ ] Loading preserves layout
- [ ] Responsive visual regression passes

Before production:

- [ ] Auth / ownership tests pass
- [ ] Rate limits configured
- [ ] Feature flag tested
- [ ] Mock runtime dependency removed

## 21. Local Verification Map (Mock)

| Goal | Action |
|------|--------|
| Frame 1 | `/user/tasks?empty=1` |
| Frame 2 | Hover a ghost card |
| Frame 2.1 | Click ⋯ on hovered ghost |
| Frame 3 | `/user/tasks` |
| Frame 6 / 7 | Open a task drawer |
| Frame 8 | Expand to full page + AI chat |
| Frame 8 Animation | AI → Yes, apply → watch purple shimmer |
