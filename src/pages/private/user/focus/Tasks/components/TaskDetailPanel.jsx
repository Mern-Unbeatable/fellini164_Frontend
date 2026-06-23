import { useEffect, useRef, useState } from 'react';
import {
  Sparkles,
  ChevronDown,
  Clock,
  Flag,
  TrendingUp,
  Plus,
  X,
  ExternalLink,
  Maximize2,
  Send,
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
          {subtasks.length > 0 && (
            <span className="flex w-5 items-center justify-center rounded-[5px] bg-[#fcfcfc] px-1 py-px text-[12px] font-medium text-[#c2c2c2]">
              {subtasks.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Add subtask manually"
            className="text-[#a3a3a3]"
          >
            <Plus size={12} />
          </button>
          <button
            type="button"
            onClick={handleAiClick}
            disabled={isGenerating}
            aria-label="Generate subtasks with AI"
            className="rounded-md p-0.5 text-[#8022fe] disabled:opacity-50"
          >
            <Sparkles size={12} />
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

      <div className="overflow-hidden rounded-[10px] border border-[#f2f2f2] bg-[#fcfcfc] dark:border-zinc-700 dark:bg-zinc-800">
        {isGenerating ? (
          <div className="flex flex-col gap-2.5 px-3 py-2">
            <SkeletonBar className="h-4 w-full" />
            <SkeletonBar className="h-4 w-[85%]" />
            <SkeletonBar className="h-4 w-[70%]" />
            <SkeletonBar className="h-4 w-[90%]" />
          </div>
        ) : subtasks.length === 0 ? (
          <div className="flex min-h-16 items-center justify-center border border-dashed border-[#e9e9e9] px-3 py-4">
            <p className="text-[12px] font-medium text-[#c2c2c2]">No Subtasks yet</p>
          </div>
        ) : (
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
        )}

        {subtasks.length > 0 && !isGenerating && (
          <div className="border-t border-[#f2f2f2] px-3 py-2 dark:border-zinc-700">
            <p className="text-[12px] font-medium text-[#5d5d5d]">
              <span className="text-[#c2c2c2]">Progress:</span> {completedCount}/{subtasks.length}{' '}
              Steps
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function AiAssistantStub() {
  const [prompt, setPrompt] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [prompt]);

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-[#f2f2f2] bg-white dark:border-zinc-700 dark:bg-zinc-900">
      <div className="flex items-center justify-between border-b border-[#f2f2f2] px-3 py-2.5 dark:border-zinc-700">
        <div className="flex items-center gap-1.5">
          <Sparkles size={12} className="text-[#8022fe]" />
          <p className="text-[14px] font-medium text-[#5d5d5d] dark:text-gray-300">AI Assistant</p>
        </div>
        <div className="flex items-center gap-2 text-[#a3a3a3]">
          <Maximize2 size={12} />
          <X size={12} />
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-end gap-3 p-3">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-lg border border-[#f2f2f2] px-2.5 py-1.5 text-[12px] font-medium text-[#5d5d5d] dark:border-zinc-700">
            ✦ Break into subtasks
          </span>
          <span className="rounded-lg border border-[#f2f2f2] px-2.5 py-1.5 text-[12px] font-medium text-[#5d5d5d] dark:border-zinc-700">
            ✦ Improve description
          </span>
        </div>
        <div className="relative w-full">
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what you want to change..."
            rows={1}
            className="max-h-30 w-full resize-none overflow-hidden rounded-xl border border-[#f2f2f2] px-3 py-2 pr-10 text-[12px] text-[#5d5d5d] placeholder:text-[#c2c2c2] focus:outline-none dark:border-zinc-700 dark:text-gray-300"
          />
          <button
            type="button"
            aria-label="Send"
            disabled={!prompt.trim()}
            className="absolute top-1/2 right-1.5 flex -translate-y-1/2 items-center justify-center rounded-full bg-[#8022fe] p-1.5 text-white disabled:opacity-50"
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

export default function TaskDetailPanel({
  task,
  onClose,
  onUpdateSubtasks,
  autoTriggerSubtasksAi = false,
  onAutoTriggerConsumed,
}) {
  if (!task) return null;

  const estMinutes =
    task.tags?.find((t) => t.label?.includes('Min'))?.label?.replace(/\D/g, '') || '60';
  const linkedGoal = task.tags?.find((t) => t.icon === TrendingUp)?.label;

  return (
    <div className="flex min-h-[min(60vh,520px)] w-full flex-col gap-4 xl:h-167.75 xl:flex-row xl:gap-7.5">
      <div className="relative flex flex-1 flex-col gap-6 overflow-y-auto scrollbar-hidden rounded-2xl border border-[#f2f2f2] bg-white p-4 sm:p-5 dark:border-zinc-700 dark:bg-zinc-900">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close task detail"
          className="absolute top-4 right-4 text-[#a3a3a3] hover:text-[#5d5d5d]"
        >
          <X size={16} />
        </button>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between pr-8">
            <div className="flex items-center gap-2">
              <span
                className={`rounded-md px-2 py-0.5 text-[14px] font-medium uppercase ${PRIORITY_STYLES[task.priority]}`}
              >
                {PRIORITY_LABELS[task.priority]}
              </span>
              {task.source === 'ai' && (
                <span className="flex items-center gap-1.5 rounded-md bg-[#f9f4ff] px-2 py-0.5 text-[14px] font-medium text-[#8022fe]">
                  <Sparkles size={12} />
                  AI
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-xl font-medium text-[#181818] dark:text-white md:text-2xl">{task.title}</p>
            {task.description && (
              <p className="text-base text-[#c2c2c2]">{task.description}</p>
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
            <span className="inline-flex w-fit rounded-md border border-[#f2f2f2] px-2 py-0.5 text-[14px] font-medium text-[#5d5d5d] dark:border-zinc-700">
              {task.category || task.tags?.[0]?.label || 'Career'}
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <p className="text-[12px] font-medium text-[#c2c2c2]">Due Date</p>
            <span className="inline-flex w-fit items-center gap-1.5 rounded-md border border-[#f2f2f2] px-2 py-0.5 text-[14px] font-medium text-[#5d5d5d] dark:border-zinc-700">
              <Flag size={12} className="text-[#dc2626]" />
              {task.due}
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <p className="text-[12px] font-medium text-[#c2c2c2]">Estimate Minutes</p>
            <span className="inline-flex w-fit items-center gap-1.5 rounded-md border border-[#f2f2f2] px-2 py-0.5 text-[14px] font-medium text-[#5d5d5d] dark:border-zinc-700">
              <Clock size={12} />
              {estMinutes} Min
            </span>
          </div>

          {linkedGoal && (
            <div className="flex flex-col gap-1.5">
              <p className="text-[12px] font-medium text-[#c2c2c2]">Linked Goal</p>
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
            </div>
          )}

          <SubtasksSection
            task={task}
            onUpdateSubtasks={onUpdateSubtasks}
            autoTriggerAi={autoTriggerSubtasksAi}
            onAutoTriggerConsumed={onAutoTriggerConsumed}
          />
        </div>
      </div>

      <div className="h-125 w-full shrink-0 xl:h-auto xl:w-100">
        <AiAssistantStub />
      </div>
    </div>
  );
}
