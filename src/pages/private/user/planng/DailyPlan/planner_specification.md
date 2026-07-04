# Planner Board Specification

The Main interaction in the Planner Board happens through the AI chat panel on the right side.

For the MVP, all AI actions, schedule changes, plan generation, rebalance flows, and planner adjustments are handled through chat interaction instead of separate popups or advanced interaction systems.

## User Capabilities

Users can:
- **Generate a new plan**
- **Adjust existing schedule**
- **Rebalance workload**
- **Reduce overload**
- **Optimize schedule**
- **Accept or dismiss AI suggestions**
- **Undo AI changes**

AI responses update the planner in real time.

## Planner Layouts

Planner supports:
- **Daily view**
- **Weekly view**
- **Monthly view**

*Note: Daily view contains the most detailed interaction level. Weekly and Monthly are simplified overview states.*

## AI Actions Button Flow

1. On click, AI sends a message inside the chat with available actions:
   - Recalibrate my day
   - Reduce overload
   - Optimize schedule
2. User selects one option directly in the chat.
3. AI continues the flow and updates the planner in real time.

## Visual Feedback (MVP)

Planner changes are visualized through:
- **Skeleton loading states / Shimmer effects** during AI generation/rebalancing.
- **Live card appearance animations** when new plans are generated or scheduled.
- **AI labels and adaptive states** on modified/suggested cards.
