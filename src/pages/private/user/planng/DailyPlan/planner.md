# Planner Board — MVP, Rules, and Backend Integration Contract

Status: Frontend mock implementation complete; backend integration not started  
Primary route: `/user/daily-plan`  
Frontend module: `src/pages/private/user/planng/DailyPlan/`

This document is the canonical implementation contract for Planner Board. Backend, frontend, AI, QA, and design teams should use it before changing Planner behavior.

## 1. Product Goal

Planner Board organizes existing Tasks and Habits into a schedule. Planner AI may recommend schedule placement, but it does not own or edit Task or Habit content.

The Planner supports:

- Daily view — detailed schedule
- Weekly view — simplified week overview
- Monthly view — simplified month overview
- AI-generated schedule proposals
- Chat-led schedule adjustments
- Accept, Dismiss, and Undo
- Loading, preview, animation, and AI-adaptive states

## 2. Non-Negotiable MVP Boundary

### Planner AI may

- Reorder existing Tasks and Habits.
- Rebalance workload.
- Move existing items to another date or time slot.
- Optimize schedule timing.
- Reduce overload.
- Create focus spacing.
- Generate placements for existing Tasks and Habits.

### Planner AI must not

- Create an invented Task or Habit.
- Edit a title.
- Edit a description.
- Edit subtasks.
- Edit a category.
- Edit priority, status, or progress owned by Tasks/Habits.
- Edit Habit structure, frequency, reminders, streaks, or completion content.
- Delete a Task or Habit.
- Persist locally inferred schedule movement as if it came from the backend.

Task content belongs to the Tasks system. Habit content belongs to the Habits system. Planner owns only schedule placement and Planner transaction metadata.

## 3. Current Frontend Scope

The current Planner uses `INITIAL_DAILY_PLAN` from `plannerData.js` only to reproduce the approved Figma UI before backend integration.

Mock data is a visual fixture, not permission to invent AI behavior.

Until the backend returns a confirmed schedule proposal:

- Low, Medium, and High must not locally move cards.
- Reduce Overload must not locally choose a Task or time.
- Optimize Schedule must not locally choose a Task or time.
- Free-text requests must not locally infer a move.
- No card may be added, removed, duplicated, retimed, or moved between dates by a frontend heuristic.

`plannerEngine.js` currently supports cloning and mock plan generation only. Backend integration must replace mock generation with canonical Task/Habit data.

## 4. Figma and Interaction Rules

Reference file:

`https://www.figma.com/design/VwgJovqBGtb90CEfNXkk2T/Elyxa.Ai--Phase-2---Copy-`

Reference nodes:

- Empty Daily: `1260:22919`
- Empty Weekly: `1264:25106`
- Empty Monthly: `1264:26177`
- Empty Daily hover: `1266:39863`
- Empty Weekly hover: `1266:40215`
- Empty Monthly hover: `1266:40470`
- Accepted Daily: `1263:24108`
- Accepted Weekly: `1264:25455`
- Accepted Monthly: `1264:26526`
- Accepted/continued state: `1264:28525`
- AI Actions chat flow: `1264:29142`

Design rules:

- Do not add UI elements that are absent from the approved requirements or Figma.
- Do not change card dimensions, gaps, timeline offsets, typography, borders, dotted states, or responsive behavior during API integration.
- Ghost cards become active after Accept without changing dimensions or positions.
- Daily remains the detailed view.
- Weekly and Monthly remain simplified views.
- Backend fields must be adapted into the existing view model; API integration must not force a redesign.
- AI movement must never create overlapping cards or resize timeline rows unexpectedly.

### Requirement traceability — verified

MVP boundary:

- [x] Planner AI can reorder existing Tasks and Habits.
- [x] Planner AI can rebalance workload.
- [x] Planner AI can move existing items between time slots.
- [x] Planner AI can optimize schedule timing.
- [x] Planner AI can reduce overload.
- [x] Planner AI can create focus spacing.
- [x] Planner AI cannot edit titles.
- [x] Planner AI cannot edit descriptions.
- [x] Planner AI cannot edit subtasks.
- [x] Planner AI cannot edit categories.
- [x] Planner AI cannot edit Habit structure/content.
- [x] Tasks and Habits remain owned by their respective systems.

Interaction rules:

- [x] Main AI interaction occurs in the right-side AI Assistant chat.
- [x] AI plan generation and every AI schedule action continue through chat for MVP.
- [x] Users can generate a new AI plan.
- [x] Users can request schedule adjustments.
- [x] Users can rebalance workload.
- [x] Users can reduce overload.
- [x] Users can optimize schedule timing.
- [x] AI proposals support Accept and Dismiss.
- [x] Eligible accepted AI changes support Undo.
- [x] Confirmed AI responses update the shared Planner schedule in real time.
- [x] Daily, Weekly, and Monthly consume the same canonical schedule.
- [x] Daily is detailed; Weekly and Monthly are simplified projections.

AI Actions and Figma node `1264:29142`:

- [x] Clicking `AI Actions` posts choices inside chat.
- [x] The choices are exactly `Recalibrate My Day`, `Reduce Overload`, and `Optimize Schedule`.
- [x] Selecting a choice continues inside chat.
- [x] Recalibrate continues to `Low`, `Medium`, and `High` as shown in Figma.
- [x] No unsupported frontend movement matrix is inferred from those energy choices.

Visual feedback:

- [x] Skeleton loading states are required while confirmed Planner work is pending.
- [x] Shimmer/wireframe generation states are required.
- [x] Confirmed card appearances/movements use live animation.
- [x] Confirmed AI changes may include approved AI labels/adaptive states.
- [x] Visual feedback must not resize, overlap, or distort the Figma layout.

Future versions may replace selected chat flows with approved popups or deeper contextual interactions. Those future behaviors are out of scope for MVP and must not be introduced early.

## 5. Clarified Button Responsibilities

### Create Plan button

The header `Create Plan` button opens the existing manual `New Plan` modal.

This is a manual entry flow and is separate from AI plan generation and the `AI Actions` flow. It must never run Planner AI inside the modal.

If product defines this button as `Generate a new AI plan` instead of manual entry, opening a modal would conflict with the quoted MVP rule; in that case the action must be moved into AI chat. The current contract treats it as manual entry based on the confirmed frontend flow.

If the modal creates a Task, the Tasks service must own that creation. Planner should receive the new Task ID and create only its schedule placement. Planner API must not directly become the source of truth for Task title or description.

### AI Actions button

The `AI Actions` button is visible after the initial suggested plan is accepted.

Clicking it posts exactly these choices inside the AI chat:

1. Recalibrate My Day
2. Reduce Overload
3. Optimize Schedule

No separate AI Actions popup is required for MVP.

## 6. Required User Flows

### 6.1 Initial suggested plan

1. Frontend requests the current Planner range.
2. If the backend returns an unaccepted proposal, render it as the Figma ghost state.
3. AI Assistant explains that a suggested plan was built.
4. User selects `Accept plan` or `Dismiss`.
5. Accept commits the proposal and changes ghost cards to active cards.
6. Dismiss leaves the canonical schedule unchanged.
7. After Accept, show `AI Actions`.

### 6.2 Recalibrate My Day

1. User clicks `AI Actions`.
2. User selects `Recalibrate My Day`.
3. AI asks: `How is your energy today?`
4. Chat presents `Low`, `Medium`, and `High`.
5. Frontend sends the selected energy and current schedule revision to the backend.
6. Backend decides whether any placement should change.
7. Frontend must not map energy to hardcoded Tasks or times.
8. If the backend returns no operations, keep the board unchanged and show the backend message.
9. If the backend returns a proposal, render only those operations as a preview.
10. Accept commits; Dismiss restores; Undo can reverse the accepted change.

MVP and Figma define the chat flow, but they do not define a hardcoded Low/Medium/High movement matrix. That decision belongs to backend Planner AI.

### 6.3 Reduce Overload

1. User selects `Reduce Overload`.
2. Frontend sends the visible date range, schedule revision, user timezone, and optional constraints.
3. Backend evaluates workload using canonical Tasks/Habits and placement data.
4. Backend may return schedule-only operations such as MOVE, REORDER, or UNPLACE.
5. Backend must identify the exact entity and destination.
6. Frontend renders a loading state while waiting.
7. Frontend previews the returned operations without changing entity content.
8. Accept, Dismiss, and Undo follow the common transaction lifecycle.

Frontend must not assume that `Complete Work Task` should move to tomorrow at 9 AM. That earlier mock rule was unsupported and must not return.

### 6.4 Optimize Schedule

1. User selects `Optimize Schedule`.
2. Frontend sends the current range, revision, timezone, and constraints.
3. Backend returns zero or more schedule-only operations.
4. Frontend renders only the confirmed proposal.
5. Accept, Dismiss, and Undo follow the common transaction lifecycle.

Frontend must not hardcode Morning Workout to 5 AM or Exercise Routine to 9 AM.

### 6.5 Free-text adjustment

1. User types a schedule request in AI Assistant.
2. Frontend sends the raw text plus schedule context to the backend.
3. Backend interprets the request.
4. Backend validates that the result changes placement only.
5. Backend returns either:
   - a proposal,
   - a clarification question,
   - or a no-change explanation.
6. Frontend must not parse words such as `earlier`, `later`, `habit`, `focus`, or `overload` into hardcoded local moves.

### 6.6 Manual Create Plan modal

Recommended backend-safe flow:

1. User opens `New Plan`.
2. User enters the manual content and date range.
3. If this represents a Task, frontend calls the Tasks API.
4. Tasks API creates the entity and returns `taskId`.
5. Frontend or backend orchestration calls Planner placement API with `taskId`.
6. Planner stores placement only.
7. If Task creation succeeds but placement fails, show the Task as unscheduled; do not delete it silently.

Before implementation, backend/product must confirm whether the modal creates a Task or a separate manual Plan entity. Do not duplicate Task ownership inside Planner.

## 7. Canonical Domain Model

### 7.1 Task

Owned by Tasks service:

```json
{
  "id": "task_123",
  "title": "Complete Work Task",
  "description": "Work on the main career task assigned for today.",
  "priority": "MEDIUM",
  "status": "TO_DO",
  "categoryId": "category_finance",
  "durationMinutes": 30,
  "subtasks": []
}
```

Planner may read these fields but must not write them.

### 7.2 Habit

Owned by Habits service:

```json
{
  "id": "habit_123",
  "title": "Drink Water",
  "description": "Stay hydrated throughout the day",
  "status": "ACTIVE",
  "frequency": {
    "type": "DAILY",
    "target": 2
  },
  "todayProgress": {
    "done": 0,
    "total": 2
  }
}
```

Planner may read these fields but must not write them.

### 7.3 Planner placement

Planner-owned:

```json
{
  "id": "placement_123",
  "entityType": "TASK",
  "entityId": "task_123",
  "date": "2026-05-13",
  "startsAt": "2026-05-13T09:00:00-04:00",
  "endsAt": "2026-05-13T09:30:00-04:00",
  "durationMinutes": 30,
  "order": 2,
  "source": "AI",
  "revision": 12,
  "createdAt": "2026-05-12T20:00:00Z",
  "updatedAt": "2026-05-12T20:00:00Z"
}
```

Rules:

- `entityType + entityId` references an existing entity.
- Planner does not duplicate editable Task/Habit content in this table.
- `startsAt` and `endsAt` must be valid ISO 8601 values.
- Backend stores instants in UTC and also receives the user's IANA timezone.
- API must not use display strings such as `1 AM` as canonical time values.
- `order` is deterministic inside a date/time group.

### 7.4 Schedule revision

```json
{
  "id": "revision_12",
  "userId": "user_123",
  "version": 12,
  "rangeStart": "2026-05-11",
  "rangeEnd": "2026-05-17",
  "createdAt": "2026-05-12T20:00:00Z"
}
```

Every committed schedule change increments `version`.

### 7.5 Proposal

```json
{
  "id": "proposal_123",
  "userId": "user_123",
  "action": "REDUCE_OVERLOAD",
  "status": "PENDING",
  "baseRevision": 12,
  "expiresAt": "2026-05-12T20:15:00Z",
  "summary": "One lower-priority task can be moved.",
  "operations": []
}
```

Allowed status values:

- `PENDING`
- `ACCEPTED`
- `DISMISSED`
- `EXPIRED`
- `SUPERSEDED`

### 7.6 Proposal operation

```json
{
  "type": "MOVE",
  "placementId": "placement_123",
  "entityType": "TASK",
  "entityId": "task_123",
  "from": {
    "date": "2026-05-13",
    "startsAt": "2026-05-13T14:00:00Z",
    "order": 1
  },
  "to": {
    "date": "2026-05-14",
    "startsAt": "2026-05-14T13:00:00Z",
    "order": 0
  }
}
```

Allowed MVP operation types:

- `PLACE`
- `MOVE`
- `REORDER`
- `UNPLACE`

Forbidden operation fields:

- `title`
- `description`
- `subtasks`
- `category`
- `habitStructure`
- `habitFrequency`
- any content patch

Backend must reject a proposal containing forbidden fields.

## 8. API Response Envelope

Use the repository's existing response convention:

```json
{
  "success": true,
  "message": "Planner range loaded",
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Schedule revision conflict",
  "error": {
    "code": "PLANNER_REVISION_CONFLICT",
    "details": {}
  }
}
```

## 9. Recommended API Endpoints

All endpoints require the existing Bearer token handled by `axiosInstance`.

### Read schedule

`GET /api/v1/planner/schedule?from=2026-05-11&to=2026-05-17&timezone=America/New_York`

Response data:

```json
{
  "revision": 12,
  "timezone": "America/New_York",
  "placements": [],
  "entities": {
    "tasks": [],
    "habits": []
  },
  "pendingProposal": null
}
```

The backend may join read-only entity data for rendering. Planner placement persistence must still contain references, not editable copies.

### Generate plan proposal

`POST /api/v1/planner/proposals/generate`

```json
{
  "view": "DAILY",
  "rangeStart": "2026-05-13",
  "rangeEnd": "2026-05-13",
  "timezone": "America/New_York",
  "baseRevision": 12,
  "constraints": {}
}
```

### Recalibrate

`POST /api/v1/planner/proposals/recalibrate`

```json
{
  "date": "2026-05-13",
  "energy": "LOW",
  "timezone": "America/New_York",
  "baseRevision": 12
}
```

`energy` values: `LOW`, `MEDIUM`, `HIGH`.

### Reduce overload

`POST /api/v1/planner/proposals/reduce-overload`

```json
{
  "rangeStart": "2026-05-13",
  "rangeEnd": "2026-05-13",
  "timezone": "America/New_York",
  "baseRevision": 12,
  "constraints": {
    "doNotMoveLockedItems": true
  }
}
```

### Optimize schedule

`POST /api/v1/planner/proposals/optimize`

```json
{
  "rangeStart": "2026-05-13",
  "rangeEnd": "2026-05-13",
  "timezone": "America/New_York",
  "baseRevision": 12,
  "constraints": {
    "preserveFixedTimes": true
  }
}
```

### Free-text adjustment

`POST /api/v1/planner/proposals/adjust`

```json
{
  "request": "Move flexible work later and create focus spacing.",
  "rangeStart": "2026-05-13",
  "rangeEnd": "2026-05-17",
  "timezone": "America/New_York",
  "baseRevision": 12,
  "conversationId": "conversation_123"
}
```

### Accept proposal

`POST /api/v1/planner/proposals/:proposalId/accept`

```json
{
  "expectedRevision": 12,
  "idempotencyKey": "accept-proposal_123-client_uuid"
}
```

Accept must be atomic:

1. Lock/check the current schedule revision.
2. Validate proposal status and ownership.
3. Validate all referenced Tasks/Habits still exist.
4. Validate no forbidden content mutation.
5. Validate time ranges and collisions.
6. Apply operations in one transaction.
7. Mark proposal accepted.
8. Create an undo record.
9. Increment schedule revision.
10. Return the committed schedule projection.

### Dismiss proposal

`POST /api/v1/planner/proposals/:proposalId/dismiss`

Dismiss changes proposal status only. It must not mutate the canonical schedule.

### Undo accepted change

`POST /api/v1/planner/changes/:changeId/undo`

```json
{
  "expectedRevision": 13,
  "idempotencyKey": "undo-change_123-client_uuid"
}
```

Undo must:

- only undo an eligible accepted change,
- reject stale or already-undone changes,
- restore the previous placement snapshot atomically,
- never restore deleted Task/Habit content,
- return the new schedule revision.

### Manual placement

`POST /api/v1/planner/placements`

```json
{
  "entityType": "TASK",
  "entityId": "task_123",
  "startsAt": "2026-05-13T14:00:00Z",
  "durationMinutes": 30,
  "timezone": "America/New_York",
  "expectedRevision": 12
}
```

This endpoint schedules an existing entity. It must not accept title or description.

## 10. Proposal Response

```json
{
  "success": true,
  "message": "Schedule proposal ready",
  "data": {
    "proposal": {
      "id": "proposal_123",
      "action": "OPTIMIZE",
      "status": "PENDING",
      "baseRevision": 12,
      "summary": "Two existing items can be better spaced.",
      "operations": []
    },
    "previewSchedule": {
      "revision": 12,
      "placements": [],
      "entities": {
        "tasks": [],
        "habits": []
      }
    }
  }
}
```

Frontend must render `previewSchedule` but must not treat it as committed until Accept succeeds.

## 11. No-Change and Clarification Responses

No-change:

```json
{
  "success": true,
  "message": "No schedule change is required",
  "data": {
    "resultType": "NO_CHANGE",
    "assistantMessage": "Your current schedule already matches this request.",
    "proposal": null
  }
}
```

Clarification:

```json
{
  "success": true,
  "message": "Clarification required",
  "data": {
    "resultType": "CLARIFICATION",
    "assistantMessage": "Which day should I optimize?",
    "options": [
      {
        "id": "TODAY",
        "label": "Today"
      },
      {
        "id": "THIS_WEEK",
        "label": "This week"
      }
    ]
  }
}
```

Frontend must not invent a fallback movement when the response is no-change, clarification, timeout, or error.

## 12. Concurrency and Idempotency

Required protections:

- Every schedule read returns a numeric `revision`.
- Every proposal stores `baseRevision`.
- Accept and Undo require `expectedRevision`.
- Stale revisions return HTTP `409`.
- Mutating requests use an `Idempotency-Key` header or explicit `idempotencyKey`.
- Repeating Accept with the same key returns the first successful result.
- Only one pending proposal should be active per user/range unless product explicitly supports multiple.
- A new accepted proposal supersedes older pending proposals for the same range.

Recommended conflict response:

```json
{
  "success": false,
  "message": "The schedule changed after this proposal was created.",
  "error": {
    "code": "PLANNER_REVISION_CONFLICT",
    "details": {
      "expectedRevision": 12,
      "currentRevision": 13
    }
  }
}
```

Frontend behavior on `409`:

1. Dismiss the stale local preview.
2. Reload the canonical schedule.
3. Add an AI message explaining that the schedule changed.
4. Let the user request a fresh proposal.

## 13. Timezone and Date Rules

- Send an IANA timezone, for example `Asia/Dhaka`.
- Store timestamps in UTC.
- Return ISO 8601 timestamps.
- Convert to local time only in the frontend adapter.
- Date-only ranges use `YYYY-MM-DD`.
- Backend must handle daylight-saving transitions.
- Never parse or persist display labels such as `1 AM`.
- Weekly range starts Monday, matching current `getWeekDays`.
- Monthly endpoints must include adjacent dates only when needed for the rendered grid.

## 14. Collision and Layout Safety

Backend scheduling validation:

- Reject invalid intervals.
- Respect locked/fixed placements.
- Avoid overlapping placements unless the product explicitly allows a grouped layout.
- Return a collision group when two placements intentionally share a slot.
- Include duration so the frontend can validate fit.
- Never return a placement outside the requested range without explicitly including the destination range.

Recommended placement display metadata:

```json
{
  "layout": {
    "groupId": "group_7am",
    "variant": "SIDE_BY_SIDE",
    "order": 0
  }
}
```

Allowed variants should be a closed enum agreed with the existing Figma implementation. Backend must not send arbitrary CSS dimensions.

Frontend safety before rendering a preview:

1. Validate operation shape.
2. Confirm every entity reference exists.
3. Confirm timestamps parse correctly.
4. Confirm layout variant is supported.
5. Reject the preview if it would produce an unsupported overlap.
6. Keep the canonical board visible and show an error message.

API integration must not modify the existing pixel dimensions to accommodate malformed data.

## 15. Frontend Integration Architecture

Use the repository's existing stack:

- Axios through `src/services/axiosInstance.js`
- HTTP helpers through `src/services/httpMethods.js`
- Redux Toolkit async thunks and slice
- Existing Bearer-token interceptor
- Existing `{ success, message, data }` envelope

Recommended new files:

```text
src/features/planner/
  plannerAPI.js
  plannerSlice.js
  plannerSelectors.js
  plannerAdapter.js
```

### plannerAPI.js

Responsibilities:

- Call Planner endpoints.
- Pass ranges, timezone, revision, and idempotency keys.
- Normalize API errors into stable Planner error codes.
- Never contain UI layout classes.

### plannerSlice.js

Recommended state:

```json
{
  "schedule": null,
  "revision": null,
  "pendingProposal": null,
  "latestAcceptedChange": null,
  "chat": [],
  "loading": {
    "schedule": false,
    "proposal": false,
    "commit": false,
    "undo": false
  },
  "error": null
}
```

### plannerAdapter.js

Responsibilities:

- Join placement references with read-only Task/Habit entities.
- Convert ISO times to the user's timezone.
- Produce the current Daily/Weekly/Monthly view model.
- Map supported layout enums to existing presentation variants.
- Preserve canonical IDs.
- Never infer AI movement.
- Never mutate entity content.

### Presentation components

Keep these presentation-focused:

- `DailyView.jsx`
- `WeeklyView.jsx`
- `MonthlyView.jsx`
- `PlannerControls.jsx`
- `AIAssistant.jsx`

They should receive already-adapted data and callbacks. API payload parsing should not be scattered across view components.

### Repository integration cautions

- `axiosInstance` already applies the Bearer token and handles `401`; Planner calls must not manually read a different token key or duplicate authorization headers.
- Existing Axios timeout is 10 seconds in development and 5 seconds otherwise. Use the async operation flow in section 17 when AI work cannot reliably finish inside that limit.
- Keep plain Planner request functions separate from Redux thunks so API transport and state transitions remain testable.
- Register `plannerSlice` explicitly in `src/features/store.js`.
- Do not put React icons or display strings such as `Today`, `0/4 Steps`, or `7:00 AM • 8:00 PM` in the backend model.
- Tasks use structured timestamps, duration, goal IDs, and subtasks in the API; the adapter creates display labels.
- Habits use structured recurrence, reminder times, target count, timezone, and linked Goal IDs; the adapter creates display labels.
- Goal links are read-only references for Planner. Planner must not change Goal content or relationship ownership.
- The current manual modal's `dateRange` is not applied by `handleSavePlan`; backend integration must define and test its exact range semantics instead of preserving that mock limitation.

### UI limitations are not backend rules

The current presentation has temporary implementation constraints:

- Daily currently renders a limited visible hour list.
- Weekly has Figma-specific card layout mappings.
- Monthly intentionally shows a compact subset.

The backend API must return complete canonical range data and must not:

- filter entities by current hardcoded frontend IDs,
- limit schedules to the currently visible 1–11 AM fixture,
- omit Habits because a simplified view hides them,
- cap a date to the number of cards currently displayed in Monthly,
- return CSS positions or Figma pixel values.

`plannerAdapter.js` is responsible for projecting complete canonical data into each approved view without changing the API contract.

## 16. Frontend Integration Steps

### Phase 1 — Contract setup

1. Backend and frontend agree on models and endpoints in this document.
2. Confirm manual `Create Plan` ownership.
3. Confirm timezone source.
4. Confirm collision/layout enums.
5. Confirm synchronous proposal response versus operation polling.
6. Publish OpenAPI definitions.

### Phase 2 — Read-only schedule

1. Add `plannerAPI.js`.
2. Add `plannerSlice.js` to `src/features/store.js`.
3. Fetch Daily range on Planner load.
4. Fetch Weekly/Monthly range when the view changes.
5. Adapt API data through `plannerAdapter.js`.
6. Keep `INITIAL_DAILY_PLAN` available behind a development-only fallback until API parity is verified.
7. Do not remove mock fixtures until visual regression passes.

### Phase 3 — Initial proposal

1. Load `pendingProposal` with the schedule.
2. Render ghost state from `previewSchedule`.
3. Wire Accept and Dismiss endpoints.
4. On Accept, replace preview with returned committed schedule.
5. On Dismiss, restore canonical schedule.
6. Verify no card changes dimensions during state transition.

### Phase 4 — AI Actions

1. Keep the exact three chat choices.
2. Wire Recalibrate request.
3. Wire Reduce Overload request.
4. Wire Optimize Schedule request.
5. Render skeleton while the request is pending.
6. Render only backend-returned proposals.
7. Do not reintroduce local hardcoded movement.

### Phase 5 — Free-text adjustment

1. Send raw request and conversation context.
2. Handle proposal, clarification, and no-change result types.
3. Keep chat actions disabled after consumption.
4. Block another schedule mutation while a proposal is pending.

### Phase 6 — Undo and conflict handling

1. Store returned `changeId`.
2. Enable Undo only for the latest eligible accepted change.
3. Wire Undo endpoint.
4. Handle `409` by refetching schedule.
5. Disable expired or superseded links.

### Phase 7 — Remove mock runtime dependency

1. Confirm API parity in Daily, Weekly, and Monthly.
2. Confirm empty, ghost, accepted, loading, error, and no-change states.
3. Confirm responsive visual regression.
4. Remove runtime initialization from `INITIAL_DAILY_PLAN`.
5. Keep fixtures only for Storybook/tests if needed.

## 17. Async Processing

For MVP, prefer a synchronous proposal response if generation reliably completes within the configured request timeout.

If AI generation exceeds the timeout:

1. `POST` returns HTTP `202` with `operationId`.
2. Frontend polls `GET /api/v1/planner/operations/:operationId`.
3. Poll every 1–2 seconds with backoff.
4. Stop on `COMPLETED`, `FAILED`, `CANCELLED`, or timeout.
5. Keep Planner skeleton active while pending.
6. Fetch proposal when complete.

Operation response:

```json
{
  "success": true,
  "data": {
    "id": "operation_123",
    "status": "PROCESSING",
    "progress": 60
  }
}
```

Do not add WebSocket/SSE infrastructure for MVP unless the wider application already adopts it.

## 18. Error Handling

Expected HTTP statuses:

- `200` read/success/no-change
- `201` placement created
- `202` AI operation accepted
- `400` invalid request
- `401` unauthenticated; existing interceptor redirects
- `403` placement/entity not owned by user
- `404` entity, proposal, or change not found
- `409` revision conflict, invalid proposal state, or collision
- `422` Planner policy validation failed
- `429` AI rate limit
- `500` internal error
- `503` Planner AI unavailable

Frontend rules:

- Never clear the current board because an API failed.
- Never apply a partial proposal.
- Stop skeleton state on failure.
- Keep the user's input in chat history.
- Show a concise retry message.
- Do not generate a local fallback movement.

## 19. Security and Authorization

Backend must:

- Derive `userId` from the authenticated token, never from request body.
- Verify ownership of every Task, Habit, placement, proposal, and change.
- Prevent cross-user entity references.
- Validate all operation fields against an allowlist.
- Reject content-mutation fields.
- Rate-limit AI proposal endpoints.
- Audit proposal creation, acceptance, dismissal, and undo.
- Avoid placing private Task/Habit descriptions in AI logs unless required and approved.
- Apply retention rules to chat and AI prompt data.

## 20. Database Constraints

Recommended constraints:

- Foreign key or service-level validation for entity references.
- Unique placement ID.
- Unique proposal ID.
- Unique change ID.
- Unique idempotency key per user/action.
- Proposal status transition constraints.
- Positive duration.
- `endsAt > startsAt`.
- Revision version increments atomically.
- Index placements by `(userId, startsAt)`.
- Index proposals by `(userId, status, createdAt)`.
- Index changes by `(userId, createdAt)`.

If Tasks and Habits live in separate services, use stable external references and validate through service APIs rather than cross-service database foreign keys.

## 21. Validation Invariants

Every backend proposal must pass:

1. Every entity already exists and belongs to the user.
2. Operations modify placement only.
3. No title/description/subtask/category/habit content appears in a patch.
4. Base revision matches.
5. Source placement exists for MOVE/REORDER/UNPLACE.
6. Destination date/time is valid.
7. Locked items are preserved.
8. Collision rules pass.
9. Operation order is deterministic.
10. Applying the same request twice is idempotent.

Frontend must reject malformed proposal data instead of attempting to repair it.

## 22. Testing Requirements

### Backend unit tests

- Proposal policy rejects content changes.
- Recalibrate accepts only LOW/MEDIUM/HIGH.
- Reduce Overload does not invent entities.
- Optimize modifies placement only.
- Revision conflicts return `409`.
- Accept is atomic.
- Dismiss does not mutate schedule.
- Undo restores placement snapshot.
- Idempotency prevents duplicate commits.
- Cross-user references return `403`.
- Timezone and DST cases are correct.
- Collision validation works.

### Backend integration tests

- Tasks/Habits read integration.
- Schedule range query.
- Generate → Accept.
- Generate → Dismiss.
- Action → Proposal → Accept → Undo.
- Proposal expires.
- Entity deleted after proposal creation.
- Concurrent schedule change before Accept.
- AI timeout and no-change response.

### Frontend tests

- Initial ghost state matches Figma.
- Accept changes only visual state, not card dimensions.
- Dismiss restores canonical schedule.
- AI Actions appears only after Accept.
- AI Actions posts exactly three options.
- Recalibrate posts Low/Medium/High.
- No backend response means no local card movement.
- Backend no-change means no card movement.
- Backend proposal preview does not commit early.
- Reduce/Optimize render only returned operations.
- Undo restores returned snapshot.
- Daily/Weekly/Monthly read the same schedule state.
- No overlap after confirmed movement.
- Loading and error states preserve board dimensions.
- Desktop, laptop, tablet, and mobile visual regression.

### Contract tests

- Generate OpenAPI client fixtures.
- Verify response envelope.
- Verify enum compatibility.
- Verify forbidden content fields are absent.
- Verify all IDs and revisions remain stable.

## 23. QA Matrix

Test each action in:

- Daily
- Weekly
- Monthly

Test each state:

- Initial loading
- Empty
- Ghost proposal
- Hover
- Accepted
- Proposal loading
- Proposal preview
- Accepted change
- Dismissed change
- Undo
- No-change
- Clarification
- Error
- Revision conflict
- Expired proposal

Test responsive widths:

- Desktop
- Laptop
- Tablet
- Mobile

For every test, verify:

- No invented card.
- No duplicated card.
- No missing card unless a confirmed operation moved/unplaced it.
- No content mutation.
- No overlap.
- No card resize caused by accepted state.
- Timeline indicator remains aligned.
- Monthly cells do not compress or distort.

## 24. Observability

Recommended structured events:

- `planner.schedule.loaded`
- `planner.proposal.requested`
- `planner.proposal.created`
- `planner.proposal.no_change`
- `planner.proposal.accepted`
- `planner.proposal.dismissed`
- `planner.change.undone`
- `planner.proposal.failed`
- `planner.revision.conflict`

Include:

- user ID or privacy-safe hash
- action
- proposal ID
- change ID
- base/current revision
- operation count
- duration
- result status

Do not log full private Task/Habit content by default.

## 25. Rollout Plan

1. Finalize OpenAPI contract.
2. Implement read-only schedule endpoint.
3. Integrate frontend behind `VITE_PLANNER_API_ENABLED`.
4. Compare API projection with mock Figma fixture.
5. Implement proposal generation.
6. Implement Accept/Dismiss.
7. Implement AI Actions.
8. Implement Undo.
9. Run visual and contract regression.
10. Enable for internal users.
11. Monitor conflicts, errors, and invalid proposals.
12. Remove runtime mock fallback after parity is confirmed.

Rollback:

- Disable `VITE_PLANNER_API_ENABLED`.
- Restore read-only mock fixture.
- Do not keep partially committed client state.
- Canonical backend schedule remains source of truth.

## 26. Definition of Done

Backend integration is complete only when:

- Planner reads canonical Tasks/Habits.
- Planner persists placement separately from content.
- AI never edits entity content.
- All AI movements come from backend-confirmed operations.
- Initial plan supports Accept and Dismiss.
- Accepted AI changes support Undo.
- Revision conflicts are safe.
- Requests are idempotent.
- Daily, Weekly, and Monthly use the same canonical schedule.
- Loading/errors never destroy the current board.
- No overlapping or distorted UI is introduced.
- Existing pixel-perfect Figma states remain unchanged.
- Responsive behavior passes regression tests.
- Mock runtime data is no longer required.

## 27. Explicitly Out of Scope for MVP

- Editing Task/Habit content from Planner.
- Creating AI-authored Tasks/Habits.
- Drag-and-drop advanced scheduling unless separately approved.
- Multi-user collaborative scheduling.
- Multiple simultaneously active proposals for the same range.
- Arbitrary popup-based AI action flows.
- Backend-provided CSS or pixel dimensions.
- Local frontend AI scheduling heuristics.
- Silent automatic commits without user confirmation where a proposal is required.

## 28. Integration Checklist

Before coding:

- [ ] Confirm Task and Habit API contracts.
- [ ] Confirm manual Create Plan ownership.
- [ ] Confirm Planner endpoint names.
- [ ] Confirm timezone source.
- [ ] Confirm revision and idempotency behavior.
- [ ] Confirm supported layout variants.
- [ ] Confirm AI no-change and clarification responses.
- [ ] Confirm proposal expiry.
- [ ] Confirm Undo eligibility.

Before frontend merge:

- [ ] No hardcoded card movement.
- [ ] No content mutation fields.
- [ ] API adapter has tests.
- [ ] Daily/Weekly/Monthly share state.
- [ ] Loading preserves layout.
- [ ] Error preserves canonical board.
- [ ] Accept is atomic from the user's perspective.
- [ ] Dismiss restores without refetch glitches.
- [ ] Undo handles stale revision.
- [ ] Responsive visual regression passes.

Before production:

- [ ] Authentication and ownership tests pass.
- [ ] Rate limits configured.
- [ ] Audit logs enabled.
- [ ] Monitoring dashboards configured.
- [ ] Feature flag tested.
- [ ] Rollback tested.
- [ ] Mock runtime dependency removed.
