import { useEffect, useRef, useState } from 'react';
import { Sparkles, X, Maximize2, Minimize2, Send, ListTodo, Pencil, Repeat } from 'lucide-react';
import { toast } from 'react-toastify';
import {
  acceptGoalSuggestionApi,
  dismissGoalSuggestionApi,
  suggestGoalApi,
  undoGoalAiApi,
} from '../../../../../../features/goals/goalsAPI';

const QUICK_ACTIONS = [
  {
    key: 'ADD_TASKS',
    label: 'Add tasks',
    icon: ListTodo,
    message: 'Add practical next steps for this week',
  },
  {
    key: 'IMPROVE_DESCRIPTION',
    label: 'Improve description',
    icon: Pencil,
    message: 'Make it more specific and motivating',
  },
  {
    key: 'ADD_HABITS',
    label: 'Add habits',
    icon: Repeat,
    message: 'Suggest daily habits that support this goal',
  },
];

function formatSessionStamp() {
  return new Date().toLocaleString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function UserBubble({ children }) {
  return (
    <div className="flex justify-end pl-15">
      <div className="relative rounded-tl-[10px] rounded-bl-[10px] rounded-br-[10px] rounded-tr-none bg-[#8022fe] px-3 py-2">
        <p className="text-[14px] font-medium text-white">{children}</p>
        <svg className="absolute top-0 -right-[11px]" width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
          <path d="M11 0C4.92487 0 0 4.92487 0 11V0H11Z" fill="#8022fe" />
        </svg>
      </div>
    </div>
  );
}

function AiBubble({ children }) {
  return (
    <div className="flex justify-start pr-15">
      <div className="relative rounded-tr-[10px] rounded-bl-[10px] rounded-br-[10px] rounded-tl-none border border-[#f2f2f2] bg-[#fcfcfc] px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800">
        <div className="text-[14px] font-medium whitespace-pre-line text-[#181818] dark:text-gray-200">
          {children}
        </div>
        <svg className="absolute -top-px -left-[13px] text-[#f2f2f2] dark:text-zinc-700" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M0 0C6.62742 0 12 5.37258 12 12V0H0Z" fill="currentColor" />
        </svg>
        <svg className="absolute top-0 -left-1.5 text-[#fcfcfc] dark:text-zinc-800" width="8" height="9.5" viewBox="0 0 8 9.5" fill="none" aria-hidden="true">
          <path d="M0 0C2.5 0.5 6 4.5 6 9.5L8 0H0Z" fill="currentColor" />
        </svg>
      </div>
    </div>
  );
}

function ActionPill({ children, onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-fit rounded-md bg-[#f9f4ff] px-2 pt-0.5 pb-0.75 text-[14px] font-medium text-[#8022fe] disabled:opacity-50"
    >
      {children}
    </button>
  );
}

function formatSuggestionBody(data) {
  const lines = [data?.message || 'Here is what I suggest.'];
  const goal = data?.proposedGoal;
  if (goal?.title || goal?.description) {
    lines.push('');
    lines.push('Proposed goal updates:');
    if (goal.title) lines.push(`• Title: ${goal.title}`);
    if (goal.description) lines.push(`• Description: ${goal.description}`);
    if (goal.priorityLevel) lines.push(`• Priority: ${goal.priorityLevel}`);
    if (goal.targetDate) lines.push(`• Target: ${goal.targetDate}`);
  }
  const tasks = Array.isArray(data?.proposedTasks) ? data.proposedTasks : [];
  if (tasks.length) {
    lines.push('');
    lines.push(`Proposed tasks (${tasks.length}):`);
    tasks.forEach((t, i) => {
      lines.push(`${i + 1}. ${t.title || t.name || 'Untitled task'}`);
    });
  }
  const habits = Array.isArray(data?.proposedHabits) ? data.proposedHabits : [];
  if (habits.length) {
    lines.push('');
    lines.push(`Proposed habits (${habits.length}):`);
    habits.forEach((h, i) => {
      lines.push(`${i + 1}. ${h.name || h.title || 'Untitled habit'}`);
    });
  }
  return lines.join('\n');
}

function hasApplyableProposal(data) {
  if (!data) return false;
  if (data.proposedGoal?.title || data.proposedGoal?.description) return true;
  if (Array.isArray(data.proposedTasks) && data.proposedTasks.length) return true;
  if (Array.isArray(data.proposedHabits) && data.proposedHabits.length) return true;
  return false;
}

function assistantStorageKey(goalId) {
  return `fellini:goal-ai-assistant:${goalId}`;
}

function loadAssistantMessages(goalId) {
  if (!goalId || typeof sessionStorage === 'undefined') return [];
  try {
    const raw = sessionStorage.getItem(assistantStorageKey(goalId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveAssistantMessages(goalId, messages) {
  if (!goalId || typeof sessionStorage === 'undefined') return;
  try {
    sessionStorage.setItem(assistantStorageKey(goalId), JSON.stringify(messages));
  } catch {
    // ignore quota / private mode
  }
}

/**
 * Goal detail AI Assistant — POST /goals/:id/ai/suggest
 * Accept: POST /goals/ai/suggestions/:suggestionId/accept
 * Dismiss: POST /goals/ai/suggestions/:suggestionId/dismiss
 * Undo: POST /goals/:goalId/ai/undo
 * Chat thread kept in sessionStorage for refresh within the tab.
 */
export default function GoalAiAssistant({
  goalId,
  goal,
  onClose,
  onToggleExpand,
  isExpanded = false,
  onRefreshGoal,
}) {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState(() => loadAssistantMessages(goalId));
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [sessionStamp] = useState(formatSessionStamp);
  const textareaRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    setMessages(loadAssistantMessages(goalId));
  }, [goalId]);

  useEffect(() => {
    saveAssistantMessages(goalId, messages);
  }, [goalId, messages]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [prompt]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const runSuggest = async (action, message) => {
    if (!goalId || !message?.trim() || loading) return;

    const userText = message.trim();
    setMessages((prev) => [...prev, { id: `u-${Date.now()}`, role: 'user', text: userText }]);
    setLoading(true);

    try {
      const data = await suggestGoalApi(goalId, { action, message: userText });
      if (!data?.success && data?.success !== undefined) {
        throw new Error(data?.message || 'Suggestion failed');
      }
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          text: formatSuggestionBody(data),
          suggestion: data,
          suggestionId: data?.suggestionId || data?.id || null,
          action: data?.action || action,
        },
      ]);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to get AI suggestion';
      toast.error(msg);
      setMessages((prev) => [
        ...prev,
        { id: `e-${Date.now()}`, role: 'assistant', text: msg, error: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (action) => {
    runSuggest(action.key, action.message);
  };

  const handleSend = () => {
    if (!prompt.trim()) return;
    const text = prompt.trim();
    setPrompt('');
    runSuggest('CHAT', text);
  };

  const handleApply = async (msg) => {
    const suggestionId = msg.suggestionId || msg.suggestion?.suggestionId || msg.suggestion?.id;
    if (!suggestionId || busyId) return;
    setBusyId(msg.id);
    setPrompt('');
    setMessages((prev) => [
      ...prev.map((m) => (m.id === msg.id ? { ...m, suggestion: null, dismissed: true } : m)),
      { id: `u-apply-${Date.now()}`, role: 'user', text: 'Yes, apply' },
    ]);

    try {
      const data = await acceptGoalSuggestionApi(suggestionId);
      if (!data?.success && data?.success !== undefined) {
        throw new Error(data?.message || 'Failed to apply suggestion');
      }
      setMessages((prev) => [
        ...prev,
        {
          id: `done-${Date.now()}`,
          role: 'assistant',
          text: data?.message || 'Done. The goal has been updated.',
          canUndo: true,
        },
      ]);
      toast.success(data?.message || 'Changes applied');
      await onRefreshGoal?.();
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Failed to apply changes';
      toast.error(message);
      setMessages((prev) => [
        ...prev,
        { id: `err-${Date.now()}`, role: 'assistant', text: message, error: true },
      ]);
    } finally {
      setBusyId(null);
    }
  };

  const handleDismiss = async (msg) => {
    const suggestionId = msg.suggestionId || msg.suggestion?.suggestionId || msg.suggestion?.id;
    if (busyId) return;
    setBusyId(msg.id);
    setMessages((prev) => [
      ...prev.map((m) => (m.id === msg.id ? { ...m, suggestion: null, dismissed: true } : m)),
      { id: `u-cancel-${Date.now()}`, role: 'user', text: 'No, cancel' },
    ]);

    try {
      if (suggestionId) {
        const data = await dismissGoalSuggestionApi(suggestionId);
        if (!data?.success && data?.success !== undefined) {
          throw new Error(data?.message || 'Failed to dismiss suggestion');
        }
      }
      setMessages((prev) => [
        ...prev,
        {
          id: `c-${Date.now()}`,
          role: 'assistant',
          text: 'Okay, I discarded that suggestion.',
        },
      ]);
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Failed to cancel suggestion';
      toast.error(message);
      setMessages((prev) => [
        ...prev,
        { id: `err-${Date.now()}`, role: 'assistant', text: message, error: true },
      ]);
    } finally {
      setBusyId(null);
    }
  };

  const handleUndo = async (msg) => {
    if (!goalId || busyId) return;
    setBusyId(msg.id);
    try {
      const data = await undoGoalAiApi(goalId);
      if (!data?.success && data?.success !== undefined) {
        throw new Error(data?.message || 'Failed to undo');
      }
      setMessages((prev) =>
        prev
          .map((m) => (m.id === msg.id ? { ...m, canUndo: false } : m))
          .concat({
            id: `undo-${Date.now()}`,
            role: 'assistant',
            text: data?.message || 'Changes have been undone.',
          }),
      );
      toast.success(data?.message || 'Changes undone');
      await onRefreshGoal?.();
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Failed to undo changes';
      toast.error(message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-[#f2f2f2] bg-white dark:border-zinc-700 dark:bg-zinc-900">
      <div className="flex shrink-0 items-center gap-1.5 border-b border-[#f2f2f2] px-3 py-2.5 dark:border-zinc-700">
        <Sparkles size={14} className="shrink-0 text-[#8022fe]" />
        <p className="flex-1 text-[14px] font-medium text-[#5d5d5d] dark:text-gray-300">AI Assistant</p>
        <div className="flex items-center gap-3 text-[#a3a3a3]">
          <button
            type="button"
            onClick={onToggleExpand}
            aria-label={isExpanded ? 'Collapse AI Assistant' : 'Expand AI Assistant'}
            className="hover:text-[#5d5d5d] dark:hover:text-gray-300"
          >
            {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close AI Assistant"
            className="hover:text-[#5d5d5d] dark:hover:text-gray-300"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      <div className="scrollbar-white flex min-h-0 flex-1 flex-col overflow-y-auto py-3 pl-3 pr-4.5">
        <p className="mb-2.5 text-center text-[12px] font-medium text-[#c2c2c2]">{sessionStamp}</p>
        <div className="flex flex-col gap-5">
          {messages.length === 0 && (
            <AiBubble>
              {`Hi — I can improve this goal, suggest tasks, or habits.\n\nUse a quick action below or describe what you want.`}
            </AiBubble>
          )}
          {messages.map((msg) => (
            <div key={msg.id} className="flex flex-col gap-2.5">
              {msg.role === 'user' ? (
                <UserBubble>{msg.text}</UserBubble>
              ) : (
                <>
                  <AiBubble>{msg.text}</AiBubble>
                  {hasApplyableProposal(msg.suggestion) && !msg.dismissed && (
                    <div className="flex items-center gap-2">
                      <ActionPill
                        disabled={Boolean(busyId) || loading}
                        onClick={() => handleApply(msg)}
                      >
                        {busyId === msg.id ? 'Applying…' : 'Yes, apply'}
                      </ActionPill>
                      <ActionPill
                        disabled={Boolean(busyId) || loading}
                        onClick={() => handleDismiss(msg)}
                      >
                        No, cancel
                      </ActionPill>
                    </div>
                  )}
                  {msg.canUndo && (
                    <button
                      type="button"
                      disabled={Boolean(busyId) || loading}
                      onClick={() => handleUndo(msg)}
                      className="w-fit text-[14px] font-medium text-[#8022fe] disabled:opacity-50"
                    >
                      {busyId === msg.id ? 'Undoing…' : 'Undo changes'}
                    </button>
                  )}
                </>
              )}
            </div>
          ))}
          {loading && <AiBubble>Thinking…</AiBubble>}
          <div ref={bottomRef} />
        </div>
      </div>

      <div className="flex shrink-0 flex-col gap-3 p-3">
        <div className="flex flex-wrap gap-2">
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action.key}
              type="button"
              disabled={!goalId || loading || Boolean(busyId)}
              onClick={() => handleQuickAction(action)}
              className="flex items-center gap-1.5 rounded-lg border border-[#f2f2f2] px-2.5 py-1.5 text-[12px] font-medium text-[#5d5d5d] disabled:opacity-50 dark:border-zinc-700 dark:text-gray-300"
            >
              <action.icon size={14} className="shrink-0 text-[#8022fe]" />
              {action.label}
            </button>
          ))}
        </div>
        <div className="flex w-full items-center gap-2 rounded-xl border border-[#f2f2f2] px-3 py-2 dark:border-zinc-700">
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Describe what you want to change..."
            rows={1}
            disabled={!goalId || loading || Boolean(busyId)}
            className="max-h-30 flex-1 resize-none overflow-hidden bg-transparent text-[12px] text-[#5d5d5d] placeholder:text-[#c2c2c2] focus:outline-none disabled:opacity-50 dark:text-gray-300"
          />
          <button
            type="button"
            aria-label="Send"
            disabled={!goalId || !prompt.trim() || loading || Boolean(busyId)}
            onClick={handleSend}
            className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#8022fe] text-white disabled:opacity-50"
          >
            <Send size={12} />
          </button>
        </div>
        <p className="text-center text-[10px] text-[#c2c2c2]">
          AI can make mistakes. Verify important info.
        </p>
      </div>
    </div>
  );
}
