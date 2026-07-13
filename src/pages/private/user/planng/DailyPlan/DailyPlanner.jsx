import React, { useState, useEffect, useRef } from 'react';
import NewPlanModal from './components/NewPlanModal';
import PlannerBoard from './components/PlannerBoard';
import AIAssistant from './components/AIAssistant';
import PlannerHeader from './components/PlannerHeader';
import PlannerControls from './components/PlannerControls';
import {
  SEED_DATE_KEY,
  INITIAL_DAILY_PLAN,
  RECALIBRATED_SUGGESTION,
  INITIAL_MESSAGE,
  dateKeyFromDate,
} from './plannerData';
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
  const [modle, setModle] = useState(false);
  const handleOpenModal = () => setModle(true);
  const handleCloseModal = () => setModle(false);

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

  // Backup of plans for undo functionality
  const [plansBackup, setPlansBackup] = useState(null);

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

  const postMessages = (...msgs) => setMessages((prev) => [...prev, ...msgs]);

  const handleQuickAction = (actionType) => {
    const ts = timestamp();
    const userMsgId = Date.now().toString();

    if (actionType === 'adjust_before_accepting') {
      postMessages(
        { id: userMsgId, sender: 'user', text: 'Adjust before accepting', timestamp: ts },
        {
          id: userMsgId + '_ai',
          sender: 'ai',
          text: 'Tell me what you want to change before accepting — for example, move a task earlier, reduce workload, or leave more focus time.',
          timestamp: ts,
        }
      );
      return;
    }

    if (actionType === 'show_whats_included') {
      postMessages(
        { id: userMsgId, sender: 'user', text: "Show what's included", timestamp: ts },
        {
          id: userMsgId + '_ai',
          sender: 'ai',
          text: 'Your suggested plan includes your existing tasks, habits, and AI-recommended time slots — nothing new was added without your approval.',
          timestamp: ts,
        }
      );
      return;
    }

    if (actionType === 'generate_weekly_plan') {
      setViewMode('Weekly');
      postMessages(
        { id: userMsgId, sender: 'user', text: 'Generate Weekly Plan', timestamp: ts },
        {
          id: userMsgId + '_ai',
          sender: 'ai',
          text: "I've prepared a weekly overview based on your tasks and habits. Switch to Weekly view to review it, then accept or adjust from chat.",
          timestamp: ts,
          actions: [
            { label: 'Accept plan', actionId: 'accept_initial' },
            { label: 'Dismiss', actionId: 'dismiss_initial' },
          ],
        }
      );
      return;
    }

    if (actionType === 'generate_monthly_plan') {
      setViewMode('Monthly');
      postMessages(
        { id: userMsgId, sender: 'user', text: 'Generate Monthly Plan', timestamp: ts },
        {
          id: userMsgId + '_ai',
          sender: 'ai',
          text: "I've prepared a monthly overview based on your tasks and habits. Switch to Monthly view to review it, then accept or adjust from chat.",
          timestamp: ts,
          actions: [
            { label: 'Accept plan', actionId: 'accept_initial' },
            { label: 'Dismiss', actionId: 'dismiss_initial' },
          ],
        }
      );
      return;
    }

    if (actionType === 'balance') {
      postMessages(
        { id: userMsgId, sender: 'user', text: 'Balance my schedule', timestamp: ts },
        {
          id: userMsgId + '_ai',
          sender: 'ai',
          text: 'I can rebalance your day by moving lower-priority items and creating more focus spacing. Use AI Actions to choose Recalibrate, Reduce overload, or Optimize schedule.',
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
          id: userMsgId + '_ai',
          sender: 'ai',
          text: 'I can move non-urgent items out of your evening block to reduce overload. Want me to reduce overload now?',
          timestamp: ts,
          actions: [
            { label: 'Reduce Overload', actionId: 'reduce_overload' },
            { label: 'Dismiss', actionId: 'dismiss_initial' },
          ],
        }
      );
      return;
    }

    if (actionType === 'ai_actions_menu') {
      postMessages(
        { id: userMsgId, sender: 'user', text: 'AI Actions', timestamp: ts },
        {
          id: userMsgId + '_ai',
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
      // Per Figma state 4: this action asks a clarifying question before running.
      postMessages(
        { id: userMsgId, sender: 'user', text: 'Recalibrate My Day', timestamp: ts },
        {
          id: userMsgId + '_ai_energy',
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
      setPlansBackup(JSON.parse(JSON.stringify(plans)));
      setIsLoading(true);
      postMessages(
        { id: userMsgId, sender: 'user', text: 'Reduce Overload', timestamp: ts },
        { id: userMsgId + '_ai_loading', sender: 'ai', text: 'Rebalancing tasks to reduce cognitive overload... Please wait.', timestamp: ts }
      );
      setTimeout(() => {
        setIsLoading(false);
        setPlans((prev) => {
          const items = prev[SEED_DATE_KEY] || [];
          return {
            ...prev,
            [SEED_DATE_KEY]: items.map((item) =>
              item.id === '2' ? { ...item, status: 'Rescheduled' } : item
            ),
          };
        });
        postMessages({
          id: userMsgId + '_ai_done',
          sender: 'ai',
          text: "Reduced overload. I've rescheduled 'Complete Work Task' to tomorrow and left only urgent items for today to reduce cognitive pressure. Do you want to keep this?",
          timestamp: ts,
          actions: [
            { label: 'Accept changes', actionId: 'accept_recalibrate' },
            { label: 'Undo changes', actionId: 'dismiss_recalibrate' },
          ],
        });
      }, 1500);
      return;
    }

    if (actionType === 'optimize_schedule') {
      setPlansBackup(JSON.parse(JSON.stringify(plans)));
      setIsLoading(true);
      postMessages(
        { id: userMsgId, sender: 'user', text: 'Optimize Schedule', timestamp: ts },
        { id: userMsgId + '_ai_loading', sender: 'ai', text: 'Optimizing your daily planner layout... Please wait.', timestamp: ts }
      );
      setTimeout(() => {
        setIsLoading(false);
        setPlans((prev) => {
          const items = prev[SEED_DATE_KEY] || [];
          return {
            ...prev,
            [SEED_DATE_KEY]: items.map((item) =>
              item.id === '1' || item.id === '3' ? { ...item, optimized: true } : item
            ),
          };
        });
        postMessages({
          id: userMsgId + '_ai_done',
          sender: 'ai',
          text: "Schedule optimized. I've re-arranged your Workout and Exercise blocks to align with your peak focus hours. Do you want to keep this?",
          timestamp: ts,
          actions: [
            { label: 'Accept changes', actionId: 'accept_recalibrate' },
            { label: 'Undo changes', actionId: 'dismiss_recalibrate' },
          ],
        });
      }, 1500);
      return;
    }
  };

  const runRecalibration = () => {
    setPlansBackup(JSON.parse(JSON.stringify(plans)));
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setPlans((prev) => {
        const items = prev[SEED_DATE_KEY] || [];
        const alreadySuggested = items.some((item) => item.id === RECALIBRATED_SUGGESTION.id);
        return {
          ...prev,
          [SEED_DATE_KEY]: [
            ...items.map((item) => (item.id === '4' ? { ...item, balanced: true } : item)),
            ...(alreadySuggested ? [] : [RECALIBRATED_SUGGESTION]),
          ],
        };
      });
      postMessages({
        id: 'ai_recalibrate_done_' + Date.now(),
        sender: 'ai',
        text: 'Done! The day was recalibrated successfully!',
        timestamp: timestamp(),
        links: [{ label: 'Undo changes', actionId: 'dismiss_recalibrate' }],
      });
    }, 1500);
  };

  const handleActionClick = (actionId) => {
    const ts = timestamp();

    // The AI Actions menu posts its 3 options as in-chat message actions, which route
    // through this handler (not handleQuickAction) — delegate to the shared logic.
    if (actionId === 'recalibrate_day' || actionId === 'reduce_overload' || actionId === 'optimize_schedule') {
      handleQuickAction(actionId);
      return;
    }

    if (actionId === 'energy_low' || actionId === 'energy_medium' || actionId === 'energy_high') {
      const label = { energy_low: 'Low', energy_medium: 'Medium', energy_high: 'High' }[actionId];
      postMessages({ id: 'user_energy_' + Date.now(), sender: 'user', text: label, timestamp: ts });
      runRecalibration();
      return;
    }

    if (actionId === 'accept_initial') {
      setHasAcceptedPlan(true);
      postMessages(
        { id: 'user_accept_' + Date.now(), sender: 'user', text: 'Accept plan', timestamp: ts },
        {
          id: 'ai_accept_reply_' + Date.now(),
          sender: 'ai',
          text: 'Great. Your day is set. You can adjust anything by typing here or using the actions above.',
          timestamp: ts,
          links: [{ label: 'Undo changes', actionId: 'dismiss_recalibrate' }],
        }
      );
      return;
    }

    if (actionId === 'accept_recalibrate') {
      postMessages(
        { id: 'user_accept_' + Date.now(), sender: 'user', text: 'Accept changes', timestamp: ts },
        {
          id: 'ai_accept_reply_' + Date.now(),
          sender: 'ai',
          text: 'Great! The changes have been successfully applied to your planner layout.',
          timestamp: ts,
          links: [{ label: 'Undo changes', actionId: 'dismiss_recalibrate' }],
        }
      );
      return;
    }

    if (actionId === 'dismiss_initial') {
      setHasAcceptedPlan(false);
      postMessages(
        { id: 'user_dismiss_' + Date.now(), sender: 'user', text: 'Dismiss', timestamp: ts },
        {
          id: 'ai_dismiss_reply_' + Date.now(),
          sender: 'ai',
          text: 'No problem — the suggested plan was dismissed. Ask me to build a new one whenever you\'re ready.',
          timestamp: ts,
        }
      );
      return;
    }

    if (actionId === 'dismiss_recalibrate') {
      if (plansBackup) {
        setPlans(plansBackup);
      }
      postMessages(
        { id: 'user_undo_' + Date.now(), sender: 'user', text: 'Undo changes', timestamp: ts },
        { id: 'ai_undo_reply_' + Date.now(), sender: 'ai', text: 'Restored your previous schedule settings.', timestamp: ts }
      );
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setChatInput('');
    const ts = timestamp();
    const msgId = Date.now().toString();

    postMessages({ id: msgId, sender: 'user', text: userText, timestamp: ts });

    setTimeout(() => {
      postMessages({
        id: msgId + '_ai',
        sender: 'ai',
        text: `I've updated your schedule preferences based on: "${userText}".`,
        timestamp: ts,
      });
    }, 1000);
  };

  const navigateMonth = (direction) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  return (
    <div className="relative flex min-h-full flex-col py-7.5 max-lg:min-h-0 max-lg:py-4 max-lg:sm:py-6">
      <div className="mx-auto flex min-h-0 w-full min-w-0 flex-1 flex-col gap-6 xl:flex-row">
        {/* Left Side: Header, Controls, and Board */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <PlannerHeader />
          <PlannerControls
            currentDate={currentDate}
            setSelectedDate={setSelectedDate}
            viewMode={viewMode}
            setViewMode={setViewMode}
            dropdownOpen={dropdownOpen}
            setDropdownOpen={setDropdownOpen}
            navigateMonth={navigateMonth}
            handleOpenModal={handleOpenModal}
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
            onAccept={() => handleActionClick('accept_initial')}
            onDismiss={() => handleActionClick('dismiss_initial')}
          />
        </div>

        {/* AI Assistant Sidebar */}
        <AIAssistant
          messages={messages}
          chatInput={chatInput}
          setChatInput={setChatInput}
          handleSendMessage={handleSendMessage}
          handleActionClick={handleActionClick}
          handleQuickAction={handleQuickAction}
          chatContainerRef={chatContainerRef}
          hasAcceptedPlan={hasAcceptedPlan}
          viewMode={viewMode}
        />
      </div>

      <NewPlanModal open={modle} onClose={handleCloseModal} onSave={handleSavePlan} />
    </div>
  );
}
