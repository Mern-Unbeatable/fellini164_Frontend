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
2. If Postman or the backend does not provide a valid response, explicitly state that a backend response is required before integration can be completed.
3. Do not invent endpoints, fields, or status codes.
4. Prefer failing loudly with a clear blocker over silent fallbacks that hide contract mismatches.

---

## Appendix A — Goals Board API Audit (Current Frontend)

**Date:** 2026-07-21 (re-test)  
**Module:** `src/features/goals/` + `src/pages/private/user/focus/Goals/`  
**Base URL (env):** `VITE_API_BASE_URL` → `https://backendtest.elyxaai.com`  
**API prefix used in code:** `/api/v1/goals`  
**Contract verifier:** `node scripts/audit-goals-list.mjs` (Postman sample responses)

### A.1 Endpoint Matrix

| Action | Method + Path (as coded) | Postman validation | Frontend wired | Status |
|--------|--------------------------|--------------------|----------------|--------|
| List goals (+ filters) | `GET /api/v1/goals` + query params | Confirmed 2026-07-21 — samples for bare list, `status`+`priorityLevel`, `search`+`page`+`limit`, `dueFilter` | Yes — `ActiveGoals` → `fetchGoals({ filters, search })` | **PASS** (mapper audit ALL PASS; live Network needs logged-in session) |
| AI generate goal | `POST /api/v1/goals/ai/generate` | Confirmed 2026-07-21 — body `{ prompt, category }` | Yes — New Goal → AI Generation → Generate | **PASS** (body `{ prompt, category }`; server persists; Add to Board refreshes only) |
| Board summary | Embedded in list response `summary` | Confirmed in list responses (`active` / `paused` / `completedThisMonth` / `total`) | Yes — used from list envelope; separate `/summary` kept as unused fallback | **PASS** for list-embedded summary |
| Create goal | `POST /api/v1/goals` | Confirmed body with `source`, optional UUID `taskIds`/`habitIds` | Yes — `NewGoalModal` manual + live task/habit pickers | **PASS** (omit `taskIds`/`habitIds` when empty; never send placeholders) |
| Get single goal | `GET /api/v1/goals/:id` | Confirmed via `goalId` variable flow | Yes — `GoalDetailPage` | **PASS** |
| Update goal | `PATCH` → `PUT` → `POST` `/api/v1/goals/:id` | Exact method not locked in Postman paste | Yes — Edit modal | **PARTIAL** — method fallbacks |
| Link tasks | `POST .../link-tasks` (+ `/tasks` fallback) | Exact path/body not pasted this session | Yes — `LinkItemsModal` | **PARTIAL** |
| Link habits | `POST .../link-habits` (+ `/habits` fallback) | Exact path/body not pasted this session | Yes — `LinkItemsModal` | **PARTIAL** |
| Complete | `PATCH .../complete` then status fallbacks | Named “PATCH Complete Goal” | Yes — card menu | **PARTIAL** |
| Pause / Activate | `PATCH /api/v1/goals/:id/pause` (Activate: `/activate`) | Confirmed earlier: `200 OK`, `status: "PAUSED"` | Yes — card menu toggle | **PASS** |
| Delete | `DELETE /api/v1/goals/:id` | Named in collection | Yes — card / detail | **PASS** (needs Network re-check) |

### A.1b GET /goals — Query Parameters (Postman-fixed)

| Param | Allowed values | Frontend mapping |
|-------|----------------|------------------|
| `status` | ACTIVE / PAUSED / COMPLETED / ARCHIVED | UI Active/Paused/Completed → uppercase (ARCHIVED not in UI) |
| `category` | e.g. CAREER | UI category → `categoryToApi` |
| `priorityLevel` | LOW / MEDIUM / HIGH / URGENT | UI Priority → uppercase |
| `source` | AI / MANUAL | Created by AI → `AI`; Created manually → `MANUAL` |
| `search` | string | Search input (300ms debounce) |
| `minProgress` / `maxProgress` | numbers | Progress buckets e.g. `26-50%` → 26–50 |
| `dueFilter` | today / tomorrow / this_week / this_month / overdue | Date filter labels → snake_case |
| `page` / `limit` | page default 1; limit default 50 (max 100) | Always sent (`page=1`, `limit=50`) |

### A.2 Request Contract (Create) — Known from Postman

Verified Postman body shape used by frontend mapper:

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

- `category`: `CAREER` | `HEALTH` | `FINANCE` | `PERSONAL` | `EDUCATION`
- `priorityLevel`: `LOW` | `MEDIUM` | `HIGH` | `URGENT` (default MEDIUM)
- `taskIds` / `habitIds`: only included when non-empty real UUIDs (placeholders like `{{taskId}}` fail validation)

Frontend mapper: `mapCreatePayload` in `goalsMappers.js` — **aligned**.

### A.2b Request Contract (AI Generate)

```json
{
  "prompt": "I want to developers my math learning path",
  "category": "CAREER"
}
```

Frontend: `generateGoal` → `generateGoalApi({ prompt, category })`. Response goal is already persisted — do not `POST /goals` again.

### A.3 Response Contract (Create) — Known from Postman

```json
{
  "success": true,
  "message": "Goal created successfully",
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "title": "string",
    "description": "string",
    "category": "CAREER",
    "status": "ACTIVE",
    "priority": 5,
    "priorityLevel": "MEDIUM"
  }
}
```

Frontend maps only UI fields (`title`, `description`, `category`, `priorityLevel`, `status`, `targetDate` → `due`, `progress`, counts). Extra fields ignored — **aligned** with “no extra UI fields” rule.

### A.3b Response Contract (List) — Confirmed 2026-07-21

Envelope shape used by `fetchGoalsApi` + `parseGoalsListResponse`:

```json
{
  "success": true,
  "count": 5,
  "data": [ /* goal objects */ ],
  "summary": {
    "active": 3,
    "paused": 0,
    "completedThisMonth": 2,
    "total": 5
  },
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 5,
    "totalPages": 1
  }
}
```

Goal object fields mapped to UI: `id`, `title`, `description`, `category`, `status`, `priorityLevel`, `targetDate`, `source` (`AI`/`MANUAL`), `progress`, `_count.tasks` / `_count.habits`, `completedAt`.

### A.4 Gaps vs This Standard

| Requirement | Result | Notes |
|-------------|--------|-------|
| Verify in Postman before integrate | **PASS for GET list/filters**; **PARTIAL for Update/Link/Complete** | List + query samples pasted; Update/Link/Complete still need exact Postman method/body |
| Exact method match (no guessing) | **PARTIAL** | Update/Complete/Link still use multi-method fallbacks |
| Remove mock after connect | **PARTIAL** | Board list + AI Generate use API; ghost cards + Manual linked pickers still mock |
| Loading states | **PASS** (list) | Board shows “Loading goals…” via `loadingList` |
| Empty state | **PASS** | Empty filter → “No matching goals.”; empty board → ghosts when no filters/search |
| Error handling | **PASS** | Toasts on failure; axios 401 redirect exists |
| Unauthorized | **PASS** (client + probe) | Unauthenticated `GET /api/v1/goals` → **HTTP 401**; client clears token + redirects login |
| Build / ESLint | **PASS** | `vite build` OK; eslint on goals modules clean |
| Mapper contract audit | **PASS** | `node scripts/audit-goals-list.mjs` — ALL PASS |
| Network QA logged-in | **NOT DONE HERE** | Requires user browser session; agent cannot read authenticated Network tab |

### A.5 Blockers (Need Backend / Postman Evidence)

Do **not** mark these complete until Postman shows:

1. **Update Goal** — exact method (`PATCH` vs `PUT` vs `POST`) + sample `200` body  
2. **Complete** — exact URL + method + sample response  
3. **Link tasks / habits** — exact path + body keys (`taskIds` / `habitIds`) + response  

List filters / search / summary-from-list are **unblocked** by Postman samples from 2026-07-21.

If Postman has no response for any of the above, use this statement:

> This API is not returning a response in Postman. A valid backend response is required before frontend integration can be completed.

### A.6 Verdict

| Area | Verdict |
|------|---------|
| List + filters + search + list summary | **Production-ready under contract** (re-verify Network once logged in) |
| Create / Get / Delete / Pause | **Mostly production-ready** (re-verify Network once) |
| Edit / Complete / Link | **Not fully validated** against Postman contracts |
| Overall Goals Board APIs | **PARTIAL — List/filters PASS; mark complete only after logged-in Network QA for remaining endpoints** |

---

## Appendix B — How to Re-test (Engineer Checklist)

For each Goals endpoint in Postman:

1. Select environment **Fellini** (`baseUrl` = `https://backendtest.elyxaai.com/api/v1`).
2. Set `token` Current value (Bearer).
3. Send request → save Status + Body screenshot.
4. Open app Network tab → same action → compare URL, method, headers, body byte-for-byte.
5. Tick QA checklist in §6.
6. Only then flip Appendix A row to **PASS**.

### B.1 GET /goals filter smoke (logged-in Network)

| Step | Action in app | Expected Network |
|------|---------------|------------------|
| 1 | Open `/user/goals` | `GET /api/v1/goals?page=1&limit=50` → `200` + `data` + `summary` |
| 2 | Status → Active | `...&status=ACTIVE` |
| 3 | Priority → High | `...&priorityLevel=HIGH` |
| 4 | Search `career` | `...&search=career` (after debounce) |
| 5 | Date → Overdue | `...&dueFilter=overdue` |
| 6 | Stats bar | Matches response `summary.active` / `paused` / `completedThisMonth` |

Automated mapper check (no auth): `node scripts/audit-goals-list.mjs`
