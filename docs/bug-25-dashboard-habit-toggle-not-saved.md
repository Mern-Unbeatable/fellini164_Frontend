# BUG 25 — Dashboard: Habit-এ টিক দিলে/তুললে save হয় না

| | |
|---|---|
| **Bug ID** | BUG 25 |
| **Module** | Dashboard → Habit Tracking |
| **Severity** | Medium |
| **ধরন** | Frontend fix। API আগে থেকেই ছিল (Habits page ব্যবহার করে)। |
| **Files** | `src/pages/private/user/userDashboard/UserDashView.jsx`, `src/pages/private/user/userDashboard/components/HabitTracker.jsx` |

---

## ১. সমস্যা

Dashboard-এর "Habits" অংশে habit-এ click করলে টিক বদলাত, কিন্তু অন্য page ঘুরে ফিরলে আগের অবস্থা ফিরে আসত।

**কারণ:** `toggleHabit` শুধু page-এর ভেতরের `checkedHabits` state উল্টাত — কোনো API call হতো না।

### ব্যবহৃত API (আগে থেকেই ছিল)

| কাজ | API | Function |
|---|---|---|
| আজকের জন্য complete (multi-slot habit-এ ১ ধাপ বাড়ে, যেমন 1/4 → 2/4) | `POST /api/v1/habits/:habitId/complete` | `completeHabitTodayApi` |
| আজকের complete বাতিল | `DELETE /api/v1/habits/:habitId/complete` | `undoHabitCompletionApi` |

---

## ২. আগের code (UNDO করতে হলে এগুলো ফিরিয়ে দাও)

### ২.১ `UserDashView.jsx` — import (লাইন 1)

```jsx
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
```

(`toast` আর `habitsAPI` import ছিল না।)

### ২.২ `UserDashView.jsx` — state

```jsx
  const [checkedTasks, setCheckedTasks] = useState({});
  const [checkedHabits, setCheckedHabits] = useState({});
```

### ২.৩ `UserDashView.jsx` — habits sync effect

```jsx
  useEffect(() => {
    if (!habits.length) {
      setCheckedHabits({});
      return;
    }
    const next = {};
    habits.forEach((habit) => {
      next[habit.id] = Boolean(habit.completedToday);
    });
    setCheckedHabits(next);
  }, [habits]);
```

### ২.৪ `UserDashView.jsx` — `toggleHabit`

```jsx
  const toggleHabit = (id) => {
    setCheckedHabits((prev) => ({ ...prev, [id]: !prev[id] }));
  };
```

### ২.৫ `UserDashView.jsx` — `<HabitTracker>` JSX

```jsx
          <HabitTracker
            habits={habits}
            checkedHabits={checkedHabits}
            toggleHabit={toggleHabit}
            shownOf={habitsMeta.shownOf}
            todayPercent={habitsMeta.todayPercent}
          />
```

### ২.৬ `HabitTracker.jsx` — props আর button

```jsx
const HabitTracker = ({ habits, checkedHabits, toggleHabit, shownOf, todayPercent }) => {
```

```jsx
          {habits.map((habit) => {
            const done = Boolean(checkedHabits[habit.id]);
            return (
              <button
                key={habit.id}
                type="button"
                onClick={() => toggleHabit(habit.id)}
                className="flex w-full items-center gap-3 rounded-xl border border-[#f2f2f2] bg-[#fcfcfc] px-3 py-3 text-left transition hover:bg-white dark:border-zinc-700 dark:bg-zinc-900/40 dark:hover:bg-zinc-900/70"
              >
```

---

## ৩. নতুন code

### ৩.১ Import

```jsx
import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
...
import {
  completeHabitTodayApi,
  undoHabitCompletionApi,
} from '../../../../features/habits/habitsAPI';
```

### ৩.২ State — কোন habit save হচ্ছে

```jsx
  const [checkedHabits, setCheckedHabits] = useState({});
  // Habits with a complete/undo request in flight: their button is disabled and a dashboard
  // refetch must not overwrite their optimistic tick.
  const [pendingHabitIds, setPendingHabitIds] = useState(() => new Set());
  const pendingHabitIdsRef = useRef(new Set());
```

### ৩.৩ Habits sync effect — pending habit-এর টিক রেখে দেয়

```jsx
  useEffect(() => {
    if (!habits.length) {
      setCheckedHabits({});
      return;
    }
    setCheckedHabits((prev) => {
      const next = {};
      habits.forEach((habit) => {
        next[habit.id] = pendingHabitIdsRef.current.has(habit.id)
          ? Boolean(prev[habit.id])
          : Boolean(habit.completedToday);
      });
      return next;
    });
  }, [habits]);
```

### ৩.৪ `toggleHabit` — API call + rollback

```jsx
  const setHabitPending = (id, isPending) => {
    if (isPending) pendingHabitIdsRef.current.add(id);
    else pendingHabitIdsRef.current.delete(id);
    setPendingHabitIds(new Set(pendingHabitIdsRef.current));
  };

  const toggleHabit = async (id) => {
    if (pendingHabitIdsRef.current.has(id)) return;
    const wasDone = Boolean(checkedHabits[id]);
    setHabitPending(id, true);
    setCheckedHabits((prev) => ({ ...prev, [id]: !wasDone }));
    try {
      if (wasDone) await undoHabitCompletionApi(id);
      else await completeHabitTodayApi(id);
      setHabitPending(id, false);
      dispatch(fetchDashboard());
    } catch (error) {
      setHabitPending(id, false);
      setCheckedHabits((prev) => ({ ...prev, [id]: wasDone }));
      toast.error(error?.response?.data?.message || 'Failed to update habit');
    }
  };
```

### ৩.৫ `<HabitTracker>` — `pendingHabitIds` prop

```jsx
          <HabitTracker
            habits={habits}
            checkedHabits={checkedHabits}
            toggleHabit={toggleHabit}
            pendingHabitIds={pendingHabitIds}
            shownOf={habitsMeta.shownOf}
            todayPercent={habitsMeta.todayPercent}
          />
```

### ৩.৬ `HabitTracker.jsx` — save চলার সময় button disabled

```jsx
const HabitTracker = ({ habits, checkedHabits, toggleHabit, pendingHabitIds, shownOf, todayPercent }) => {
```

```jsx
            const done = Boolean(checkedHabits[habit.id]);
            const pending = Boolean(pendingHabitIds?.has(habit.id));
            return (
              <button
                key={habit.id}
                type="button"
                onClick={() => toggleHabit(habit.id)}
                disabled={pending}
                aria-pressed={done}
                className="... disabled:cursor-wait disabled:opacity-60"
              >
```

---

## ৪. এখন কী হবে

| অবস্থা | আগে | এখন |
|---|---|---|
| টিক দেওয়া | শুধু screen-এ | Screen-এ সাথে সাথে + `POST /complete` |
| টিক তোলা | শুধু screen-এ | Screen-এ সাথে সাথে + `DELETE /complete` |
| অন্য page ঘুরে ফেরা | আগের অবস্থা ফিরে আসত | নতুন অবস্থা থাকে |
| Save সফল | — | Dashboard আবার load ("X completed today", "% today" ঠিক হয়) |
| API ব্যর্থ | — | Error toast, টিক আগের অবস্থায় ফেরে |
| Save চলার সময় একই habit-এ click | — | কিছু হয় না (button disabled), দুবার call যায় না |
| Multi-slot habit (যেমন 1/4) | — | টিক দিলে ১ ধাপ বাড়ে (2/4)। সব ধাপ শেষ না হলে reload-এর পরে টিক আবার খালি দেখাতে পারে, কিন্তু progress label (2/4) বাড়ে। Habits page-এর নিয়মের সাথে মিলে। |

### যা ইচ্ছাকৃতভাবে বদলানো হয়নি

Dashboard-এর **Today's Focus (task) checkbox**-এ (`toggleTask`) একই সমস্যা আছে — শুধু screen-এ বদলায়। কিন্তু schedule-এ task আর habit মেশানো (`itemType`), আর item-এর `id` আসল task id নাকি planner item id সেটা নিশ্চিত না। ভুল id-তে API call করলে অন্য জিনিস বদলে যেতে পারে, তাই backend থেকে নিশ্চিত হওয়ার আগে এটা ছোঁয়া হয়নি।

**Backend-কে প্রশ্ন:** `GET /dashboard`-এর `schedule[].id` কি আসল task/habit id? Task complete/undo-র জন্য কোন API ব্যবহার করা উচিত?

---

## ৫. Test-এর ধাপ

1. Dashboard → Habits → একটা খালি habit-এ click → টিক আসবে।
2. Tasks বা অন্য page-এ যাও → Dashboard-এ ফেরো → টিক থাকবে।
3. টিক দেওয়া habit-এ click → টিক উঠে যাবে → অন্য page ঘুরে ফেরো → খালি থাকবে।
4. Habits page-এও একই habit-এর আজকের অবস্থা মিলবে।
5. দ্রুত দুবার click → একবারই কাজ করবে।

---

## ৬. UNDO করার উপায়

```bash
git checkout -- src/pages/private/user/userDashboard/UserDashView.jsx src/pages/private/user/userDashboard/components/HabitTracker.jsx
```

শুধু তখনই চালাও যদি এই দুই file-এ BUG 25 ছাড়া অন্য কোনো uncommitted পরিবর্তন না থাকে (`git diff` দিয়ে দেখে নাও)। নইলে উপরের "২. আগের code" অংশ দিয়ে হাতে বদলে দাও।
