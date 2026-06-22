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

**Status (2026-06-18):** ✅ done — empty-state ghost cards (frames 1-2), populated board with
real cards, three-dot menu, and filter dropdowns (frame 3 + 3.1-Hover + 3-Filter) all built
in `src/pages/private/user/focus/Tasks/TasksBoard.jsx`. Confirmed from Figma inspection
(not just the written spec): real/non-ghost cards never show the "AI" sparkle pill — that's
ghost-card-only; **Delete in the three-dot menu is plain gray, not red** (don't "fix" this
to red later, it's intentional in the design); ghost-card and real-card ⋯ buttons are both
hidden until hover (confirmed via user decision 2026-06-18); overdue real cards show
"Overdue" / "Overdue Xd" in red instead of the "Due: X" footer.

**Update (2026-06-18):** New Task / Edit Task popup built (`components/TaskFormModal.jsx`),
matching frame 4.2 exactly: Title, Priority+Category, Due Date+Due Time (12h, custom 3-part
select — no native `<input type="time">`, per the mistakes list below), Est. Minutes+Status,
Linked Goal (first option AI-recommended, last is "+ Create new goal"), Description. Submit
button reads "Add to Board" when creating, "Edit" when editing (exact Figma wording, not
"Save"). Wired to real state: "New Task" creates a card in the column matching the chosen
Status; the three-dot "Edit" action opens the same modal pre-filled and updates that card in
place (including moving it between columns if Status changed). Frames 4 and 4.1 (despite
their names) turned out to just be additional populated-board screenshots, not popups —
don't re-fetch those expecting form content.

Still open (frames 5-8, not built yet): frame 5/6 (unclear purpose, not yet investigated),
card insert animation (frame 8), subtasks UI (frame 7, 7.1), the AI-generation tab for New
Task (Generate button + rotating placeholder + skeleton, written spec rules 4-6 — no Figma
frame found for this yet, may need to ask the user), and actually wiring the filter
dropdowns to filter the card list (currently they open/select visually but don't filter).

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

**Status (2026-06-21):** Steps 1, 2, and 3 ✅ done — all visually verified against the Figma
frames. Step 1 (Empty States + Hover) and Step 2 (Populated Board) live in
`src/pages/private/user/focus/Habits/Habits.jsx`; the real habit row is extracted into
`components/HabitRow.jsx` (reused by both the board and the Step 3 modal preview); Step 3
(New Habit popup, 3 states) lives in `components/NewHabitsModal.jsx`. This was the last
planned step for the Habits Board per the user's 3-step plan — no further steps specified
as of this date.

**Build plan (per user, 2026-06-21):** this board ships in 3 steps, each with sub-steps.
Step 1 = Empty States (Figma frames below).

- Step 1 frames: [Habits Board (1440) - 1 - Empty States](https://www.figma.com/design/VwgJovqBGtb90CEfNXkk2T/Elyxa.Ai--Phase-2---Copy-?node-id=1243-7175&m=dev)
  (default) and [...- Empty States - Hover](https://www.figma.com/design/VwgJovqBGtb90CEfNXkk2T/Elyxa.Ai--Phase-2---Copy-?node-id=1243-7663&m=dev)
  (hover sub-step).

### Step 1 — Empty States (board has zero real habits)
Confirmed from Figma inspection 2026-06-21 (fileKey `VwgJovqBGtb90CEfNXkk2T`):

- Page header: "Habits Board" (20px) + subtitle "Build daily habits and keep your streaks
  alive..." (12px, gray-200), search input "Search habits in board..." top-right.
- Toolbar row: purple **"+ New Habit"** button (left) — filters on the right, in this exact
  order: **All Category / All Schedule / All Days Left**. Note: the **Streak filter from the
  Filters annotation does not appear in this empty-state frame** — only 3 filter buttons are
  visible here, not 4. Don't assume Streak filter is missing from the board entirely; it may
  only show once habits exist, or may need to be confirmed separately.
- List header row inside the card panel: a **"✦ 3 AI Suggestions"** purple pill (left,
  next to a small icon) + a "Streak" column label (with icon) + day-of-week column headers
  Mon–Sun (current day, e.g. "Wed", highlighted purple with a dot).
- When the board has **zero real habits**, exactly 3 AI-suggested ghost habit rows render
  (Drink Water / Take Breaks / Meditate in the inspected frame — illustrative content, not
  fixed copy) at **opacity-40** with a **dashed gray-100 border**, each row showing: title +
  small purple "AI" pill, one-line description (truncated), category tag + time/streak-info
  tag, a "0 days" streak readout, and a row of 7 empty day-checkbox squares (40×40,
  `border-[#e9e9e9]`, two of the seven are `opacity-0` spacers to align under the correct
  weekday column).
- **Default state:** ghost row is opacity-40, dashed border, no "Accept" affordance visible,
  no three-dot menu visible.
- **Hover state (sub-step):** the hovered ghost row flips to **full opacity**, **solid**
  gray-100 border, `bg-gray-50`, and a subtle shadow (`0px 2px 4px rgba(0,0,0,0.03)`); a new
  **"Accept Habit ✓"** pill (purple text, checkmark icon) appears under the tags; a
  three-dot **"⋯"** menu appears at the far right of that row (visible on hover only — exact
  menu items not yet confirmed for ghost habit rows, but Tasks board's ghost-card pattern is
  "Regenerate suggestion" / "Dismiss" and is the most likely match per [[project-dashboard-spec]]).
  Non-hovered rows stay opacity-40/dashed.
- This is the same "ghost card, hover reveals AI accept action" mechanic as Tasks/Goals
  ghost cards (§0 global rule: "same mechanics... share the component") but with habit-
  specific copy ("Accept Habit" instead of a footer + "Accept" button) — don't copy the
  Tasks ghost-card footer text verbatim onto Habits.
- Ghost row three-dot menu reuses the Tasks ghost-card pattern exactly: **Regenerate
  suggestion** / **Dismiss** (confirmed with user 2026-06-21, no separate Habits-specific
  copy).
- **Day-checkbox grid gotcha:** each ghost habit only shows checkboxes for the days it's
  actually scheduled on — unscheduled days render as invisible (`opacity-0`) spacers so the
  grid stays pixel-aligned with the Mon–Sun header columns, rather than evenly spacing
  however many days are visible. Confirmed from the Figma frame's literal per-row spacer
  divs: Drink Water hides Thu/Sat, Take Breaks shows all 7, Meditate hides Thu/Sun. Both the
  header's day-of-week row and each row's checkbox grid use the same fixed `gap-7.5`
  (30px) spacing, right-aligned, so they line up — don't switch either one to
  `justify-between`/flexible spacing or they'll drift apart.
- Icons: leading icon before the "✦ N AI Suggestions" pill is a refresh/loop icon (not part
  of the pill itself); "Streak" column label uses a timer icon (not flame); reminder-time
  tags ("7:00 AM", "6:30 PM") use a bell icon (not a clock); a linked-goal-style tag ("New
  Job") uses a flag icon; a "days left" tag uses an hourglass icon.

### Step 2 — Populated Board (real habits, not ghost/empty state)

Figma source (fileKey `VwgJovqBGtb90CEfNXkk2T`): node `1234-11897` (default), node
`1237-12542` (1.1 — Hover: cursor over a row, no menu open), node `1237-13017` (1.2 — Hover:
three-dot menu open). Confirmed via `get_metadata` + targeted `get_design_context` calls,
2026-06-21.

**Resolved 2026-06-21 (supersedes the old single-time MVP rule above):** habits now support
**multiple reminder times per day**. A habit can have 2+ times (tag shows
"7:00 AM • 8:00 PM", or "7:00 AM • 8:00 PM • +1" when there are 3+), a schedule badge like
"3x/Day", and today's cell shows fractional same-day progress — a left-aligned partial-fill
bar (width ∝ completed/total) plus a centered `"{done}/{total}"` label below the cell (e.g.
"1/2", "2/3"). The original "Habits popup" section's "Times Per Day: only one time per day"
/ "one reminder per day" bullets are **stale** — multi-time is the current model as of Step
2. Update that section when the New/Edit Habit popup (with its time-picker UI) is actually
built, rather than relying on this note alone.

#### Header (left side) — replaces the ghost-state "✦ N AI Suggestions" pill
- Refresh icon + `"{N} active"` (gray-400, 14px, no pill background — plain text+icon, not
  a colored badge like the ghost-state pill).
- A separate gray pill (`bg-#f2f2f2`, 12px, gray-400 text) reading
  `"{N} paused • {N} completed this month"` (the `•` separator is `#c2c2c2`, lighter than
  the surrounding text).
- Streak column header (icon + "Streak" label) and Mon–Sun day headers are **unchanged**
  from Step 1 — same `w-44`/`flex-1 justify-between` columns, same today-highlight dot.

#### Row anatomy (per habit, real data)
- Card: `bg-#fcfcfc`, solid `border-#f2f2f2` (1px), `rounded-2xl`, `p-3` — **solid border
  always** (not dashed — dashed is ghost-state only). No hover-only opacity flip like ghost
  rows; real rows are always full opacity (paused rows are an exception, see below).
- Title (16px) + optional status badge inline, then description (12px, `text-[#a3a3a3]`,
  truncate), then a tag row (12px chips, `border-#f2f2f2`), matching Step 1's tag style
  exactly (category chip, time chip with bell icon, linked-goal chip with flag icon,
  `+N` overflow chip per the existing overflow-tag rule below).
- Streak column (`w-[175px]`, same slot as ghost state's "0 days"): renders as
  **`"{N} days"` plain gray-400 text** normally, but **with a small flame icon + orange
  text (`#f97316`)** once a row has an active, non-zero, non-paused streak (confirmed on
  "Take Breaks" → 🔥 `7 days` in `#f97316`; contrast with "Meditate" (paused) → plain
  `3 days` in light gray `#c2c2c2`, no icon, and "Drink Water" (completed) → plain
  `21 days` in `#c2c2c2`, no icon). So: flame+orange is **active-streak-only**, not a
  universal streak indicator.
- Day-of-week cells (same 40×40 squares, same `gap-7.5`/`pr-44` grid as Step 1): each cell
  is one of — empty/unscheduled (plain bordered square), **checked** (filled square +
  checkmark, purple), or **today-in-progress** (a left-aligned partial-fill bar inside the
  square, width proportional to completed/total, with a small `"{done}/{total}"` label
  centered just below the cell — only ever appears on the today column). Unscheduled days
  use the same `opacity-0` spacer trick as Step 1's ghost rows.

#### Status variants (same row shape, different state)
- **Active** (default): full opacity, black title, flame+orange streak if streak > 0.
- **Paused**: title color drops to gray-400, a `"PAUSED"` uppercase badge appears next to
  the title (`bg-rgba(93,93,93,0.05)`, text `#5d5d5d`), description lightens to gray-200,
  the whole tag row gets `opacity-50`, streak text has no flame icon and is plain
  `#c2c2c2`, and scheduled-but-not-yet-done day cells render at `opacity-40` (vs full
  opacity for active rows) — i.e. a paused row is dimmed throughout, not just the streak.
- **Completed** (habit/streak goal reached): a `"COMPLETED"` uppercase badge next to the
  title (`bg-rgba(42,157,0,0.05)`, text `#2a9d00`), streak text plain `#c2c2c2` (no flame).
  **The entire 7-day checkbox grid is replaced** by a single full-width green banner
  (`bg-rgba(42,157,0,0.05)`, `rounded-[10px]`, 40px tall, spans the same 460px the 7
  checkboxes would occupy) reading **"Habit reached ✓"** (text `#2a9d00`, centered). Don't
  render checkboxes *and* the banner together — it's one or the other.

#### Three-dot menu (real row — different from ghost row's menu)
Visible on hover, same position/trigger as Step 1. **5 items in 2 groups** (confirmed from
`1237-13017`), not the ghost row's 2-item Regenerate/Dismiss menu:
1. Edit (gray)
2. ✦ Improve habit (purple, sparkle icon) — AI action, same visual treatment as Tasks
   board's "Break into subtasks"/"Improve description"
   — *(border below this group, like Tasks' 3-group menu pattern)*
3. Complete (gray, checkmark icon)
4. Pause (gray)
5. Delete (gray)

#### List overflow / scroll
The panel has a **fixed-height content area with vertical scroll and a bottom fade-out
gradient mask** (`rgba(255,255,255,0)` → white, ~60px tall) — present in every frame
inspected so far (ghost-state and populated), confirming it's a permanent feature of the
panel, not something that only appears once content overflows. Step 1's implementation
doesn't have this yet (3 ghost rows fit without scrolling) — needs adding now that real
data can exceed visible rows (~5 rows fit before scroll/fade kicks in at this card height).

### Habit card — overflow tags
- When tags overflow available width, hide extras and show `+N`.
- Hovering `+N` reveals all hidden tags via dropdown/tooltip — same hover pattern as the rest of the product (don't invent a new hover affordance here).
- Reference screenshots show this on a card with `Health` tag + time range + `+3`, and on a Fitness card with `3x/Day` badge.

### Habits popup
- **STALE as of 2026-06-21 — superseded by §2 Step 2 "Resolved" note above.** Multi-time
  habits are now the confirmed model (multiple reminder times/day, fractional same-day
  progress, "3x/Day"-style badges). The bullets below describe the *original* single-time
  MVP rule and are kept only as history; don't follow them. Re-derive the actual New/Edit
  Habit popup fields from Figma when that popup is built, rather than this note.
- ~~Times Per Day: MVP supports exactly **one** time per day.~~
- ~~Reminder Time: exactly one reminder, tied to the single daily time. One time picker, 12h format.~~
- ~~Not in MVP: multiple check-ins per day — habit completion is a single click/tap on the habit box.~~

### Step 3 — New Habit popup (3 states)

Figma source (fileKey `VwgJovqBGtb90CEfNXkk2T`), confirmed via `get_metadata` 2026-06-21:
- node `1237-13457` ("...- 2") — **AI Generation tab**, initial/empty state. Modal
  450×336px, centered.
- node `1237-13935` ("...- 2.1") — **Manual tab**, all fields. Modal 450×564px, centered
  (taller than the AI tab because of the extra fields).
- node `1239-5884` ("...- 3") — **AI generation result/preview** state. Modal 920×446px,
  centered (much wider — it embeds a live board-row-style preview of the generated habit).

This is the same two-tab "AI Generation / Manual" pattern as Tasks board's `TaskFormModal`
(§1) — reuse that component's structure/behavior (tab toggle, disabled-until-typed Generate
button, typewriter placeholder, Cancel pairing) rather than building a parallel pattern from
scratch, adapting only the fields themselves.

#### Shared modal chrome (all 3 states)
- Header: "New Habit" (left) + ✕ close (right), 38px tall, border-b.
- Footer: two equal-width buttons side by side (`Cancel` / action), `gap-[10px]`-ish row.

#### `HabitRow` reuse gotcha (found + fixed 2026-06-21)
The State 3 preview embeds the real `HabitRow` (§2 Step 2), but the **modal's row is not
just a narrower copy of the board's row** — per Figma metadata, the preview row drops the
streak/"X days" column entirely (grid starts immediately after the title block, no 175px
streak slot) and the 7-day grid is a **fixed** 460px width (40×7 + 30×6), not the board's
responsive `flex-1`/stretch-to-edge grid. `HabitRow.jsx` has a `compact` prop for this:
`compact` omits the streak column and switches the day grid to the fixed 460px layout;
`showMenu` (separate prop) controls the three-dot menu. Board usage: neither prop (defaults
apply). Modal preview usage: `compact` + `showMenu={false}`. Also: the tab toggle and the
"Anything to change?" block in State 3 are each constrained to a **centered 430px column**
(`mx-auto max-w-[430px]`) even though the modal body is 896px wide and the row preview
itself stays full-width — don't assume every child of a wide modal should stretch full
width, check Figma's per-element measurements.

#### State 1 — AI Generation tab (node `1237-13457`)
- Tab toggle row: "✦ AI Generation" (active/purple) | "Manual" (inactive), 50/50 split.
- Label: "Describe the habit you want to generate".
- Large textarea (140px tall) with rotating placeholder examples (typewriter animation,
  reuse the shared component per global rule in §1) — e.g. "Create a habit for updating my
  portfolio...".
- Footer: `Cancel` (gray) / `Generate` (purple, **disabled until text is typed** — confirmed
  from the screenshot showing it greyed out with empty textarea).

#### State 2 — Manual tab (node `1237-13935`)
Fields, top to bottom:
1. **Title** — text input, placeholder e.g. "e.g. Update LinkedIn profile".
2. **Category** + **Reminder Time** — side-by-side, 50/50 split. Category is a dropdown
   (same category list as elsewhere — confirm exact options against the Filters list in
   this doc). Reminder Time is a single time input with a clock icon, 12h-style.
3. **Target Days** — 7 equal-width toggle buttons (Mon...Sun), each ~45px, **not stretched
   to the full row width** (they total ~350px inside a 426px row, left-aligned — don't
   stretch them to fill). Multi-select toggle (screenshot shows Tue + Thu selected/purple,
   others unselected/white).
4. **Linked Goal** — dropdown, full width. Reuse the existing Linked Goal pattern from
   Tasks board (§1): first item "AI recommended"/"AI Suggested", last item "+ Create new
   goal".
5. **Description** — textarea, 80px tall.
- Footer: `Cancel` / `Create` (disabled until required fields filled, per the screenshot
  showing it greyed out).

**Resolved 2026-06-21:** multi-time habits are **AI Generation-only** for this step. The
Manual tab stays single-time exactly as captured in Figma (one "Reminder Time" field, no
"+ add another time" control) — don't add one.

#### State 3 — AI generation result / preview (node `1239-5884`)
- Modal widens to 920px (vs 450px for states 1/2) to fit a **live preview of the generated
  habit rendered as an actual board row** — same row component as the populated board
  (Step 2): Mon–Sun header above, then the habit row with title/tags/streak-column-area/
  day-checkboxes, literally reusing the board-row markup/component, not a simplified
  summary card.
- Below the preview: **"Anything to change?"** label with an inline **"Update"** link
  (purple, top-right of that label) + a refinement textarea (70px, placeholder "Type
  here...") — lets the user nudge the AI result without leaving the modal.
- Footer: `Regenerate` (gray) / `Add to Board` (purple, active — not disabled, since a
  result already exists to add).

### Potential mistakes to flag for Step 3
1. **Resolved:** the State 3 preview **reuses the real populated-board row component**
   (Step 2), not a separate simplified card — confirmed 2026-06-21. Build Step 2's row
   component first and import it into the modal, rather than duplicating row markup.
2. **Stretching the Target Days buttons to full width** — Figma has them left-aligned at
   their natural ~350px width inside the 426px row; don't `flex-1`/`justify-between` them to
   fill the row (the same mistake already made and corrected twice this session on the
   Mon–Sun day grid elsewhere — don't repeat it here).
3. **Manual tab's single Reminder Time vs Step 2's multi-time reality** — see the open
   question above; don't silently build single-time-only or silently invent a multi-time
   UI without asking.
4. **Category list mismatch** — confirm the Manual tab's Category dropdown options against
   this doc's Habits Filters list (`Career/Health/Finance/Fitness/Wellness/Productivity/
   Personal/Education`) rather than assuming it matches Tasks' shorter list.
5. **Generate/Create button disabled-state logic** — Generate is disabled until the
   textarea has text (State 1); Create is disabled until required Manual fields are filled
   (State 2) — two different conditions, don't share one boolean.
6. **Modal width/centering per state** — 450×336 (State 1), 450×564 (State 2), 920×446
   (State 3) are each independently centered on screen, not a single fixed-size modal that
   just changes content — get the resize/recenter transition right, or at minimum render
   each state at its correct size.

### Filters (dropdown values — exact strings)
- Category: All Category / Career / Health / Finance / Fitness / Wellness / Productivity / Personal / Education
- Schedule: All Schedule / Daily / Weekly / Monthly / Custom
- Streak: All Streak / Active streak / No streak / Best streak
- Days Left: All Days Left / 1-7 days / 8-30 days / 30+ days

Note the Habits category list is **longer** than the Tasks/Goals category list (adds
Fitness, Wellness, Productivity) — don't copy-paste the Tasks filter list here by mistake.

---

## 3. Goals Board

**Status (2026-06-21):** Step 1 (Empty States + Hover) starting now. Figma source
(fileKey `VwgJovqBGtb90CEfNXkk2T`): node `1250-6857` (default) and node `1250-7794`
(hover), confirmed via `get_metadata` + targeted `get_design_context`. Steps 2+ (populated
board, New Goal popup, Goal preview popup, detail-page empty states — i.e. everything in
§"New Goal popup" / "Goal preview popup" / "Empty state" below) are **not in scope yet** —
documented ahead of time per the user's requirement doc, but don't build them until told.

### Step 1 — Empty States (board has zero real goals)
- **Layout: a 3-column card grid**, not a list (unlike Tasks' kanban columns or Habits'
  single-column rows). Each ghost card is exactly **378.6px × 186px** at desktop, 3 across
  filling the 1156px panel content width (2 gaps between, ~10px each, matching the
  panel's existing `gap-2.5` convention) — confirm exact gap once building, Figma's
  per-card x-offsets are 0 / 388.6 / 777.2 (≈10px gutter each).
- Header row above the grid: same convention as Tasks/Habits — leading small icon (13×13,
  refresh/loop style) + **"✦ N AI Suggestions"** purple pill (here genuinely "3 AI
  Suggestions", no Streak/day-of-week columns since Goals has no weekly schedule concept).
- **Default (non-hover) ghost card:**
  - Card: **dashed** `#e9e9e9` border, `rounded-2xl`, **no background fill** (transparent,
    not even the gray-50 used elsewhere) at rest.
  - Top content block (priority+AI badge row, title, description) and the tags row are both
    at **opacity-40**.
  - **Corrected 2026-06-21 — this *is* a real three-dot menu, not decorative:** the 19×3px
    element top-right is a `MoreHorizontal`-style ⋯ icon exported as SVG with
    `opacity="0"` baked into the default-state asset (confirmed by downloading and reading
    the raw SVG, not just eyeballing its bounding box — `get_metadata`'s width/height alone
    don't reveal this). In the hover frame the *same* icon has no opacity override (i.e.
    opacity 1) and fill `#5d5d5d`. So: hidden at rest, fades in on hover — same convention
    as the Tasks/Habits ghost-card three-dot trigger. **Wired in Step 1** with the same
    Regenerate suggestion / Dismiss menu as Tasks/Habits ghost cards (corrects the earlier
    "purely decorative" decision from this same day — that was based on guessing the icon's
    appearance from its bounding box instead of opening the actual SVG asset).
  - Footer (54px tall, dashed top border): **"Progress" / "0%"** label row + an empty
    `#e9e9e9` progress-bar track (`h-2 rounded-full`) — at opacity-40 too. So unlike Habits'
    ghost rows (which show *nothing* in the footer until hover), **Goals' ghost cards show a
    dimmed empty progress bar by default.**
  - Tags row: category chip + "{N} Tasks" + "{N} Habits" + due-date chip (e.g.
    "May 21, 2026" or relative "In 2 days") — four chips, all dimmed with the rest.
- **Hover state:** card flips to **solid** `#e9e9e9` border, `bg-#fcfcfc` fill, subtle
  shadow (`0px 2px 4px rgba(0,0,0,0.03)`), and **full opacity** on the top block + tags.
  The **entire footer is replaced** (not appended to) by **"AI suggested based on your
  profile"** (left) + a purple **"Accept Goal"** pill with a chevron (right) — the progress
  bar/percentage disappears entirely on hover, matching Tasks/Habits' "footer swaps, doesn't
  stack" convention.
- Sample card content from Figma (illustrative, not fixed copy): "Fitness Regimen" (Urgent),
  "Physical Activity" (High), "Improve Rate" (Medium) — each "✦ AI" tagged.

### Three-dot menu — goal card (Step 2, not Step 1 — documented ahead of time)
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

## 4.5 Font family — Inter, not Poppins (fixed 2026-06-21, applies to all boards)

The whole private dashboard was rendering in **Poppins** (`--font-primary`, the marketing
site's body font) because Inter was never imported, even though every dashboard Figma frame
specifies **Inter**. Poppins vs Inter look close enough at a glance not to register as wrong
until compared pixel-by-pixel against an actual Figma screenshot — boards can look subtly
"off"/bulkier than Figma despite every padding/gap/px value matching, purely from this.

Fixed: added Inter to the Google Fonts `@import` in `src/index.css`, plus a scoped
`.dashboard-font` class (defined in `src/index.css`, applied to `PrivateLayout`'s root div
in `src/components/layout/private/PrivateLayout.jsx`) — **not** a `body` override, since
marketing pages intentionally keep Poppins/Lato/Bungee/Satisfy. If a new board still looks
"off" from Figma after matching every spacing value, check computed `font-family` in
DevTools before re-deriving spacing — it's an easy thing to overlook.

Also fixed same day: `PrivateNavbar.jsx` was `h-[52px]`; every Figma frame specifies
`h-[42px]`. This affects every private page (not just one board) — re-verify it didn't get
reverted if `PrivateNavbar.jsx` is touched again.

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
