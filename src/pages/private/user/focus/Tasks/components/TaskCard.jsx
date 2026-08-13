import { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  MoreHorizontal,
  X,
  Check,
  Pencil,
  Trash2,
  AlertCircle,
  Clock,
  TrendingUp,
  Target,
} from 'lucide-react';
import { PRIORITY_LABELS } from './TaskFilters';

const TAG_ICONS = {
  clock: Clock,
  goal: TrendingUp,
  target: Target,
};

function TagIcon({ tag }) {
  const Icon = tag.icon || TAG_ICONS[tag.iconKey];
  if (!Icon) return null;
  return <Icon size={12} className="shrink-0" />;
}

export const PRIORITY_STYLES = {
  URGENT: 'bg-[rgba(220,38,38,0.05)] text-[#dc2626]',
  HIGH: 'bg-[rgba(249,115,22,0.05)] text-[#f97316]',
  MEDIUM: 'bg-[rgba(202,138,4,0.05)] text-[#ca8a04]',
  LOW: 'bg-[rgba(107,114,128,0.05)] text-[#6b7280]',
};

function GhostTaskDashedBorder() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
      viewBox="0 0 359 174"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="0.5"
        y="0.5"
        width="358"
        height="173"
        rx="16"
        ry="16"
        fill="none"
        stroke="#e9e9e9"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
        strokeDasharray="5 5"
      />
    </svg>
  );
}

function GhostTaskDashedDivider() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute top-0 right-0 left-0 h-px w-full"
      viewBox="0 0 359 1"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        x1="0"
        y1="0.5"
        x2="359"
        y2="0.5"
        stroke="#e9e9e9"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
        strokeDasharray="5 5"
      />
    </svg>
  );
}

function GhostTaskMenu({ busy, onRegenerate, onDismiss }) {
  return (
    <div className="absolute right-0 top-full z-30 mt-1 flex w-max flex-col overflow-hidden rounded-lg border border-[#f2f2f2] bg-white shadow-[0px_2px_4px_0px_rgba(0,0,0,0.03)] dark:border-zinc-700 dark:bg-zinc-800">
      <button
        type="button"
        disabled={busy}
        onClick={onRegenerate}
        className="flex items-center gap-1.5 border-b border-[#f2f2f2] px-[10px] py-1.5 text-left text-sm font-medium whitespace-nowrap text-[#8022fe] hover:bg-[#fcfcfc] disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-700"
      >
        <Sparkles size={10} className="shrink-0" />
        Regenerate suggestion
      </button>
      <button
        type="button"
        disabled={busy}
        onClick={onDismiss}
        className="flex items-center gap-1.5 px-[10px] py-1.5 text-left text-sm font-medium whitespace-nowrap text-[#5d5d5d] hover:bg-[#fcfcfc] disabled:opacity-50 dark:text-gray-300 dark:hover:bg-zinc-700"
      >
        <X size={10} className="shrink-0" />
        Dismiss
      </button>
    </div>
  );
}

export function GhostTaskCard({ task, busy, onDismiss, onRegenerate, onAccept }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cardRef.current && !cardRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = menuOpen || isHovered;

  if (isActive) {
    return (
      <div
        ref={cardRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`ghost-task-card group relative flex w-full shrink-0 flex-col rounded-2xl border border-solid border-[#f2f2f2] bg-[#fcfcfc] shadow-[0px_2px_2px_0px_rgba(0,0,0,0.03)] ${
          menuOpen ? 'overflow-visible' : 'overflow-hidden'
        }`}
      >
        <div className="flex w-full flex-col gap-2.5 p-3">
          <div className="flex w-full flex-col gap-2">
            <div className="flex w-full items-center gap-1">
              <span
                className={`rounded-[6px] px-[6px] py-[2px] text-[12px] font-medium uppercase leading-normal ${PRIORITY_STYLES[task.priority]}`}
              >
                {PRIORITY_LABELS[task.priority]}
              </span>
              <span className="flex items-center gap-1 rounded-[6px] bg-[#f9f4ff] px-[6px] py-[2px] text-[12px] font-medium leading-normal text-[#8022fe]">
                <Sparkles size={10} />
                AI
              </span>
            </div>
            <div className="flex w-full flex-col gap-1">
              <p className="w-full text-[16px] font-medium leading-normal text-[#181818]">
                {task.title}
              </p>
              <p className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-[12px] leading-normal text-[#a3a3a3]">
                {task.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 overflow-hidden">
            {(task.tags || []).map((tag) => (
              <span
                key={tag.label}
                className="flex shrink-0 items-center gap-1.5 rounded-[6px] border border-[#f2f2f2] px-[6px] py-[2px] text-[12px] font-medium leading-normal text-[#5d5d5d]"
              >
                <TagIcon tag={tag} />
                {tag.label}
              </span>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Ghost task menu"
          aria-expanded={menuOpen}
          className={`absolute right-[11px] top-[12px] z-20 rounded-[6px] p-1 text-[#a3a3a3] outline-none ${
            menuOpen || isHovered ? 'bg-[#f2f2f2]' : ''
          }`}
        >
          <MoreHorizontal size={16} />
        </button>

        {menuOpen && (
          <div className="absolute right-[11px] top-[37px] z-50">
            <GhostTaskMenu
              busy={busy}
              onRegenerate={() => {
                if (busy) return;
                setMenuOpen(false);
                onRegenerate(task.id);
              }}
              onDismiss={() => {
                if (busy) return;
                setMenuOpen(false);
                onDismiss(task.id);
              }}
            />
          </div>
        )}

        <div className="flex h-[42px] w-full shrink-0 items-center justify-between border-t border-solid border-[#f2f2f2] px-3 py-[10px]">
          <p className="shrink-0 text-[12px] font-medium leading-normal text-[#c2c2c2]">
            {task.message || 'AI suggested based on your profile'}
          </p>
          <button
            type="button"
            disabled={busy}
            onClick={onAccept}
            className="flex shrink-0 items-center gap-1.5 rounded-[6px] bg-[#f9f4ff] px-[8px] py-[2px] text-[12px] font-medium leading-normal text-[#8022fe] disabled:opacity-50"
          >
            Accept Task
            <Check size={10} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="ghost-task-card relative flex h-[174px] w-full shrink-0 flex-col items-start justify-between overflow-hidden rounded-2xl"
    >
      <GhostTaskDashedBorder />
      <div className="relative z-1 flex w-full flex-col gap-2.5 p-3">
        <div className="flex w-full flex-col gap-2 opacity-40">
          <div className="flex w-full items-center gap-1">
            <span
              className={`rounded-[6px] px-[6px] py-[2px] text-[12px] font-medium uppercase leading-normal ${PRIORITY_STYLES[task.priority]}`}
            >
              {PRIORITY_LABELS[task.priority]}
            </span>
            <span className="flex items-center gap-1 rounded-[6px] bg-[#f9f4ff] px-[6px] py-[2px] text-[12px] font-medium leading-normal text-[#8022fe]">
              <Sparkles size={10} />
              AI
            </span>
          </div>
          <div className="flex w-full flex-col gap-1">
            <p className="w-full text-[16px] font-medium leading-normal text-[#181818]">
              {task.title}
            </p>
            <p className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-[12px] leading-normal text-[#a3a3a3]">
              {task.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 overflow-hidden opacity-40">
          {(task.tags || []).map((tag) => (
            <span
              key={tag.label}
              className="flex shrink-0 items-center gap-1.5 rounded-[6px] border border-[#f2f2f2] px-[6px] py-[2px] text-[12px] font-medium leading-normal text-[#5d5d5d]"
            >
              <TagIcon tag={tag} />
              {tag.label}
            </span>
          ))}
        </div>
      </div>

      <div className="relative z-1 flex h-[42px] w-full shrink-0 items-center px-3 py-[10px]">
        <GhostTaskDashedDivider />
        <p className="min-w-0 flex-1 text-[12px] font-medium leading-normal opacity-40">
          <span className="text-[#c2c2c2]">Due:</span>{' '}
          <span className="text-[#5d5d5d]">{task.due}</span>
        </p>
      </div>
    </div>
  );
}

function TaskCardMenu({ onClose, onEdit, onDelete, onBreakIntoSubtasks, onImproveDescription }) {
  return (
    <div
      className="flex w-max flex-col overflow-hidden rounded-[8px] border border-[#f2f2f2] bg-white shadow-[0px_2px_4px_0px_rgba(0,0,0,0.03)] dark:border-zinc-700 dark:bg-zinc-800"
      onMouseDown={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        onClick={onEdit}
        className="flex w-full items-center gap-[6px] border-b border-[#f2f2f2] px-[10px] py-[6px] text-left text-sm font-medium leading-normal whitespace-nowrap text-[#5d5d5d] hover:bg-[#fcfcfc] lg:text-[12px] dark:border-zinc-700 dark:text-gray-300 dark:hover:bg-zinc-700"
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
        className="flex w-full items-center gap-[6px] px-[10px] py-[6px] text-left text-sm font-medium leading-normal whitespace-nowrap text-[#8022fe] hover:bg-[#fcfcfc] lg:text-[12px] dark:hover:bg-zinc-700"
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
        className="flex w-full items-center gap-[6px] border-b border-[#f2f2f2] px-[10px] py-[6px] text-left text-sm font-medium leading-normal whitespace-nowrap text-[#8022fe] hover:bg-[#fcfcfc] lg:text-[12px] dark:border-zinc-700 dark:hover:bg-zinc-700"
      >
        <Sparkles size={10} className="shrink-0" />
        Improve description
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="flex w-full items-center gap-[6px] px-[10px] py-[6px] text-left text-sm font-medium leading-normal whitespace-nowrap text-[#5d5d5d] hover:bg-[#fcfcfc] lg:text-[12px] dark:text-gray-300 dark:hover:bg-zinc-700"
      >
        <Trash2 size={10} className="shrink-0" />
        Delete
      </button>
    </div>
  );
}

export function TaskCard({
  task,
  onEdit,
  onDelete,
  onSelect,
  onBreakIntoSubtasks,
  onImproveDescription,
  isDoneColumn = false,
  isEntering = false,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cardRef.current && !cardRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const faded = isDoneColumn;
  const showMenuTrigger = isHovered || menuOpen;

  return (
    <div
      ref={cardRef}
      role="button"
      tabIndex={0}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => {
        if (e.target.closest('button')) return;
        onSelect?.(task);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect?.(task);
        }
      }}
      className={`group relative flex w-full shrink-0 cursor-pointer flex-col rounded-2xl border border-[#f2f2f2] bg-[#fcfcfc] dark:border-zinc-700 dark:bg-zinc-800 ${
        isEntering ? 'animate-board-card-enter' : ''
      } ${
        menuOpen || isHovered
          ? 'z-10 overflow-visible shadow-[0px_2px_4px_0px_rgba(0,0,0,0.03)]'
          : 'overflow-hidden'
      }`}
    >
      <div className="flex flex-col gap-2.5 p-3">
        <div className={`flex w-full flex-col gap-2 ${faded ? 'opacity-50' : ''}`}>
          <div className="flex items-center gap-1">
            <span
              className={`rounded-[6px] px-[6px] py-[2px] text-xs font-medium uppercase lg:text-[12px] ${PRIORITY_STYLES[task.priority]}`}
            >
              {PRIORITY_LABELS[task.priority]}
            </span>
            {task.source === 'ai' && (
              <span className="flex items-center gap-1 rounded-[6px] bg-[#f9f4ff] px-[6px] py-[2px] text-xs font-medium text-[#8022fe] lg:text-[12px]">
                <Sparkles size={10} className="shrink-0" />
                AI
              </span>
            )}
          </div>
          <div className="flex w-full flex-col gap-1">
            <p
              className={`w-full text-base font-medium leading-normal lg:text-[16px] ${faded ? 'text-[#5d5d5d]' : 'text-[#181818]'} dark:text-white`}
            >
              {task.title}
            </p>
            {task.description && (
              <p
                className={`w-full overflow-hidden text-ellipsis text-sm leading-normal whitespace-nowrap lg:text-[12px] ${faded ? 'text-[#c2c2c2]' : 'text-[#a3a3a3]'}`}
              >
                {task.description}
              </p>
            )}
          </div>
        </div>

        {(task.tags?.length > 0 || task.steps) && (
          <div className={`flex flex-wrap items-center gap-1 ${faded ? 'opacity-50' : ''}`}>
            {task.tags?.map((tag) => (
              <span
                key={tag.label}
                className="flex items-center gap-[6px] rounded-[6px] border border-[#f2f2f2] px-[6px] py-[2px] text-xs font-medium leading-normal text-[#5d5d5d] lg:text-[12px] dark:border-zinc-700 dark:text-gray-300"
              >
                <TagIcon tag={tag} />
                {tag.label}
              </span>
            ))}
            {task.steps && (
              <span className="rounded-[6px] border border-[#f2f2f2] px-[6px] py-[2px] text-xs font-medium text-[#5d5d5d] lg:text-[12px] dark:border-zinc-700 dark:text-gray-300">
                {task.steps}
              </span>
            )}
          </div>
        )}

      </div>

      {/* Step 2 — ⋯ only on hover (Step 3 — stays while menu open) */}
      {showMenuTrigger && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen((o) => !o);
          }}
          aria-label="Task menu"
          aria-expanded={menuOpen}
          className={`animate-fade-in absolute right-[11px] top-[12px] z-20 rounded-[6px] p-1 text-[#a3a3a3] ${
            menuOpen ? 'bg-[#f2f2f2] dark:bg-zinc-600' : 'hover:bg-[#f2f2f2] dark:hover:bg-zinc-600'
          }`}
        >
          <MoreHorizontal size={16} />
        </button>
      )}

      {/* Step 3 — dropdown menu */}
      {menuOpen && (
        <div className="absolute right-[11px] top-[37px] z-50">
          <TaskCardMenu
            onClose={() => setMenuOpen(false)}
            onEdit={() => {
              setMenuOpen(false);
              onEdit(task);
            }}
            onDelete={() => {
              setMenuOpen(false);
              onDelete(task);
            }}
            onBreakIntoSubtasks={() => {
              setMenuOpen(false);
              onBreakIntoSubtasks?.(task);
            }}
            onImproveDescription={() => {
              setMenuOpen(false);
              onImproveDescription?.(task);
            }}
          />
        </div>
      )}

      <div className="relative z-10 flex w-full shrink-0 items-center justify-between border-t border-[#f2f2f2] bg-[#fcfcfc] px-[12px] py-[10px] dark:border-zinc-700 dark:bg-zinc-800">
        {task.completed ? (
          <p className={`text-xs font-medium leading-normal lg:text-[12px] ${faded ? 'text-[#5d5d5d]' : ''}`}>
            <span className="text-[#c2c2c2]">Completed:</span>{' '}
            <span className="text-[#5d5d5d]">{task.completed}</span>
          </p>
        ) : (
          <>
            <p className="text-xs font-medium leading-normal lg:text-[12px]">
              <span className="text-[#c2c2c2]">Due:</span>{' '}
              <span className="text-[#5d5d5d]">{task.due}</span>
            </p>
            {task.overdueDays != null && (
              <span className="flex items-center gap-[6px] rounded-[6px] bg-[rgba(220,38,38,0.05)] px-[6px] py-[2px] text-xs font-medium leading-normal text-[#dc2626] lg:text-[12px]">
                <AlertCircle size={12} className="shrink-0" />
                Overdue {task.overdueDays}d
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}
