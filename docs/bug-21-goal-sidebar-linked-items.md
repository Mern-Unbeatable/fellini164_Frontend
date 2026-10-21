# BUG 21 — Goal Details Sidebar: Linked Tasks-এ শুধু একটা task দেখায়

| | |
|---|---|
| **Bug ID** | BUG 21 |
| **Module** | Goals Board → Details Sidebar |
| **Severity** | Medium |
| **ধরন** | Frontend, শুধু UI (data ঠিকমতো আসছিল) |
| **File** | `src/pages/private/user/focus/Goals/components/GoalDetailPanel.jsx` (একটাই file) |
| **সিদ্ধান্ত** | Option (খ) — উপর-নিচে list, প্রথমে ৪টা, তারপর "View All" |

---

## ১. সমস্যা

Goal-এ click করলে ডান দিকের sidebar-এ "Linked Tasks"-এর count ঠিক দেখায় (যেমন 4), কিন্তু নিচে একটাই task card দেখা যায়। Full page-এ সব দেখা যায়।

**কারণ:** Card-গুলো পাশাপাশি এক লাইনে (horizontal) সাজানো ছিল। প্রথম card 310px চওড়া হওয়ায় sidebar প্রায় ভরে যেত, বাকি card ডান দিকে বাইরে চলে যেত। পাশে scroll করার scrollbar লুকানো (`scrollbar-hidden`) ছিল, তাই বোঝা যেত না যে আরও card আছে।

"Linked Habits"-এও হুবহু একই সমস্যা ছিল — একসাথে ঠিক করা হয়েছে।

---

## ২. আগের code (UNDO করতে হলে এগুলো ফিরিয়ে দাও)

### ২.১ Import (লাইন 1–13)

```jsx
import { useEffect, useRef, useState } from 'react';
import {
  Sparkles,
  MoreHorizontal,
  Flag,
  Plus,
  X,
  ExternalLink,
  CircleX,
  Pencil,
  Pause,
  Trash2,
} from 'lucide-react';
```

### ২.২ `LinkedTaskCard` — শুরুর অংশ

```jsx
function LinkedTaskCard({ task, compact = false }) {
  return (
    <div
      className={`flex shrink-0 flex-col overflow-hidden rounded-xl border border-[#f2f2f2] bg-[#fcfcfc] dark:border-zinc-700 dark:bg-zinc-800 ${
        compact ? 'w-[270px]' : 'w-[310px]'
      }`}
    >
```

### ২.৩ `LinkedHabitCard` — শুরুর অংশ

```jsx
function LinkedHabitCard({ habit, compact = false }) {
  const progress = habit.todayProgress;

  return (
    <div
      className={`flex shrink-0 items-end overflow-hidden rounded-xl border border-[#f2f2f2] bg-[#fcfcfc] dark:border-zinc-700 dark:bg-zinc-800 ${
        compact ? 'w-[270px]' : 'w-[310px]'
      }`}
    >
```

### ২.৪ `GoalDetailPanel` — state (লাইন 268–270 এর কাছে)

```jsx
  const [menuOpen, setMenuOpen] = useState(false);
```

(এর পরে নতুন কোনো state ছিল না।)

### ২.৫ Linked Tasks list

```jsx
              {linkedTasks.length === 0 ? (
                <EmptyLinkedState message="No linked tasks yet" />
              ) : (
                <div className="scrollbar-hidden flex w-full gap-2 overflow-x-auto pb-1">
                  {linkedTasks.map((task, index) => (
                    <LinkedTaskCard key={task.id} task={task} compact={index > 0} />
                  ))}
                </div>
              )}
```

### ২.৬ Linked Habits list

```jsx
              {linkedHabits.length === 0 ? (
                <EmptyLinkedState message="No linked habits yet" />
              ) : (
                <div className="scrollbar-hidden flex w-full gap-2 overflow-x-auto pb-1">
                  {linkedHabits.map((habit, index) => (
                    <LinkedHabitCard key={habit.id} habit={habit} compact={index > 0} />
                  ))}
                </div>
              )}
```

---

## ৩. নতুন code

### ৩.১ Import — `ArrowDown`, `ArrowUp` যোগ

```jsx
import {
  Sparkles,
  MoreHorizontal,
  Flag,
  Plus,
  X,
  ExternalLink,
  CircleX,
  Pencil,
  Pause,
  Trash2,
  ArrowDown,
  ArrowUp,
} from 'lucide-react';
```

### ৩.২ নতুন constant + "View All" button component

```jsx
const SIDEBAR_LINKED_PREVIEW = 4;

function ViewAllToggle({ expanded, total, noun, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="mx-auto flex items-center gap-1.5 pt-1 text-[13px] font-medium text-[#c2c2c2] hover:text-[#8022fe]"
    >
      {expanded ? 'Show Less' : `View All ${total} ${noun}`}
      {expanded ? <ArrowUp size={13} /> : <ArrowDown size={13} />}
    </button>
  );
}
```

### ৩.৩ Card — পুরো চওড়া (`compact` prop বাদ)

```jsx
function LinkedTaskCard({ task }) {
  return (
    <div className="flex w-full flex-col overflow-hidden rounded-xl border border-[#f2f2f2] bg-[#fcfcfc] dark:border-zinc-700 dark:bg-zinc-800">
```

```jsx
function LinkedHabitCard({ habit }) {
  const progress = habit.todayProgress;

  return (
    <div className="flex w-full items-end overflow-hidden rounded-xl border border-[#f2f2f2] bg-[#fcfcfc] dark:border-zinc-700 dark:bg-zinc-800">
```

### ৩.৪ State — কোন goal-এর list খোলা

```jsx
  const [menuOpen, setMenuOpen] = useState(false);
  // Goal id whose full linked list is expanded; switching goals collapses back to the preview.
  const [expandedTasksFor, setExpandedTasksFor] = useState(null);
  const [expandedHabitsFor, setExpandedHabitsFor] = useState(null);
```

```jsx
  const showAllTasks = expandedTasksFor === goal.id;
  const showAllHabits = expandedHabitsFor === goal.id;
```

### ৩.৫ Linked Tasks list — উপর-নিচে, প্রথমে ৪টা

```jsx
              {linkedTasks.length === 0 ? (
                <EmptyLinkedState message="No linked tasks yet" />
              ) : (
                <div className="flex w-full flex-col gap-2">
                  {(showAllTasks ? linkedTasks : linkedTasks.slice(0, SIDEBAR_LINKED_PREVIEW)).map((task) => (
                    <LinkedTaskCard key={task.id} task={task} />
                  ))}
                  {linkedTasks.length > SIDEBAR_LINKED_PREVIEW && (
                    <ViewAllToggle
                      expanded={showAllTasks}
                      total={linkedTasks.length}
                      noun="tasks"
                      onToggle={() => setExpandedTasksFor(showAllTasks ? null : goal.id)}
                    />
                  )}
                </div>
              )}
```

Linked Habits-এও একই (`habits`, `setExpandedHabitsFor`)।

---

## ৪. এখন কেমন দেখাবে

| অবস্থা | আগে | এখন |
|---|---|---|
| ১টা linked task | ১টা card | ১টা card (পুরো চওড়া) |
| ৩টা linked task | ১টা দেখা যেত, বাকি লুকানো | ৩টাই উপর-নিচে |
| ৭টা linked task | ১টা দেখা যেত | প্রথম ৪টা + "View All 7 tasks" → click করলে ৭টাই, "Show Less" দিয়ে আবার ৪টা |
| অন্য goal-এ click | — | List আবার ৪টায় ফিরে যায় |
| Linked Habits | একই সমস্যা | একইভাবে ঠিক |
| Sidebar চওড়া/সরু করা (resize) | Card fixed 310px | Card sidebar-এর চওড়া অনুযায়ী বাড়ে/কমে |

---

## ৫. UNDO করার উপায়

**সহজ উপায় (git):**

```bash
git checkout -- src/pages/private/user/focus/Goals/components/GoalDetailPanel.jsx
```

এটা শুধু তখনই ব্যবহার করো যদি এই file-এ BUG 21 ছাড়া অন্য কোনো uncommitted পরিবর্তন না থাকে। চালানোর আগে `git diff` দিয়ে দেখে নাও।

**হাতে undo:** উপরের "২. আগের code" অংশের প্রতিটা block দিয়ে "৩. নতুন code"-এর অংশগুলো বদলে দাও, আর `SIDEBAR_LINKED_PREVIEW`, `ViewAllToggle`, `expandedTasksFor`, `expandedHabitsFor`, `showAllTasks`, `showAllHabits` মুছে দাও।
