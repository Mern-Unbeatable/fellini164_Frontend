# BUG 23 — Goal Full Page: Link করা Task/Habit save হয় না

| | |
|---|---|
| **Bug ID** | BUG 23 |
| **Module** | Goals Board → Expanded (Full Page) View |
| **Severity** | High |
| **ধরন** | Frontend fix। Backend-এর API আগে থেকেই ছিল, কিছু লাগেনি। |
| **File** | `src/pages/private/user/focus/Goals/GoalDetailPage.jsx` (একটাই file) |

---

## ১. সমস্যা

Goal-এর full page-এ "Linked Tasks"-এর **+** দিয়ে task link করলে list-এ দেখা যেত, কিন্তু page বন্ধ করে আবার খুললে হারিয়ে যেত।

**কারণ:** Full page শুধু page-এর ভেতরের সাময়িক list (`editedLists`)-এ card যোগ করত — backend-এ কোনো API call করত না। Sidebar (`ActiveGoals.jsx`) ঠিকভাবে `linkTasksToGoal` / `linkHabitsToGoal` call করে, তাই sidebar-এ সমস্যা ছিল না।

একই ভুল আরও দুই জায়গায় ছিল (QA ধরেনি, একসাথে ঠিক করা হয়েছে):
- Full page → **Linked Habits**-এর **+**
- Full page → **Spark (AI) popup** থেকে আগে থেকে থাকা task/habit বেছে attach করা

(Spark দিয়ে **নতুন** task/habit generate করা ঠিকই ছিল — backend generate-এর সময় `goalId` পেয়ে নিজেই link করে।)

### ব্যবহৃত API (আগে থেকেই ছিল)

| কাজ | API |
|---|---|
| Task link | `POST /api/v1/goals/:goalId/link-tasks` — body `{ taskIds: [...] }` |
| Habit link | `POST /api/v1/goals/:goalId/link-habits` — body `{ habitIds: [...] }` |

---

## ২. আগের code (UNDO করতে হলে এগুলো ফিরিয়ে দাও)

### ২.১ Import (`goalsSlice` থেকে)

```jsx
import {
  clearCurrentGoal,
  deleteGoal,
  fetchGoalById,
  selectCurrentGoal,
  selectCurrentGoalHabits,
  selectCurrentGoalTasks,
  selectGoalDetailLoading,
  selectGoals,
  updateGoal,
  updateGoalStatus,
} from '../../../../../features/goals/goalsSlice';
```

### ২.২ State

```jsx
  const [linkModal, setLinkModal] = useState({ open: false, type: 'tasks' });
  const [sparkModal, setSparkModal] = useState({ open: false, type: 'tasks' });
```

(এর মাঝে `linking` state ছিল না।)

### ২.৩ `handleConfirmLink` (+ button)

```jsx
  const handleConfirmLink = (ids, selectedItems = []) => {
    if (!ids?.length) return;
    if (linkModal.type === 'tasks') {
      const base = editedLists.goalId === goalId && editedLists.tasks ? editedLists.tasks : tasks;
      const cards = optionsToTaskCards(selectedItems).filter(
        (c) => !base.some((t) => t.id === c.id),
      );
      mergeEditedTasks([...base, ...cards]);
    } else {
      const base =
        editedLists.goalId === goalId && editedLists.habits ? editedLists.habits : habits;
      const cards = optionsToHabitCards(selectedItems).filter(
        (c) => !base.some((h) => h.id === c.id),
      );
      mergeEditedHabits([...base, ...cards]);
    }
    setLinkModal({ open: false, type: 'tasks' });
  };
```

### ২.৪ `handleSparkAttach` (Spark popup → attach)

```jsx
  const handleSparkAttach = (ids, selectedItems = []) => {
    if (!ids?.length) return;
    if (sparkModal.type === 'tasks') {
      const base = editedLists.goalId === goalId && editedLists.tasks ? editedLists.tasks : tasks;
      const cards = optionsToTaskCards(selectedItems).filter(
        (c) => !base.some((t) => t.id === c.id),
      );
      mergeEditedTasks([...base, ...cards]);
    } else {
      const base =
        editedLists.goalId === goalId && editedLists.habits ? editedLists.habits : habits;
      const cards = optionsToHabitCards(selectedItems).filter(
        (c) => !base.some((h) => h.id === c.id),
      );
      mergeEditedHabits([...base, ...cards]);
    }
  };
```

### ২.৫ `<LinkItemsModal>` JSX

```jsx
      <LinkItemsModal
        key={`${linkModal.open}-${linkModal.type}-${goal?.id ?? 'none'}`}
        open={linkModal.open}
        type={linkModal.type}
        goalTitle={goal?.title}
        excludeIds={
          linkModal.type === 'tasks'
            ? tasks.map((t) => t.id).filter(Boolean)
            : habits.map((h) => h.id).filter(Boolean)
        }
        onClose={() => setLinkModal({ open: false, type: 'tasks' })}
        onConfirm={handleConfirmLink}
      />
```

---

## ৩. নতুন code

### ৩.১ Import — `linkHabitsToGoal`, `linkTasksToGoal` যোগ

```jsx
import {
  clearCurrentGoal,
  deleteGoal,
  fetchGoalById,
  linkHabitsToGoal,
  linkTasksToGoal,
  selectCurrentGoal,
  ...
} from '../../../../../features/goals/goalsSlice';
```

### ৩.২ State

```jsx
  const [linkModal, setLinkModal] = useState({ open: false, type: 'tasks' });
  const [linking, setLinking] = useState(false);
  const [sparkModal, setSparkModal] = useState({ open: false, type: 'tasks' });
```

### ৩.৩ নতুন helper — `linkItemsToGoal`

```jsx
  // Shows the cards right away, persists via link-tasks / link-habits, then re-reads the goal.
  // On failure the optimistic cards are rolled back (the thunk already shows the error toast).
  const linkItemsToGoal = async (type, ids, selectedItems = []) => {
    const isTasks = type === 'tasks';
    const listKey = isTasks ? 'tasks' : 'habits';
    const base = isTasks ? tasks : habits;
    const previousOverride = editedLists.goalId === goalId ? editedLists[listKey] : null;
    const cards = (isTasks ? optionsToTaskCards : optionsToHabitCards)(selectedItems).filter(
      (c) => !base.some((item) => item.id === c.id),
    );
    if (cards.length) {
      if (isTasks) mergeEditedTasks([...base, ...cards]);
      else mergeEditedHabits([...base, ...cards]);
    }

    const thunk = isTasks ? linkTasksToGoal : linkHabitsToGoal;
    const result = await dispatch(
      isTasks
        ? linkTasksToGoal({ goalId: goal.id, taskIds: ids })
        : linkHabitsToGoal({ goalId: goal.id, habitIds: ids }),
    );

    if (!thunk.fulfilled.match(result)) {
      setEditedLists((prev) =>
        prev.goalId === goalId ? { ...prev, [listKey]: previousOverride } : prev,
      );
      return false;
    }

    await dispatch(fetchGoalById(goal.id));
    setEditedLists((prev) => (prev.goalId === goalId ? { ...prev, [listKey]: null } : prev));
    return true;
  };
```

### ৩.৪ `handleConfirmLink`

```jsx
  const handleConfirmLink = async (ids, selectedItems = []) => {
    if (!ids?.length || linking) return;
    setLinking(true);
    const ok = await linkItemsToGoal(linkModal.type, ids, selectedItems);
    setLinking(false);
    if (ok) setLinkModal({ open: false, type: 'tasks' });
  };
```

### ৩.৫ `handleSparkAttach`

```jsx
  const handleSparkAttach = (ids, selectedItems = []) => {
    if (!ids?.length) return;
    linkItemsToGoal(sparkModal.type, ids, selectedItems);
  };
```

### ৩.৬ `<LinkItemsModal>` — `confirming` prop যোগ

```jsx
        onConfirm={handleConfirmLink}
        confirming={linking}
      />
```

---

## ৪. এখন কী হবে

| অবস্থা | আগে | এখন |
|---|---|---|
| Full page → + → task link | Screen-এ দেখায়, save হয় না | সাথে সাথে দেখায় + backend-এ save |
| Page বন্ধ করে আবার খোলা | Link হারিয়ে যায় | Link থাকে |
| Full page → + → habit link | Save হয় না | Save হয় |
| Spark popup → existing attach | Save হয় না | Save হয় |
| Save চলার সময় modal | — | Confirm button disabled (দুবার save হয় না) |
| API ব্যর্থ | — | Error toast, যোগ করা card সরে যায়, modal খোলা থাকে (আবার চেষ্টা করা যায়) |
| Sidebar থেকে link | কাজ করত | বদলায়নি |

---

## ৫. Test-এর ধাপ

1. Goals → একটা goal-এ click → sidebar → full page আইকন।
2. Linked Tasks-এর **+** → ২–৩টা task বেছে confirm।
3. Card-গুলো দেখা যাবে, count বাড়বে।
4. Page থেকে বের হয়ে Goals board → আবার একই goal খোলো (sidebar ও full page দুটোতেই) → link করা task থাকবে।
5. Linked Habits-এর **+** দিয়ে একই test।
6. Spark (AI) button → existing task attach → একই test।

---

## ৬. UNDO করার উপায়

```bash
git checkout -- src/pages/private/user/focus/Goals/GoalDetailPage.jsx
```

শুধু তখনই চালাও যদি এই file-এ BUG 23 ছাড়া অন্য কোনো uncommitted পরিবর্তন না থাকে (`git diff` দিয়ে দেখে নাও)। নইলে উপরের "২. আগের code" অংশ দিয়ে হাতে বদলে দাও।
