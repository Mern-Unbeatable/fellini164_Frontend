import React, { useState, useEffect, useRef } from 'react';
import NewPlanModal from './components/NewPlanModal';
import PlannerBoard from './components/PlannerBoard';
import AIAssistant from './components/AIAssistant';
import PlannerHeader from './components/PlannerHeader';
import PlannerControls from './components/PlannerControls';

export default function DailyPlanner() {
  const [modle, setModle] = useState(false);
  const handleOpenModal = () => setModle(true);
  const handleCloseModal = () => setModle(false);

  // Selected date (May 13, 2026)
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 13));
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 4, 13));
  const [viewMode, setViewMode] = useState('Monthly');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // loading state for shimmer skeleton
  const [isLoading, setIsLoading] = useState(false);
  // state to manage simulated planner configurations
  const [aiActionState, setAiActionState] = useState(null); // 'recalibrated' | 'overload_reduced' | 'optimized' | 'balanced' | 'free_evening' | null

  // Backup of plans for undo functionality
  const [plansBackup, setPlansBackup] = useState(null);

  // Plans/tasks data mapping
  const [plans, setPlans] = useState({
    '2026-05-13': [
      { id: '1', title: 'Morning Workout...' },
      { id: '2', title: 'Complete Work T...' },
      { id: '3', title: 'Exercise Routine' },
    ],
  });

  // AI chat history
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 'm1',
      sender: 'ai',
      text: "I've built a suggested plan for your day based on your tasks, habits, and priorities.\n\nDo you want to keep it?",
      timestamp: 'Tuesday, May 5 • 7:39 PM',
      actions: [
        { label: 'Accept plan', actionId: 'accept_initial' },
        { label: 'Dismiss', actionId: 'dismiss_initial' },
      ],
    },
  ]);

  const chatContainerRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSavePlan = (data) => {
    const dateKey = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
    const newPlan = {
      id: Date.now().toString(),
      title: data.title || 'Untitled Plan',
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

    // Prev month overflow
    for (let i = startDay - 1; i >= 0; i--) {
      days.push({
        day: prevMonthTotalDays - i,
        month: month - 1,
        year: year,
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let i = 1; i <= totalDays; i++) {
      days.push({
        day: i,
        month: month,
        year: year,
        isCurrentMonth: true,
      });
    }

    // Next month overflow
    const totalCells = days.length > 35 ? 42 : 35;
    const remaining = totalCells - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({
        day: i,
        month: month + 1,
        year: year,
        isCurrentMonth: false,
      });
    }

    return days;
  };

  const calendarDays = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());

  const handleQuickAction = (actionType) => {
    const timestamp =
      'Today • ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsgId = Date.now().toString();

    if (actionType === 'ai_actions_menu') {
      setMessages((prev) => [
        ...prev,
        { id: userMsgId, sender: 'user', text: 'Select AI Action', timestamp },
        {
          id: userMsgId + '_ai',
          sender: 'ai',
          text: 'Here are the available AI actions you can run on your planner:',
          timestamp,
          actions: [
            { label: 'Recalibrate my day', actionId: 'recalibrate_day' },
            { label: 'Reduce overload', actionId: 'reduce_overload' },
            { label: 'Optimize schedule', actionId: 'optimize_schedule' },
          ],
        },
      ]);
      return;
    }

    if (actionType === 'recalibrate_day') {
      setPlansBackup(JSON.parse(JSON.stringify(plans)));
      setIsLoading(true);
      setMessages((prev) => [
        ...prev,
        { id: userMsgId, sender: 'user', text: 'Recalibrate my day', timestamp },
        { id: userMsgId + '_ai_loading', sender: 'ai', text: 'Recalibrating your day based on your tasks, habits, and priorities... Please wait.', timestamp }
      ]);
      setTimeout(() => {
        setIsLoading(false);
        setAiActionState('recalibrated');
        setPlans((prev) => ({
          ...prev,
          '2026-05-13': [
            { id: '1', title: 'Morning Workout...', source: 'ai', status: 'To Do', priority: 'HIGH' },
            { id: '2', title: 'Complete Work T...', source: 'ai', status: 'To Do', priority: 'MEDIUM' },
            { id: '3', title: 'Exercise Routine', source: 'ai', status: 'To Do', priority: 'URGENT' },
            { id: '4', title: 'Career Development Plan', source: 'ai', status: 'In Progress', priority: 'HIGH' },
            { id: '5', title: 'Read Book & Meditate', source: 'ai', status: 'To Do', priority: 'LOW' }
          ]
        }));
        setMessages((prev) => [
          ...prev,
          {
            id: userMsgId + '_ai_done',
            sender: 'ai',
            text: "I've recalibrated your schedule. I've added a Career Block and a balanced cognitive buffer to optimize performance. Do you want to keep it?",
            timestamp,
            actions: [
              { label: 'Accept plan', actionId: 'accept_recalibrate' },
              { label: 'Dismiss', actionId: 'dismiss_recalibrate' },
            ]
          }
        ]);
      }, 1500);
      return;
    }

    if (actionType === 'reduce_overload') {
      setPlansBackup(JSON.parse(JSON.stringify(plans)));
      setIsLoading(true);
      setMessages((prev) => [
        ...prev,
        { id: userMsgId, sender: 'user', text: 'Reduce overload', timestamp },
        { id: userMsgId + '_ai_loading', sender: 'ai', text: 'Rebalancing tasks to reduce cognitive overload... Please wait.', timestamp }
      ]);
      setTimeout(() => {
        setIsLoading(false);
        setAiActionState('overload_reduced');
        setPlans((prev) => {
          const updated = { ...prev };
          const items = updated['2026-05-13'] || [];
          updated['2026-05-13'] = items.filter(x => x.id !== '2'); // Move Complete Work Task
          updated['2026-05-14'] = [
            ...(updated['2026-05-14'] || []),
            { id: '2', title: 'Complete Work Task (Rescheduled)', source: 'ai', status: 'To Do', priority: 'MEDIUM' }
          ];
          return updated;
        });
        setMessages((prev) => [
          ...prev,
          {
            id: userMsgId + '_ai_done',
            sender: 'ai',
            text: "Reduced overload. I've moved 'Complete Work Task' to tomorrow (May 14) and left only urgent items for today to reduce cognitive pressure. Do you want to keep this?",
            timestamp,
            actions: [
              { label: 'Accept changes', actionId: 'accept_recalibrate' },
              { label: 'Undo changes', actionId: 'dismiss_recalibrate' },
            ]
          }
        ]);
      }, 1500);
      return;
    }

    if (actionType === 'optimize_schedule') {
      setPlansBackup(JSON.parse(JSON.stringify(plans)));
      setIsLoading(true);
      setMessages((prev) => [
        ...prev,
        { id: userMsgId, sender: 'user', text: 'Optimize schedule', timestamp },
        { id: userMsgId + '_ai_loading', sender: 'ai', text: 'Optimizing your daily planner layout... Please wait.', timestamp }
      ]);
      setTimeout(() => {
        setIsLoading(false);
        setAiActionState('optimized');
        setPlans((prev) => ({
          ...prev,
          '2026-05-13': [
            { id: '1', title: 'Morning Workout...', source: 'ai', status: 'To Do', priority: 'HIGH' },
            { id: '3', title: 'Exercise Routine', source: 'ai', status: 'To Do', priority: 'URGENT' },
            { id: '2', title: 'Complete Work T...', source: 'ai', status: 'To Do', priority: 'MEDIUM' }
          ]
        }));
        setMessages((prev) => [
          ...prev,
          {
            id: userMsgId + '_ai_done',
            sender: 'ai',
            text: "Schedule optimized. I've re-arranged your Workout and Exercise blocks to align with your peak focus hours. Do you want to keep this?",
            timestamp,
            actions: [
              { label: 'Accept changes', actionId: 'accept_recalibrate' },
              { label: 'Undo changes', actionId: 'dismiss_recalibrate' },
            ]
          }
        ]);
      }, 1500);
      return;
    }

    let userMsg = '';
    let aiResponse = '';

    if (actionType === 'balance') {
      setPlansBackup(JSON.parse(JSON.stringify(plans)));
      userMsg = 'Balance my schedule';
      aiResponse = "I've re-distributed your tasks for May 13 to allow for better work-life balance and deep focus time. Do you want to keep it?";
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setAiActionState('balanced');
        setPlans((prev) => ({
          ...prev,
          '2026-05-13': [
            { id: '1', title: 'Morning Workout...', source: 'ai', status: 'To Do', priority: 'HIGH' },
            { id: '2', title: 'Complete Work T...', source: 'ai', status: 'To Do', priority: 'MEDIUM' },
            { id: '3', title: 'Exercise Routine', source: 'ai', status: 'To Do', priority: 'URGENT' },
          ]
        }));
      }, 1500);
    } else if (actionType === 'free_evening') {
      setPlansBackup(JSON.parse(JSON.stringify(plans)));
      userMsg = 'Free up my evening';
      aiResponse = "I've moved evening tasks to tomorrow morning to ensure you have a relaxed evening.";
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setAiActionState('free_evening');
        setPlans((prev) => {
          const updated = { ...prev };
          const eveningPlans = updated['2026-05-13'] || [];
          updated['2026-05-14'] = [...(updated['2026-05-14'] || []), ...eveningPlans];
          updated['2026-05-13'] = [];
          return updated;
        });
      }, 1500);
    } else if (actionType === 'monthly_plan') {
      userMsg = 'Generate Monthly Plan';
      aiResponse = "I've generated focus blocks for May 2026. The calendar has been updated with these slots.";
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setPlans((prev) => ({
          ...prev,
          '2026-05-11': [{ id: 'm1', title: 'Sprint Focus Block' }],
          '2026-05-13': [
            { id: '1', title: 'Morning Workout...' },
            { id: '2', title: 'Complete Work T...' },
            { id: '3', title: 'Exercise Routine' }
          ],
          '2026-05-15': [{ id: 'm2', title: 'Client Review Block' }],
          '2026-05-20': [{ id: 'm3', title: 'Product Rebalance Block' }],
        }));
      }, 1500);
    }

    const userMsgIdRaw = Date.now().toString();

    setMessages((prev) => [
      ...prev,
      { id: userMsgIdRaw, sender: 'user', text: userMsg, timestamp },
      {
        id: userMsgIdRaw + '_ai',
        sender: 'ai',
        text: aiResponse,
        timestamp,
        actions: [
          { label: 'Accept changes', actionId: 'accept_recalibrate' },
          { label: 'Undo changes', actionId: 'dismiss_recalibrate' },
        ]
      },
    ]);
  };

  const handleActionClick = (actionId) => {
    const timestamp =
      'Today • ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (actionId === 'accept_initial' || actionId === 'accept_recalibrate') {
      setMessages((prev) => [
        ...prev,
        { id: 'user_accept_' + Date.now(), sender: 'user', text: 'Accept changes', timestamp },
        {
          id: 'ai_accept_reply_' + Date.now(),
          sender: 'ai',
          text: 'Great! The changes have been successfully applied to your planner layout.',
          timestamp,
          links: [{ label: 'Undo changes', actionId: 'dismiss_recalibrate' }],
        },
      ]);
      setAiActionState(null);
    } else if (actionId === 'dismiss_initial' || actionId === 'dismiss_recalibrate') {
      if (plansBackup) {
        setPlans(plansBackup);
      }
      setMessages((prev) => [
        ...prev,
        { id: 'user_undo_' + Date.now(), sender: 'user', text: 'Undo changes', timestamp },
        {
          id: 'ai_undo_reply_' + Date.now(),
          sender: 'ai',
          text: 'Restored your previous schedule settings.',
          timestamp,
        },
      ]);
      setAiActionState(null);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setChatInput('');
    const timestamp =
      'Today • ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const msgId = Date.now().toString();

    setMessages((prev) => [...prev, { id: msgId, sender: 'user', text: userText, timestamp }]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: msgId + '_ai',
          sender: 'ai',
          text: `I've updated your schedule preferences based on: "${userText}".`,
          timestamp,
        },
      ]);
    }, 1000);
  };

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const navigateMonth = (direction) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const getFormattedDateString = (dayObj) => {
    return `${dayObj.year}-${String(dayObj.month + 1).padStart(2, '0')}-${String(dayObj.day).padStart(2, '0')}`;
  };

  return (
    <div className="py-7.5 max-lg:py-4 max-lg:sm:py-6">
      <div className="mx-auto flex flex-col gap-6 xl:flex-row">
        {/* Left Side: Header, Controls, and Board */}
        <div className="flex flex-1 flex-col">
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
            months={months}
          />
          <PlannerBoard
            currentDate={currentDate}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            viewMode={viewMode}
            plans={plans}
            calendarDays={calendarDays}
            getFormattedDateString={getFormattedDateString}
            isLoading={isLoading}
            aiActionState={aiActionState}
            onAccept={() => handleActionClick('accept_recalibrate')}
            onDismiss={() => handleActionClick('dismiss_recalibrate')}
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
        />
      </div>

      <NewPlanModal open={modle} onClose={handleCloseModal} onSave={handleSavePlan} />
    </div>
  );
}
