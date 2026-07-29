import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Sparkles, X, Maximize2, Minimize2, Send, ListTree, Wand2 } from 'lucide-react';
import { toast } from 'react-toastify';
import {
  acceptTaskSuggestionApi,
  dismissTaskSuggestionApi,
  fetchTaskAiSuggestionsApi,
  suggestTaskAiApi,
  undoTaskAiApi,
} from '../../../../../../features/tasks/tasksAPI';
import {
  categoryFromApi,
  formatTaskSuggestionBody,
  mapSubtaskFromApi,
  mapTaskAiSuggestionsToMessages,
  mapTaskFromApi,
} from '../../../../../../features/tasks/tasksMappers';

const QUICK_ACTIONS = [
  {
    key: 'BREAKDOWN',
    label: 'Break into subtasks',
    icon: ListTree,
    message: 'Break this task into subtasks',
  },
  {
    key: 'IMPROVE_DESCRIPTION',
    label: 'Improve description',
    icon: Wand2,
    // Optional per Postman; included so the chat shows a user bubble
    message: 'Make it more specific',
  },
];

/** Survive drawer/page remounts so Apply does not blank the chat. */
const taskAiChatCache = new Map();

function readChatCache(taskId) {
  if (!taskId) return [];
  const cached = taskAiChatCache.get(String(taskId));
  return Array.isArray(cached) ? cached : [];
}

function writeChatCache(taskId, messages) {
  if (!taskId) return;
  taskAiChatCache.set(String(taskId), messages);
}

/** MVP allowlist — never apply due/status/priority from proposedTask. */
function allowlistedFromProposedTask(proposed) {
  if (!proposed || typeof proposed !== 'object') return null;
  const patch = {};
  if (proposed.title != null && String(proposed.title).trim()) {
    patch.title = String(proposed.title).trim();
  }
  if (proposed.description != null) {
    patch.description = String(proposed.description);
  }
  if (proposed.category != null && String(proposed.category).trim()) {
    patch.category = categoryFromApi(proposed.category);
  }
  return Object.keys(patch).length ? patch : null;
}

function unwrapSuggestResponse(data) {
  if (!data || typeof data !== 'object') return data;
  // Flat Postman shape: { success, suggestionId, proposedTask, ... }
  if (data.suggestionId || data.proposedTask || data.proposedSubtasks || data.message) {
    return data;
  }
  if (data.data && typeof data.data === 'object') return data.data;
  return data;
}

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

function doneMessageForAction(action) {
  const key = String(action || '').toUpperCase();
  if (key === 'BREAKDOWN') return 'Done. The subtasks were successfully added.';
  if (key === 'IMPROVE_DESCRIPTION') return 'Done. The title and description were updated.';
  return 'Done. The task has been updated.';
}

/**
 * Task detail AI Assistant
 * Suggest: POST /tasks/:id/ai/suggest
 * History: GET /tasks/:id/ai/suggestions (full list — keep chat after apply/refresh)
 * Accept / Dismiss / Undo: suggestion action endpoints
 *
 * Figma chat flow after Yes, apply:
 *   pills → purple "Yes, apply" bubble → Done → Undo changes
 */
export default function TaskAiAssistant({
  taskId,
  hasSubtasks = false,
  onClose,
  onToggleExpand,
  isExpanded = false,
  onRefreshTask,
  onTaskUpdated,
  onApplyingChange,
  autoAction = null,
  onAutoActionConsumed,
}) {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState(() => readChatCache(taskId));
  const [historyLoading, setHistoryLoading] = useState(() => {
    const cached = readChatCache(taskId);
    return Boolean(taskId) && cached.length === 0;
  });
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [sessionStamp] = useState(formatSessionStamp);
  const textareaRef = useRef(null);
  const scrollRef = useRef(null);
  const autoRanRef = useRef(false);
  const hasSubtasksRef = useRef(hasSubtasks);
  const messagesRef = useRef(messages);
  hasSubtasksRef.current = hasSubtasks;
  messagesRef.current = messages;

  useEffect(() => {
    writeChatCache(taskId, messages);
  }, [taskId, messages]);

  const syncHistory = useCallback(
    async ({ requireSuggestionId } = {}) => {
      if (!taskId) return;
      try {
        const data = await fetchTaskAiSuggestionsApi(taskId);
        const next = mapTaskAiSuggestionsToMessages(data);
        // Never replace a live chat with an empty server list (causes Image-2 wipe)
        if (next.length === 0) return;
        if (requireSuggestionId) {
          const found = next.some(
            (m) => String(m.suggestionId) === String(requireSuggestionId)
          );
          if (!found) return;
        }
        setMessages(next);
        writeChatCache(taskId, next);
      } catch {
        // keep on-screen messages
      }
    },
    [taskId]
  );

  const reloadHistory = useCallback(async () => {
    if (!taskId) {
      setMessages([]);
      setHistoryLoading(false);
      return;
    }
    const cached = readChatCache(taskId);
    // Remount mid-thread: show cache immediately, still try to sync in background
    if (cached.length > 0) {
      setMessages(cached);
      setHistoryLoading(false);
    } else {
      setHistoryLoading(true);
    }
    try {
      const data = await fetchTaskAiSuggestionsApi(taskId);
      const next = mapTaskAiSuggestionsToMessages(data);
      // Initial load may be empty; after a live thread, don't wipe on a bad/empty parse
      if (next.length === 0 && (messagesRef.current.length > 0 || cached.length > 0)) {
        return;
      }
      setMessages(next);
      writeChatCache(taskId, next);
    } catch {
      if (messagesRef.current.length === 0 && cached.length === 0) setMessages([]);
    } finally {
      setHistoryLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    reloadHistory();
  }, [reloadHistory]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [prompt]);

  useLayoutEffect(() => {
    if (historyLoading) return;
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, loading, historyLoading]);

  const appendAssistantSuggestion = useCallback((data, action) => {
    const suggestionId = data?.suggestionId || data?.id || null;
    setMessages((prev) => [
      ...prev,
      {
        id: `a-${suggestionId || Date.now()}`,
        role: 'assistant',
        text: formatTaskSuggestionBody(data),
        suggestion: data,
        suggestionId,
        action: data?.action || action,
      },
    ]);
    return suggestionId;
  }, []);

  const applyingTargetForAction = useCallback((action, suggestion) => {
    const key = String(action || suggestion?.action || '').toUpperCase();
    const hasSubs =
      Array.isArray(suggestion?.proposedSubtasks) && suggestion.proposedSubtasks.length > 0;
    if (key === 'BREAKDOWN' || hasSubs) return 'subtasks';
    if (key === 'IMPROVE_DESCRIPTION') return 'description';
    if (suggestion?.proposedTask) return 'description';
    return null;
  }, []);

  const runSuggest = useCallback(
    async (action, message, options = {}) => {
      if (!taskId || loading) return;

      const userText = (message || '').trim();
      if (userText) {
        setMessages((prev) => [...prev, { id: `u-${Date.now()}`, role: 'user', text: userText }]);
      }
      setLoading(true);
      // Suggest phase: only pulse the section this action will change (not both).
      onApplyingChange?.(applyingTargetForAction(action));

      try {
        const body = { action };
        if (userText) body.message = userText;
        const shouldRegenerate =
          options.regenerate === true ||
          (action === 'BREAKDOWN' && hasSubtasksRef.current);
        if (shouldRegenerate) body.regenerate = true;

        const raw = await suggestTaskAiApi(taskId, body);
        const data = unwrapSuggestResponse(raw);
        if (!data?.success && data?.success !== undefined) {
          const errMsg = data?.message || 'Suggestion failed';
          if (
            action === 'BREAKDOWN' &&
            !body.regenerate &&
            /regenerate\s*=\s*true/i.test(errMsg)
          ) {
            const retry = unwrapSuggestResponse(
              await suggestTaskAiApi(taskId, { ...body, regenerate: true })
            );
            if (!retry?.success && retry?.success !== undefined) {
              throw new Error(retry?.message || errMsg);
            }
            const suggestionId = appendAssistantSuggestion(retry, action);
            if (suggestionId) await syncHistory({ requireSuggestionId: suggestionId });
            return;
          }
          throw new Error(errMsg);
        }
        const suggestionId = appendAssistantSuggestion(data, action);
        if (suggestionId) await syncHistory({ requireSuggestionId: suggestionId });
      } catch (err) {
        const msg = err?.response?.data?.message || err?.message || 'Failed to get AI suggestion';
        if (action === 'BREAKDOWN' && /regenerate\s*=\s*true/i.test(msg)) {
          try {
            const body = { action, regenerate: true };
            if (userText) body.message = userText;
            const retry = unwrapSuggestResponse(await suggestTaskAiApi(taskId, body));
            if (!retry?.success && retry?.success !== undefined) {
              throw new Error(retry?.message || msg);
            }
            const suggestionId = appendAssistantSuggestion(retry, action);
            if (suggestionId) await syncHistory({ requireSuggestionId: suggestionId });
            return;
          } catch (retryErr) {
            const retryMsg =
              retryErr?.response?.data?.message || retryErr?.message || msg;
            toast.error(retryMsg);
            setMessages((prev) => [
              ...prev,
              { id: `e-${Date.now()}`, role: 'assistant', text: retryMsg, error: true },
            ]);
            return;
          }
        }
        toast.error(msg);
        setMessages((prev) => [
          ...prev,
          { id: `e-${Date.now()}`, role: 'assistant', text: msg, error: true },
        ]);
      } finally {
        setLoading(false);
        onApplyingChange?.(null);
      }
    },
    [
      taskId,
      loading,
      onApplyingChange,
      applyingTargetForAction,
      appendAssistantSuggestion,
      syncHistory,
    ]
  );

  useEffect(() => {
    autoRanRef.current = false;
  }, [autoAction, taskId]);

  useEffect(() => {
    if (!autoAction || !taskId || autoRanRef.current || historyLoading || loading) return;
    autoRanRef.current = true;
    const action = autoAction === 'improve' ? 'IMPROVE_DESCRIPTION' : 'BREAKDOWN';
    const message =
      action === 'IMPROVE_DESCRIPTION'
        ? 'Make it more specific'
        : 'Break this task into subtasks';
    onAutoActionConsumed?.();
    runSuggest(action, message);
  }, [autoAction, taskId, historyLoading, loading, onAutoActionConsumed, runSuggest]);

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

    const action = msg.action || msg.suggestion?.action;
    const doneText = doneMessageForAction(action);
    onApplyingChange?.(applyingTargetForAction(action, msg.suggestion));

    // Figma: show purple "Yes, apply" bubble immediately (not only after history reload)
    setMessages((prev) => {
      const withoutPills = prev.map((m) =>
        m.id === msg.id || String(m.suggestionId) === String(suggestionId)
          ? { ...m, suggestion: null }
          : m
      );
      return [
        ...withoutPills,
        { id: `u-apply-${suggestionId}-${Date.now()}`, role: 'user', text: 'Yes, apply' },
        {
          id: `done-${suggestionId}`,
          role: 'assistant',
          text: doneText,
          canUndo: true,
          suggestionId,
        },
      ];
    });

    const optimistic = allowlistedFromProposedTask(msg.suggestion?.proposedTask);
    if (optimistic) onTaskUpdated?.(optimistic);

    // BREAKDOWN: paint proposed subtasks on the left immediately
    const proposedSubs = msg.suggestion?.proposedSubtasks;
    if (Array.isArray(proposedSubs) && proposedSubs.length > 0) {
      onTaskUpdated?.({
        subtasks: proposedSubs
          .map((s, i) =>
            mapSubtaskFromApi({
              id: s.id || `proposed-${i}`,
              title: s.title || s.name || 'Subtask',
              description: s.description || '',
              status: s.status || 'TODO',
              estimatedMinutes: s.estimatedMinutes ?? null,
            })
          )
          .filter(Boolean),
      });
    }

    try {
      const data = await acceptTaskSuggestionApi(suggestionId);
      if (!data?.success && data?.success !== undefined) {
        throw new Error(data?.message || 'Failed to apply suggestion');
      }
      toast.success(data?.message || 'Changes applied');
      const acceptedTask = data?.task || data?.data?.task || data?.data;
      if (acceptedTask?.id || acceptedTask?.title) {
        const mapped = mapTaskFromApi(acceptedTask);
        // Accept often returns task without nested subtasks — don't wipe optimistic list
        if (!Array.isArray(acceptedTask.subtasks) || acceptedTask.subtasks.length === 0) {
          const { subtasks: _ignored, ...rest } = mapped;
          onTaskUpdated?.(rest);
        } else {
          onTaskUpdated?.(mapped);
        }
      }
      // Refresh task data, but keep the optimistic Yes, apply + Done thread.
      // Replacing from GET after accept often remounts/races and blanks the chat.
      await onRefreshTask?.();
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Failed to apply changes';
      toast.error(message);
      // Restore Yes/No pills; remove optimistic Yes, apply + Done bubbles
      setMessages((prev) =>
        prev
          .filter(
            (m) =>
              m.id !== `done-${suggestionId}` &&
              !(m.role === 'user' && m.id.startsWith(`u-apply-${suggestionId}`))
          )
          .map((m) =>
            String(m.suggestionId) === String(suggestionId)
              ? { ...m, suggestion: msg.suggestion }
              : m
          )
      );
      await onRefreshTask?.();
    } finally {
      setBusyId(null);
      onApplyingChange?.(null);
    }
  };

  const handleDismiss = async (msg) => {
    const suggestionId = msg.suggestionId || msg.suggestion?.suggestionId || msg.suggestion?.id;
    if (!suggestionId || busyId) return;
    setBusyId(msg.id);

    setMessages((prev) => {
      const withoutPills = prev.map((m) =>
        m.id === msg.id || String(m.suggestionId) === String(suggestionId)
          ? { ...m, suggestion: null }
          : m
      );
      return [
        ...withoutPills,
        { id: `u-cancel-${suggestionId}-${Date.now()}`, role: 'user', text: 'No, cancel' },
        {
          id: `c-${suggestionId}`,
          role: 'assistant',
          text: 'Okay, I discarded that suggestion.',
          suggestionId,
        },
      ];
    });

    try {
      const data = await dismissTaskSuggestionApi(suggestionId);
      if (!data?.success && data?.success !== undefined) {
        throw new Error(data?.message || 'Failed to dismiss suggestion');
      }
      await syncHistory({ requireSuggestionId: suggestionId });
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Failed to cancel suggestion';
      toast.error(message);
      setMessages((prev) =>
        prev
          .filter(
            (m) =>
              m.id !== `c-${suggestionId}` &&
              !(m.role === 'user' && m.text === 'No, cancel' && m.id.startsWith(`u-cancel-${suggestionId}`))
          )
          .map((m) =>
            String(m.suggestionId) === String(suggestionId)
              ? { ...m, suggestion: msg.suggestion || m.suggestion }
              : m
          )
      );
    } finally {
      setBusyId(null);
    }
  };

  const handleUndo = async (msg) => {
    if (!taskId || busyId) return;
    setBusyId(msg.id);
    try {
      const data = await undoTaskAiApi(taskId);
      if (!data?.success && data?.success !== undefined) {
        throw new Error(data?.message || 'Failed to undo');
      }
      toast.success(data?.message || 'Changes undone');
      if (data?.task) {
        onTaskUpdated?.(mapTaskFromApi(data.task));
      }
      await onRefreshTask?.();
      await reloadHistory();
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Failed to undo changes';
      toast.error(message);
    } finally {
      setBusyId(null);
    }
  };

  const showEmptyWelcome = !historyLoading && messages.length === 0 && !loading;

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

      <div ref={scrollRef} className="scrollbar-hidden flex flex-1 flex-col gap-5 overflow-y-auto py-3 pl-3 pr-4.5">
        {historyLoading ? (
          <p className="text-center text-[12px] text-[#c2c2c2]">Loading suggestions…</p>
        ) : showEmptyWelcome ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-1.5 text-center">
            <Sparkles size={16} className="text-[#e9d9ff]" />
            <p className="text-[12px] text-[#c2c2c2]">Ask the AI Assistant to help with this task.</p>
          </div>
        ) : (
          <>
            <p className="text-center text-[12px] font-medium text-[#c2c2c2]">{sessionStamp}</p>
            {messages.map((m) => (
              <div key={m.id} className="flex w-full flex-col gap-2.5">
                {m.role === 'user' ? (
                  <UserBubble>{m.text}</UserBubble>
                ) : (
                  <>
                    <AiBubble>{m.text}</AiBubble>
                    {m.suggestion && !m.dismissed && (
                      <div className="flex items-center gap-2">
                        <ActionPill disabled={Boolean(busyId)} onClick={() => handleApply(m)}>
                          {busyId === m.id ? 'Applying…' : 'Yes, apply'}
                        </ActionPill>
                        <ActionPill disabled={Boolean(busyId)} onClick={() => handleDismiss(m)}>
                          No, cancel
                        </ActionPill>
                      </div>
                    )}
                    {m.canUndo && !m.undone && (
                      <ActionPill disabled={Boolean(busyId)} onClick={() => handleUndo(m)}>
                        {busyId === m.id ? 'Undoing…' : 'Undo changes'}
                      </ActionPill>
                    )}
                  </>
                )}
              </div>
            ))}
            {loading && (
              <p className="text-[12px] text-[#c2c2c2]">Thinking…</p>
            )}
          </>
        )}
      </div>

      <div className="flex flex-col gap-3 p-3">
        <div className="flex flex-wrap gap-2">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.key}
                type="button"
                onClick={() => handleQuickAction(action)}
                disabled={loading || Boolean(busyId)}
                className="flex items-center gap-1.5 rounded-lg border border-[#f2f2f2] px-2.5 py-1.5 text-[12px] font-medium text-[#5d5d5d] disabled:opacity-50 dark:border-zinc-700"
              >
                <Icon size={14} className="shrink-0 text-[#8022fe]" />
                {action.label}
              </button>
            );
          })}
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
            className="max-h-30 flex-1 resize-none overflow-hidden bg-transparent text-[12px] text-[#5d5d5d] placeholder:text-[#c2c2c2] focus:outline-none dark:text-gray-300"
          />
          <button
            type="button"
            aria-label="Send"
            disabled={!prompt.trim() || loading || Boolean(busyId)}
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
