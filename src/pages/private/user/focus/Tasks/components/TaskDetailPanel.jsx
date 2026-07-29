import { useEffect, useRef, useState, useCallback } from 'react';
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
  MoreHorizontal,
  Pencil,
  Trash2,
} from 'lucide-react';
import SkeletonBar from '../../../../../../components/ui/SkeletonBar';
import TaskAiAssistant from './TaskAiAssistant';
import { fetchGoalsApi } from '../../../../../../features/goals/goalsAPI';
import { mapTaskFromApi } from '../../../../../../features/tasks/tasksMappers';

/** Keep detail view on local state so AI apply updates the left panel immediately. */
function useLocalTask(task) {
  const [localTask, setLocalTask] = useState(task);

  useEffect(() => {
    if (!task) {
      setLocalTask(null);
      return;
    }
    setLocalTask((prev) => {
      if (!prev || String(prev.id) !== String(task.id)) return task;
      return {
        ...prev,
        ...task,
        subtasks: Array.isArray(task.subtasks) ? task.subtasks : prev.subtasks || [],
      };
    });
  }, [task]);

  const applyTaskUpdate = useCallback((next) => {
    if (!next) return;
    // Already-mapped UI task, or a partial allowlisted patch (title/description/…)
    const looksMapped =
      next.id ||
      next.status === 'To Do' ||
      next.status === 'In Progress' ||
      next.status === 'Done' ||
      next.columnKey ||
      Array.isArray(next.tags) ||
      Array.isArray(next.subtasks);
    const mapped = looksMapped ? next : mapTaskFromApi(next);
    if (!mapped) return;
    setLocalTask((prev) => ({
      ...(prev || {}),
      ...mapped,
      // Prefer explicit subtasks on the patch; otherwise keep previous
      subtasks: Array.isArray(mapped.subtasks) ? mapped.subtasks : prev?.subtasks || [],
    }));
  }, []);

  return [localTask, setLocalTask, applyTaskUpdate];
}

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

const TASK_STATUSES = ['To Do', 'In Progress', 'Done'];

function StatusDropdown({ value, onChange, disabled = false }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = TASK_STATUSES.includes(value) ? value : 'To Do';

  useEffect(() => {
    if (!open) return undefined;
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div ref={ref} className="relative w-[120px]">
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => !disabled && setOpen((o) => !o)}
        className="flex w-full items-center justify-between rounded-lg border border-[#f2f2f2] bg-[#fcfcfc] px-3 py-2 text-left dark:border-zinc-700 dark:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="text-[14px] font-medium text-[#181818] dark:text-white">{current}</span>
        <ChevronDown size={12} className="shrink-0 text-[#a3a3a3]" aria-hidden="true" />
      </button>
      {open && (
        <div
          role="listbox"
          className="absolute left-0 top-full z-30 mt-1 flex w-full flex-col overflow-hidden rounded-lg border border-[#f2f2f2] bg-white shadow-[0px_2px_4px_0px_rgba(0,0,0,0.03)] dark:border-zinc-700 dark:bg-zinc-800"
        >
          {TASK_STATUSES.map((status) => (
            <button
              key={status}
              type="button"
              role="option"
              aria-selected={status === current}
              onClick={() => {
                setOpen(false);
                if (status !== current) onChange?.(status);
              }}
              className={`px-3 py-2 text-left text-[14px] font-medium transition-colors hover:bg-[#fcfcfc] dark:hover:bg-zinc-700 ${
                status === current
                  ? 'text-[#8022fe]'
                  : 'text-[#181818] dark:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function isGoalTag(tag) {
  return Boolean(
    tag?.linkedGoal || tag?.iconKey === 'goal' || tag?.icon === Target || tag?.icon === TrendingUp
  );
}

function getLinkedGoalLabel(task) {
  if (task.linkedGoal) return task.linkedGoal;
  if (task.goal?.title) return task.goal.title;
  return task.tags?.find(isGoalTag)?.label ?? null;
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

function SubtasksSection({ task, isApplyingAiEdit = false, onRequestBreakdown }) {
  const subtasks = task.subtasks ?? [];
  const completedCount = subtasks.filter((s) => s.done || s.completed).length;
  const showAiSkeleton = isApplyingAiEdit;

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
            onClick={() => onRequestBreakdown?.()}
            disabled={isApplyingAiEdit}
            aria-label="Break into subtasks"
            className="rounded-md p-0.5 text-[#a3a3a3] hover:text-[#8022fe] disabled:opacity-50"
          >
            <Plus size={16} />
          </button>
          <button
            type="button"
            onClick={() => onRequestBreakdown?.()}
            disabled={isApplyingAiEdit}
            aria-label="Generate subtasks with AI"
            className="rounded-md p-0.5 text-[#8022fe] disabled:opacity-50"
          >
            <Sparkles size={16} />
          </button>
        </div>
      </div>

      {showAiSkeleton ? (
        <SkeletonBar variant="ai" className="h-[164px] w-full rounded-[10px]" />
      ) : subtasks.length === 0 ? (
        <div className="flex h-10 items-center justify-center rounded-xl border border-dashed border-[#f2f2f2]">
          <p className="text-[12px] font-medium text-[#c2c2c2]">No Subtasks yet</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[#f2f2f2] bg-[#fcfcfc] dark:border-zinc-700 dark:bg-zinc-800">
          <div className="flex flex-col gap-2.5 px-3 py-2">
            {subtasks.map((sub) => (
              <div
                key={sub.id}
                className={`flex items-center gap-2 ${sub.done || sub.completed ? 'opacity-50' : ''}`}
              >
                <span
                  className={`flex size-3.5 shrink-0 items-center justify-center rounded border ${
                    sub.done || sub.completed
                      ? 'border-[#8022fe] bg-[#8022fe] text-white'
                      : 'border-[#e9e9e9]'
                  }`}
                />
                <span
                  className={`text-[14px] font-medium text-[#5d5d5d] dark:text-gray-300 ${
                    sub.done || sub.completed ? 'line-through' : ''
                  }`}
                >
                  {sub.title || sub.label}{' '}
                  {(sub.estimatedMinutes || sub.minutes) != null && (
                    <span className="text-[12px] text-[#c2c2c2]">
                      ({sub.estimatedMinutes || sub.minutes} Min)
                    </span>
                  )}
                </span>
              </div>
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

function TaskDetailCard({
  task,
  onUpdateTaskFields,
  onChangeStatus,
  isApplyingAiEdit = false,
  onEdit,
  onDelete,
  onTriggerSubtasksAi,
  onTriggerImproveAi,
  variant = 'page',
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [goalMenuOpen, setGoalMenuOpen] = useState(false);
  const [goalOptions, setGoalOptions] = useState([]);
  const [statusBusy, setStatusBusy] = useState(false);
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

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const envelope = await fetchGoalsApi({ page: 1, limit: 50, status: 'ACTIVE' });
        const list = Array.isArray(envelope?.goals)
          ? envelope.goals
          : Array.isArray(envelope?.data)
            ? envelope.data
            : [];
        if (!cancelled) {
          setGoalOptions(
            list.filter((g) => g?.id).map((g) => ({ id: g.id, title: g.title || 'Untitled goal' }))
          );
        }
      } catch {
        if (!cancelled) setGoalOptions([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const estMinutesTag = task.tags?.find((t) => t.label?.includes('Min'));
  const estMinutesLabel = estMinutesTag
    ? `${estMinutesTag.label.replace(/\D/g, '')} Min`
    : task.estimatedMinutes
      ? `${task.estimatedMinutes} Min`
      : 'None';
  const linkedGoal = getLinkedGoalLabel(task);

  const handleSelectLinkedGoal = (goalId, goalTitle) => {
    setGoalMenuOpen(false);
    if (!goalId) return;
    const withoutGoal = (task.tags ?? []).filter((tag) => !isGoalTag(tag));
    onUpdateTaskFields({
      goalId,
      linkedGoal: goalTitle,
      tags: [...withoutGoal, { label: goalTitle, iconKey: 'goal', linkedGoal: true }],
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
                onImproveDescription={onTriggerImproveAi}
                onDelete={() => onDelete?.(task)}
              />
            )}
          </div>
        </div>
        <div className={`relative flex flex-col ${isDrawer ? 'gap-1' : 'gap-2'}`}>
          {isApplyingAiEdit ? (
            <div className="flex flex-col gap-2">
              <SkeletonBar variant="ai" className="h-[31px] w-[241px] max-w-full rounded-[8px]" />
              <SkeletonBar variant="ai" className="h-4 w-[295px] max-w-full rounded-[5px]" />
            </div>
          ) : (
            <>
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
              {task.description && (
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
              )}
            </>
          )}
        </div>
        <StatusDropdown
          value={task.status || 'To Do'}
          disabled={statusBusy || !onChangeStatus}
          onChange={async (nextStatus) => {
            if (!onChangeStatus || statusBusy) return;
            setStatusBusy(true);
            try {
              await onChangeStatus(nextStatus);
            } finally {
              setStatusBusy(false);
            }
          }}
        />
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
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex w-fit items-center gap-1.5 rounded-md border border-[#f2f2f2] font-medium text-[#5d5d5d] dark:border-zinc-700 ${isDrawer || isPage ? 'px-2 pt-0.5 pb-[3px] text-[14px]' : 'px-2 py-0.5 text-[14px]'}`}
            >
              <Flag size={12} className="text-[#dc2626]" />
              {task.due}
            </span>
            {task.overdueDays != null && (
              <span className="inline-flex items-center gap-1.5 rounded-md bg-[rgba(220,38,38,0.05)] px-2 pt-0.5 pb-[3px] text-[14px] font-medium text-[#dc2626]">
                <Flag size={12} />
                Overdue {task.overdueDays}d
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <p className="text-[12px] font-medium text-[#c2c2c2]">Estimate Minutes</p>
          <span
            className={`inline-flex w-fit items-center gap-1.5 rounded-md border border-[#f2f2f2] font-medium text-[#5d5d5d] dark:border-zinc-700 ${isDrawer || isPage ? 'px-2 pt-0.5 pb-[3px] text-[14px]' : 'px-2 py-0.5 text-[14px]'}`}
          >
            <Clock size={12} />
            {estMinutesLabel}
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
                    {goalOptions.length === 0 ? (
                      <p className="px-[10px] py-1.5 text-[12px] text-[#c2c2c2]">No active goals</p>
                    ) : (
                      goalOptions.map((goal, i) => (
                        <button
                          key={goal.id}
                          type="button"
                          onClick={() => handleSelectLinkedGoal(goal.id, goal.title)}
                          className={`flex w-full items-center gap-1.5 px-[10px] py-1.5 text-left text-sm font-medium whitespace-nowrap hover:bg-[#fcfcfc] lg:text-[12px] dark:hover:bg-zinc-700 ${
                            i === 0
                              ? 'border-b border-[#f2f2f2] text-[#8022fe] dark:border-zinc-700'
                              : 'text-[#5d5d5d] dark:text-gray-300'
                          }`}
                        >
                          {i === 0 && <Sparkles size={10} className="shrink-0" />}
                          {goal.title}
                        </button>
                      ))
                    )}
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
            </div>
          ) : (
            <div className="flex h-10 items-center justify-center rounded-xl border border-dashed border-[#f2f2f2] dark:border-zinc-700">
              <p className="text-[12px] font-medium text-[#c2c2c2]">No Goal yet</p>
            </div>
          )}
        </div>

        <SubtasksSection
          task={task}
          isApplyingAiEdit={isApplyingAiEdit}
          onRequestBreakdown={onTriggerSubtasksAi}
        />
      </div>
    </div>
  );
}


const DRAWER_DEFAULT_WIDTH = 360;
const DRAWER_MIN_WIDTH = 360;
const DRAWER_MAX_WIDTH = 720;

export function TaskDetailDrawer({
  task,
  onClose,
  onOpenFullPage,
  onUpdateTaskFields,
  onChangeStatus,
  onEdit,
  onDelete,
  onRefreshTask,
  onTriggerSubtasksAi,
  onTriggerImproveAi,
  autoAiAction = null,
  onAutoAiActionConsumed,
}) {
  if (!task) return null;

  return (
    <TaskDetailDrawerInner
      task={task}
      onClose={onClose}
      onOpenFullPage={onOpenFullPage}
      onUpdateTaskFields={onUpdateTaskFields}
      onChangeStatus={onChangeStatus}
      onEdit={onEdit}
      onDelete={onDelete}
      onRefreshTask={onRefreshTask}
      onTriggerSubtasksAi={onTriggerSubtasksAi}
      onTriggerImproveAi={onTriggerImproveAi}
      autoAiAction={autoAiAction}
      onAutoAiActionConsumed={onAutoAiActionConsumed}
    />
  );
}

function TaskDetailDrawerInner({
  task: taskProp,
  onClose,
  onOpenFullPage,
  onUpdateTaskFields,
  onChangeStatus,
  onEdit,
  onDelete,
  onRefreshTask,
  onTriggerSubtasksAi,
  onTriggerImproveAi,
  autoAiAction = null,
  onAutoAiActionConsumed,
}) {
  const [localTask, , applyTaskUpdate] = useLocalTask(taskProp);
  const [width, setWidth] = useState(DRAWER_DEFAULT_WIDTH);
  const isResizing = useRef(false);
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.innerWidth >= 1024
  );
  const [isApplyingAiEdit, setIsApplyingAiEdit] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(Boolean(autoAiAction));

  const task = localTask || taskProp;

  const handleRefreshTask = useCallback(async () => {
    const updated = await onRefreshTask?.();
    if (updated) applyTaskUpdate(updated);
    return updated;
  }, [onRefreshTask, applyTaskUpdate]);

  useEffect(() => {
    if (autoAiAction) setIsAssistantOpen(true);
  }, [autoAiAction]);

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

        <div className="scrollbar-drawer flex min-h-0 flex-1 flex-col overflow-y-auto py-5 pl-5 pr-5">
          <TaskDetailCard
            variant="drawer"
            task={task}
            onUpdateTaskFields={onUpdateTaskFields}
            onChangeStatus={async (status) => {
              const updated = await onChangeStatus?.(status);
              if (updated) applyTaskUpdate(updated);
            }}
            isApplyingAiEdit={isApplyingAiEdit}
            onEdit={onEdit}
            onDelete={onDelete}
            onTriggerSubtasksAi={() => {
              setIsAssistantOpen(true);
              onTriggerSubtasksAi?.();
            }}
            onTriggerImproveAi={() => {
              setIsAssistantOpen(true);
              onTriggerImproveAi?.();
            }}
          />
          {isAssistantOpen && (
            <div className="mt-4 h-80 shrink-0">
              <TaskAiAssistant
                taskId={task.id}
                hasSubtasks={Array.isArray(task.subtasks) && task.subtasks.length > 0}
                onClose={() => setIsAssistantOpen(false)}
                onRefreshTask={handleRefreshTask}
                onTaskUpdated={applyTaskUpdate}
                onApplyingChange={setIsApplyingAiEdit}
                autoAction={autoAiAction}
                onAutoActionConsumed={onAutoAiActionConsumed}
              />
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

export default function TaskDetailPanel({
  task: taskProp,
  onUpdateTaskFields,
  onChangeStatus,
  onEdit,
  onDelete,
  onRefreshTask,
  onTriggerSubtasksAi,
  onTriggerImproveAi,
  autoAiAction = null,
  onAutoAiActionConsumed,
}) {
  const [localTask, , applyTaskUpdate] = useLocalTask(taskProp);
  const [isApplyingAiEdit, setIsApplyingAiEdit] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(true);
  const [isAssistantExpanded, setIsAssistantExpanded] = useState(false);

  const task = localTask || taskProp;

  const handleRefreshTask = useCallback(async () => {
    const updated = await onRefreshTask?.();
    if (updated) applyTaskUpdate(updated);
    return updated;
  }, [onRefreshTask, applyTaskUpdate]);

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
          onUpdateTaskFields={onUpdateTaskFields}
          onChangeStatus={async (status) => {
            const updated = await onChangeStatus?.(status);
            if (updated) applyTaskUpdate(updated);
          }}
          isApplyingAiEdit={isApplyingAiEdit}
          onEdit={onEdit}
          onDelete={onDelete}
          onTriggerSubtasksAi={() => {
            setIsAssistantOpen(true);
            onTriggerSubtasksAi?.();
          }}
          onTriggerImproveAi={() => {
            setIsAssistantOpen(true);
            onTriggerImproveAi?.();
          }}
        />
      </div>

      {isAssistantOpen && !isAssistantExpanded && (
        <div className="flex h-125 w-full shrink-0 flex-col xl:h-full xl:w-100">
          <TaskAiAssistant
            taskId={task.id}
            hasSubtasks={Array.isArray(task.subtasks) && task.subtasks.length > 0}
            onClose={closeAssistant}
            onToggleExpand={toggleExpandAssistant}
            isExpanded={false}
            onRefreshTask={handleRefreshTask}
            onTaskUpdated={applyTaskUpdate}
            onApplyingChange={setIsApplyingAiEdit}
            autoAction={autoAiAction}
            onAutoActionConsumed={onAutoAiActionConsumed}
          />
        </div>
      )}

      {isAssistantOpen && isAssistantExpanded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="h-[85vh] w-full max-w-2xl">
            <TaskAiAssistant
              taskId={task.id}
              hasSubtasks={Array.isArray(task.subtasks) && task.subtasks.length > 0}
              onClose={closeAssistant}
              onToggleExpand={toggleExpandAssistant}
              isExpanded
              onRefreshTask={handleRefreshTask}
              onTaskUpdated={applyTaskUpdate}
              onApplyingChange={setIsApplyingAiEdit}
              autoAction={autoAiAction}
              onAutoActionConsumed={onAutoAiActionConsumed}
            />
          </div>
        </div>
      )}
    </div>
  );
}
