# BUG 08 — Goals Board: AI Generation-এ "Update" চাপলে দুটো goal তৈরি হয়

| | |
|---|---|
| **Bug ID** | BUG 08 |
| **Module** | Goals Board → New Goal → AI Generation |
| **Severity** | High |
| **ধরন** | Frontend fix (backend-এ কিছু বদলাতে হয়নি) |
| **File** | `src/pages/private/user/focus/Goals/components/NewGoalModal.jsx` |

---

## ১. QA কী পেয়েছে

1. Goals → **New Goal** → **AI Generation**
2. Category বাছাই করে goal-এর বর্ণনা লেখা হলো → **Generate**
3. "Anything to change?" ঘরে বদল লিখে **Update** চাপা হলো
4. নতুন ফলাফল দেখে **Add to Board** চাপা হলো

**প্রত্যাশিত:** board-এ শুধু শেষের (update করা) goal থাকবে।
**আসলে যা হচ্ছিল:** প্রথম goal আর update করা goal, দুটোই board-এ এসেছে।

---

## ২. কেন হচ্ছিল

- `POST /api/v1/goals/ai/generate` শুধু preview বানায় না, **call হওয়ামাত্র goal database-এ save করে ফেলে।**
- **Update** আর **Regenerate** দুটোই একই generate API আবার call করে, ফলে আরেকটা goal save হয়। আগেরটা মুছে ফেলা হতো না।
- **Add to Board** নতুন করে কিছু save করে না, শুধু board refresh করে। তাই database-এ থাকা সব generate করা goal board-এ চলে আসত।

একই কারণে আরও দুটো লুকানো সমস্যা ছিল:
- Generate করে **Add to Board** না চেপে modal বন্ধ (X / Cancel) করলেও goal board-এ থেকে যেত।
- Generate চলার সময় modal বন্ধ করলে উত্তর পরে এসে একটা goal রেখে যেত।

---

## ৩. আগের code (Current code — fix-এর আগে)

```jsx
import {
  fetchHabitsForLinkApi,
  fetchTasksForLinkApi,
} from '../../../../../../features/goals/goalsAPI';
```

```jsx
  const runAiGeneration = async (prompt) => {
    setPendingGoal(
      generatedGoal || {
        title: '',
        description: '',
        priority: 'MEDIUM',
        category: form.category || 'Career',
        due: '',
      }
    );
    setAiPhase('generating');
    setChangeRequest('');
    const revealPromise = startReveal();
    const result = await dispatch(
      generateGoal({ prompt, category: form.category || 'Career' })
    );
    await revealPromise;

    if (generateGoal.fulfilled.match(result)) {
      setGeneratedGoal(result.payload);
      setPendingGoal(null);
      setAiPhase('preview');
      return;
    }

    setPendingGoal(null);
    setGeneratedGoal(null);
    setAiPhase('input');
  };

  const handleClose = () => {
    resetReveal();
    onClose();
  };

  const handleGenerate = () => {
    if (!aiPrompt.trim() || isRevealing) return;
    runAiGeneration(aiPrompt);
  };

  const handleRegenerate = () => {
    if (isRevealing) return;
    runAiGeneration(aiPrompt);
  };

  const handleUpdatePreview = () => {
    if (!changeRequest.trim() || isRevealing) return;
    runAiGeneration(`${aiPrompt} ${changeRequest}`);
  };

  const handleAddGeneratedToBoard = () => {
    if (!generatedGoal) return;
    // POST /goals/ai/generate already persisted the goal — only refresh the board.
    onSave({
      id: generatedGoal.id,
      title: generatedGoal.title,
      description: generatedGoal.description,
      priority: generatedGoal.priority,
      category: generatedGoal.category,
      due: generatedGoal.due,
      dueDate: generatedGoal.dueDate,
      linkedTasks: [],
      linkedHabits: [],
      source: 'ai',
      alreadyPersisted: true,
    });
    handleClose();
  };
```

**সমস্যা কোথায়:** `runAiGeneration`-এ নতুন goal আসার পর আগের goal-এর id কোথাও রাখা হয় না বা মোছা হয় না। আর `handleClose`-এ save হয়ে থাকা preview goal মোছা হয় না।

---

## ৪. নতুন code (Fix-এর পরে)

### ৪.১ Delete API import আর একটা helper

```jsx
import {
  deleteGoalApi,
  fetchHabitsForLinkApi,
  fetchTasksForLinkApi,
} from '../../../../../../features/goals/goalsAPI';

/**
 * POST /goals/ai/generate persists the goal immediately, so a preview that gets replaced
 * (Update / Regenerate) or abandoned (modal closed without "Add to Board") must be deleted.
 * Silent on purpose: the user never "created" this goal from their point of view.
 */
function discardGeneratedGoal(goalId) {
  if (!goalId) return;
  deleteGoalApi(goalId).catch(() => {});
}
```

- আগে থেকে থাকা `DELETE /api/v1/goals/:id` ব্যবহার হয়েছে, নতুন কোনো API লাগেনি।
- এখানে `deleteGoal` thunk ব্যবহার করিনি, কারণ ওটা "Goal deleted" toast দেখায়। User-এর চোখে সে কোনো goal মোছেনি, তাই এটা চুপচাপ মোছা হয়।

### ৪.২ কোন goal এখনো board-এ যোগ হয়নি, সেটা মনে রাখা

```jsx
  // Id of the AI goal the server has saved but the user hasn't added to the board yet.
  const unsavedGeneratedIdRef = useRef(null);
  // Bumped on every close so a generate request that finishes after closing is thrown away.
  const sessionRef = useRef(0);

  useEffect(
    () => () => {
      sessionRef.current += 1;
      discardGeneratedGoal(unsavedGeneratedIdRef.current);
      unsavedGeneratedIdRef.current = null;
    },
    []
  );

  useEffect(() => {
    if (!open) return undefined;
    discardGeneratedGoal(unsavedGeneratedIdRef.current);
    unsavedGeneratedIdRef.current = null;
    setForm(buildInitialForm());
    // ... বাকি reset আগের মতোই
```

- `unsavedGeneratedIdRef` মনে রাখে কোন generate করা goal server-এ save হয়ে আছে কিন্তু user এখনো "Add to Board" চাপেনি।
- `sessionRef` প্রতিবার modal বন্ধ হলে এক করে বাড়ে। এতে বোঝা যায় কোনো generate request পুরোনো (বন্ধ হয়ে যাওয়া) modal-এর।
- **Unmount cleanup:** modal খোলা অবস্থায় user অন্য page-এ চলে গেলেও save হয়ে থাকা preview goal মুছে যায়।
- **Modal খোলার সময় cleanup:** কোনোভাবে আগের কোনো preview goal থেকে গেলে, সেটাও মুছে যায়।

### ৪.৩ `runAiGeneration` — নতুন goal এলে আগেরটা মোছা

```jsx
    setAiPhase('generating');
    setChangeRequest('');
    const session = sessionRef.current;
    const revealPromise = startReveal();
    const result = await dispatch(
      generateGoal({ prompt, category: form.category || 'Career' })
    );
    await revealPromise;

    if (generateGoal.fulfilled.match(result)) {
      const nextId = result.payload.id;
      if (session !== sessionRef.current) {
        // Modal was closed while generating — nobody will ever add this goal.
        discardGeneratedGoal(nextId);
        return;
      }
      const previousId = unsavedGeneratedIdRef.current;
      unsavedGeneratedIdRef.current = nextId;
      if (previousId && String(previousId) !== String(nextId)) {
        discardGeneratedGoal(previousId);
      }
      setGeneratedGoal(result.payload);
      setPendingGoal(null);
      setAiPhase('preview');
      return;
    }

    if (session !== sessionRef.current) return;
    setPendingGoal(null);
    // Update/Regenerate failed: keep showing the previous (still saved) preview instead of losing it.
    if (generatedGoal) {
      setAiPhase('preview');
      return;
    }
    setGeneratedGoal(null);
    setAiPhase('input');
```

- **Update / Regenerate সফল হলে:** নতুন goal-এর id মনে রাখে আর আগের goal মুছে দেয়। ফলে database-এ সবসময় একটাই preview goal থাকে।
- **আগেরটা কখন মোছে:** নতুন goal **সফলভাবে আসার পরেই**। Update ব্যর্থ হলে user-এর আগের preview হারায় না।
- **Update / Regenerate ব্যর্থ হলে:** আগে preview মুছে input-এ ফিরে যেত, কিন্তু goal database-এ থেকে যেত। এখন আগের preview দেখাতে থাকে, যাতে user চাইলে সেটাই board-এ যোগ করতে পারে। Error toast আগের মতোই `generateGoal` thunk দেখায়।
- **Generate চলার সময় modal বন্ধ হলে:** উত্তর পরে এলে সেই goal সাথে সাথে মুছে দেয়।

### ৪.৪ `handleClose` — বন্ধ করলে preview goal মোছা

```jsx
  const handleClose = () => {
    sessionRef.current += 1;
    discardGeneratedGoal(unsavedGeneratedIdRef.current);
    unsavedGeneratedIdRef.current = null;
    resetReveal();
    onClose();
  };
```

X বাটন, Cancel, আর manual tab থেকে Create — সব পথই `handleClose` দিয়ে যায়। তাই "Add to Board" না চাপলে কোনো AI goal থেকে যায় না।

### ৪.৫ `handleAddGeneratedToBoard` — যেটা রাখা হবে সেটা যেন না মোছে

```jsx
  const handleAddGeneratedToBoard = () => {
    if (!generatedGoal) return;
    // POST /goals/ai/generate already persisted the goal — only refresh the board.
    // Clear the tracked id first so handleClose() below doesn't delete the goal we're keeping.
    unsavedGeneratedIdRef.current = null;
    onSave({
      // ... আগের মতোই
      alreadyPersisted: true,
    });
    handleClose();
  };
```

`handleClose()` ডাকার আগে tracked id মুছে দেওয়া হয়, যাতে user যে goal রাখতে চায় সেটা মুছে না যায়।

---

## ৫. Fix-এর পরে প্রতিটা অবস্থায় কী হয়

| User যা করল | আগে | এখন |
|---|---|---|
| Generate → Add to Board | ১টা goal | ১টা goal (বদল নেই) |
| Generate → Update → Add to Board | **২টা goal** | ১টা goal (শুধু update করা) |
| Generate → Regenerate ×3 → Add to Board | **৪টা goal** | ১টা goal (শেষেরটা) |
| Generate → X / Cancel | **১টা goal থেকে যেত** | কোনো goal থাকে না |
| Generate → Manual tab → Create | **AI goal + manual goal** | শুধু manual goal |
| Generate চলার সময় X | **১টা goal থেকে যেত** | কোনো goal থাকে না |
| Update ব্যর্থ হলো | Preview মুছে যেত, goal থেকে যেত | আগের preview থাকে, চাইলে যোগ করা যায় |
| Modal খোলা রেখে অন্য page-এ যাওয়া | **১টা goal থেকে যেত** | কোনো goal থাকে না |

---

## ৬. যা বদলায়নি

- Edit Goal (board বা goal detail page থেকে) — শুধু manual tab, এই code-এ পড়ে না।
- Manual দিয়ে goal তৈরি — আগের মতোই।
- `ActiveGoals.jsx`-এর `handleSavePlan` — কোনো বদল নেই।
- Backend — কোনো বদল লাগেনি।

---

## ৭. যা মাথায় রাখতে হবে

- **মোছা চুপচাপ হয়:** delete API ব্যর্থ হলে (যেমন network নেই) user কিছু দেখে না, আর সেই goal database-এ থেকে যেতে পারে। Board refresh করলে দেখা যাবে। এটা বিরল ঘটনা।
- **Backend-এর কাছে confirm করার বিষয়:** generate API goal-এর সাথে কোনো milestone, task বা habit বানায় কিনা, আর বানালে goal মুছলে সেগুলোও মোছে কিনা। Frontend-এর preview-এ কোনো linked task বা habit আসে না।
- **ভবিষ্যতের পরিষ্কার সমাধান:** backend-এর generate API যদি শুধু preview ফেরত দেয় (save না করে) আর "Add to Board"-এ save হয়, তাহলে এই মোছামুছির দরকার থাকবে না।
- **একই সমস্যা অন্য জায়গায়:** `/tasks/ai/generate` আর `/habits/ai/generate`-ও সাথে সাথে save করে। BUG 11, 19, 20 সম্ভবত একই কারণে হচ্ছে, আর এই পদ্ধতিতেই ঠিক করা যাবে।

---

## ৮. Test করার ধাপ

1. Goals → New Goal → AI Generation → Generate → "Anything to change?"-এ বদল লিখে **Update** → **Add to Board**। Board-এ **একটাই** goal আসবে।
2. Generate → **Regenerate** কয়েকবার → Add to Board। একটাই goal আসবে।
3. Generate → **X** চাপো। Board-এ নতুন কোনো goal থাকবে না। Page refresh করেও দেখো।
4. Generate চলার সময় **X** চাপো, কয়েক সেকেন্ড অপেক্ষা করে refresh করো। নতুন কোনো goal থাকবে না।
5. Generate → **Manual** tab → manual goal Create। শুধু manual goal আসবে।
6. Network বন্ধ করে Update চাপো। Error toast দেখাবে, কিন্তু আগের preview থেকে যাবে।
