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

  // Plans/tasks data mapping
  const [plans, setPlans] = useState({
    '2026-05-13': [
      { id: '1', title: 'Morning Workout...' },
      { id: '2', title: 'Complete Work T...' },
      { id: '3', title: 'Exercise Routine' }
    ]
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
        { label: 'Dismiss', actionId: 'dismiss_initial' }
      ]
    }
  ]);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSavePlan = (data) => {
    const dateKey = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
    const newPlan = {
      id: Date.now().toString(),
      title: data.title || 'Untitled Plan'
    };
    
    setPlans(prev => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), newPlan]
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
        isCurrentMonth: false
      });
    }

    // Current month days
    for (let i = 1; i <= totalDays; i++) {
      days.push({
        day: i,
        month: month,
        year: year,
        isCurrentMonth: true
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
        isCurrentMonth: false
      });
    }

    return days;
  };

  const calendarDays = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());

  const handleQuickAction = (actionType) => {
    let userMsg = '';
    let aiResponse = '';
    
    if (actionType === 'balance') {
      userMsg = 'Balance my schedule';
      aiResponse = "I've re-distributed your tasks for May 13 to allow for better work-life balance and deep focus time. Do you want to keep it?";
    } else if (actionType === 'free_evening') {
      userMsg = 'Free up my evening';
      aiResponse = "I've moved evening tasks to tomorrow morning to ensure you have a relaxed evening.";
      setTimeout(() => {
        setPlans(prev => {
          const updated = { ...prev };
          const eveningPlans = updated['2026-05-13'] || [];
          updated['2026-05-14'] = [...(updated['2026-05-14'] || []), ...eveningPlans];
          updated['2026-05-13'] = [];
          return updated;
        });
      }, 1000);
    } else if (actionType === 'monthly_plan') {
      userMsg = 'Generate Monthly Plan';
      aiResponse = "I've generated focus blocks for May 2026. The calendar has been updated with these slots.";
    }

    const timestamp = 'Today • ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsgId = Date.now().toString();
    
    setMessages(prev => [
      ...prev,
      { id: userMsgId, sender: 'user', text: userMsg, timestamp },
      { id: userMsgId + '_ai', sender: 'ai', text: aiResponse, timestamp }
    ]);
  };

  const handleActionClick = (actionId) => {
    const timestamp = 'Today • ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (actionId === 'accept_initial') {
      setMessages(prev => [
        ...prev,
        { id: 'user_accept', sender: 'user', text: 'Accept plan', timestamp },
        { 
          id: 'ai_accept_reply', 
          sender: 'ai', 
          text: 'Great. Your day is set. You can adjust anything by typing here or using the actions above.', 
          timestamp,
          links: [{ label: 'Undo changes', actionId: 'undo_initial' }] 
        }
      ]);
    } else if (actionId === 'undo_initial') {
      setMessages(prev => [
        ...prev,
        { id: 'user_undo', sender: 'user', text: 'Undo changes', timestamp },
        { id: 'ai_undo_reply', sender: 'ai', text: 'Restored your previous schedule settings.', timestamp }
      ]);
    } else if (actionId === 'dismiss_initial') {
      setMessages(prev => [
        ...prev,
        { id: 'user_dismiss', sender: 'user', text: 'Dismiss plan', timestamp },
        { id: 'ai_dismiss_reply', sender: 'ai', text: 'Suggested plan dismissed. Let me know how else I can help.', timestamp }
      ]);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setChatInput('');
    const timestamp = 'Today • ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const msgId = Date.now().toString();

    setMessages(prev => [
      ...prev,
      { id: msgId, sender: 'user', text: userText, timestamp }
    ]);

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { 
          id: msgId + '_ai', 
          sender: 'ai', 
          text: `I've updated your schedule preferences based on: "${userText}".`, 
          timestamp 
        }
      ]);
    }, 1000);
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
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
      <div className="mx-auto flex flex-col lg:flex-row gap-6">
        
        {/* Left Side: Header, Controls, and Board */}
        <div className="flex-1 flex flex-col">
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
          chatEndRef={chatEndRef}
        />

      </div>

      <NewPlanModal open={modle} onClose={handleCloseModal} onSave={handleSavePlan} />
    </div>
  );
}
