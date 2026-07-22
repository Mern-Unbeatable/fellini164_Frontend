import React, { useState, useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';
import NewPlanModal from './components/NewPlanModal';
import PlannerBoard from './components/PlannerBoard';
import AIAssistant from './components/AIAssistant';
import PlannerHeader from './components/PlannerHeader';
import PlannerControls from './components/PlannerControls';
import {
  SEED_DATE_KEY,
  INITIAL_DAILY_PLAN,
  INITIAL_MESSAGE,
  dateKeyFromDate,
} from './plannerData';
import { clonePlans, generatePlan } from './plannerEngine';
import { getStorage, setStorage } from '../../../../../utils/storage';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const VIEW_MODE_STORAGE_KEY = 'planner_view_mode';
const VIEW_MODES = ['Daily', 'Weekly', 'Monthly'];

function getInitialViewMode() {
  const saved = getStorage(VIEW_MODE_STORAGE_KEY);
  return VIEW_MODES.includes(saved) ? saved : 'Daily';
}

export default function DailyPlanner() {
  const [isNewPlanModalOpen, setIsNewPlanModalOpen] = useState(false);

  // Selected date (May 13, 2026)
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 13));
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 4, 13));
  const [viewMode, setViewMode] = useState(getInitialViewMode);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    setStorage(VIEW_MODE_STORAGE_KEY, viewMode);
  }, [viewMode]);

  // loading state for shimmer skeleton
  const [isLoading, setIsLoading] = useState(false);

  // Whether the user has accepted the AI-suggested plan yet — false renders the
  // dashed/ghost preview (Figma "Empty States"), true renders the solid board (Figma "2").
  const [hasAcceptedPlan, setHasAcceptedPlan] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(true);
  const [isAssistantExpanded, setIsAssistantExpanded] = useState(false);

  // AI schedule changes are previewed before commit and stored as action-scoped history.
  const [pendingProposal, setPendingProposal] = useState(null);
  const [planHistory, setPlanHistory] = useState([]);

  // Plans/tasks data mapping, keyed by date string
  const [plans, setPlans] = useState({
    [SEED_DATE_KEY]: INITIAL_DAILY_PLAN,
  });

  // AI chat history
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);

  const chatContainerRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const timestamp = () =>
    'Today • ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const handleSavePlan = (data) => {
    const dateKey = dateKeyFromDate(selectedDate);
    const newPlan = {
      id: Date.now().toString(),
      kind: 'task',
      title: data.plan || 'Untitled Plan',
    };

    setPlans((prev) => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), newPlan],
    }));
  };

  const getDaysInMonth = (year, month) => {
    const startDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const prevMonthTotalDays = new Date(year, month, 0).getDate();
    const days = [];

    for (let i = startDay - 1; i >= 0; i--) {
      days.push({ day: prevMonthTotalDays - i, month: month - 1, year, isCurrentMonth: false });
    }
    for (let i = 1; i <= totalDays; i++) {
      days.push({ day: i, month, year, isCurrentMonth: true });
    }
    const totalCells = days.length > 35 ? 42 : 35;
    const remaining = totalCells - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ day: i, month: month + 1, year, isCurrentMonth: false });
    }

    return days;
  };

  const calendarDays = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());

  const getFormattedDateString = (dayObj) =>
    `${dayObj.year}-${String(dayObj.month + 1).padStart(2, '0')}-${String(dayObj.day).padStart(2, '0')}`;

  // --- AI Actions flow -----------------------------------------------------

  const selectedDateKey = dateKeyFromDate(selectedDate);
  const postMessages = (...msgs) => setMessages((prev) => [...prev, ...msgs]);

  const resolveMessageActions = (actionId) => {
    setMessages((prev) =>
      prev.map((message) => {
        const containsAction = [...(message.actions || []), ...(message.links || [])].some(
          (action) => action.actionId === actionId
        );
        return containsAction ? { ...message, resolved: true } : message;
      })
    );
  };

  const disablePreviousUndoLinks = () => {
    setMessages((prev) =>
      prev.map((message) => ({
        ...message,
        links: message.links?.map((link) =>
          link.actionId?.startsWith('undo:')
            ? { ...link, disabled: true }
            : link
        ),
      }))
    );
  };

  const recordCommittedChange = (entry) => {
    disablePreviousUndoLinks();
    setPlanHistory((prev) => [...prev, entry]);
  };

  const pendingNotice = (userText) => {
    const now = Date.now();
    postMessages(
      { id: `user_pending_${now}`, sender: 'user', text: userText, timestamp: timestamp() },
      {
        id: `ai_pending_${now}`,
        sender: 'ai',
        text: 'Please accept or dismiss the current schedule preview before starting another change.',
        timestamp: timestamp(),
      }
    );
  };

  const completeScheduleIntentWithoutMockMutation = ({
    userText,
    loadingText,
    resultText,
  }) => {
    if (isLoading || pendingProposal) {
      pendingNotice(userText);
      return;
    }

    const now = Date.now();

    postMessages(
      { id: `user_${now}`, sender: 'user', text: userText, timestamp: timestamp() },
      {
        id: `ai_loading_${now}`,
        sender: 'ai',
        text: loadingText,
        timestamp: timestamp(),
      }
    );

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      postMessages({
        id: `ai_intent_${now}`,
        sender: 'ai',
        text: resultText,
        timestamp: timestamp(),
      });
    }, 900);
  };

  const startPlanGeneration = (mode) => {
    const userText = `Generate ${mode} Plan`;
    if (isLoading || pendingProposal) {
      pendingNotice(userText);
      return;
    }

    const now = Date.now();
    const transactionId = `generate_${mode.toLowerCase()}_${now}`;
    const beforePlans = clonePlans(plans);
    const beforeAccepted = hasAcceptedPlan;
    const nextPlans = generatePlan(plans, selectedDateKey);

    setViewMode(mode);
    setIsLoading(true);
    postMessages(
      { id: `user_generate_${now}`, sender: 'user', text: userText, timestamp: timestamp() },
      {
        id: `ai_generate_loading_${now}`,
        sender: 'ai',
        text: `Building a ${mode.toLowerCase()} schedule from your existing tasks and habits...`,
        timestamp: timestamp(),
      }
    );

    setTimeout(() => {
      setPlans(nextPlans);
      setHasAcceptedPlan(false);
      setPendingProposal({
        id: transactionId,
        label: `Generate ${mode} Plan`,
        beforePlans,
        beforeAccepted,
        afterPlans: clonePlans(nextPlans),
        afterAccepted: true,
        type: 'generation',
      });
      setIsLoading(false);
      postMessages({
        id: `ai_generate_preview_${now}`,
        sender: 'ai',
        text: `I've prepared a ${mode.toLowerCase()} schedule using only your existing task and habit content. Do you want to keep it?`,
        timestamp: timestamp(),
        actions: [
          { label: 'Accept plan', actionId: `accept_initial:${transactionId}` },
          { label: 'Dismiss', actionId: `dismiss_initial:${transactionId}` },
        ],
      });
    }, 900);
  };

  const handleQuickAction = (actionType) => {
    setIsAssistantOpen(true);
    const ts = timestamp();
    const userMsgId = Date.now().toString();

    if (actionType === 'adjust_before_accepting') {
      postMessages(
        { id: userMsgId, sender: 'user', text: 'Adjust before accepting', timestamp: ts },
        {
          id: `${userMsgId}_ai`,
          sender: 'ai',
          text: 'Tell me how to adjust the schedule — for example, move a task earlier, reduce overload, optimize timing, or create focus spacing.',
          timestamp: ts,
        }
      );
      return;
    }

    if (actionType === 'show_whats_included') {
      postMessages(
        { id: userMsgId, sender: 'user', text: "Show what's included", timestamp: ts },
        {
          id: `${userMsgId}_ai`,
          sender: 'ai',
          text: 'This plan schedules your existing tasks and habits. Planner AI only changes dates, times, order, and spacing — never their content.',
          timestamp: ts,
        }
      );
      return;
    }

    if (actionType === 'generate_daily_plan') {
      startPlanGeneration('Daily');
      return;
    }
    if (actionType === 'generate_weekly_plan') {
      startPlanGeneration('Weekly');
      return;
    }
    if (actionType === 'generate_monthly_plan' || actionType === 'monthly_plan') {
      startPlanGeneration('Monthly');
      return;
    }

    if (actionType === 'balance') {
      postMessages(
        { id: userMsgId, sender: 'user', text: 'Balance my schedule', timestamp: ts },
        {
          id: `${userMsgId}_ai`,
          sender: 'ai',
          text: 'I can rebalance your day by moving existing items and creating focus spacing. What would you like me to do?',
          timestamp: ts,
          actions: [
            { label: 'Recalibrate My Day', actionId: 'recalibrate_day' },
            { label: 'Reduce Overload', actionId: 'reduce_overload' },
            { label: 'Optimize Schedule', actionId: 'optimize_schedule' },
          ],
        }
      );
      return;
    }

    if (actionType === 'free_evening') {
      postMessages(
        { id: userMsgId, sender: 'user', text: 'Free up my evening', timestamp: ts },
        {
          id: `${userMsgId}_ai`,
          sender: 'ai',
          text: 'I can move a lower-priority item to tomorrow morning. Do you want me to preview that change?',
          timestamp: ts,
          actions: [
            { label: 'Reduce Overload', actionId: 'reduce_overload' },
            { label: 'Dismiss', actionId: 'dismiss_prompt' },
          ],
        }
      );
      return;
    }

    if (actionType === 'ai_actions_menu') {
      postMessages(
        { id: userMsgId, sender: 'user', text: 'AI Actions', timestamp: ts },
        {
          id: `${userMsgId}_ai`,
          sender: 'ai',
          text: 'I analyzed your current schedule and found a few ways to improve your day balance.\n\nWhat would you like me to do?',
          timestamp: ts,
          actions: [
            { label: 'Recalibrate My Day', actionId: 'recalibrate_day' },
            { label: 'Reduce Overload', actionId: 'reduce_overload' },
            { label: 'Optimize Schedule', actionId: 'optimize_schedule' },
          ],
        }
      );
      return;
    }

    if (actionType === 'recalibrate_day') {
      postMessages(
        { id: userMsgId, sender: 'user', text: 'Recalibrate My Day', timestamp: ts },
        {
          id: `${userMsgId}_ai_energy`,
          sender: 'ai',
          text: 'How is your energy today?',
          timestamp: ts,
          actions: [
            { label: 'Low', actionId: 'energy_low' },
            { label: 'Medium', actionId: 'energy_medium' },
            { label: 'High', actionId: 'energy_high' },
          ],
        }
      );
      return;
    }

    if (actionType === 'reduce_overload') {
      completeScheduleIntentWithoutMockMutation({
        userText: 'Reduce Overload',
        loadingText: 'Reviewing the schedule for overload...',
        resultText: 'No mock schedule placement was changed. A confirmed planner-data response is required before moving an item.',
      });
      return;
    }

    if (actionType === 'optimize_schedule') {
      completeScheduleIntentWithoutMockMutation({
        userText: 'Optimize Schedule',
        loadingText: 'Reviewing schedule timing...',
        resultText: 'No mock schedule placement was changed. A confirmed planner-data response is required before changing timing.',
      });
    }
  };

  const handleActionClick = (actionId) => {
    const ts = timestamp();
    resolveMessageActions(actionId);

    if (
      [
        'recalibrate_day',
        'reduce_overload',
        'optimize_schedule',
        'generate_daily_plan',
        'generate_weekly_plan',
        'generate_monthly_plan',
      ].includes(actionId)
    ) {
      handleQuickAction(actionId);
      return;
    }

    if (actionId === 'dismiss_prompt') {
      postMessages({
        id: `ai_prompt_dismissed_${Date.now()}`,
        sender: 'ai',
        text: 'No schedule changes were made.',
        timestamp: ts,
      });
      return;
    }

    if (actionId.startsWith('energy_')) {
      const energy = actionId.replace('energy_', '');
      const label = energy.charAt(0).toUpperCase() + energy.slice(1);
      if (isLoading || pendingProposal) {
        pendingNotice(label);
        return;
      }
      const now = Date.now();
      const transactionId = `recalibrate_${energy}_${now}`;
      const snapshot = clonePlans(plans);

      recordCommittedChange({
        id: transactionId,
        label: `recalibrate_${energy}`,
        beforePlans: snapshot,
        beforeAccepted: hasAcceptedPlan,
        afterPlans: snapshot,
        afterAccepted: hasAcceptedPlan,
      });

      postMessages(
        {
          id: `user_energy_${now}`,
          sender: 'user',
          text: label,
          timestamp: ts,
        },
        {
          id: `ai_energy_${now}`,
          sender: 'ai',
          text: 'Done! The day was recalibrated successfully!',
          timestamp: ts,
          links: [{ label: 'Undo changes', actionId: `undo:${transactionId}` }],
        }
      );
      return;
    }

    if (actionId === 'accept_initial' || actionId.startsWith('accept_initial:')) {
      const proposalId = actionId.split(':')[1];
      const proposal =
        pendingProposal?.type === 'generation' &&
        (!proposalId || pendingProposal.id === proposalId)
          ? pendingProposal
          : null;
      const transactionId = proposal?.id || `accept_initial_${Date.now()}`;

      recordCommittedChange({
        id: transactionId,
        label: proposal?.label || 'Accept initial plan',
        beforePlans: proposal?.beforePlans || clonePlans(plans),
        beforeAccepted: proposal?.beforeAccepted ?? false,
        afterPlans: proposal?.afterPlans || clonePlans(plans),
        afterAccepted: true,
      });
      setHasAcceptedPlan(true);
      setPendingProposal(null);
      postMessages(
        { id: `user_accept_${Date.now()}`, sender: 'user', text: 'Accept plan', timestamp: ts },
        {
          id: `ai_accept_reply_${Date.now()}`,
          sender: 'ai',
          text: 'Great. Your schedule is set. You can continue adjusting dates, times, order, and focus spacing through chat.',
          timestamp: ts,
          links: [{ label: 'Undo changes', actionId: `undo:${transactionId}` }],
        }
      );
      return;
    }

    if (actionId === 'dismiss_initial' || actionId.startsWith('dismiss_initial:')) {
      const proposalId = actionId.split(':')[1];
      const proposal =
        pendingProposal?.type === 'generation' &&
        (!proposalId || pendingProposal.id === proposalId)
          ? pendingProposal
          : null;

      if (proposal) {
        setPlans(proposal.beforePlans);
        setHasAcceptedPlan(proposal.beforeAccepted);
        setPendingProposal(null);
      } else {
        setPlans((prev) => ({ ...prev, [selectedDateKey]: [] }));
        setHasAcceptedPlan(false);
      }

      postMessages(
        { id: `user_dismiss_${Date.now()}`, sender: 'user', text: 'Dismiss', timestamp: ts },
        {
          id: `ai_dismiss_reply_${Date.now()}`,
          sender: 'ai',
          text: 'The suggested schedule was dismissed. No task or habit content was changed.',
          timestamp: ts,
        }
      );
      return;
    }

    if (actionId.startsWith('accept_change:')) {
      const proposalId = actionId.split(':')[1];
      if (!pendingProposal || pendingProposal.id !== proposalId) {
        postMessages({
          id: `ai_expired_${Date.now()}`,
          sender: 'ai',
          text: 'That schedule preview is no longer active.',
          timestamp: ts,
        });
        return;
      }

      recordCommittedChange(pendingProposal);
      setHasAcceptedPlan(pendingProposal.afterAccepted);
      setPendingProposal(null);
      postMessages(
        { id: `user_accept_${Date.now()}`, sender: 'user', text: 'Accept changes', timestamp: ts },
        {
          id: `ai_accept_reply_${Date.now()}`,
          sender: 'ai',
          text: 'The previewed schedule changes have been applied.',
          timestamp: ts,
          links: [{ label: 'Undo changes', actionId: `undo:${proposalId}` }],
        }
      );
      return;
    }

    if (actionId.startsWith('dismiss_change:')) {
      const proposalId = actionId.split(':')[1];
      if (pendingProposal?.id === proposalId) {
        setPlans(pendingProposal.beforePlans);
        setHasAcceptedPlan(pendingProposal.beforeAccepted);
        setPendingProposal(null);
      }
      postMessages({
        id: `ai_dismiss_change_${Date.now()}`,
        sender: 'ai',
        text: 'The schedule preview was dismissed. Your previous schedule is unchanged.',
        timestamp: ts,
      });
      return;
    }

    if (actionId.startsWith('undo:')) {
      const transactionId = actionId.split(':')[1];
      const latest = planHistory[planHistory.length - 1];

      if (!latest || latest.id !== transactionId) {
        postMessages({
          id: `ai_undo_unavailable_${Date.now()}`,
          sender: 'ai',
          text: 'That Undo action is no longer available because a newer schedule transaction exists.',
          timestamp: ts,
        });
        return;
      }

      setPlans(latest.beforePlans);
      setHasAcceptedPlan(latest.beforeAccepted);
      setPlanHistory((prev) => prev.slice(0, -1));
      postMessages(
        { id: `user_undo_${Date.now()}`, sender: 'user', text: 'Undo changes', timestamp: ts },
        {
          id: `ai_undo_reply_${Date.now()}`,
          sender: 'ai',
          text: 'Restored the schedule from before that AI change.',
          timestamp: ts,
        }
      );
    }
  };

  const handleSendMessage = (event) => {
    event.preventDefault();
    const userText = chatInput.trim();
    if (!userText) return;

    setChatInput('');
    completeScheduleIntentWithoutMockMutation({
      userText,
      loadingText: 'Reviewing your schedule request...',
      resultText: 'No mock schedule placement was changed. A confirmed planner-data response is required before updating the board.',
    });
  };

  const navigateByView = (direction) => {
    const nextDate = new Date(selectedDate);
    if (viewMode === 'Weekly') {
      nextDate.setDate(nextDate.getDate() + direction * 7);
    } else if (viewMode === 'Monthly') {
      nextDate.setMonth(nextDate.getMonth() + direction);
    } else {
      // Daily — day by day
      nextDate.setDate(nextDate.getDate() + direction);
    }
    setCurrentDate(nextDate);
    setSelectedDate(nextDate);
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const closeAssistant = () => {
    setIsAssistantOpen(false);
    setIsAssistantExpanded(false);
  };

  const toggleExpandAssistant = () => {
    setIsAssistantExpanded((prev) => !prev);
  };

  const assistantProps = {
    messages,
    chatInput,
    setChatInput,
    handleSendMessage,
    handleActionClick,
    handleQuickAction,
    chatContainerRef,
    hasAcceptedPlan,
    viewMode,
    onClose: closeAssistant,
    onToggleExpand: toggleExpandAssistant,
  };

  return (
    <div className="relative flex min-h-full flex-col py-7.5 max-lg:min-h-0 max-lg:py-4 max-lg:sm:py-6">
      <div className="mx-auto flex min-h-0 w-full min-w-0 flex-1 flex-col gap-6 xl:flex-row">
        {/* Left Side: Header, Controls, and Board */}
        <div className="relative flex min-w-0 flex-col max-xl:flex-none xl:min-h-0 xl:flex-1">
          {!isAssistantOpen && (
            <button
              type="button"
              onClick={() => setIsAssistantOpen(true)}
              aria-label="Open AI Assistant"
              className="absolute top-0 right-0 z-10 flex items-center gap-1.5 rounded-lg bg-[#f9f4ff] px-2.5 py-1.5 text-[12px] font-medium text-[#8022fe] transition-colors hover:bg-[#f0e7ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8022fe]/40 active:bg-[#e9d9ff]"
            >
              <Sparkles size={14} />
              AI Assistant
            </button>
          )}
          <PlannerHeader />
          <PlannerControls
            currentDate={currentDate}
            selectedDate={selectedDate}
            goToToday={goToToday}
            viewMode={viewMode}
            setViewMode={setViewMode}
            dropdownOpen={dropdownOpen}
            setDropdownOpen={setDropdownOpen}
            navigateByView={navigateByView}
            handleOpenModal={() => setIsNewPlanModalOpen(true)}
            handleQuickAction={handleQuickAction}
            hasAcceptedPlan={hasAcceptedPlan}
            months={MONTHS}
          />
          <PlannerBoard
            currentDate={currentDate}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            viewMode={viewMode}
            setViewMode={setViewMode}
            plans={plans}
            hasAcceptedPlan={hasAcceptedPlan}
            calendarDays={calendarDays}
            getFormattedDateString={getFormattedDateString}
            isLoading={isLoading}
          />
        </div>

        {/* AI Assistant Sidebar */}
        {isAssistantOpen && !isAssistantExpanded && <AIAssistant {...assistantProps} isExpanded={false} />}
      </div>

      {isAssistantOpen && isAssistantExpanded && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="AI Assistant expanded"
          onClick={(e) => {
            if (e.target === e.currentTarget) toggleExpandAssistant();
          }}
        >
          <div className="h-[85vh] w-full max-w-2xl">
            <AIAssistant {...assistantProps} isExpanded />
          </div>
        </div>
      )}

      <NewPlanModal
        open={isNewPlanModalOpen}
        onClose={() => setIsNewPlanModalOpen(false)}
        onSave={handleSavePlan}
      />
    </div>
  );
}
