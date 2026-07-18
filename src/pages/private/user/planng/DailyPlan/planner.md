# Planner Board — MVP, Rules, Flow, and Figma (Pixel-Perfect Contract)

Status: Frontend mock implementation complete; backend integration not started  
Primary route: `/user/daily-plan`  
Frontend module: `src/pages/private/user/planng/DailyPlan/`

Same contract style as Tasks (`focus/Tasks/tasks.md`) and Habits (`focus/Habits/habits.md`).

**Source brief (authentic):** User dashboard to Planner Board needs UI fixes, like Figma — MVP + RULES + FLOW + FIGMA UI.  
**Do not invent. Do not remove Figma controls. Change only what the Fix requires.**

---

## Fix ONLY

User dashboard to Planner Board needs UI fixes, like Figma.  
Check the **MVP**, **RULES**, **FLOW**, and **FIGMA UI** pixel perfect.

## Do NOT touch

Do not change any other files outside Planner Board Fix scope.  
Read the Figma fully before writing any code. Do not invent controls that remove approved Figma affordances without product confirmation.

---

## MVP

### Planner AI — MVP Rule (Planner Board)

> Planner AI does NOT modify task or habit content.
>
> **AI can:**
>
> - reorder tasks and habits  
> - rebalance workload  
> - move items to different time slots  
> - Optimize schedule timing  
> - reduce overload  
> - create focus spacing  
>
> **AI can NOT:**
>
> - edit titles  
> - edit descriptions  
> - edit subtasks  
> - edit categories  
> - edit habit structure/content  
>
> Task and Habit content management belongs to their own AI systems outside the Planner layer.

---

## RULES

### Planner Board

> Main interaction in Planner Board happens through the AI chat panel on the right side.
>
> For MVP, all AI actions, schedule changes, plan generation, rebalance flows, and planner adjustments are handled through chat interaction instead of separate popups or advanced interaction systems.
>
> **Users can:**
>
> - Generate a new plan  
> - Adjust existing schedule  
> - Rebalance workload  
> - Reduce overload  
> - Optimize schedule  
> - Accept or dismiss AI suggestions  
> - Undo AI changes  
>
> AI responses update the planner in real time.
>
> **Planner supports:**
>
> - Daily view  
> - Weekly view  
> - Monthly view  
>
> Daily view contains the most detailed interaction level. Weekly and Monthly are simplified overview states.
>
> **AI Actions button:**  
> On click, AI sends a message inside the chat with available actions:
>
> - Recalibrate my day  
> - Reduce overload  
> - Optimize schedule  
>
> User selects one option directly in chat and AI continues the flow from there.
>
> For MVP, planner changes are visualized through:
>
> - skeleton loading states  
> - shimmer/wireframe generation states  
> - live card appearance animations  
> - AI labels and adaptive states  
>
> Future versions after MVP may replace some chat flows with dedicated popups and deeper contextual AI interactions.

### Frame 4 — AI Actions (from Figma step-by-step)

> The user taps AI Actions and then the AI suggests 3 options in the chat.

(Options = Recalibrate my day / Reduce overload / Optimize schedule.)

---

## Figma nodes

File: [Elyxa.Ai — Phase 2](https://www.figma.com/design/VwgJovqBGtb90CEfNXkk2T/Elyxa.Ai--Phase-2---Copy-)

| Frame | Link |
|-------|------|
| Planner Board (1440) - 1 - Empty States | https://www.figma.com/design/VwgJovqBGtb90CEfNXkk2T/Elyxa.Ai--Phase-2---Copy-?node-id=1260-22919&m=dev |
| Planner Board (1440) - 1.1 - Empty States | https://www.figma.com/design/VwgJovqBGtb90CEfNXkk2T/Elyxa.Ai--Phase-2---Copy-?node-id=1264-25106&m=dev |
| Planner Board (1440) - 1.2 - Empty States | https://www.figma.com/design/VwgJovqBGtb90CEfNXkk2T/Elyxa.Ai--Phase-2---Copy-?node-id=1264-26177&m=dev |
| Planner Board (1440) - 1 - Empty States - hover | https://www.figma.com/design/VwgJovqBGtb90CEfNXkk2T/Elyxa.Ai--Phase-2---Copy-?node-id=1266-39863&m=dev |
| Planner Board (1440) - 1.1 - Empty States - hover | https://www.figma.com/design/VwgJovqBGtb90CEfNXkk2T/Elyxa.Ai--Phase-2---Copy-?node-id=1266-40215&m=dev |
| Planner Board (1440) - 1.2 - Empty States - hover | https://www.figma.com/design/VwgJovqBGtb90CEfNXkk2T/Elyxa.Ai--Phase-2---Copy-?node-id=1266-40470&m=dev |
| Planner Board (1440) - 2 | https://www.figma.com/design/VwgJovqBGtb90CEfNXkk2T/Elyxa.Ai--Phase-2---Copy-?node-id=1263-24108&m=dev |
| Planner Board (1440) - 2.1 | https://www.figma.com/design/VwgJovqBGtb90CEfNXkk2T/Elyxa.Ai--Phase-2---Copy-?node-id=1264-25455&m=dev |
| Planner Board (1440) - 2.2 | https://www.figma.com/design/VwgJovqBGtb90CEfNXkk2T/Elyxa.Ai--Phase-2---Copy-?node-id=1264-26526&m=dev |
| Planner Board (1440) - 3 | https://www.figma.com/design/VwgJovqBGtb90CEfNXkk2T/Elyxa.Ai--Phase-2---Copy-?node-id=1264-28525&m=dev |
| Planner Board (1440) - 4 | https://www.figma.com/design/VwgJovqBGtb90CEfNXkk2T/Elyxa.Ai--Phase-2---Copy-?node-id=1264-29142&m=dev |

Node IDs: `1260:22919`, `1264:25106`, `1264:26177`, `1266:39863`, `1266:40215`, `1266:40470`, `1263:24108`, `1264:25455`, `1264:26526`, `1264:28525`, `1264:29142`.

**Step-by-step flow (Figma order):**  
1 / 1.1 / 1.2 Empty → Empty hovers → 2 / 2.1 / 2.2 Accepted → 3 → **AI Actions** (Rule: 3 options in chat) → 4.

---

## Responsive + text sizing

> Fully responsive (Desktop, Laptop, Tablet, Mobile).
>
> Responsive, and text sizing must follow the user dashboard Work to [Tasks, Habits, Goals].

Implement all Planner pages pixel-perfect to the Figma links above across Desktop / Laptop / Tablet / Mobile.

---

## FLOW — how to verify in the app

Build must flow from **Figma + MVP + Rules**. Verify full flow before done.

| Step | URL / action | Matches |
|------|----------------|---------|
| Empty Daily | `/user/daily-plan` (empty / Daily) | Frame 1 — Empty States |
| Empty Weekly | Switch to Weekly (empty) | Frame 1.1 |
| Empty Monthly | Switch to Monthly (empty) | Frame 1.2 |
| Empty hover | Hover empty / ghost cards | Frames 1 / 1.1 / 1.2 — hover |
| Accepted Daily | Accept plan / populated Daily | Frame 2 |
| Accepted Weekly | Weekly populated | Frame 2.1 |
| Accepted Monthly | Monthly populated | Frame 2.2 |
| Continued | Post-accept continued state | Frame 3 |
| AI Actions | Tap **AI Actions** | Frame 4 — 3 chat options |
| Chat-only AI | Generate / rebalance / overload / optimize / accept / dismiss / undo | RULES — no separate popups |
| MVP content | Confirm titles/descriptions/subtasks/categories/habit content unchanged by Planner AI | MVP denylist |
| Responsive | Desktop / Laptop / Tablet / Mobile | Match Work boards text sizing |

---

## Agent rules (from brief)

- **Most Important:** Before providing the code, list potential mistakes and confirm the rules.  
- Build must flow yourself from Figma + MVP + Rules  
- Implement all pages pixel-perfect  
- Fully responsive (Desktop, Laptop, Tablet, Mobile)  
- Do not change any other files  
- Read the Figma fully before writing any code  
- Do not invent  
- Do not remove any Figma control  
- Verify full flow before done  

---

## Potential mistakes to avoid (confirm before coding)

1. Letting Planner AI edit Task/Habit **content** (title, description, subtasks, category, habit structure) — **forbidden**.  
2. Adding AI schedule popups / advanced systems instead of **chat-only** MVP flows.  
3. Inventing AI Actions beyond the three: Recalibrate my day / Reduce overload / Optimize schedule.  
4. Treating Weekly/Monthly as full Daily detail — they are **simplified overviews**.  
5. Skipping skeleton / shimmer / live card / AI label visualization states.  
6. Changing Tasks / Habits / Goals files or dashboard chrome outside Planner Fix.  
7. Ignoring responsive + text-sizing parity with Work boards (Tasks, Habits, Goals).  
8. Writing code before reading the linked Figma frames end-to-end.

---

## Implementation map

| File / area | Role |
|-------------|------|
| `DailyPlan/` board entry | Daily / Weekly / Monthly views |
| AI chat panel (right) | Main MVP interaction surface |
| AI Actions → chat | Frame 4 — three options |
| Skeleton / shimmer / card enter | MVP visualization states |
| `planner.md` | This file |
| `planner_specification.md` | Short pointer |

---

## Traceability checklist

- [x] Fix ONLY + Do NOT touch present  
- [x] MVP Planner AI can / can NOT present **same wording**  
- [x] RULES present **same wording** (chat-first, views, AI Actions, viz states)  
- [x] Frame 4 rule: AI suggests 3 options in chat  
- [x] All Figma node links present (1 → 4)  
- [x] Responsive + Work board text-sizing rule present  
- [x] FLOW table for app verification  
- [x] Agent rules + potential mistakes list present  
