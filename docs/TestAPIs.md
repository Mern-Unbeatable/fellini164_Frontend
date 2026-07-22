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

## Appendix A — Goals Board API Audit (Current Frontend)

**Date:** 2026-07-22  
**Module:** `src/features/goals/` + `src/pages/private/user/focus/Goals/`  
**Base URL (env):** `VITE_API_BASE_URL` → `https://backendtest.elyxaai.com`  
**API prefix used in code:** `/api/v1/goals`  
**Contract verifier:** `node scripts/audit-goals-list.mjs`

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
| Update goal | `PATCH` → `PUT` → `POST` `/api/v1/goals/:id` | Edit Goal modal (board + detail) | Method not locked in Postman | **PARTIAL** |
| Complete goal | `PATCH/POST .../complete` (+ status fallbacks) | Card menu Complete | Exact contract not pasted | **PARTIAL** |
| Link tasks | `POST .../link-tasks` (+ `/tasks` fallback) | Plus / Find & Attach | Exact path not locked | **PARTIAL** |
| Link habits | `POST .../link-habits` (+ `/habits` fallback) | Plus / Find & Attach | Exact path not locked | **PARTIAL** |
| Tasks for link picker | `GET /api/v1/tasks` | New Goal linked fields, Link / Spark Find & Attach, goal ⋯ → Add Task | Live list; envelope `{ tasks, pagination }`; default `parentOnly=true&page=1&limit=50` (no `goalId` on attach — that filters already-linked) | **FULFILLED** |
| Habits for link picker | `GET /api/v1/habits` | New Goal linked fields, Link / Spark Find & Attach, goal ⋯ → Add Habit | Live list; envelope `{ habits, pagination }`; default `isActive=true&page=1&limit=50` (no `goalId` on attach) | **FULFILLED** |

### A.1b Deferred / still mock (no backend contract yet)

| UI | Notes | Status |
|----|-------|--------|
| Empty-board ghost goal cards | Local `GHOST_GOALS` — integrate later when suggestions API exists | **DEFERRED** |
| Spark ✨ → AI Generation tab (task/habit for a goal) | Local `mockGenerate` in `GoalSparkLinkModal` | **DEFERRED** |
| Spark ✨ → Find & Attach tab | Uses live `GET /tasks` / `GET /habits` | **FULFILLED** (attach path still **PARTIAL** until link API locked) |

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
| Postman before integrate | **PASS** for list/create/AI/pause; **PARTIAL** for update/link/complete | Exact method/body still needed for PARTIAL rows |
| Exact method (no guessing) | **PARTIAL** | Update / Complete / Link use fallbacks |
| Remove mock after connect | **PASS** for list/create/AI/link pickers; **DEFERRED** ghosts + Spark AI generate | See A.1b |
| Loading / empty / errors | **PASS** | Soft list reload; empty copy; toasts; 401 → login |
| Mapper audit | **PASS** | `node scripts/audit-goals-list.mjs` → ALL PASS |
| Logged-in Network QA | **Manual** | Engineer checklist in Appendix B |

### A.5 Blockers (need Postman evidence)

1. **Update Goal** — exact method + sample `200` body  
2. **Complete Goal** — exact URL + method + sample response  
3. **Link tasks / habits** — exact path + body (`taskIds` / `habitIds`) + response  
4. **Ghost suggestions / Spark task-habit AI** — endpoints when backend ready  

If Postman has no response:

> This API is not returning a response in Postman. A valid backend response is required before frontend integration can be completed.

### A.6 Verdict

| Area | Verdict |
|------|---------|
| List + filters + search + summary | **FULFILLED** |
| Create + AI generate + Get + Pause/Activate + Delete | **FULFILLED** |
| Link picker lists (`GET /tasks`, `GET /habits`) | **FULFILLED** |
| Update / Complete / Link mutations | **PARTIAL** (wired, contract not locked) |
| Ghosts + Spark AI Generation (task/habit) | **DEFERRED** |
| Overall Goals Board | **FULFILLED for contracted APIs**; PARTIAL/DEFERRED only where Postman/backend incomplete |

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

Automated mapper check (no auth): `node scripts/audit-goals-list.mjs`

### B.2 GET /tasks link-picker smoke (Goals → Add Task)

| Step | Action in app | Expected Network |
|------|---------------|------------------|
| 1 | Goal card ⋯ → **Add Task** (or Linked Tasks **+**) | `GET /api/v1/tasks?parentOnly=true&page=1&limit=50` → `200` + `{ tasks, pagination }` |
| 2 | Confirm select | `POST /api/v1/goals/:id/link-tasks` (or `/tasks` fallback) with `{ taskIds: [uuid] }` |

**Do not** send `goalId` on the list call for Add/Attach — `goalId` filters tasks already linked to that goal (often empty).

### B.3 GET /habits link-picker smoke (Goals → Add Habit)

| Step | Action in app | Expected Network |
|------|---------------|------------------|
| 1 | Goal card ⋯ → **Add Habit** (or Linked Habits **+**) | `GET /api/v1/habits?isActive=true&page=1&limit=50` → `200` + `{ habits, pagination }` |
| 2 | Confirm select | `POST /api/v1/goals/:id/link-habits` (or `/habits` fallback) with `{ habitIds: [uuid] }` |

**Do not** send `goalId` on the list call for Add/Attach — same reason as tasks.

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
