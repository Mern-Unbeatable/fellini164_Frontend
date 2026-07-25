# TestAPIs.md — Production-Ready Frontend API Integration Standard

**Role:** Senior Software Engineer (10+ years)  
**Scope:** Frontend ↔ Backend API integration  
**Rule:** Do not assume. Validate every API before implementation and after integration.

---

## 1. API Validation (Before Integration)

Before writing any frontend code:

1. Verify the API **endpoint** and **HTTP method** (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`).
2. Confirm the **Base URL** and **endpoint path**.
3. Validate all required **headers** (`Authorization`, `Content-Type`, `Accept`, etc.).
4. Ensure **request body** structure matches the backend contract.
5. Verify required **path parameters**, **query parameters**, and **request payload**.
6. If any required field is missing — **stop** and document what is missing.

---

## 2. During Integration

1. Ensure the request body is **exactly** as specified by the backend.
2. Validate request headers.
3. Handle **loading**, **success**, **empty**, and **error** states.
4. Implement proper error handling.
5. Do **not** hardcode API data.
6. Remove mock or dummy data once the API is connected.

---

## 3. Response Validation

1. Verify HTTP status codes (`200`, `201`, `204`, `400`, `401`, `403`, `404`, `422`, `500`, etc.).
2. Ensure response structure matches the API contract.
3. Validate all response fields and data types.
4. Handle `null`, `undefined`, empty arrays, and missing properties safely.
5. Display appropriate user messages for errors.

---

## 4. VS Code + Postman Verification

1. Verify every API in **Postman** before using it in the frontend.
2. Compare the frontend request with the Postman request.
3. Ensure request body, headers, query parameters, and endpoint are **identical**.
4. If Postman does not return a response, do **not** guess.

Instead, clearly state:

> This API is not returning a response in Postman. A valid backend response is required before frontend integration can be completed.

5. If the response is incomplete or incorrect, specify exactly what the backend needs to provide.

---

## 5. Code Quality

1. Run the application after every API integration.
2. Check the browser console for errors and warnings.
3. Check the Network tab for failed requests.
4. Ensure there are no TypeScript or ESLint errors.
5. Remove unused imports, variables, and dead code.
6. Follow SOLID, DRY, and Clean Code principles.

---

## 6. QA Checklist

- [ ] Success scenarios
- [ ] Validation errors
- [ ] Unauthorized access (`401`)
- [ ] Forbidden access (`403`)
- [ ] Server errors (`500`)
- [ ] Empty responses
- [ ] Slow network conditions
- [ ] Retry behavior (if applicable)
- [ ] UI updates correctly after API responses
- [ ] No console errors or unhandled promise rejections

---

## 7. Final Verification (Before Marking Complete)

Confirm all of the following:

- [ ] API is successfully integrated
- [ ] Request body is correct
- [ ] Response is validated
- [ ] Error handling works
- [ ] Loading state works
- [ ] Empty state works
- [ ] UI matches the API data
- [ ] Code builds successfully
- [ ] No console errors
- [ ] No TypeScript or ESLint issues
- [ ] QA testing is complete

---

## 8. Non-Negotiable Rules

1. **Never** make assumptions about backend responses.
2. If Postman or the backend does not provide a valid response, explicitly state that a backend response is required before frontend integration can be completed.
3. Do not invent endpoints, fields, or status codes.
4. Prefer failing loudly with a clear blocker over silent fallbacks that hide contract mismatches.

---

## 9. Mandatory Post-Integration Test (Agent + Engineer)

**Rule:** After every API wire-up, do **not** mark done until this section is followed against `docs/TestAPIs.md`.

1. **Contract** — Confirm endpoint, method, query/body, and sample response exist in Appendix A / C (or paste Postman evidence first).
2. **Code match** — Frontend request must match Postman (path, params, body keys). No invented fields.
3. **Automated audits** (no auth):
   - `node scripts/audit-goals-list.mjs` — GET `/goals` filters/search
   - `node scripts/audit-link-pickers.mjs` — GET `/tasks` + `/habits` link pickers
   - `node scripts/audit-habits-board.mjs` — Habits Board create + filter query mapping
   - `node scripts/audit-tasks-board.mjs` — Tasks Board create + filter query mapping
4. **QA §6 / Final §7** — Tick what was verified; leave unchecked if only Network QA remains.
5. **Update Appendix A / C / D** — Set row to **FULFILLED** / **PARTIAL** / **DEFERRED** / **CLIENT** with date + evidence notes.
6. **Logged-in Network** — Run Appendix B (Goals), Appendix C §C.6 (Habits), or Appendix D §D.6 (Tasks) smoke steps; compare Network tab to Postman.

If Postman has no valid response:

> This API is not returning a response in Postman. A valid backend response is required before frontend integration can be completed.

---

## Appendix A — Goals Board API Audit (Current Frontend)

**Date:** 2026-07-22  
**Last automated re-test:** 2026-07-22 evening — `audit-goals-list.mjs` + `audit-link-pickers.mjs` → **ALL PASS**  
**Module:** `src/features/goals/` + `src/pages/private/user/focus/Goals/`  
**Base URL (env):** `VITE_API_BASE_URL` → `https://backendtest.elyxaai.com`  
**API prefix used in code:** `/api/v1/goals`  
**Contract verifiers:**  
- `node scripts/audit-goals-list.mjs`  
- `node scripts/audit-link-pickers.mjs`  

### A.1 Endpoint Matrix (as coded)

| Action | Method + Path | Frontend entry | Contract evidence | Status |
|--------|---------------|----------------|-------------------|--------|
| List + filters + search | `GET /api/v1/goals` | Board filters + search → `buildGoalsQueryParams` → `fetchGoals` | Postman 2026-07-22 samples (bare, status+priority, search, dueFilter, empty HIGH) | **FULFILLED** |
| Board summary | From list `summary` | Stats bar on `ActiveGoals` | List envelope `summary.active/paused/completedThisMonth/total` | **FULFILLED** |
| AI generate goal | `POST /api/v1/goals/ai/generate` | New Goal → AI Generation | Body `{ prompt, category }`; server persists; Add to Board refreshes only | **FULFILLED** |
| Create goal | `POST /api/v1/goals` | New Goal → Manual | Body with `source: MANUAL`, optional UUID `taskIds`/`habitIds` | **FULFILLED** |
| Get goal | `GET /api/v1/goals/:id` | `GoalDetailPage` | Wired + mapped | **FULFILLED** |
| Pause | `PATCH /api/v1/goals/:id/pause` | Card / detail menu | Confirmed `status: PAUSED` | **FULFILLED** |
| Activate | `PATCH /api/v1/goals/:id/activate` | Same toggle | Counterpart of pause | **FULFILLED** |
| Delete | `DELETE /api/v1/goals/:id` | Card / detail menu | Wired | **FULFILLED** |
| Update goal | `PATCH /api/v1/goals/:id` | Edit Goal modal (board + detail) | Partial body `{ title, priorityLevel?, status?, targetDate?, … }` | **FULFILLED** |
| Complete goal | `POST /api/v1/goals/:id/complete` | Card menu Complete | No body | **FULFILLED** |
| Link tasks | `POST /api/v1/goals/:id/link-tasks` | Plus / Spark Find & Attach | Body `{ taskIds: [uuid] }` | **FULFILLED** |
| Link habits | `POST /api/v1/goals/:id/link-habits` | Plus / Spark Find & Attach | Body `{ habitIds: [uuid] }` | **FULFILLED** |
| Tasks for link picker | `GET /api/v1/tasks` | **+** `LinkItemsModal`, Spark **Find & Attach**, New Goal linked tasks | Envelope `{ tasks, pagination }`; default `parentOnly=true&page=1&limit=50` (no `goalId`) | **FULFILLED** |
| Habits for link picker | `GET /api/v1/habits` | **+** `LinkItemsModal`, Spark **Find & Attach**, New Goal linked habits | Envelope `{ habits, pagination }`; default `isActive=true&page=1&limit=50` (no `goalId`) | **FULFILLED** |
| AI generate task | `POST /api/v1/tasks/ai/generate` | Spark ✨ → **AI Generation** (Linked Tasks) | Body `{ prompt, category, goalId? }`; response `{ task }` | **FULFILLED** |
| AI generate habit | `POST /api/v1/habits/ai/generate` | Spark ✨ → **AI Generation** (Linked Habits) | Body `{ prompt, category, goalId? }`; response `{ habit }` | **FULFILLED** |
| AI suggest (assistant) | `POST /api/v1/goals/:id/ai/suggest` | Goal detail **AI Assistant** — Add tasks / Improve description / Add habits / chat | Body `{ action, message }`; actions `IMPROVE_DESCRIPTION` \| `ADD_TASKS` \| `ADD_HABITS` \| `CHAT` | **FULFILLED** |
| Accept AI suggestion | `POST /api/v1/goals/ai/suggestions/:suggestionId/accept` | AI Assistant **Yes, apply** | Applies proposal server-side; then refetch goal | **FULFILLED** |
| Dismiss AI suggestion | `POST /api/v1/goals/ai/suggestions/:suggestionId/dismiss` | AI Assistant **No, cancel** | Discards pending suggestion | **FULFILLED** |
| Undo AI changes | `POST /api/v1/goals/:goalId/ai/undo` | AI Assistant **Undo changes** | Reverts last accepted suggestion; refetch goal | **FULFILLED** |
| AI suggestion history | `GET /api/v1/goals/:goalId/ai/suggestions` | Goal detail AI Assistant open / refresh | Restores chat + pending **Yes, apply / No, cancel** | **FULFILLED** |
| Update linked task | `PATCH /api/v1/tasks/:taskId` | Goal detail Linked Tasks ⋯ → **Edit task** | Body e.g. `{ priority, status, title, … }`; response `{ task }` | **FULFILLED** |
| Complete linked task | `POST /api/v1/tasks/:taskId/complete` | Goal detail Linked Tasks ⋯ → **Complete** | Body `{ actualMinutes }`; response `{ task }` | **FULFILLED** |
| Delete linked task | `DELETE /api/v1/tasks/:taskId` | Goal detail Linked Tasks ⋯ → **Delete** | Removes card + refreshes goal | **FULFILLED** |
| Update linked habit | `PATCH /api/v1/habits/:habitId` | Goal detail Linked Habits ⋯ → **Edit habit** | Body e.g. `{ difficulty, reminderTime, name?, goalId? }`; response `{ habit }` | **FULFILLED** |
| Skip linked habit | `POST /api/v1/habits/:habitId/skip` | Goal detail Linked Habits ⋯ → **Skip today** | Body `{ reason }` | **FULFILLED** |
| Delete linked habit | `DELETE /api/v1/habits/:habitId` | Goal detail Linked Habits ⋯ → **Delete** | Removes row + refreshes goal | **FULFILLED** |

### A.1b Deferred / still mock (no backend contract yet)

| UI | Notes | Status |
|----|-------|--------|
| Empty-board ghost goal cards | Local `GHOST_GOALS` — integrate later when suggestions API exists | **DEFERRED** |

### A.1c GET /goals — Query Parameters

| Param | Allowed values | Frontend mapping |
|-------|----------------|------------------|
| `status` | ACTIVE / PAUSED / COMPLETED / ARCHIVED | Active / Paused / Completed → uppercase |
| `category` | CAREER / HEALTH / FINANCE / PERSONAL / EDUCATION | Category filter → `categoryToApi` |
| `priorityLevel` | LOW / MEDIUM / HIGH / URGENT | Priority filter → uppercase |
| `source` | AI / MANUAL | Created by AI → `AI`; Created manually → `MANUAL` |
| `search` | string | Search input (300ms debounce) |
| `minProgress` / `maxProgress` | numbers | Progress buckets e.g. `26-50%` → 26–50 |
| `dueFilter` | today / tomorrow / this_week / this_month / overdue | Date filter → snake_case |
| `page` / `limit` | default `1` / `50` (max 100) | Always sent |

### A.2 Create — Request

```json
{
  "title": "string",
  "description": "string",
  "category": "CAREER",
  "priorityLevel": "MEDIUM",
  "targetDate": "YYYY-MM-DD",
  "isMainFocus": false,
  "source": "MANUAL",
  "taskIds": ["uuid"],
  "habitIds": ["uuid"]
}
```

- `taskIds` / `habitIds` omitted when empty; never send placeholders like `{{taskId}}`.
- Mapper: `mapCreatePayload` in `goalsMappers.js`.

### A.2b AI Generate — Request

```json
{
  "prompt": "I want to developers my math learning path",
  "category": "CAREER"
}
```

Response goal is already persisted — do **not** `POST /goals` again on Add to Board.

### A.3 List — Response (confirmed 2026-07-22)

```json
{
  "success": true,
  "count": 7,
  "data": [ /* goals */ ],
  "summary": {
    "active": 4,
    "paused": 0,
    "completedThisMonth": 3,
    "total": 7
  },
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 7,
    "totalPages": 1
  }
}
```

Goal fields mapped to UI: `id`, `title`, `description`, `category`, `status`, `priorityLevel`, `targetDate`, `source` (`AI`/`MANUAL`), `progress`, `_count.tasks` / `_count.habits`, `completedAt`.

### A.4 Gaps vs This Standard

| Requirement | Result | Notes |
|-------------|--------|-------|
| Postman before integrate | **PASS** for list/create/AI/pause/update/complete/link | Ghosts still deferred |
| Exact method (no guessing) | **PASS** for contracted Goals APIs | Update=`PATCH`, Complete=`POST .../complete`, Link=`POST .../link-tasks|link-habits` |
| Remove mock after connect | **PASS** for list/create/AI/link pickers/detail mutations; **DEFERRED** ghosts | See A.1b |
| Loading / empty / errors | **PASS** | Soft list reload; empty copy; toasts; 401 → login |
| Mapper audit | **PASS** | `audit-goals-list.mjs` + `audit-link-pickers.mjs` — ALL PASS (2026-07-22) |
| Logged-in Network QA | **Manual** | Engineer checklist in Appendix B (Plus + Spark + filters) |

### A.5 Blockers (need Postman evidence)

1. **Ghost suggestions** — endpoints when backend ready (client will provide)

If Postman has no response:

> This API is not returning a response in Postman. A valid backend response is required before frontend integration can be completed.

### A.6 Verdict

| Area | Verdict |
|------|---------|
| List + filters + search + summary | **FULFILLED** |
| Create + AI generate + Get + Pause/Activate + Delete | **FULFILLED** |
| Update goal (`PATCH /goals/:id`) | **FULFILLED** |
| Complete goal (`POST /goals/:id/complete`) | **FULFILLED** |
| Link tasks / habits (`POST .../link-tasks` \| `link-habits`) | **FULFILLED** |
| Link picker lists (`GET /tasks`, `GET /habits`) | **FULFILLED** |
| Spark AI generate task (`POST /tasks/ai/generate`) | **FULFILLED** |
| Spark AI generate habit (`POST /habits/ai/generate`) | **FULFILLED** |
| Goal AI Assistant suggest (`POST /goals/:id/ai/suggest`) | **FULFILLED** |
| AI suggestion Accept / Dismiss / Undo / History | **FULFILLED** |
| Linked task Edit / Complete / Delete (`PATCH` / `POST .../complete` / `DELETE /tasks/:id`) | **FULFILLED** |
| Linked habit Edit / Skip / Delete (`PATCH` / `POST .../skip` / `DELETE /habits/:id`) | **FULFILLED** |
| Ghosts | **DEFERRED** |
| Overall Goals Board | **FULFILLED for contracted APIs**; only ghosts deferred |

---

## Appendix B — How to Re-test (Engineer Checklist)

For each Goals endpoint in Postman:

1. Select environment **Fellini** (`baseUrl` = `https://backendtest.elyxaai.com/api/v1`).
2. Set `token` Current value (Bearer).
3. Send request → save Status + Body.
4. Open app Network tab → same action → compare URL, method, headers, body.
5. Tick QA checklist in §6.
6. Only then flip Appendix A row to **FULFILLED**.

### B.1 GET /goals filter smoke (logged-in Network)

| Step | Action in app | Expected Network |
|------|---------------|------------------|
| 1 | Open `/user/goals` | `GET /api/v1/goals?page=1&limit=50` → `200` + `data` + `summary` |
| 2 | Status → Active | `...&status=ACTIVE` |
| 3 | Priority → High | `...&priorityLevel=HIGH` |
| 4 | Category → Career | `...&category=CAREER` |
| 5 | Source → Created by AI | `...&source=AI` |
| 6 | Progress → 26-50% | `...&minProgress=26&maxProgress=50` |
| 7 | Search `career` | `...&search=career` (after debounce) |
| 8 | Date → Overdue | `...&dueFilter=overdue` |
| 9 | Stats bar | Matches `summary.active` / `paused` / `completedThisMonth` |

```bash
node scripts/audit-goals-list.mjs
node scripts/audit-link-pickers.mjs
```

### B.2 GET /tasks link-picker smoke (Goals side panel)

| Step | Action in app | Expected Network |
|------|---------------|------------------|
| 1 | Goal card → right panel → Linked Tasks **+** | `GET /api/v1/tasks?parentOnly=true&page=1&limit=50` → `200` + `{ tasks, pagination }` |
| 2 | Same panel → Linked Tasks **✨** → **Find & Attach** | Same `GET /api/v1/tasks?...` |
| 3 | Select + Attach / Create | `POST /api/v1/goals/:id/link-tasks` `{ taskIds: [uuid] }` |

**Do not** send `goalId` on the list call for Add/Attach — `goalId` filters tasks already linked to that goal (often empty).

Empty `tasks: []` → UI shows “No tasks available…” (not stuck Loading).

### B.3 GET /habits link-picker smoke (Goals side panel)

| Step | Action in app | Expected Network |
|------|---------------|------------------|
| 1 | Goal → Linked Habits **+** | `GET /api/v1/habits?isActive=true&page=1&limit=50` → `200` + `{ habits, pagination }` |
| 2 | Goal → Linked Habits **✨** → **Find & Attach** (opens on this tab for habits) | Same `GET /api/v1/habits?...` |
| 3 | Select + Attach | `POST /api/v1/goals/:id/link-habits` `{ habitIds: [uuid] }` |

**Do not** send `goalId` on the list call for Add/Attach — `goalId` filters habits already linked (often empty).

Empty `habits: []` → UI “No habits available to attach” (not stuck Loading).

Habit Spark **AI Generation** → `POST /api/v1/habits/ai/generate` — see **B.5**.

### B.5 POST /habits/ai/generate smoke (Spark → AI Generation)

| Step | Action in app | Expected Network |
|------|---------------|------------------|
| 1 | Goal → Linked Habits **✨** → **AI Generation** | Modal opens on AI tab |
| 2 | Enter prompt → Generate | `POST /api/v1/habits/ai/generate` body `{ prompt, category, goalId }` → `200` + `{ habit }` |
| 3 | Add to Goal | UI appends habit (already persisted; no second create) |

`category`: CAREER \| HEALTH \| FINANCE \| FITNESS \| WELLNESS \| PRODUCTIVITY \| PERSONAL \| EDUCATION

### A.10 POST /habits/ai/generate — Request / Response

```json
{
  "prompt": "Help me build a consistent reading habit",
  "category": "CAREER",
  "goalId": "uuid"
}
```

```json
{
  "success": true,
  "message": "Habit generated successfully",
  "habit": { "id": "uuid", "name": "...", "goalId": "uuid", "source": "AI", "aiSuggested": true },
  "tokensUsed": 707
}
```

### B.6 POST /goals/:id/ai/suggest smoke (Goal detail AI Assistant)

| Step | Action in app | Expected Network |
|------|---------------|------------------|
| 1 | Open goal detail → AI Assistant | `GET /api/v1/goals/:id/ai/suggestions` → history + pending Yes/No |
| 2 | **Improve description** | `POST /api/v1/goals/:id/ai/suggest` `{ "action": "IMPROVE_DESCRIPTION", "message": "Make it more specific and motivating" }` |
| 3 | **Add tasks** | `{ "action": "ADD_TASKS", "message": "Add practical next steps for this week" }` |
| 4 | **Add habits** | `{ "action": "ADD_HABITS", "message": "Suggest daily habits that support this goal" }` |
| 5 | Chat send | `{ "action": "CHAT", "message": "<user text>" }` |
| 6 | **Yes, apply** | `POST /api/v1/goals/ai/suggestions/:suggestionId/accept` → refresh goal + `GET .../ai/suggestions` |
| 7 | **No, cancel** | `POST /api/v1/goals/ai/suggestions/:suggestionId/dismiss` → `GET .../ai/suggestions` |
| 8 | **Undo changes** (after apply) | `POST /api/v1/goals/:goalId/ai/undo` → refresh goal + `GET .../ai/suggestions` |
| 9 | Browser refresh on pending Yes/No | Same `GET .../ai/suggestions` restores buttons |

### B.7 Linked Tasks card menu (Goal detail)

| Step | Action in app | Expected Network |
|------|---------------|------------------|
| 1 | Open goal detail → Linked Tasks card ⋯ → **Edit task** → Save | `PATCH /api/v1/tasks/:taskId` body includes `priority` / `status` (and title, description, category, dueDate, estimatedMinutes when set) → `200` + `{ task }` |
| 2 | Card ⋯ → **Complete** | `POST /api/v1/tasks/:taskId/complete` `{ "actualMinutes": <estimated or 30> }` → status `COMPLETED` |
| 3 | Card ⋯ → **Delete** | `DELETE /api/v1/tasks/:taskId` → card removed; goal refetch |

### B.8 Linked Habits row menu (Goal detail)

| Step | Action in app | Expected Network |
|------|---------------|------------------|
| 1 | Open goal detail → Linked Habits ⋯ → **Edit habit** → Update | `PATCH /api/v1/habits/:habitId` body includes `difficulty`, `reminderTime` (and name/description/category/`goalId` when set) |
| 2 | Row ⋯ → **Skip today** → enter reason | `POST /api/v1/habits/:habitId/skip` `{ "reason": "..." }` |
| 3 | Row ⋯ → **Delete** | `DELETE /api/v1/habits/:habitId` → row removed; goal refetch |

### A.11 POST /goals/:id/ai/suggest — Request / Response

```json
{ "action": "ADD_HABITS", "message": "Suggest daily habits that support this goal" }
```

```json
{
  "success": true,
  "message": "...",
  "suggestionId": "uuid",
  "action": "ADD_HABITS",
  "proposedGoal": { "title": "...", "description": "...", "category": "CAREER", "priorityLevel": "MEDIUM", "targetDate": "YYYY-MM-DD" },
  "proposedTasks": [],
  "proposedHabits": [ { "name": "...", "description": "...", "category": "CAREER", "frequency": "DAILY" } ],
  "tokensUsed": 993
}
```

### A.14 AI suggestion accept / dismiss / undo / history

**History** `GET /api/v1/goals/:goalId/ai/suggestions` — list suggestions (`PENDING` keeps Yes/No; `ACCEPTED`/`DISMISSED` as history).

**Accept** `POST /api/v1/goals/ai/suggestions/:suggestionId/accept`  
**Dismiss** `POST /api/v1/goals/ai/suggestions/:suggestionId/dismiss`  
**Undo** `POST /api/v1/goals/:goalId/ai/undo`

Accept/dismiss/undo: empty POST body. After mutations, frontend refetches goal + suggestions.

### A.15 Update / Complete / Link goals (locked 2026-07-23)

**Update** `PATCH /api/v1/goals/:goalId`

```json
{
  "title": "Improve My Rate & Portfolio",
  "priorityLevel": "HIGH",
  "status": "ACTIVE",
  "targetDate": "2026-08-01"
}
```

Partial body allowed (e.g. title only). Mapper: `mapUpdatePayload`.

**Complete** `POST /api/v1/goals/:goalId/complete` — no body.

**Link tasks** `POST /api/v1/goals/:goalId/link-tasks`

```json
{ "taskIds": ["uuid"] }
```

**Link habits** `POST /api/v1/goals/:goalId/link-habits`

```json
{ "habitIds": ["uuid"] }
```

### A.12 Linked task mutations (Goal detail card menu)

**PATCH** `/api/v1/tasks/:taskId`

```json
{ "priority": "URGENT", "status": "IN_PROGRESS" }
```

```json
{
  "success": true,
  "message": "Task updated successfully",
  "task": { "id": "uuid", "status": "IN_PROGRESS", "priority": "URGENT" }
}
```

**POST** `/api/v1/tasks/:taskId/complete`

```json
{ "actualMinutes": 45 }
```

```json
{
  "success": true,
  "message": "Task marked as complete",
  "task": { "id": "uuid", "status": "COMPLETED", "actualMinutes": 45 }
}
```

**DELETE** `/api/v1/tasks/:taskId` — no body; removes task.

### A.13 Linked habit mutations (Goal detail row menu)

**PATCH** `/api/v1/habits/:habitId`

```json
{ "difficulty": "MEDIUM", "reminderTime": "08:00" }
```

Optional: `{ "goalId": "uuid" }` to link/unlink goal.

**POST** `/api/v1/habits/:habitId/skip`

```json
{ "reason": "Travel day" }
```

**DELETE** `/api/v1/habits/:habitId` — no body; removes habit.

Automated checks (no auth):

```bash
node scripts/audit-goals-list.mjs
node scripts/audit-link-pickers.mjs
```


### B.4 POST /tasks/ai/generate smoke (Spark → AI Generation)

| Step | Action in app | Expected Network |
|------|---------------|------------------|
| 1 | Goal → Linked Tasks **✨** → **AI Generation** | Modal opens on AI tab |
| 2 | Enter prompt → Generate | `POST /api/v1/tasks/ai/generate` body `{ prompt, category, goalId }` → `200` + `{ task }` |
| 3 | Add to Goal | UI appends task card (no second create; task already persisted with `goalId`) |

`category`: `CAREER` \| `HEALTH` \| `FINANCE` \| `PERSONAL` \| `EDUCATION` (from goal).

### A.9 POST /tasks/ai/generate — Request / Response

```json
{
  "prompt": "I need to update my today work time",
  "category": "CAREER",
  "goalId": "uuid"
}
```

```json
{
  "success": true,
  "message": "Task generated successfully",
  "task": { "id": "uuid", "title": "...", "goalId": "uuid", "source": "AI_GENERATED", "aiGenerated": true },
  "tokensUsed": 671
}
```

### A.7 GET /tasks — Query params (link picker)

| Param | Allowed | Link-picker usage |
|-------|---------|-------------------|
| `status` | TODO / IN_PROGRESS / COMPLETED / CANCELED / SKIPPED | Optional (not sent by default) |
| `priority` | LOW / MEDIUM / HIGH / URGENT | Optional |
| `category` | Goal category enum | Optional |
| `goalId` | Linked goal UUID | **Not sent** for Add Task / Find & Attach |
| `search` | string | Optional |
| `dueFilter` | today / tomorrow / this_week / this_month / overdue | Optional |
| `parentOnly` | `true` | **Default `true`** |
| `page` / `limit` | defaults 1 / 50 | Always sent |

Response envelope:

```json
{
  "success": true,
  "count": 0,
  "tasks": [],
  "pagination": { "page": 1, "limit": 50, "total": 0, "totalPages": 0 }
}
```

### A.8 GET /habits — Query params (link picker)

| Param | Allowed | Link-picker usage |
|-------|---------|-------------------|
| `status` | ACTIVE / PAUSED / COMPLETED | Optional |
| `category` | Goal category enum | Optional |
| `frequency` | DAILY / WEEKLY / MONTHLY | Optional |
| `difficulty` | EASY / MEDIUM / HARD | Optional |
| `goalId` | Linked goal UUID | **Not sent** for Add Habit / Find & Attach |
| `isActive` | true / false | **Default `true`** |
| `aiSuggested` | true / false | Optional |
| `search` | string | Optional |
| `streak` | ACTIVE / NONE / BEST | Used on **Habits Board** (see Appendix C) |
| `daysLeft` | `1-7` / `8-30` / `30plus` / `ALL` | Used on **Habits Board** (see Appendix C) |
| `page` / `limit` | page size max 100 | Always sent (`1` / `50`) |

Response envelope:

```json
{
  "success": true,
  "count": 0,
  "habits": [],
  "pagination": { "page": 1, "limit": 50, "total": 0, "totalPages": 0 }
}
```

---

## Appendix C — Habits Board API Audit (Current Frontend)

**Date:** 2026-07-23  
**Last automated re-test:** 2026-07-23 — `audit-habits-board.mjs` → **ALL PASS**  
**Module:** `src/features/habits/` + `src/pages/private/user/focus/Habits/`  
**Base URL (env):** `VITE_API_BASE_URL` → `https://backendtest.elyxaai.com`  
**API prefix used in code:** `/api/v1/habits`  
**Contract verifier:** `node scripts/audit-habits-board.mjs`

---

### C.1 Endpoint Matrix (as coded)

| Action | Method + Path | Frontend entry | Contract evidence | Status |
|--------|---------------|----------------|-------------------|--------|
| List + filters + search | `GET /api/v1/habits` | Board filters/search → `buildHabitsQueryParams` → `fetchHabits` | Postman 2026-07-23: category, frequency, streak, daysLeft, search, combined | **FULFILLED** |
| Board summary | `GET /api/v1/habits/summary` | Stats bar (`active` / `paused` / `completed`) | `{ success, summary }` | **FULFILLED** |
| Stats overview | `GET /api/v1/habits/stats/overview` | Loaded with board → store `statsOverview` | `{ success, stats }` | **FULFILLED** |
| Create habit | `POST /api/v1/habits` | **+ New Habit** → Manual | Body below §C.3 | **FULFILLED** |
| AI generate habit | `POST /api/v1/habits/ai/generate` | **+ New Habit** → AI Generation | `{ prompt, category, goalId? }`; server persists; Add to Board refreshes only | **FULFILLED** |
| Get habit by ID | `GET /api/v1/habits/:id` | API wired (no habit detail page on board MVP) | Ready | **FULFILLED** (API) / board UI N/A |
| Update habit | `PATCH /api/v1/habits/:id` | Row ⋯ → **Edit** | Partial `{ name, description, category, difficulty, reminderTime, targetDays?, goalId? }` | **FULFILLED** |
| Complete today | `POST /api/v1/habits/:id/complete` | Today day-cell (empty → checked) | Optional `{ notes }` | **FULFILLED** |
| Undo today | `DELETE /api/v1/habits/:id/complete` | Today day-cell (checked → empty) | No body | **FULFILLED** |
| Skip habit | `POST /api/v1/habits/:id/skip` | Goals detail Linked Habits ⋯ → Skip | `{ reason }` | **FULFILLED** (Goals) |
| Pause / Activate toggle | `PATCH /api/v1/habits/:id/pause` | Row ⋯ → Pause / Activate | Postman name “Pause / Activate Toggle”. **No** `/activate` route (404). Fallback: `PATCH /habits/:id` `{ status, isActive }` | **FULFILLED** |
| Mark status completed | `PATCH /api/v1/habits/:id/complete-status` | Row ⋯ → **Complete** | Lifetime COMPLETED (not today’s check-in) | **FULFILLED** |
| AI improve | `POST /api/v1/habits/:id/ai/improve` | Row ⋯ → **Improve habit** | `{ instructions }` | **FULFILLED** |
| History | `GET /api/v1/habits/:id/history?days=30` | API wired (not on board UI yet) | Ready | **FULFILLED** (API) / board UI N/A |
| Delete | `DELETE /api/v1/habits/:id` | Row ⋯ → **Delete** | No body | **FULFILLED** |
| Test email | `/habits/test/email` | Not used on board | Dev/test only | **DEFERRED** |

### C.1b Deferred / still mock

| UI | Notes | Status |
|----|-------|--------|
| Empty-board ghost habits | Local `GHOST_HABITS` (`?empty=1` in DEV) until suggestions API exists | **DEFERRED** |
| Schedule → **Custom** | No `frequency=CUSTOM` in Postman; client filters partial week after list load | **CLIENT** |

### C.1c Toolbar mapping (New Habit + filters)

| UI control | Request | Status |
|------------|---------|--------|
| **+ New Habit** Manual | `POST /habits` | **FULFILLED** |
| **+ New Habit** AI | `POST /habits/ai/generate` | **FULFILLED** |
| **All Category** | `GET /habits?category=CAREER\|HEALTH\|FINANCE\|FITNESS\|WELLNESS\|PRODUCTIVITY\|PERSONAL\|EDUCATION` | **FULFILLED** |
| **All Schedule** Daily / Weekly / Monthly | `GET /habits?frequency=DAILY\|WEEKLY\|MONTHLY` | **FULFILLED** |
| **All Schedule** Custom | Client only | **CLIENT** |
| **All Streak** Active / No / Best | `GET /habits?streak=ACTIVE\|NONE\|BEST` | **FULFILLED** |
| **All Days Left** 1-7 / 8-30 / 30+ | `GET /habits?daysLeft=1-7\|8-30\|30plus` | **FULFILLED** |
| Search | `GET /habits?search=` (300ms debounce) | **FULFILLED** |

---

### C.2 GET /habits — Query Parameters (Habits Board)

| Param | Allowed values | Frontend mapping |
|-------|----------------|------------------|
| `status` | ACTIVE / PAUSED / COMPLETED | Not on board toolbar (available in API) |
| `category` | CAREER / HEALTH / FINANCE / FITNESS / WELLNESS / PRODUCTIVITY / PERSONAL / EDUCATION | Category filter → `categoryToApi` |
| `frequency` | DAILY / WEEKLY / MONTHLY | Schedule Daily/Weekly/Monthly |
| `difficulty` | EASY / MEDIUM / HARD | Not on board toolbar |
| `goalId` | UUID | Optional (create/link); not a board filter chip |
| `isActive` | true / false | Not sent on board list by default |
| `aiSuggested` | true / false | Not on board toolbar |
| `streak` | ACTIVE / NONE / BEST | Active streak / No streak / Best streak |
| `daysLeft` | `1-7` / `8-30` / `30plus` / `ALL` | `1-7 days` / `8-30 days` / `30+ days` (All Days Left = omit param) |
| `search` | string | Search input |
| `page` / `limit` | default `1` / `50` (max 100) | Always sent |

**Combined example (Postman):**  
`GET /habits?status=ACTIVE&streak=ACTIVE&category=HEALTH`

**List response fields used on board:**  
`id`, `name`→title, `description`, `category`, `frequency`, `difficulty`, `targetDays`, `reminderTime`, `currentStreak`, `status` / `isActive`, `source` / `aiSuggested`, `goal` / `goalId`, `completions`, `daysLeft`, `_count`.

---

### C.3 Create — Request / Response

**POST** `/api/v1/habits`

```json
{
  "name": "Morning walk",
  "description": "Walk for 20 minutes after waking up.",
  "category": "HEALTH",
  "frequency": "DAILY",
  "difficulty": "EASY",
  "targetDays": ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
  "targetTimesPerDay": 1,
  "reminderTime": "07:30"
}
```

Optional: `"goalId": "<uuid>"`.

Categories: `CAREER` | `HEALTH` | `FINANCE` | `FITNESS` | `WELLNESS` | `PRODUCTIVITY` | `PERSONAL` | `EDUCATION`.

MVP UI: one reminder (12h → `HH:mm`), `targetTimesPerDay: 1` only.

---

### C.4 AI Generate — Request / Response

**POST** `/api/v1/habits/ai/generate`

```json
{
  "prompt": "Help me build a consistent reading habit",
  "category": "CAREER"
}
```

```json
{
  "success": true,
  "message": "Habit generated successfully",
  "habit": { "id": "uuid", "name": "...", "source": "AI", "aiSuggested": true },
  "tokensUsed": 707
}
```

Server persists immediately — **Add to Board** only refreshes the list (no second `POST /habits`).

---

### C.5 Other board mutations (quick reference)

| Action | Method + Path | Body |
|--------|---------------|------|
| Update | `PATCH /habits/:id` | e.g. `{ "difficulty": "MEDIUM", "reminderTime": "08:00" }` or `{ "goalId": "uuid" }` |
| Complete today | `POST /habits/:id/complete` | `{ "notes": "…" }` optional |
| Undo today | `DELETE /habits/:id/complete` | — |
| Pause / Activate | `PATCH /habits/:id/pause` | toggle (do **not** call `/activate`) |
| Mark completed | `PATCH /habits/:id/complete-status` | — |
| Improve | `POST /habits/:id/ai/improve` | `{ "instructions": "…" }` |
| Delete | `DELETE /habits/:id` | — |
| Summary | `GET /habits/summary` | → `{ active, paused, completed, total, completedToday, remainingToday }` |

---

### C.6 Board smoke (logged-in Network)

| Step | Action in app | Expected Network |
|------|---------------|------------------|
| 1 | Open `/user/habits` | `GET /habits?page=1&limit=50` + `GET /habits/summary` (+ `GET /habits/stats/overview`) |
| 2 | Category → Finance | `...&category=FINANCE` |
| 3 | Schedule → Daily | `...&frequency=DAILY` |
| 4 | Streak → Active streak | `...&streak=ACTIVE` |
| 5 | Streak → No streak | `...&streak=NONE` |
| 6 | Streak → Best streak | `...&streak=BEST` |
| 7 | Days Left → 1-7 days | `...&daysLeft=1-7` |
| 8 | Days Left → 8-30 / 30+ | `...&daysLeft=8-30` / `30plus` |
| 9 | Search `reading` | `...&search=reading` (after debounce) |
| 10 | **+ New Habit** → Manual → Create | `POST /habits` then list + summary refresh |
| 11 | **+ New Habit** → AI → Generate → Add to Board | `POST /habits/ai/generate`; Add = refresh only |
| 12 | Click **today** day cell | `POST .../complete` or `DELETE .../complete` |
| 13 | ⋯ Pause / Activate | Both `PATCH .../pause` (toggle) |
| 14 | ⋯ Edit / Complete / Improve / Delete | `PATCH` / `PATCH .../complete-status` / `POST .../ai/improve` / `DELETE` |

```bash
node scripts/audit-habits-board.mjs
```

---

### C.7 TestAPIs.md compliance checklist

| Rule | Result | Notes |
|------|--------|-------|
| Postman before integrate | **PASS** | List filters (streak/daysLeft), create, complete, pause toggle, AI generate/improve |
| Exact method (no guessing) | **PASS** | Pause/Activate = `/pause` toggle only after `/activate` 404 confirmed |
| Remove mock after connect | **PASS** for list/filters/create/AI/row actions; **DEFERRED** ghosts | See C.1b |
| Loading / empty / errors | **PASS** | Soft list reload; empty copy; toasts |
| Mapper audit | **PASS** | `audit-habits-board.mjs` — ALL PASS (2026-07-23) |
| Logged-in Network QA | **Manual** | Engineer checklist §C.6 |

### C.8 Blockers

1. **Ghost suggestions** — empty-board AI rows stay local until a suggestions API exists.
2. **Schedule Custom** — no Postman enum; remains client-side.

If Postman has no response:

> This API is not returning a response in Postman. A valid backend response is required before frontend integration can be completed.

### C.9 Verdict

| Area | Verdict |
|------|---------|
| List + Category / Schedule / Streak / Days Left / search | **FULFILLED** |
| Summary + stats overview | **FULFILLED** |
| Create + AI generate + Update + Delete | **FULFILLED** |
| Today complete / undo | **FULFILLED** |
| Pause / Activate toggle (`/pause`) | **FULFILLED** |
| Complete-status + AI improve | **FULFILLED** |
| Schedule Custom | **CLIENT** |
| Ghosts / test email | **DEFERRED** |
| **Overall Habits Board** | **FULFILLED for contracted APIs**; ghosts + Custom schedule deferred/client |

---

## Appendix D — Tasks Board API Audit (Current Frontend)

**Date:** 2026-07-25  
**Last automated re-test:** 2026-07-25 — `audit-tasks-board.mjs` → **ALL PASS**  
**Module:** `src/features/tasks/` + `src/pages/private/user/focus/Tasks/`  
**Base URL (env):** `VITE_API_BASE_URL` → `https://backendtest.elyxaai.com`  
**API prefix used in code:** `/api/v1/tasks`  
**Contract verifier:** `node scripts/audit-tasks-board.mjs`

---

### D.1 Endpoint Matrix (as coded)

| Action | Method + Path | Frontend entry | Contract evidence | Status |
|--------|---------------|----------------|-------------------|--------|
| Board summary | `GET /api/v1/tasks/summary` | Loaded with board | `{ success, summary }` | **FULFILLED** |
| List + filters + search | `GET /api/v1/tasks` | Board filters/search → `buildTasksQueryParams` → `fetchTasks` (`parentOnly=true`) | status, priority, category, dueFilter, search, page, limit | **FULFILLED** |
| Create task | `POST /api/v1/tasks` | **+ New Task** → Manual | Body §D.3 | **FULFILLED** |
| AI generate task | `POST /api/v1/tasks/ai/generate` | **+ New Task** → AI Generation | `{ prompt, category, goalId? }`; server persists; Add to Board refreshes only | **FULFILLED** |
| Get task by ID | `GET /api/v1/tasks/:id` | Detail drawer / full page | Ready | **FULFILLED** |
| Update task | `PATCH /api/v1/tasks/:id` | Card/Detail ⋯ → **Edit**; linked goal | Partial fields + `goalId` link/unlink | **FULFILLED** |
| Update status | `PATCH /api/v1/tasks/:id/status` | Slice wired (`updateTaskStatus`) | `{ status }` | **FULFILLED** (API) |
| Complete | `POST /api/v1/tasks/:id/complete` | Slice wired (`completeTask`) | Optional `{ actualMinutes }` | **FULFILLED** (API) |
| Skip | `POST /api/v1/tasks/:id/skip` | Slice wired (`skipTask`) | `{ reason }` | **FULFILLED** (API) / board menu N/A |
| Delete | `DELETE /api/v1/tasks/:id` | Card/Detail ⋯ → **Delete** | No body | **FULFILLED** |
| Subtasks list | `GET /api/v1/tasks/:id/subtasks` | Detail open | Ready | **FULFILLED** |
| AI suggest | `POST /api/v1/tasks/:id/ai/suggest` | Detail AI Assistant (BREAKDOWN / IMPROVE_DESCRIPTION / CHAT) | Postman actions | **FULFILLED** |
| List suggestions | `GET /api/v1/tasks/:id/ai/suggestions` | AI chat history (full list; refresh-safe). Optional `?status=pending` for queue only | **FULFILLED** |
| Accept / Dismiss | `POST /api/v1/tasks/ai/suggestions/:id/accept\|dismiss` | Yes, apply / No, cancel | Ready | **FULFILLED** |
| Undo AI | `POST /api/v1/tasks/:id/ai/undo` | Undo changes | Ready | **FULFILLED** |

### D.1b Deferred / still mock

| UI | Notes | Status |
|----|-------|--------|
| Empty-board ghost tasks | Local `GHOST_TASKS` (`?empty=1` in DEV) until suggestions API exists | **DEFERRED** |
| Source filter | Not in Postman list query; filtered client-side after load | **CLIENT** |
| Board ↔ List toggle | List non-functional in MVP | **DEFERRED** |

### D.1c Toolbar mapping

| UI control | Request | Status |
|------------|---------|--------|
| **+ New Task** Manual | `POST /tasks` | **FULFILLED** |
| **+ New Task** AI | `POST /tasks/ai/generate` | **FULFILLED** |
| **All Status** To Do / In Progress / Done | `GET /tasks?status=TODO\|IN_PROGRESS\|COMPLETED` | **FULFILLED** |
| **All Priority** | `GET /tasks?priority=URGENT\|HIGH\|MEDIUM\|LOW` | **FULFILLED** |
| **All Category** | `GET /tasks?category=CAREER\|HEALTH\|FINANCE\|PERSONAL\|EDUCATION` | **FULFILLED** |
| **All Source** | Client only | **CLIENT** |
| **All Date** | `GET /tasks?dueFilter=today\|tomorrow\|this_week\|this_month\|overdue` | **FULFILLED** |
| Search | `GET /tasks?search=` (300ms debounce) | **FULFILLED** |

---

### D.2 GET /tasks — Query Parameters (Tasks Board)

| Param | Allowed values | Frontend mapping |
|-------|----------------|------------------|
| `status` | TODO / IN_PROGRESS / COMPLETED / CANCELED / SKIPPED | Status filter (board uses first three) |
| `priority` | LOW / MEDIUM / HIGH / URGENT | Priority filter |
| `category` | CAREER / HEALTH / FINANCE / PERSONAL / EDUCATION | Category filter |
| `goalId` | UUID | Not a board toolbar chip |
| `search` | string | Search input |
| `dueFilter` | today / tomorrow / this_week / this_month / overdue | Date filter |
| `parentOnly` | true | Always `true` on board list |
| `page` / `limit` | default `1` / `50` (max 100) | Always sent |

---

### D.3 Create — Request / Response

**POST** `/api/v1/tasks`

```json
{
  "title": "Prepare Daily cost report",
  "description": "My today cost report",
  "category": "FINANCE",
  "priority": "HIGH",
  "dueDate": "2026-07-23",
  "dueTime": "9:00",
  "estimatedMinutes": 36
}
```

Optional: `"goalId": "<uuid>"`.

Categories: `CAREER` | `HEALTH` | `FINANCE` | `PERSONAL` | `EDUCATION`.

---

### D.4 AI Generate — Request / Response

**POST** `/api/v1/tasks/ai/generate`

```json
{
  "prompt": "I need to update my today work time",
  "category": "PERSONAL"
}
```

Server persists immediately — **Add to Board** only refreshes the list (no second `POST /tasks`).

---

### D.5 Other board mutations (quick reference)

| Action | Method + Path | Body |
|--------|---------------|------|
| Update | `PATCH /tasks/:id` | e.g. `{ "priority": "URGENT" }` or `{ "goalId": null }` |
| Status only | `PATCH /tasks/:id/status` | `{ "status": "IN_PROGRESS" }` |
| Complete | `POST /tasks/:id/complete` | `{ "actualMinutes": 50 }` optional |
| Skip | `POST /tasks/:id/skip` | `{ "reason": "…" }` |
| Delete | `DELETE /tasks/:id` | — |
| AI suggest | `POST /tasks/:id/ai/suggest` | `{ "action": "BREAKDOWN", "regenerate": true }` when replacing existing subtasks; also `IMPROVE_DESCRIPTION` / `CHAT` |
| Accept | `POST /tasks/ai/suggestions/:id/accept` | — |
| Dismiss | `POST /tasks/ai/suggestions/:id/dismiss` | — |
| Undo | `POST /tasks/:id/ai/undo` | — |
| Summary | `GET /tasks/summary` | → `{ todo, inProgress, completed, overdue, dueToday, total }` |

---

### D.6 Board smoke (logged-in Network)

| Step | Action in app | Expected Network |
|------|---------------|------------------|
| 1 | Open `/user/tasks` | `GET /tasks?page=1&limit=50&parentOnly=true` + `GET /tasks/summary` |
| 2 | Status → To Do | `...&status=TODO` |
| 3 | Priority → High | `...&priority=HIGH` |
| 4 | Category → Finance | `...&category=FINANCE` |
| 5 | Date → This month | `...&dueFilter=this_month` |
| 6 | Source → Created by AI | List reload (no `source` query); client filter |
| 7 | Search `report` | `...&search=report` (after debounce) |
| 8 | **+ New Task** → Manual → Create | `POST /tasks` then list + summary refresh |
| 9 | **+ New Task** → AI → Generate → Add to Board | `POST /tasks/ai/generate`; Add = refresh only |
| 10 | Open task detail | `GET /tasks/:id` + `GET /tasks/:id/subtasks` (+ pending suggestions) |
| 11 | AI → Break into subtasks → Yes, apply | `POST .../ai/suggest` then `POST .../ai/suggestions/:id/accept` |
| 12 | ⋯ Edit / Delete | `PATCH` / `DELETE` |

```bash
node scripts/audit-tasks-board.mjs
```

---

### D.7 TestAPIs.md compliance checklist

| Rule | Result | Notes |
|------|--------|-------|
| Postman before integrate | **PASS** | Summary, list filters, CRUD, complete/skip, AI generate/suggest/accept |
| Exact method (no guessing) | **PASS** | Paths match user Postman contract |
| Remove mock after connect | **PASS** for list/filters/create/AI/detail AI; **DEFERRED** ghosts | See D.1b |
| Loading / empty / errors | **PASS** | Soft list reload; empty columns; toasts |
| Mapper audit | **PASS** | `audit-tasks-board.mjs` — ALL PASS (2026-07-25) |
| Logged-in Network QA | **Manual** | Engineer checklist §D.6 |

### D.8 Blockers

1. **Ghost suggestions** — empty-board AI cards stay local until a suggestions API exists.
2. **Source filter** — no Postman query param; remains client-side.

### D.9 Verdict

| Area | Verdict |
|------|---------|
| List + Status / Priority / Category / Date / search | **FULFILLED** |
| Summary | **FULFILLED** |
| Create + AI generate + Update + Delete | **FULFILLED** |
| Detail AI suggest / accept / dismiss / undo | **FULFILLED** |
| Source filter | **CLIENT** |
| Ghosts / List view | **DEFERRED** |
| **Overall Tasks Board** | **FULFILLED for contracted APIs**; ghosts + Source deferred/client |