import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Sparkles } from 'lucide-react';
import { toast } from 'react-toastify';
import NewPlanModal from './components/NewPlanModal';
import PlannerBoard from './components/PlannerBoard';
import AIAssistant from './components/AIAssistant';
import PlannerHeader from './components/PlannerHeader';
import PlannerControls from './components/PlannerControls';
import { dateKeyFromDate } from './plannerData';
import { clonePlans } from './plannerEngine';
import { getStorage, setStorage } from '../../../../../utils/storage';
import {
  acceptPlannerSuggestion,
  createPlannerPlan,
  dismissPlannerSuggestion,
  fetchPlannerAvailable,
  fetchPlannerBoard,
  fetchPlannerChat,
  fetchPlannerGhostSuggestions,
  fetchPlannerSuggestion,
  fetchPlannerSummary,
  suggestPlannerAi,
  undoPlannerAi,
  setHasAcceptedPlanLocal,
} from '../../../../../features/planner/plannerSlice';
import {
  AI_ACTION_TO_API,
  VIEW_FROM_DATE_RANGE,
  VIEW_UI_TO_API,
  boardToPlansMap,
  buildPlannerSuggestSourceItems,
  suggestionResponseToPlans,
  buildCreatePlanPayload,
  createPlanPromptForView,
  mapPlannerBoardFromApi,
  mapPlannerChatToMessages,
  mapPlannerItemsFromApi,
} from '../../../../../features/planner/plannerMappers';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const VIEW_MODE_STORAGE_KEY = 'planner_view_mode';
const VIEW_MODES = ['Daily', 'Weekly', 'Monthly'];

function plansHaveItems(planMap) {
  return Object.values(planMap || {}).some((items) => Array.isArray(items) && items.length > 0);
}

function ghostPlacementList(suggestions) {
  const placements = [];
  (suggestions || []).forEach((suggestion) => {
    const list = suggestion?.planner?.placements;
    if (Array.isArray(list)) placements.push(...list);
  });
  return placements;
}

function ghostBackendMessage(suggestions) {
  for (const suggestion of suggestions || []) {
    const message = suggestion?.message || suggestion?.planner?.message;
    if (String(message || '').trim()) return String(message).trim();
  }
  return '';
}

function getInitialViewMode() {
  const saved = getStorage(VIEW_MODE_STORAGE_KEY);
  return VIEW_MODES.includes(saved) ? saved : 'Daily';
}

function suggestionBoardToPlans(suggestPayload, fallbackDateKey, sourceItems = []) {
  return suggestionResponseToPlans(suggestPayload, sourceItems, fallbackDateKey);
}

export default function DailyPlanner() {
  const dispatch = useDispatch();
  const {
    plans: storePlans,
    ghostPlans,
    ghostSuggestions,
    ghostStatus,
    hasAcceptedPlan: storeHasAccepted,
    status: boardStatus,
    lastSuggestionId,
    available,
  } = useSelector((state) => state.planner);

  const [isNewPlanModalOpen, setIsNewPlanModalOpen] = useState(false);
  const [isCreatingPlan, setIsCreatingPlan] = useState(false);
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);
  const [selectedDate, setSelectedDate] = useState(today);
  const [viewMode, setViewMode] = useState(getInitialViewMode);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [hasAcceptedPlan, setHasAcceptedPlan] = useState(false);
  const [plans, setPlans] = useState({});
  const [isAssistantOpen, setIsAssistantOpen] = useState(true);
  const [isAssistantExpanded, setIsAssistantExpanded] = useState(false);
  const [pendingProposal, setPendingProposal] = useState(null);
  const [planHistory, setPlanHistory] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [chatHistoryReady, setChatHistoryReady] = useState(false);
  const chatContainerRef = useRef(null);
  const plansRef = useRef(plans);
  const hasAcceptedRef = useRef(hasAcceptedPlan);
  const emptySuggestRequested = useRef(false);

  useEffect(() => {
    plansRef.current = plans;
  }, [plans]);
  useEffect(() => {
    hasAcceptedRef.current = hasAcceptedPlan;
  }, [hasAcceptedPlan]);

  useEffect(() => {
    setStorage(VIEW_MODE_STORAGE_KEY, viewMode);
  }, [viewMode]);

  useEffect(() => {
    setPlans(storePlans || {});
  }, [storePlans]);

  useEffect(() => {
    setHasAcceptedPlan(Boolean(storeHasAccepted));
  }, [storeHasAccepted]);

  useEffect(() => {
    setIsLoading(boardStatus === 'loading');
  }, [boardStatus]);

  const selectedDateKey = dateKeyFromDate(selectedDate);

  const refreshBoard = useCallback(() => {
    dispatch(fetchPlannerBoard({ viewType: viewMode, date: selectedDateKey }));
    dispatch(fetchPlannerSummary(selectedDateKey));
    dispatch(fetchPlannerAvailable(selectedDateKey));
  }, [dispatch, viewMode, selectedDateKey]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    dispatch(fetchPlannerGhostSuggestions());
  }, [dispatch]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = await dispatch(fetchPlannerChat()).unwrap();
        if (cancelled) return;
        const mapped = mapPlannerChatToMessages(raw);
        if (mapped.messages.length) {
          setMessages(mapped.messages);
          emptySuggestRequested.current = true;
          if (mapped.pending) {
            setPendingProposal({
              ...mapped.pending,
              beforePlans: clonePlans(plansRef.current),
            });
          }
        }
      } catch {
        /* Planner chat history is optional until the first saved turn. */
      } finally {
        if (!cancelled) setChatHistoryReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  useEffect(() => {
    refreshBoard();
  }, [refreshBoard]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const timestamp = () => {
    const now = new Date();
    const dayPart = now.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
    const timePart = now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
    return `${dayPart} • ${timePart}`;
  };

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
          link.actionId?.startsWith('undo:') ? { ...link, disabled: true } : link
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

  const handleSavePlan = async (data) => {
    const payload = buildCreatePlanPayload({
      prompt: data.plan,
      dateRangeLabel: data.dateRange,
      customStart: data.customStart,
      customEnd: data.customEnd,
    });

    if (!payload.prompt) {
      throw new Error('Describe what you want to plan.');
    }
    if (payload.dateRange === 'CUSTOM' && (!payload.startDate || !payload.endDate)) {
      throw new Error('Select start and end dates for a custom range.');
    }

    const now = Date.now();
    const transactionId = `modal_create_${now}`;
    const beforePlans = clonePlans(plansRef.current);
    const beforeAccepted = hasAcceptedRef.current;

    setIsCreatingPlan(true);
    setIsLoading(true);
    try {
      const result = await dispatch(createPlannerPlan(payload)).unwrap();
      const apiView = String(result?.viewType || '').toUpperCase();
      const nextView =
        apiView === 'DAILY'
          ? 'Daily'
          : apiView === 'WEEKLY'
            ? 'Weekly'
            : apiView === 'MONTHLY'
              ? 'Monthly'
              : VIEW_FROM_DATE_RANGE[payload.dateRange] || viewMode;

      setViewMode(nextView);

      if (result?.date) {
        const [y, m, d] = String(result.date).split('-').map(Number);
        if (y && m && d) {
          const nextDate = new Date(y, m - 1, d);
          setCurrentDate(nextDate);
          setSelectedDate(nextDate);
        }
      } else if (payload.startDate) {
        const [y, m, d] = String(payload.startDate).split('-').map(Number);
        if (y && m && d) {
          const nextDate = new Date(y, m - 1, d);
          setCurrentDate(nextDate);
          setSelectedDate(nextDate);
        }
      }

      const mappedBoard = mapPlannerBoardFromApi(result?.board);
      const nextPlans = boardToPlansMap(
        mappedBoard,
        result?.date || payload.startDate || selectedDateKey
      );
      setPlans(nextPlans);
      setHasAcceptedPlan(true);
      dispatch(setHasAcceptedPlanLocal(true));
      setPendingProposal(null);

      recordCommittedChange({
        id: transactionId,
        label: 'Create Plan',
        beforePlans,
        beforeAccepted,
        afterPlans: clonePlans(nextPlans),
        afterAccepted: true,
        type: 'generation',
        useApiUndo: true,
      });

      // Modal create-plan owns board state via Redux/local plans — do not post into AI Assistant chat.
      dispatch(fetchPlannerSummary(result?.date || selectedDateKey));
      dispatch(fetchPlannerAvailable(result?.date || selectedDateKey));
      setIsNewPlanModalOpen(false);
    } catch (error) {
      const message =
        typeof error === 'string'
          ? error
          : error?.message || 'Failed to create plan. Please try again.';
      throw new Error(message);
    } finally {
      setIsCreatingPlan(false);
      setIsLoading(false);
    }
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

  const runAiSuggest = async ({
    actionKey,
    userText,
    message,
    viewType,
  }) => {
    if (isLoading || pendingProposal) {
      pendingNotice(userText);
      return;
    }

    const apiAction = AI_ACTION_TO_API[actionKey] || actionKey;
    const now = Date.now();
    const transactionId = `suggest_${apiAction}_${now}`;
    const beforePlans = clonePlans(plansRef.current);
    const beforeAccepted = hasAcceptedRef.current;

    setIsLoading(true);
    postMessages(
      { id: `user_${now}`, sender: 'user', text: userText, timestamp: timestamp() },
      {
        id: `ai_loading_${now}`,
        sender: 'ai',
        text: 'Reviewing your schedule...',
        timestamp: timestamp(),
      }
    );

    try {
      const payload = {
        action: apiAction,
        viewType: viewType || VIEW_UI_TO_API[viewMode] || 'DAILY',
        date: selectedDateKey,
      };
      if (
        (apiAction === 'CHAT' || apiAction === 'GENERATE_PLAN') &&
        (message || userText)
      ) {
        payload.message = message || userText;
      }

      const result = await dispatch(suggestPlannerAi({ payload })).unwrap();

      let previewPlans;
      try {
        const sourceItems = buildPlannerSuggestSourceItems(plansRef.current, available);
        previewPlans = suggestionBoardToPlans(result, selectedDateKey, sourceItems);
      } catch {
        toast.error('Could not preview that AI schedule. Please try again.');
        setPlans(beforePlans);
        setHasAcceptedPlan(beforeAccepted);
        postMessages({
          id: `ai_suggest_map_err_${now}`,
          sender: 'ai',
          text: 'I could not apply that schedule preview. Please try another action.',
          timestamp: timestamp(),
        });
        return;
      }

      setPlans(previewPlans);
      setHasAcceptedPlan(false);

      setPendingProposal({
        id: transactionId,
        suggestionId: result?.suggestionId || lastSuggestionId,
        label: userText,
        beforePlans,
        beforeAccepted,
        afterPlans: clonePlans(previewPlans),
        afterAccepted: true,
        type: 'ai_suggest',
        result,
      });

      postMessages({
        id: `ai_suggest_${now}`,
        sender: 'ai',
        text: result?.message || 'Here is a suggested schedule. Accept to apply it, or dismiss to keep your current plan.',
        timestamp: timestamp(),
        suggestionId: result?.suggestionId,
        actions: [
          { label: 'Accept plan', actionId: `accept_change:${transactionId}` },
          { label: 'Dismiss', actionId: `dismiss_change:${transactionId}` },
        ],
      });
    } catch {
      setPlans(beforePlans);
      setHasAcceptedPlan(beforeAccepted);
      postMessages({
        id: `ai_suggest_err_${now}`,
        sender: 'ai',
        text: 'I could not update the schedule. Please try again.',
        timestamp: timestamp(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!chatHistoryReady || emptySuggestRequested.current || pendingProposal) return;
    if (boardStatus !== 'succeeded' || ghostStatus !== 'succeeded') return;
    if (plansHaveItems(storePlans)) return;

    const placements = ghostPlacementList(ghostSuggestions);
    const onboardMessage = ghostBackendMessage(ghostSuggestions);
    const ghostSuggestion =
      (ghostSuggestions || []).find(
        (item) =>
          item?.suggestionId &&
          Array.isArray(item?.planner?.placements) &&
          item.planner.placements.length > 0
      ) || (ghostSuggestions || []).find((item) => item?.suggestionId);
    const suggestionId = ghostSuggestion?.suggestionId;
    if (!suggestionId || (!placements.length && !onboardMessage)) return;

    emptySuggestRequested.current = true;
    const transactionId = `ghost_suggest_${Date.now()}`;
    const beforePlans = clonePlans(plansRef.current);

    (async () => {
      let text = onboardMessage;

      if (placements.length) {
        try {
          const result = await dispatch(
            suggestPlannerAi({
              silent: true,
              payload: {
                action: 'GENERATE_PLAN',
                viewType: VIEW_UI_TO_API[viewMode] || 'DAILY',
                date: selectedDateKey,
                message:
                  'Build a suggested plan for my day based on my tasks, habits, and priorities.',
                placements,
              },
            })
          ).unwrap();
          text = String(result?.message || onboardMessage || '').trim();
        } catch {
          text = onboardMessage;
        }
      }

      if (!text) return;

      setPendingProposal({
        id: transactionId,
        suggestionId,
        source: 'planner',
        label: 'Suggested plan',
        beforePlans,
        beforeAccepted: false,
        afterPlans: null,
        afterAccepted: true,
        type: 'ai_suggest',
      });
      postMessages({
        id: `ai_ghost_${transactionId}`,
        sender: 'ai',
        text,
        timestamp: timestamp(),
        suggestionId,
        actions: [
          { label: 'Accept plan', actionId: `accept_change:${transactionId}` },
          { label: 'Dismiss', actionId: `dismiss_change:${transactionId}` },
        ],
      });
    })();
  }, [
    boardStatus,
    ghostStatus,
    chatHistoryReady,
    ghostSuggestions,
    storePlans,
    pendingProposal,
    viewMode,
    selectedDateKey,
    dispatch,
  ]);

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
      (async () => {
        postMessages({ id: userMsgId, sender: 'user', text: "Show what's included", timestamp: ts });
        const suggestionId = pendingProposal?.suggestionId || lastSuggestionId;
        if (suggestionId) {
          try {
            const data = await dispatch(fetchPlannerSuggestion(suggestionId)).unwrap();
            const included = data?.included;
            const lines = [
              data?.title || 'Suggested plan',
              data?.message || '',
              included
                ? `Includes ${included.totalItems ?? 0} items (${included.taskCount ?? 0} tasks, ${included.habitCount ?? 0} habits).`
                : '',
              'Planner AI only changes dates, times, order, and spacing — never task/habit content.',
            ]
              .filter(Boolean)
              .join('\n\n');
            postMessages({
              id: `${userMsgId}_ai`,
              sender: 'ai',
              text: lines,
              timestamp: ts,
            });
            return;
          } catch {
            /* fall through to available */
          }
        }

        let avail = available;
        try {
          avail = await dispatch(fetchPlannerAvailable(selectedDateKey)).unwrap();
        } catch {
          /* use store */
        }
        const taskCount = avail?.tasks?.length ?? 0;
        const habitCount = avail?.habits?.length ?? 0;
        const taskTitles = (avail?.tasks || [])
          .slice(0, 5)
          .map((t) => `• ${t.title}`)
          .join('\n');
        const habitTitles = (avail?.habits || [])
          .slice(0, 5)
          .map((h) => `• ${h.name}`)
          .join('\n');
        postMessages({
          id: `${userMsgId}_ai`,
          sender: 'ai',
          text: [
            `Available (not yet scheduled) for ${avail?.date || selectedDateKey}:`,
            `${taskCount} tasks, ${habitCount} habits.`,
            taskTitles ? `Tasks:\n${taskTitles}` : null,
            habitTitles ? `Habits:\n${habitTitles}` : null,
            'Planner AI only changes dates, times, order, and spacing — never their content.',
          ]
            .filter(Boolean)
            .join('\n\n'),
          timestamp: ts,
        });
      })();
      return;
    }

    if (actionType === 'generate_daily_plan') {
      runAiSuggest({
        actionKey: 'GENERATE_PLAN',
        userText: 'Generate Daily Plan',
        message: createPlanPromptForView('Daily'),
        viewType: 'DAILY',
      });
      return;
    }
    if (actionType === 'generate_weekly_plan') {
      runAiSuggest({
        actionKey: 'GENERATE_PLAN',
        userText: 'Generate Weekly Plan',
        message: createPlanPromptForView('Weekly'),
        viewType: 'WEEKLY',
      });
      return;
    }
    if (actionType === 'generate_monthly_plan' || actionType === 'monthly_plan') {
      runAiSuggest({
        actionKey: 'GENERATE_PLAN',
        userText: 'Generate Monthly Plan',
        message: createPlanPromptForView('Monthly'),
        viewType: 'MONTHLY',
      });
      return;
    }

    if (actionType === 'balance') {
      runAiSuggest({
        actionKey: 'balance',
        userText: 'Balance my schedule',
        message: 'Balance my schedule',
      });
      return;
    }

    if (actionType === 'free_evening') {
      runAiSuggest({
        actionKey: 'free_evening',
        userText: 'Free up my evening',
      });
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
            { label: 'Balance Schedule', actionId: 'balance_schedule' },
            { label: 'Free Evening', actionId: 'free_evening' },
          ],
        }
      );
      return;
    }

    if (actionType === 'recalibrate_day') {
      runAiSuggest({
        actionKey: 'recalibrate_day',
        userText: 'Recalibrate My Day',
      });
      return;
    }

    if (actionType === 'reduce_overload') {
      runAiSuggest({
        actionKey: 'reduce_overload',
        userText: 'Reduce Overload',
      });
      return;
    }

    if (actionType === 'optimize_schedule') {
      runAiSuggest({
        actionKey: 'optimize_schedule',
        userText: 'Optimize Schedule',
      });
      return;
    }

    if (actionType === 'balance_schedule') {
      runAiSuggest({
        actionKey: 'balance',
        userText: 'Balance Schedule',
      });
      return;
    }
  };

  const handleActionClick = async (actionId) => {
    const ts = timestamp();
    resolveMessageActions(actionId);

    if (
      [
        'recalibrate_day',
        'reduce_overload',
        'optimize_schedule',
        'balance_schedule',
        'free_evening',
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
      await runAiSuggest({
        actionKey: 'recalibrate_day',
        userText: label,
      });
      return;
    }

    // API #6 Accept AI Plan — Accept plan (initial or after suggest)
    if (actionId === 'accept_initial' || actionId.startsWith('accept_change:')) {
      const proposalId = actionId.startsWith('accept_change:')
        ? actionId.split(':')[1]
        : pendingProposal?.id;
      const proposal =
        proposalId && pendingProposal?.id === proposalId
          ? pendingProposal
          : pendingProposal;
      const suggestionId = proposal?.suggestionId || lastSuggestionId;

      if (!suggestionId) {
        postMessages({
          id: `ai_accept_none_${Date.now()}`,
          sender: 'ai',
          text: 'There is no pending AI plan to accept. Ask me to recalibrate or optimize your schedule first.',
          timestamp: ts,
        });
        return;
      }

      if (actionId.startsWith('accept_change:') && (!proposal || proposal.id !== proposalId)) {
        postMessages({
          id: `ai_expired_${Date.now()}`,
          sender: 'ai',
          text: 'That schedule preview is no longer active.',
          timestamp: ts,
        });
        return;
      }

      setIsLoading(true);
      try {
        const accepted = await dispatch(acceptPlannerSuggestion(suggestionId)).unwrap();
        console.log('Accept plan response', accepted);
        const mappedBoard = mapPlannerBoardFromApi(accepted?.board || accepted);
        const acceptedPlans = boardToPlansMap(mappedBoard, accepted?.date || selectedDateKey);
        const acceptedHasItems = Object.values(acceptedPlans).some(
          (items) => Array.isArray(items) && items.length > 0
        );
        const afterPlans = proposal?.afterPlans;
        if (acceptedHasItems) {
          setPlans(acceptedPlans);
        } else if (afterPlans) {
          setPlans(afterPlans);
        }
        await dispatch(
          fetchPlannerBoard({ viewType: viewMode, date: selectedDateKey })
        ).unwrap();
        setHasAcceptedPlan(true);
        dispatch(setHasAcceptedPlanLocal(true));
        if (proposal) {
          recordCommittedChange({
            ...proposal,
            useApiUndo: true,
          });
        }
        setPendingProposal(null);
        postMessages(
          { id: `user_accept_${Date.now()}`, sender: 'user', text: 'Accept plan', timestamp: ts },
          {
            id: `ai_accept_reply_${Date.now()}`,
            sender: 'ai',
            text: 'Your AI plan has been applied.',
            timestamp: ts,
            links: proposalId
              ? [{ label: 'Undo changes', actionId: `undo:${proposalId}` }]
              : undefined,
          }
        );
        dispatch(fetchPlannerSummary(selectedDateKey));
        dispatch(fetchPlannerGhostSuggestions());
      } catch {
        postMessages({
          id: `ai_accept_err_${Date.now()}`,
          sender: 'ai',
          text: 'Could not accept that plan. Please try again.',
          timestamp: ts,
        });
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // API #7 Dismiss AI Plan — Dismiss (initial or after suggest)
    if (actionId === 'dismiss_initial' || actionId.startsWith('dismiss_change:')) {
      const proposalId = actionId.startsWith('dismiss_change:')
        ? actionId.split(':')[1]
        : pendingProposal?.id;
      const proposal =
        proposalId && pendingProposal?.id === proposalId
          ? pendingProposal
          : pendingProposal;
      const suggestionId = proposal?.suggestionId || lastSuggestionId;

      if (proposal && (!proposalId || proposal.id === proposalId)) {
        setPlans(proposal.beforePlans);
        setHasAcceptedPlan(proposal.beforeAccepted);
        dispatch(setHasAcceptedPlanLocal(proposal.beforeAccepted));
        setPendingProposal(null);
      }

      if (suggestionId) {
        try {
          const dismissed = await dispatch(dismissPlannerSuggestion(suggestionId)).unwrap();
          console.log('Dismiss plan response', dismissed);
          dispatch(fetchPlannerGhostSuggestions());
        } catch {
          /* local restore already done when proposal existed */
        }
      }

      postMessages(
        { id: `user_dismiss_${Date.now()}`, sender: 'user', text: 'Dismiss', timestamp: ts },
        {
          id: `ai_dismiss_change_${Date.now()}`,
          sender: 'ai',
          text: suggestionId
            ? 'The AI plan was dismissed. Your previous schedule is unchanged.'
            : 'No pending AI plan to dismiss.',
          timestamp: ts,
        }
      );
      return;
    }

    // API #8 Undo — POST /api/v1/planner/ai/undo
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

      setIsLoading(true);
      try {
        await dispatch(undoPlannerAi()).unwrap();
        await dispatch(
          fetchPlannerBoard({ viewType: viewMode, date: selectedDateKey })
        ).unwrap();
        dispatch(fetchPlannerSummary(selectedDateKey));
        setPlanHistory((prev) => prev.slice(0, -1));
        setPendingProposal(null);
        postMessages(
          { id: `user_undo_${Date.now()}`, sender: 'user', text: 'Undo changes', timestamp: ts },
          {
            id: `ai_undo_reply_${Date.now()}`,
            sender: 'ai',
            text: 'Restored the schedule from before that AI change.',
            timestamp: ts,
          }
        );
      } catch {
        postMessages({
          id: `ai_undo_err_${Date.now()}`,
          sender: 'ai',
          text: 'Could not undo that change.',
          timestamp: ts,
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSendMessage = async (event) => {
    event.preventDefault();
    const userText = chatInput.trim();
    if (!userText) return;
    setChatInput('');
    await runAiSuggest({
      actionKey: 'CHAT',
      userText,
      message: userText,
    });
  };

  const navigateByView = (direction) => {
    const nextDate = new Date(selectedDate);
    if (viewMode === 'Weekly') {
      nextDate.setDate(nextDate.getDate() + direction * 7);
    } else if (viewMode === 'Monthly') {
      nextDate.setMonth(nextDate.getMonth() + direction);
    } else {
      nextDate.setDate(nextDate.getDate() + direction);
    }
    setCurrentDate(nextDate);
    setSelectedDate(nextDate);
  };

  const goToToday = () => {
    const next = new Date();
    setCurrentDate(next);
    setSelectedDate(next);
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

  const hasVisiblePlanItems = Object.values(plans).some(
    (items) => Array.isArray(items) && items.length > 0
  );
  const displayedPlans = hasVisiblePlanItems ? plans : ghostPlans || {};

  return (
    <div className="relative flex min-h-full flex-col py-7.5 max-lg:min-h-0 max-lg:py-4 max-lg:sm:py-6">
      <div className="mx-auto flex min-h-0 w-full min-w-0 flex-1 flex-col gap-6 xl:flex-row">
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
            plans={displayedPlans}
            hasAcceptedPlan={hasAcceptedPlan}
            calendarDays={calendarDays}
            getFormattedDateString={getFormattedDateString}
            isLoading={isLoading}
          />
        </div>

        {isAssistantOpen && !isAssistantExpanded && (
          <AIAssistant {...assistantProps} isExpanded={false} />
        )}
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
