# Bug 01, 02, 03 — Client-এর সিদ্ধান্ত ও পরিবর্তনের পরিকল্পনা

Client জানিয়েছে Bug 01 (Global Search), 02 (Settings gear) আর 03 (Create বাটন) MVP-তে কাজ করবে। Designer-এর কাছে নতুন design লাগবে না। আগে থেকে বানানো component, style আর functionality যতটা সম্ভব reuse করতে হবে।

## Client-এর মূল শর্ত

- তিনটাই সহজ রাখতে হবে, বর্তমান Elyxa design-এর সাথে মিলিয়ে।
- নতুন design বা বড় development task বানানো যাবে না।
- Search বানাতে অনেক বেশি কাজ লাগলে আগে Settings আর Create চালু করতে হবে। তখন search bar সাময়িকভাবে লুকিয়ে রাখা যাবে, কিন্তু অকেজো search bar দেখানো যাবে না।
- এর পাশাপাশি বাকি QA bug-গুলোও ঠিক করতে হবে।

## কাজের ক্রম

1. **Bug 02 — Settings gear** (সবচেয়ে ছোট কাজ)
2. **Bug 03 — Create বাটন** (ছোট কাজ, তিনটা modal আগে থেকেই আছে)
3. **Bug 01 — Global Search** (মাঝারি কাজ, তবে backend-এ নতুন কিছু লাগবে না)

---

## Bug 02 — Settings Gear Icon

### Client যা চায়

- Gear icon-এ click করলে বর্তমান Settings / Account page-এ যাবে।
- আগে থেকে থাকা settings-ই দেখাতে হবে: Profile/account তথ্য, password/security, notification preferences, subscription/billing, logout বা account management।
- নতুন Settings system বানানো যাবে না। **শুধু যা আসলে কাজ করে সেগুলোই দেখাতে হবে।**

### এখন কী অবস্থা

- `src/components/layout/private/PrivateNavbar.jsx`: gear icon-এ কোনো click handler নেই।
- `/settings` route আছে, ওটা `src/pages/private/user/account/Settings.jsx` দেখায়। কিন্তু ওই page-এর জিনিসগুলো কাজ করে না:
  - **Notifications toggle:** শুধু page-এর ভেতরের state, কোনো API-তে save হয় না।
  - **AI Personality "Change" বাটন:** কোনো handler নেই।
  - **Dark Mode:** code-এ comment করে বন্ধ রাখা।
- অন্য page-এ যেগুলো আসলেই কাজ করে:
  - `/user/profile`: নাম update আর password change (API-তে যুক্ত)
  - `/user/subscription`: plan আর billing
  - `/user/notifications`: notification-এর list
  - Navbar-এর account menu: Logout

### কী পরিবর্তন হবে

- **`PrivateNavbar.jsx`:** gear icon-কে `<Link to="/settings">` বানানো।
- **`Settings.jsx`:** dashboard-এর style-এ নতুন করে সাজানো। এতে শুধু কাজ করে এমন অংশগুলো থাকবে:
  - **Account:** নাম, email আর বর্তমান plan দেখাবে। "Edit profile" দিয়ে `/user/profile`-এ যাবে।
  - **Security:** "Change password" দিয়ে `/user/profile`-এর password অংশে যাবে।
  - **Subscription & Billing:** বর্তমান plan দেখাবে। "Manage subscription" দিয়ে `/user/subscription`-এ যাবে।
  - **Notifications:** "View notifications" দিয়ে `/user/notifications`-এ যাবে।
  - **Logout:** navbar-এর মতো একই logout।
- **সরানো হবে:** Notifications toggle, AI Personality আর comment করা Dark Mode অংশ, কারণ এগুলো কাজ করে না।

### খোলা প্রশ্ন

- **Notification preferences (on/off):** frontend-এ preference save করার কোনো API নেই। Client "শুধু যা কাজ করে" বলেছে, তাই আপাতত toggle দেখাব না। Backend-এ এমন API থাকলে জানালে যুক্ত করা যাবে।
- **Delete account:** frontend-এ এর কোনো API নেই, তাই দেখানো হবে না।

---

## Bug 03 — Create বাটন (Left Sidebar)

### Client যা চায়

- Create বাটনে click করলে ছোট একটা dropdown খুলবে, তিনটা option সহ: Create Task, Create Habit, Create Goal।
- কোনো option বাছলে আগে থেকে থাকা creation form/modal খুলবে।
- Create সফল হলে item save হবে আর সঠিক board-এ দেখা যাবে।
- আলাদা নতুন flow বানানো যাবে না, আগের form-গুলোই reuse করতে হবে।
- **`Ctrl + Shift + C` shortcut-এর লেখাটা সরিয়ে দিতে হবে।** এটা browser DevTools-এর সাথে conflict করে।

### এখন কী অবস্থা

- `src/components/layout/private/PrivateSidebar.jsx`: "Create" শুধু দেখানোর জন্য একটা `div`, কোনো handler নেই।
- তিনটা create modal আগে থেকেই কাজ করে, আর save-এর logic যার যার board page-এ আছে:

| Option | Modal | Save handler যেখানে আছে |
|---|---|---|
| Task | `Tasks/components/TaskFormModal.jsx` | `TasksBoard.jsx` → `handleSubmitTask` |
| Habit | `Habits/components/NewHabitsModal.jsx` | `Habits.jsx` → `handleSaveHabit` |
| Goal | `Goals/components/NewGoalModal.jsx` | `ActiveGoals.jsx` → `handleSavePlan` |

### কী পরিবর্তন হবে

- **`PrivateSidebar.jsx`:**
  - "Create"-কে আসল বাটন বানানো। Click করলে তিনটা option-এর ছোট dropdown খুলবে। Dropdown-এর style হবে app-এর অন্য dropdown-এর মতো (যেমন `ActionDropdown`)।
  - `Ctrl + Shift + C` লেখাটা সরিয়ে দেওয়া।
  - Dropdown-এর বাইরে click করলে বা Escape চাপলে dropdown বন্ধ হবে।
- **প্রস্তাবিত পদ্ধতি:** option বাছলে সংশ্লিষ্ট board-এ নিয়ে যাওয়া, URL-এ একটা চিহ্ন দিয়ে:
  - Create Task → `/user/tasks?create=1`
  - Create Habit → `/user/habits?create=1`
  - Create Goal → `/user/goals?create=1`
- **তিনটা board page-এ:** URL-এ `create=1` থাকলে নিজের create modal খুলবে। তারপর URL থেকে চিহ্নটা মুছে দেবে, যাতে refresh করলে modal আবার না খোলে।

**এই পদ্ধতি কেন:** modal, save, toast আর board refresh সবকিছু হুবহু আগের code দিয়েই চলবে। নতুন কোনো save logic লিখতে হবে না, আর তৈরি হওয়া item সাথে সাথে সঠিক board-এ দেখা যাবে। এটাই client-এর "reuse করো" শর্তের সবচেয়ে কাছাকাছি।

**বিকল্প (প্রস্তাবিত না):** তিনটা modal layout-এ রেখে সেখান থেকেই save করা। এতে board-এর বাইরে থেকেও modal খোলা যাবে। কিন্তু save আর refresh-এর logic দুই জায়গায় রাখতে হবে।

---

## Bug 01 — Global Search Bar (Ctrl + K)

### Client যা চায়

- Search bar-এ click করলে search input বা dropdown খুলবে।
- নিজের Tasks, Habits আর Goals নাম দিয়ে খোঁজা যাবে।
- ফলাফল category অনুযায়ী ভাগ করে দেখাবে (Tasks, Habits, Goals)।
- কোনো ফলাফলে click করলে item-টা খুলবে, অথবা তার board-এ যাবে।
- কিছু না মিললে "No results found." দেখাবে।
- শুধু logged-in user-এর নিজের data খোঁজা হবে।
- `Ctrl + K` (Mac-এ `Cmd + K`) দিয়ে search খুলবে, যদি নির্ভরযোগ্যভাবে করা যায়।
- `Escape` চাপলে search বন্ধ হবে।
- Advanced filter, AI search বা জটিল কিছু লাগবে না।

### এখন কী অবস্থা

- `PrivateNavbar.jsx`: "Go to... / Ctrl + K" শুধু দেখানোর জন্য, desktop আর mobile দুই জায়গাতেই। কোনো handler বা listener নেই।
- **Backend-এ নতুন কিছু লাগবে না।** তিনটা list API-ই আগে থেকে `search` parameter পাঠায়:
  - Tasks: `tasksMappers.js` → `buildTasksQueryParams` (`params.search`)
  - Habits: `habitsMappers.js` → `buildHabitsQueryParams` (`params.search`)
  - Goals: `goalsMappers.js` → `buildGoalsQueryParams` (`params.search`)
- এই API-গুলো logged-in user-এর token দিয়ে call হয়। তাই ধরে নিচ্ছি শুধু নিজের data-ই আসবে, এটা test করে নিশ্চিত করতে হবে।

### কী পরিবর্তন হবে

- **নতুন component `GlobalSearch`** (`src/components/layout/private/` folder-এ):
  - Navbar-এর "Go to..." box-এ click করলে search input-সহ একটা dropdown বা overlay খুলবে।
  - টাইপ করার 300ms পরে তিনটা API একসাথে call হবে (`search` আর ছোট `limit`, যেমন প্রতিটা থেকে 5টা)।
  - **Board-এর Redux state ছোঁয়া হবে না।** সরাসরি API function call করা হবে, যাতে search চালালে Tasks/Habits/Goals board-এর list বদলে না যায়।
  - ফলাফল তিন ভাগে দেখাবে: **Tasks / Habits / Goals**। কোনো ভাগে কিছু না থাকলে সেই ভাগ লুকানো থাকবে।
  - কিছুই না মিললে "No results found." দেখাবে। Load হওয়ার সময় "Searching…" দেখাবে।
  - Escape চাপলে বা বাইরে click করলে বন্ধ হবে।
- **ফলাফলে click করলে যেখানে যাবে:**
  - Task → `/user/tasks/:taskId` (task-এর detail page আছে)
  - Goal → `/user/goals/:goalId` (goal-এর detail page আছে)
  - Habit → `/user/habits` (habit-এর আলাদা detail page নেই, তাই board-এ যাবে)
- **Keyboard:** `Ctrl + K` আর `Cmd + K` দিয়ে search খুলবে বা focus হবে (`preventDefault` দিয়ে)। Escape দিয়ে বন্ধ হবে।
- **`PrivateNavbar.jsx`:** desktop আর mobile দুটো "Go to..." box-ই এই component দিয়ে বদলানো হবে। Mobile-এ "Ctrl + K" লেখা দেখানোর মানে নেই, তাই mobile-এ লেখাটা লুকানো থাকবে।

### ঝুঁকি আর বিকল্প পরিকল্পনা

- Tasks আর Goals-এর backend সত্যিই `search` দিয়ে filter করে কিনা নিশ্চিত হতে হবে। Habits board-এর search কাজ করে, BUG 04 থেকে এটা জানা।
- কোনো API ঠিকমতো search না করলে, অথবা কাজ অনেক বেড়ে গেলে client-এর কথামতো search bar সাময়িকভাবে লুকিয়ে রাখা হবে।

---

## কোন file-এ কী বদলাবে (সংক্ষেপে)

| File | পরিবর্তন |
|---|---|
| `src/components/layout/private/PrivateNavbar.jsx` | Gear icon → `/settings` link; "Go to..." box → `GlobalSearch` |
| `src/components/layout/private/GlobalSearch.jsx` (নতুন) | Search input, তিন API call, ভাগ করা ফলাফল, Ctrl/Cmd + K, Escape |
| `src/pages/private/user/account/Settings.jsx` | কাজ করে এমন অংশ দিয়ে নতুন করে সাজানো; অকেজো toggle সরানো |
| `src/components/layout/private/PrivateSidebar.jsx` | Create dropdown (Task/Habit/Goal); `Ctrl + Shift + C` লেখা সরানো |
| `src/pages/private/user/focus/Tasks/TasksBoard.jsx` | `?create=1` থাকলে create modal খোলা |
| `src/pages/private/user/focus/Habits/Habits.jsx` | `?create=1` থাকলে create modal খোলা |
| `src/pages/private/user/focus/Goals/ActiveGoals.jsx` | `?create=1` থাকলে create modal খোলা |

**Backend:** কোনো নতুন API লাগবে না। তবে নিচের প্রশ্নগুলোর উত্তর backend team থেকে নিশ্চিত করে নিতে হবে।

---

## Backend team-এর জন্য প্রশ্ন

### ১. Global Search (Bug 01): list API-গুলো কি `search` দিয়ে filter করে?

| API | যা জানা দরকার |
|---|---|
| `GET /api/v1/tasks?search=<text>&limit=5` | Task-এর title দিয়ে filter হয় কি? |
| `GET /api/v1/habits?search=<text>&limit=5` | Habit-এর name দিয়ে filter হয় কি? |
| `GET /api/v1/goals?search=<text>&limit=5` | Goal-এর title দিয়ে filter হয় কি? |

**কেন দরকার:** Navbar-এর search বক্সে টাইপ করলে এই তিনটা API একসাথে call হবে, আর ফলাফল Tasks / Habits / Goals ভাগ করে দেখানো হবে।

**নিশ্চিত হতে হবে:**
- Search case-insensitive কিনা, আর আংশিক মিল (partial match) ধরে কিনা। যেমন "run" লিখলে "Morning Run" পাওয়া যাবে কিনা।
- শুধু logged-in user-এর নিজের data আসে কিনা।
- `limit` param কাজ করে কিনা।
- Archived বা completed item-ও আসে কিনা।

**না থাকলে:** এই তিনটা API-তে `search` param যোগ করতে হবে। অথবা আলাদা একটা `GET /api/v1/search?q=<text>` বানানো যায়, যেটা `{ tasks, habits, goals }` ফেরত দেবে।

### ২. Notification preferences (Bug 02, Settings page)

**যা জানা দরকার:** notification on/off save করার কোনো API আছে কি? যেমন `GET` আর `PATCH /api/v1/users/notification-settings`।

**কেন দরকার:** Client চায় Settings page-এ notification preference দেখানো হোক। এখন frontend-এ যে toggle আছে সেটা কোথাও save হয় না। শুধু notification-এর list (`GET /api/v1/notifications`) আছে।

**না থাকলে:** Settings page-এ toggle দেখানো হবে না। Client বলেছে "শুধু যা কাজ করে সেগুলোই দেখাও"।

### ৩. Account management (Bug 02, Settings page)

**যা জানা দরকার:** Delete account-এর কোনো API আছে কি? যেমন `DELETE /api/v1/auth/account`।

**কেন দরকার:** Client "account management" অংশের কথা বলেছে।

**না থাকলে:** শুধু Logout দেখানো হবে।

### ৪. Profile (Bug 02, শুধু নিশ্চিত হওয়ার জন্য)

`GET` আর `PUT /api/v1/auth/profile` এবং `POST /api/v1/auth/change-password` আগে থেকে ব্যবহার হচ্ছে। এগুলোর জন্য নতুন কিছু লাগবে না।

### ৫. Create বাটন (Bug 03)

আগের create API-গুলো ব্যবহার হবে: `POST /api/v1/tasks`, `/habits`, `/goals`। **Backend-এর কিছু করতে হবে না।**
