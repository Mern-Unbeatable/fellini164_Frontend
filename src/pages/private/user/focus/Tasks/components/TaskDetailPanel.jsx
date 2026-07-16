import { useEffect, useRef, useState } from 'react';
import {
  Sparkles,
  ChevronDown,
  Clock,
  Flag,
  TrendingUp,
  Target,
  Plus,
  X,
  ExternalLink,
  Maximize2,
  Send,
  MoreHorizontal,
  Pencil,
  Trash2,
  ListTree,
  Wand2,
  Minimize2,
} from 'lucide-react';
import SkeletonBar from '../../../../../../components/ui/SkeletonBar';
import { generateSubtasksFromTitle } from '../utils/subtasks';

const PRIORITY_STYLES = {
  URGENT: 'bg-[rgba(220,38,38,0.05)] text-[#dc2626]',
  HIGH: 'bg-[rgba(249,115,22,0.05)] text-[#f97316]',
  MEDIUM: 'bg-[rgba(202,138,4,0.05)] text-[#ca8a04]',
  LOW: 'bg-[rgba(107,114,128,0.05)] text-[#6b7280]',
};

const PRIORITY_LABELS = {
  URGENT: 'Urgent',
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low',
};

/** User goals for Linked Goal picker (Rule 9 / Rule 12). First = AI recommended. */
const LINKED_GOALS = ['Improve Rate', 'Save $10,000', 'Run 500km'];

function isGoalTag(tag) {
  return Boolean(
    tag?.linkedGoal || tag?.icon === Target || tag?.icon === TrendingUp
  );
}

function getLinkedGoalLabel(task) {
  if (task.linkedGoal) return task.linkedGoal;
  return task.tags?.find(isGoalTag)?.label ?? null;
}

function buildImprovedDescription(description) {
  return `${description ?? ''} This task directly supports your linked goal — tackle it with focused effort today.`.trim();
}

function TaskDetailMenu({ onClose, onEdit, onBreakIntoSubtasks, onImproveDescription, onDelete }) {
  return (
    <div
      className="absolute top-full right-0 z-30 mt-1 flex w-max flex-col overflow-hidden rounded-lg border border-[#f2f2f2] bg-white shadow-[0px_2px_4px_0px_rgba(0,0,0,0.03)] dark:border-zinc-700 dark:bg-zinc-800"
      onMouseDown={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        onClick={() => {
          onClose();
          onEdit?.();
        }}
        className="flex w-full items-center gap-1.5 border-b border-[#f2f2f2] px-[10px] py-1.5 text-left text-sm font-medium whitespace-nowrap text-[#5d5d5d] hover:bg-[#fcfcfc] dark:border-zinc-700 dark:text-gray-300 dark:hover:bg-zinc-700"
      >
        <Pencil size={10} className="shrink-0" />
        Edit
      </button>
      <button
        type="button"
        onClick={() => {
          onClose();
          onBreakIntoSubtasks?.();
        }}
        className="flex w-full items-center gap-1.5 px-[10px] py-1.5 text-left text-sm font-medium whitespace-nowrap text-[#8022fe] hover:bg-[#fcfcfc] dark:hover:bg-zinc-700"
      >
        <Sparkles size={10} className="shrink-0" />
        Break into subtasks
      </button>
      <button
        type="button"
        onClick={() => {
          onClose();
          onImproveDescription?.();
        }}
        className="flex w-full items-center gap-1.5 border-b border-[#f2f2f2] px-[10px] py-1.5 text-left text-sm font-medium whitespace-nowrap text-[#8022fe] hover:bg-[#fcfcfc] dark:border-zinc-700 dark:hover:bg-zinc-700"
      >
        <Sparkles size={10} className="shrink-0" />
        Improve description
      </button>
      <button
        type="button"
        onClick={() => {
          onClose();
          onDelete?.();
        }}
        className="flex w-full items-center gap-1.5 px-[10px] py-1.5 text-left text-sm font-medium whitespace-nowrap text-[#5d5d5d] hover:bg-[#fcfcfc] dark:text-gray-300 dark:hover:bg-zinc-700"
      >
        <Trash2 size={10} className="shrink-0" />
        Delete
      </button>
    </div>
  );
}

function SubtasksSection({ task, onUpdateSubtasks, autoTriggerAi, onAutoTriggerConsumed }) {
  const subtasks = task.subtasks ?? [];
  const [showRegenerateConfirm, setShowRegenerateConfirm] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const runGeneration = async () => {
    setShowRegenerateConfirm(false);
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 650));
    const generated = generateSubtasksFromTitle(task.title);
    onUpdateSubtasks(generated);
    setIsGenerating(false);
  };

  const handleAiClick = () => {
    if (isGenerating) return;
    if (subtasks.length === 0) {
      runGeneration();
    } else {
      setShowRegenerateConfirm(true);
    }
  };

  useEffect(() => {
    if (!autoTriggerAi) return;
    onAutoTriggerConsumed?.();
    if (subtasks.length === 0) {
      runGeneration();
    } else {
      setShowRegenerateConfirm(true);
    }
    // Only run when autoTriggerAi flips on
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoTriggerAi]);

  const completedCount = subtasks.filter((s) => s.completed).length;

  const toggleSubtask = (id) => {
    onUpdateSubtasks(
      subtasks.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s))
    );
  };

  return (
    <div className="flex w-full flex-col gap-1.5">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-1.5">
          <p className="text-[12px] font-medium text-[#c2c2c2]">Subtasks</p>
          <span className="flex w-5 items-center justify-center rounded-[5px] bg-[#fcfcfc] px-1 py-px text-[12px] font-medium text-[#c2c2c2]">
            {subtasks.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Add subtask manually"
            className="text-[#a3a3a3]"
          >
            <Plus size={16} />
          </button>
          <button
            type="button"
            onClick={handleAiClick}
            disabled={isGenerating}
            aria-label="Generate subtasks with AI"
            className="rounded-md p-0.5 text-[#8022fe] disabled:opacity-50"
          >
            <Sparkles size={16} />
          </button>
        </div>
      </div>

      {showRegenerateConfirm && (
        <div className="flex w-full items-center justify-between gap-3 rounded-lg border border-[#f2f2f2] bg-[#f9f4ff] px-3 py-2 dark:border-zinc-700">
          <p className="text-[12px] font-medium text-[#5d5d5d] dark:text-gray-300">
            Regenerate all subtasks?
          </p>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={runGeneration}
              className="text-[12px] font-medium text-[#8022fe]"
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => setShowRegenerateConfirm(false)}
              className="text-[12px] font-medium text-[#5d5d5d] dark:text-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {isGenerating ? (
        <div className="overflow-hidden rounded-xl border border-[#f2f2f2] bg-[#fcfcfc] dark:border-zinc-700 dark:bg-zinc-800">
          <div className="flex flex-col gap-2.5 px-3 py-2">
            <SkeletonBar className="h-4 w-full" />
            <SkeletonBar className="h-4 w-[85%]" />
            <SkeletonBar className="h-4 w-[70%]" />
            <SkeletonBar className="h-4 w-[90%]" />
          </div>
        </div>
      ) : subtasks.length === 0 ? (
        <div className="flex h-10 items-center justify-center rounded-xl border border-dashed border-[#f2f2f2]">
          <p className="text-[12px] font-medium text-[#c2c2c2]">No Subtasks yet</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[#f2f2f2] bg-[#fcfcfc] dark:border-zinc-700 dark:bg-zinc-800">
          <div className="flex flex-col gap-2.5 px-3 py-2">
            {subtasks.map((sub) => (
              <label key={sub.id} className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={sub.completed}
                  onChange={() => toggleSubtask(sub.id)}
                  className="size-3.5 rounded border-[#c2c2c2] accent-[#8022fe]"
                />
                <span className="text-[14px] font-medium text-[#5d5d5d] dark:text-gray-300">
                  {sub.label}{' '}
                  <span className="text-[12px] text-[#c2c2c2]">({sub.minutes} Min)</span>
                </span>
              </label>
            ))}
          </div>
          <div className="border-t border-[#f2f2f2] px-3 py-2 dark:border-zinc-700">
            <p className="text-[12px] font-medium text-[#5d5d5d]">
              <span className="text-[#c2c2c2]">Progress:</span> {completedCount}/{subtasks.length}{' '}
              Steps
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function formatChatTimestamp(date) {
  const datePart = date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
  const timePart = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  return `${datePart} • ${timePart}`;
}

function ChatMessage({ message, onApply, onCancel, onUndo }) {
  if (message.role === 'user') {
    return (
      <div className="flex justify-end">
        <p className="max-w-[85%] rounded-2xl bg-[#8022fe] px-3 py-2 text-[12px] font-medium text-white">
          {message.text}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start gap-1.5">
      <p className="text-[12px] text-[#5d5d5d] dark:text-gray-300">{message.text}</p>
      {message.plan && (
        <ul className="list-disc pl-4 text-[12px] text-[#5d5d5d] dark:text-gray-300">
          {message.plan.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      )}
      {message.confirm && !message.resolved && (
        <>
          <p className="text-[12px] text-[#5d5d5d] dark:text-gray-300">
            Do you want me to apply these changes?
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onApply(message)}
              className="text-[12px] font-medium text-[#8022fe]"
            >
              Yes, apply
            </button>
            <button
              type="button"
              onClick={() => onCancel(message)}
              className="text-[12px] font-medium text-[#5d5d5d] dark:text-gray-300"
            >
              No, cancel
            </button>
          </div>
        </>
      )}
      {message.undo && !message.undone && (
        <button
          type="button"
          onClick={() => onUndo(message)}
          className="text-[12px] font-medium text-[#8022fe]"
        >
          Undo changes
        </button>
      )}
    </div>
  );
}

let messageIdCounter = 0;
function nextMessageId() {
  messageIdCounter += 1;
  return `msg-${messageIdCounter}`;
}

function AiAssistantChat({
  task,
  onUpdateSubtasks,
  onUpdateTaskFields,
  onApplyingChange,
  onClose,
  onToggleExpand,
  isExpanded = false,
}) {
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const textareaRef = useRef(null);
  const threadRef = useRef(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [prompt]);

  useEffect(() => {
    const el = threadRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages, isThinking]);

  const pushMessage = (msg) => {
    const message = { id: nextMessageId(), ...msg };
    setMessages((prev) => [...prev, message]);
    return message;
  };

  const runPrompt = (text, intent) => {
    if (!text.trim() || isThinking) return;
    pushMessage({ role: 'user', text });
    setPrompt('');
    setIsThinking(true);
    window.setTimeout(() => {
      setIsThinking(false);
      const plan =
        intent === 'subtasks'
          ? ['add subtasks']
          : intent === 'description'
            ? ['improve clarity']
            : ['improve clarity', 'add subtasks', 'improve tracking'];
      pushMessage({
        role: 'assistant',
        text: 'Sure, I can update this task.',
        plan,
        confirm: true,
        intent,
      });
    }, 700);
  };

  const handleApply = (msg) => {
    if (!msg || msg.resolved) return;
    setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, resolved: true } : m)));
    onApplyingChange(true);
    window.setTimeout(() => {
      const changes = [];
      if (msg.intent === 'subtasks' || msg.intent === 'both') {
        changes.push({ type: 'subtasks', previous: task.subtasks });
        onUpdateSubtasks(generateSubtasksFromTitle(task.title));
      }
      if (msg.intent === 'description' || msg.intent === 'both') {
        changes.push({ type: 'description', previous: task.description });
        onUpdateTaskFields({ description: buildImprovedDescription(task.description) });
      }
      onApplyingChange(false);
      pushMessage({
        role: 'assistant',
        text:
          msg.intent === 'description'
            ? 'Done. The description was successfully improved.'
            : 'Done. The subtasks were successfully added.',
        undo: true,
        changes,
      });
    }, 900);
  };

  const handleCancel = (msg) => {
    if (!msg || msg.resolved) return;
    setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, resolved: true } : m)));
    pushMessage({ role: 'assistant', text: 'Okay, no changes made.' });
  };

  const handleUndo = (msg) => {
    if (!msg?.changes || msg.undone) return;
    msg.changes.forEach((change) => {
      if (change.type === 'subtasks') onUpdateSubtasks(change.previous);
      if (change.type === 'description') onUpdateTaskFields({ description: change.previous });
    });
    setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, undone: true } : m)));
    pushMessage({ role: 'assistant', text: 'Changes undone.' });
  };

  const handleSend = () => runPrompt(prompt, 'both');

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-[#f2f2f2] bg-white dark:border-zinc-700 dark:bg-zinc-900">
      <div className="flex items-center justify-between border-b border-[#f2f2f2] px-3 py-2.5 dark:border-zinc-700">
        <div className="flex items-center gap-1.5">
          <Sparkles size={14} className="text-[#8022fe]" />
          <p className="text-[14px] font-medium text-[#5d5d5d] dark:text-gray-300">AI Assistant</p>
        </div>
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

      <div ref={threadRef} className="scrollbar-hidden flex flex-1 flex-col gap-3 overflow-y-auto py-3 pl-3 pr-[18px]">
        {messages.length === 0 && !isThinking ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-1.5 text-center">
            <Sparkles size={16} className="text-[#e9d9ff]" />
            <p className="text-[12px] text-[#c2c2c2]">Ask the AI Assistant to help with this task.</p>
          </div>
        ) : (
          <>
            <p className="text-center text-[10px] text-[#c2c2c2]">
              {formatChatTimestamp(new Date())}
            </p>
            {messages.map((m) => (
              <ChatMessage
                key={m.id}
                message={m}
                onApply={handleApply}
                onCancel={handleCancel}
                onUndo={handleUndo}
              />
            ))}
            {isThinking && (
              <div className="flex flex-col gap-1.5">
                <SkeletonBar className="h-3 w-3/4" />
                <SkeletonBar className="h-3 w-1/2" />
              </div>
            )}
          </>
        )}
      </div>

      <div className="flex flex-col gap-3 p-3">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => runPrompt('Break this task into subtasks.', 'subtasks')}
            className="flex items-center gap-1.5 rounded-lg border border-[#f2f2f2] px-2.5 py-1.5 text-[12px] font-medium text-[#5d5d5d] dark:border-zinc-700"
          >
            <ListTree size={14} className="shrink-0 text-[#8022fe]" />
            Break into subtasks
          </button>
          <button
            type="button"
            onClick={() => runPrompt('Improve this task description.', 'description')}
            className="flex items-center gap-1.5 rounded-lg border border-[#f2f2f2] px-2.5 py-1.5 text-[12px] font-medium text-[#5d5d5d] dark:border-zinc-700"
          >
            <Wand2 size={14} className="shrink-0 text-[#8022fe]" />
            Improve description
          </button>
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
            disabled={!prompt.trim() || isThinking}
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

function TaskDetailCard({
  task,
  onUpdateSubtasks,
  onUpdateTaskFields,
  autoTriggerSubtasksAi = false,
  onAutoTriggerConsumed,
  isApplyingAiEdit = false,
  onEdit,
  onDelete,
  onTriggerSubtasksAi,
  variant = 'page',
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [goalMenuOpen, setGoalMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const goalMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
      if (goalMenuRef.current && !goalMenuRef.current.contains(e.target)) setGoalMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const estMinutes =
    task.tags?.find((t) => t.label?.includes('Min'))?.label?.replace(/\D/g, '') || '60';
  const linkedGoal = getLinkedGoalLabel(task);

  const handleImproveDescription = () => {
    onUpdateTaskFields({ description: buildImprovedDescription(task.description) });
  };

  const handleSelectLinkedGoal = (goalLabel) => {
    setGoalMenuOpen(false);
    if (goalLabel === '__create_new__') return;
    const withoutGoal = (task.tags ?? []).filter((tag) => !isGoalTag(tag));
    onUpdateTaskFields({
      linkedGoal: goalLabel,
      tags: [...withoutGoal, { label: goalLabel, icon: TrendingUp, linkedGoal: true }],
    });
  };

  const isDrawer = variant === 'drawer';
  const isPage = variant === 'page';

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`rounded-md font-medium uppercase ${isDrawer || isPage ? 'px-2 pt-0.5 pb-[3px] text-[14px]' : 'px-2 py-0.5 text-[14px]'} ${PRIORITY_STYLES[task.priority]}`}
            >
              {PRIORITY_LABELS[task.priority]}
            </span>
            {task.source === 'ai' && (
              <span
                className={`flex items-center rounded-md bg-[#f9f4ff] font-medium text-[#8022fe] ${isDrawer ? 'gap-1.5 px-2 pt-0.5 pb-[3px] text-[14px]' : 'gap-1.5 px-2 py-0.5 text-[14px]'}`}
              >
                <Sparkles size={12} />
                AI
              </span>
            )}
          </div>
          <div ref={menuRef} className="relative shrink-0">
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Task options"
              aria-expanded={menuOpen}
              className="text-[#a3a3a3] hover:text-[#5d5d5d]"
            >
              <MoreHorizontal size={16} />
            </button>
            {menuOpen && (
              <TaskDetailMenu
                onClose={() => setMenuOpen(false)}
                onEdit={() => onEdit?.(task)}
                onBreakIntoSubtasks={onTriggerSubtasksAi}
                onImproveDescription={handleImproveDescription}
                onDelete={() => onDelete?.(task)}
              />
            )}
          </div>
        </div>
        <div className={`flex flex-col ${isDrawer ? 'gap-1' : 'gap-2'}`}>
          {isApplyingAiEdit ? (
            <SkeletonBar className="h-7 w-3/4" />
          ) : (
            <p
              className={
                isDrawer
                  ? 'text-2xl font-semibold leading-[1.3] text-[#181818] dark:text-white'
                  : isPage
                    ? 'text-[20px] font-medium leading-normal text-[#181818] dark:text-white'
                    : 'text-xl font-medium text-[#181818] dark:text-white md:text-2xl'
              }
            >
              {task.title}
            </p>
          )}
          {isApplyingAiEdit ? (
            <SkeletonBar className="h-4 w-full" />
          ) : (
            task.description && (
              <p
                className={
                  isDrawer
                    ? 'text-sm font-medium text-[#a3a3a3]'
                    : isPage
                      ? 'text-[12px] font-medium text-[#c2c2c2]'
                      : 'text-base text-[#c2c2c2]'
                }
              >
                {task.description}
              </p>
            )
          )}
        </div>
        <div className="flex w-30 items-center justify-between rounded-lg border border-[#f2f2f2] bg-[#fcfcfc] px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800">
          <p className="text-[14px] font-medium text-[#181818] dark:text-white">
            {task.status || 'To Do'}
          </p>
          <ChevronDown size={10} className="text-[#a3a3a3]" />
        </div>
      </div>

      <div className="h-px w-full bg-[#f2f2f2] dark:bg-zinc-700" />

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1.5">
          <p className="text-[12px] font-medium text-[#c2c2c2]">Category</p>
          <span
            className={`inline-flex w-fit rounded-md border border-[#f2f2f2] font-medium text-[#5d5d5d] dark:border-zinc-700 ${isDrawer || isPage ? 'px-2 pt-0.5 pb-[3px] text-[14px]' : 'px-2 py-0.5 text-[14px]'}`}
          >
            {task.category || task.tags?.[0]?.label || 'Career'}
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          <p className="text-[12px] font-medium text-[#c2c2c2]">Due Date</p>
          <span
            className={`inline-flex w-fit items-center gap-1.5 rounded-md border border-[#f2f2f2] font-medium text-[#5d5d5d] dark:border-zinc-700 ${isDrawer || isPage ? 'px-2 pt-0.5 pb-[3px] text-[14px]' : 'px-2 py-0.5 text-[14px]'}`}
          >
            <Flag size={12} className="text-[#dc2626]" />
            {task.due}
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          <p className="text-[12px] font-medium text-[#c2c2c2]">Estimate Minutes</p>
          <span
            className={`inline-flex w-fit items-center gap-1.5 rounded-md border border-[#f2f2f2] font-medium text-[#5d5d5d] dark:border-zinc-700 ${isDrawer || isPage ? 'px-2 pt-0.5 pb-[3px] text-[14px]' : 'px-2 py-0.5 text-[14px]'}`}
          >
            <Clock size={12} />
            {estMinutes} Min
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex w-full items-center justify-between">
            <p className="text-[12px] font-medium text-[#c2c2c2]">Linked Goal</p>
            {!linkedGoal && (
              <div ref={goalMenuRef} className="relative">
                <button
                  type="button"
                  aria-label="Add linked goal"
                  aria-expanded={goalMenuOpen}
                  onClick={() => setGoalMenuOpen((o) => !o)}
                  className="text-[#a3a3a3] hover:text-[#5d5d5d]"
                >
                  <Plus size={16} />
                </button>
                {goalMenuOpen && (
                  <div className="absolute right-0 top-full z-30 mt-1 flex w-max min-w-44 flex-col overflow-hidden rounded-lg border border-[#f2f2f2] bg-white shadow-[0px_2px_4px_0px_rgba(0,0,0,0.03)] dark:border-zinc-700 dark:bg-zinc-800">
                    {LINKED_GOALS.map((goal, i) => (
                      <button
                        key={goal}
                        type="button"
                        onClick={() => handleSelectLinkedGoal(goal)}
                        className={`flex w-full items-center gap-1.5 px-[10px] py-1.5 text-left text-sm font-medium whitespace-nowrap hover:bg-[#fcfcfc] lg:text-[12px] dark:hover:bg-zinc-700 ${
                          i === 0
                            ? 'border-b border-[#f2f2f2] text-[#8022fe] dark:border-zinc-700'
                            : 'text-[#5d5d5d] dark:text-gray-300'
                        }`}
                      >
                        {i === 0 && <Sparkles size={10} className="shrink-0" />}
                        {i === 0 ? `${goal} (AI recommended)` : goal}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => handleSelectLinkedGoal('__create_new__')}
                      className="flex w-full items-center gap-1.5 border-t border-[#f2f2f2] px-[10px] py-1.5 text-left text-sm font-medium whitespace-nowrap text-[#5d5d5d] hover:bg-[#fcfcfc] lg:text-[12px] dark:border-zinc-700 dark:text-gray-300 dark:hover:bg-zinc-700"
                    >
                      + Create new goal
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          {linkedGoal ? (
            <div className="overflow-hidden rounded-xl border border-[#f2f2f2] bg-[#fcfcfc] dark:border-zinc-700 dark:bg-zinc-800">
              <div className="flex items-center justify-between px-3 py-2">
                <div className="flex items-center gap-1.5">
                  <TrendingUp size={12} className="text-[#5d5d5d]" />
                  <p className="text-[14px] font-medium text-[#5d5d5d]">{linkedGoal}</p>
                </div>
                <span className="flex shrink-0 items-center gap-1 text-[12px] text-[#c2c2c2]">
                  View Goal <ExternalLink size={10} />
                </span>
              </div>
              <p className="px-3 pt-1 pb-2 text-[12px] text-[#c2c2c2]">
                Stick to your fitness plan or engage in a workout session to boost your progress.
              </p>
              <div className="flex items-center justify-between border-t border-[#f2f2f2] px-3 py-2 text-[12px] text-[#5d5d5d] dark:border-zinc-700">
                <span>
                  <span className="text-[#c2c2c2]">Progress:</span> 60%
                </span>
                <span>
                  3/5 Tasks <span className="text-[#c2c2c2]">•</span> 2 Habits
                </span>
              </div>
            </div>
          ) : (
            <div className="flex h-10 items-center justify-center rounded-xl border border-dashed border-[#f2f2f2] dark:border-zinc-700">
              <p className="text-[12px] font-medium text-[#c2c2c2]">No Goal yet</p>
            </div>
          )}
        </div>

        <SubtasksSection
          task={task}
          onUpdateSubtasks={onUpdateSubtasks}
          autoTriggerAi={autoTriggerSubtasksAi}
          onAutoTriggerConsumed={onAutoTriggerConsumed}
        />
      </div>
    </div>
  );
}

// Slide-over peek (Figma frames 6/6.1/7/7.1) — board stays visible behind it.
const DRAWER_DEFAULT_WIDTH = 360;
const DRAWER_MIN_WIDTH = 360;
const DRAWER_MAX_WIDTH = 720;

export function TaskDetailDrawer({
  task,
  onClose,
  onOpenFullPage,
  onUpdateSubtasks,
  onUpdateTaskFields,
  onEdit,
  onDelete,
  onTriggerSubtasksAi,
  autoTriggerSubtasksAi = false,
  onAutoTriggerConsumed,
}) {
  const [width, setWidth] = useState(DRAWER_DEFAULT_WIDTH);
  const isResizing = useRef(false);
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.innerWidth >= 1024
  );

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing.current) return;
      const next = Math.min(
        DRAWER_MAX_WIDTH,
        Math.max(DRAWER_MIN_WIDTH, window.innerWidth - e.clientX)
      );
      setWidth(next);
    };
    const handleMouseUp = () => {
      isResizing.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const startResize = () => {
    isResizing.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  if (!task) return null;

  return (
    <div className="fixed inset-0 z-40 max-lg:bg-black/10 lg:top-13 lg:z-30 lg:bg-transparent">
      <button
        type="button"
        aria-label="Close task detail"
        onClick={onClose}
        className="absolute inset-0"
      />

      <aside
        style={isDesktop ? { width } : undefined}
        className="absolute inset-y-0 right-0 flex w-full max-w-full flex-col overflow-hidden border-l border-[#f2f2f2] bg-white dark:border-zinc-700 dark:bg-zinc-900"
        aria-label="Task detail"
      >
        <button
          type="button"
          aria-label="Resize task detail panel"
          onMouseDown={startResize}
          className="absolute inset-y-0 left-0 hidden w-1 -translate-x-1/2 cursor-col-resize hover:bg-[#8022fe]/20 lg:block"
        />

        <div className="flex shrink-0 items-center justify-between border-b border-[#f2f2f2] px-5 py-4 dark:border-zinc-700">
          <button
            type="button"
            onClick={() => onOpenFullPage?.(task)}
            aria-label="Open task in full page"
            className="text-[#a3a3a3] hover:text-[#5d5d5d]"
          >
            <ExternalLink size={16} />
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close task detail"
            className="text-[#a3a3a3] hover:text-[#5d5d5d]"
          >
            <X size={14} />
          </button>
        </div>

        <div className="scrollbar-hidden flex min-h-0 flex-1 flex-col overflow-y-auto pl-5 pr-7.5 py-5">
          <TaskDetailCard
            variant="drawer"
            task={task}
            onUpdateSubtasks={onUpdateSubtasks}
            onUpdateTaskFields={onUpdateTaskFields}
            autoTriggerSubtasksAi={autoTriggerSubtasksAi}
            onAutoTriggerConsumed={onAutoTriggerConsumed}
            onEdit={onEdit}
            onDelete={onDelete}
            onTriggerSubtasksAi={onTriggerSubtasksAi}
          />
        </div>
      </aside>
    </div>
  );
}

// Full page (Figma frame 8) — board hidden, AI Assistant docked alongside.
export default function TaskDetailPanel({
  task,
  onUpdateSubtasks,
  onUpdateTaskFields,
  onEdit,
  onDelete,
  onTriggerSubtasksAi,
  autoTriggerSubtasksAi = false,
  onAutoTriggerConsumed,
}) {
  const [isApplyingAiEdit, setIsApplyingAiEdit] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(true);
  const [isAssistantExpanded, setIsAssistantExpanded] = useState(false);

  if (!task) return null;

  const closeAssistant = () => {
    setIsAssistantOpen(false);
    setIsAssistantExpanded(false);
  };
  const toggleExpandAssistant = () => setIsAssistantExpanded((e) => !e);

  return (
    <div className="flex min-h-0 flex-1 w-full flex-col gap-7.5 xl:flex-row xl:items-stretch">
      <div className="relative flex min-h-[min(60vh,520px)] min-w-0 flex-1 flex-col overflow-y-auto rounded-2xl border border-[#f2f2f2] bg-white p-5 scrollbar-hidden xl:min-h-0 dark:border-zinc-700 dark:bg-zinc-900">
        {!isAssistantOpen && (
          <button
            type="button"
            onClick={() => setIsAssistantOpen(true)}
            aria-label="Open AI Assistant"
            className="absolute top-4 right-14 z-10 flex items-center gap-1.5 rounded-lg bg-[#f9f4ff] px-2.5 py-1.5 text-[12px] font-medium text-[#8022fe]"
          >
            <Sparkles size={12} />
            AI Assistant
          </button>
        )}
        <TaskDetailCard
          variant="page"
          task={task}
          onUpdateSubtasks={onUpdateSubtasks}
          onUpdateTaskFields={onUpdateTaskFields}
          autoTriggerSubtasksAi={autoTriggerSubtasksAi}
          onAutoTriggerConsumed={onAutoTriggerConsumed}
          isApplyingAiEdit={isApplyingAiEdit}
          onEdit={onEdit}
          onDelete={onDelete}
          onTriggerSubtasksAi={onTriggerSubtasksAi}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-15 rounded-b-2xl bg-gradient-to-b from-transparent to-white dark:to-zinc-900" />
      </div>

      {isAssistantOpen && !isAssistantExpanded && (
        <div className="flex h-125 w-full shrink-0 flex-col xl:h-full xl:w-100">
          <AiAssistantChat
            task={task}
            onUpdateSubtasks={onUpdateSubtasks}
            onUpdateTaskFields={onUpdateTaskFields}
            onApplyingChange={setIsApplyingAiEdit}
            onClose={closeAssistant}
            onToggleExpand={toggleExpandAssistant}
            isExpanded={false}
          />
        </div>
      )}

      {isAssistantOpen && isAssistantExpanded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="h-[85vh] w-full max-w-2xl">
            <AiAssistantChat
              task={task}
              onUpdateSubtasks={onUpdateSubtasks}
              onUpdateTaskFields={onUpdateTaskFields}
              onApplyingChange={setIsApplyingAiEdit}
              onClose={closeAssistant}
              onToggleExpand={toggleExpandAssistant}
              isExpanded
            />
          </div>
        </div>
      )}
    </div>
  );
}
