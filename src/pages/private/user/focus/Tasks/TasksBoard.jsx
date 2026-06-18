import {
  Plus,
  Search,
  Sparkles,
  MoreHorizontal,
  ChevronDown,
  ListTodo,
  Loader2,
  CheckCircle2,
  Clock,
  TrendingUp,
  Check,
  X,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import TaskFormModal from './components/TaskFormModal';

const STATUS_TO_COLUMN = { 'To Do': 'todo', 'In Progress': 'inProgress', Done: 'done' };

function formatDate(iso) {
  if (!iso) return 'No date';
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

const PRIORITY_STYLES = {
  URGENT: 'bg-[rgba(220,38,38,0.05)] text-[#dc2626]',
  HIGH: 'bg-[rgba(249,115,22,0.05)] text-[#f97316]',
  MEDIUM: 'bg-[rgba(202,138,4,0.05)] text-[#ca8a04]',
  LOW: 'bg-[rgba(34,197,94,0.05)] text-green-600',
};

const PRIORITY_LABELS = {
  URGENT: 'Urgent',
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low',
};

// AI-suggested ghost tasks — shown only when the entire board has no real tasks.
const GHOST_TASKS = [
  {
    id: 'ghost-1',
    priority: 'URGENT',
    title: 'Exercise Routine',
    description: 'Follow your fitness routine or do a workout session.',
    tags: [{ label: 'Career' }, { label: 'Improve Rate', icon: TrendingUp }, { label: '60 Min', icon: Clock }],
    steps: '0/4 Steps',
    due: 'Today',
  },
  {
    id: 'ghost-2',
    priority: 'HIGH',
    title: 'Deliver message',
    description:
      'Communicate the expectations regarding maintaining a calm environment to the relevant individuals in a direct and respectful manner.',
    tags: [{ label: 'Health' }],
    steps: '0/8 Steps',
    due: 'Today',
  },
  {
    id: 'ghost-3',
    priority: 'MEDIUM',
    title: 'Complete Work Task',
    description: 'Work on the main career task assigned for today.',
    tags: [{ label: 'Finance' }, { label: '30 Min', icon: Clock }],
    due: 'Tomorrow',
  },
];

const FILTER_OPTIONS = {
  Status: ['All Statuses', 'To Do', 'In Progress', 'Done'],
  Priority: ['All Priorities', 'Urgent', 'High', 'Medium', 'Low'],
  Category: ['All Categories', 'Career', 'Health', 'Finance', 'Personal', 'Education'],
  Source: ['All Sources', 'Created by AI', 'Created manually'],
  Date: ['All Dates', 'Today', 'Tomorrow', 'This week', 'This month', 'Overdue'],
};

function GhostTaskMenu({ onRegenerate, onDismiss }) {
  return (
    <div className="absolute right-3 top-9.5 z-20 flex flex-col overflow-hidden rounded-lg border border-[#f2f2f2] bg-white shadow-[0px_2px_4px_0px_rgba(0,0,0,0.03)] dark:border-zinc-700 dark:bg-zinc-800">
      <button
        type="button"
        onClick={onRegenerate}
        className="flex items-center gap-1.5 border-b border-[#f2f2f2] px-2.5 py-1.5 text-left text-[12px] font-medium text-[#8022fe] hover:bg-[#fcfcfc] dark:border-zinc-700 dark:hover:bg-zinc-700"
      >
        <Sparkles size={10} />
        Regenerate suggestion
      </button>
      <button
        type="button"
        onClick={onDismiss}
        className="flex w-full items-center gap-1.5 px-2.5 py-1.5 text-left text-[12px] font-medium text-[#5d5d5d] hover:bg-[#fcfcfc] dark:text-gray-300 dark:hover:bg-zinc-700"
      >
        <X size={10} />
        Dismiss
      </button>
    </div>
  );
}

function GhostTaskCard({ task, onDismiss, onRegenerate }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cardRef.current && !cardRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = menuOpen;

  return (
    <div
      ref={cardRef}
      className={`group relative flex h-43.5 w-full flex-col items-start justify-between overflow-hidden rounded-2xl border bg-white transition-all dark:bg-zinc-800 ${
        isActive
          ? 'border-solid border-[#f2f2f2] bg-[#fcfcfc] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.03)] dark:bg-zinc-700'
          : 'border-dashed border-[#e9e9e9] hover:border-solid hover:border-[#f2f2f2] hover:bg-[#fcfcfc] hover:shadow-[0px_2px_4px_0px_rgba(0,0,0,0.03)] dark:hover:bg-zinc-700'
      }`}
    >
      <div className="relative flex w-full flex-col items-start gap-2.5 p-3">
        <div
          className={`flex w-full flex-col items-start gap-2 transition-opacity ${isActive ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'}`}
        >
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-1">
              <span
                className={`rounded-md px-1.5 py-0.5 text-[12px] font-medium uppercase ${PRIORITY_STYLES[task.priority]}`}
              >
                {PRIORITY_LABELS[task.priority]}
              </span>
              <span className="flex items-center gap-1 rounded-md bg-[#f9f4ff] px-1.5 py-0.5 text-[12px] font-medium text-[#8022fe]">
                <Sparkles size={10} />
                AI
              </span>
            </div>
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Ghost task menu"
              aria-expanded={menuOpen}
              className={`rounded-md p-1 text-[#a3a3a3] transition-opacity ${
                menuOpen
                  ? 'bg-[#f2f2f2] opacity-100 dark:bg-zinc-600'
                  : 'opacity-0 group-hover:opacity-100'
              }`}
            >
              <MoreHorizontal size={14} />
            </button>
          </div>
          <div className="flex w-full flex-col items-start gap-1">
            <p className="w-full text-[16px] font-medium text-[#181818] dark:text-white">{task.title}</p>
            <p className="w-full overflow-hidden text-ellipsis text-[12px] whitespace-nowrap text-[#a3a3a3]">
              {task.description}
            </p>
          </div>
        </div>
        <div
          className={`flex items-center gap-1 transition-opacity ${isActive ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'}`}
        >
          {task.tags.map((tag) => (
            <span
              key={tag.label}
              className="flex items-center gap-1.5 rounded-md border border-[#f2f2f2] px-1.5 py-0.5 text-[12px] font-medium text-[#5d5d5d] dark:border-zinc-700 dark:text-gray-300"
            >
              {tag.icon && <tag.icon size={12} />}
              {tag.label}
            </span>
          ))}
          {task.steps && (
            <span className="rounded-md border border-[#f2f2f2] px-1.5 py-0.5 text-[12px] font-medium text-[#5d5d5d] dark:border-zinc-700 dark:text-gray-300">
              {task.steps}
            </span>
          )}
        </div>

        {menuOpen && (
          <GhostTaskMenu
            onRegenerate={() => {
              setMenuOpen(false);
              onRegenerate(task.id);
            }}
            onDismiss={() => {
              setMenuOpen(false);
              onDismiss(task.id);
            }}
          />
        )}
      </div>

      {/* Footer: due date fades out on hover, Accept footer fades in */}
      <div className="relative h-10.5 w-full shrink-0 border-t border-[#f2f2f2] dark:border-zinc-700">
        <div
          className={`absolute inset-0 flex items-center justify-center border-t border-dashed border-[#e9e9e9] px-3 py-2.5 transition-opacity duration-200 ${
            isActive ? 'pointer-events-none opacity-0' : 'opacity-40 group-hover:opacity-0'
          }`}
        >
          <p className="text-[12px]">
            <span className="text-[#c2c2c2]">Due:</span> <span className="text-[#5d5d5d]">{task.due}</span>
          </p>
        </div>
        <div
          className={`absolute inset-0 flex items-center justify-between px-3 py-2.5 transition-opacity duration-200 ${
            isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
        >
          <p className="text-[12px] font-medium text-[#c2c2c2] dark:text-gray-400">
            AI suggested based on your profile
          </p>
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-md bg-[#f9f4ff] px-2 py-0.5 text-[12px] font-medium text-[#8022fe]"
          >
            Accept
            <Check size={10} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}

// Three groups: 1) Edit  2) Break into subtasks, Improve description (✦ AI actions)  3) Delete.
function TaskCardMenu({ onClose, onEdit }) {
  return (
    <div className="absolute right-0 top-6 z-20 w-44 rounded-lg border border-[#f2f2f2] bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
      <button
        type="button"
        onClick={onEdit}
        className="flex w-full items-center px-3 py-2 text-left text-[12px] font-medium text-[#5d5d5d] hover:bg-[#fcfcfc] dark:text-gray-300 dark:hover:bg-zinc-700"
      >
        Edit
      </button>
      <div className="border-t border-[#f2f2f2] dark:border-zinc-700" />
      <button
        type="button"
        onClick={onClose}
        className="flex w-full items-center gap-1.5 px-3 py-2 text-left text-[12px] font-medium text-[#8022fe] hover:bg-[#fcfcfc] dark:hover:bg-zinc-700"
      >
        <Sparkles size={12} />
        Break into subtasks
      </button>
      <button
        type="button"
        onClick={onClose}
        className="flex w-full items-center gap-1.5 px-3 py-2 text-left text-[12px] font-medium text-[#8022fe] hover:bg-[#fcfcfc] dark:hover:bg-zinc-700"
      >
        <Sparkles size={12} />
        Improve description
      </button>
      <div className="border-t border-[#f2f2f2] dark:border-zinc-700" />
      <button
        type="button"
        onClick={onClose}
        className="flex w-full items-center px-3 py-2 text-left text-[12px] font-medium text-[#5d5d5d] hover:bg-[#fcfcfc] dark:text-gray-300 dark:hover:bg-zinc-700"
      >
        Delete
      </button>
    </div>
  );
}

function TaskCard({ task, onEdit }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cardRef.current && !cardRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      ref={cardRef}
      className="group relative flex w-full flex-col items-start gap-2.5 rounded-2xl border border-[#f2f2f2] bg-white p-3 dark:border-zinc-700 dark:bg-zinc-800"
    >
      <div className="flex w-full items-center justify-between">
        <span
          className={`rounded-md px-1.5 py-0.5 text-[12px] font-medium uppercase ${PRIORITY_STYLES[task.priority]}`}
        >
          {task.priority}
        </span>
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Task menu"
          className={`text-[#a3a3a3] transition-opacity ${menuOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
        >
          <MoreHorizontal size={14} />
        </button>
        {menuOpen && (
          <TaskCardMenu
            onClose={() => setMenuOpen(false)}
            onEdit={() => {
              setMenuOpen(false);
              onEdit(task);
            }}
          />
        )}
      </div>

      <div className="flex w-full flex-col items-start gap-1">
        <p className="w-full text-[16px] font-medium text-[#181818] dark:text-white">{task.title}</p>
        {task.description && (
          <p className="w-full overflow-hidden text-ellipsis text-[12px] whitespace-nowrap text-[#a3a3a3]">
            {task.description}
          </p>
        )}
      </div>

      {task.tags?.length > 0 && (
        <div className="flex flex-wrap items-center gap-1">
          {task.tags.map((tag) => (
            <span
              key={tag.label}
              className="flex items-center gap-1.5 rounded-md border border-[#f2f2f2] px-1.5 py-0.5 text-[12px] font-medium text-[#5d5d5d] dark:border-zinc-700 dark:text-gray-300"
            >
              {tag.icon && <tag.icon size={12} />}
              {tag.label}
            </span>
          ))}
          {task.steps && (
            <span className="rounded-md border border-[#f2f2f2] px-1.5 py-0.5 text-[12px] font-medium text-[#5d5d5d] dark:border-zinc-700 dark:text-gray-300">
              {task.steps}
            </span>
          )}
        </div>
      )}

      <div className="flex h-10.5 w-full items-center justify-center border-t border-[#f2f2f2] px-3 py-2.5 dark:border-zinc-700">
        {task.overdue ? (
          <p className="text-[12px] font-medium text-[#dc2626]">
            Overdue{task.overdueDays ? ` ${task.overdueDays}d` : ''}
          </p>
        ) : (
          <p className="text-[12px]">
            <span className="text-[#c2c2c2]">Due:</span> <span className="text-[#5d5d5d]">{task.due}</span>
          </p>
        )}
      </div>
    </div>
  );
}

function FilterDropdown({ options }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(options[0]);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-30 items-center justify-between rounded-lg border border-[#f2f2f2] px-3 py-1.75 text-[12px] font-medium text-[#181818] dark:border-zinc-700 dark:text-white"
      >
        <span className="truncate">{selected}</span>
        <ChevronDown size={10} className="shrink-0 text-[#a3a3a3]" />
      </button>

      {open && (
        <div className="absolute left-0 top-8 z-20 w-40 rounded-lg border border-[#f2f2f2] bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                setSelected(opt);
                setOpen(false);
              }}
              className={`flex w-full items-center px-3 py-2 text-left text-[12px] font-medium ${
                opt === selected
                  ? 'bg-[#f9f4ff] text-[#8022fe]'
                  : 'text-[#5d5d5d] hover:bg-[#fcfcfc] dark:text-gray-300 dark:hover:bg-zinc-700'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyColumnPlaceholder({ text }) {
  return (
    <div className="flex w-full items-center justify-center pt-2.5">
      <p className="flex-1 text-center text-[12px] font-medium text-[#c2c2c2] dark:text-gray-500">{text}</p>
    </div>
  );
}

const COLUMNS = [
  { key: 'todo', label: 'To Do', icon: ListTodo },
  { key: 'inProgress', label: 'In Progress', icon: Loader2 },
  { key: 'done', label: 'Done', icon: CheckCircle2 },
];

export default function TasksBoard() {
  const [columns, setColumns] = useState({ todo: [], inProgress: [], done: [] });
  const [ghostTasks, setGhostTasks] = useState(GHOST_TASKS);
  const [taskModal, setTaskModal] = useState({ open: false, mode: 'create', task: null });

  const openNewTaskModal = () => setTaskModal({ open: true, mode: 'create', task: null });
  const openEditTaskModal = (task) => setTaskModal({ open: true, mode: 'edit', task });
  const closeTaskModal = () => setTaskModal((prev) => ({ ...prev, open: false }));

  const handleDismissGhost = (id) => {
    setGhostTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleRegenerateGhost = () => {
    // Visual-only for Step 2 — AI regeneration wired in a later step.
  };

  const boardIsEmpty =
    columns.todo.length === 0 && columns.inProgress.length === 0 && columns.done.length === 0;

  const showGhostCards = boardIsEmpty && ghostTasks.length > 0;

  const handleSubmitTask = (form) => {
    const columnKey = STATUS_TO_COLUMN[form.status] || 'todo';
    const taskData = {
      id: taskModal.mode === 'edit' ? taskModal.task.id : Date.now(),
      priority: form.priority.toUpperCase(),
      title: form.title || 'Untitled Task',
      description: form.description,
      tags: [{ label: form.category }],
      due: formatDate(form.dueDate),
    };

    setColumns((prev) => {
      const next = { todo: [...prev.todo], inProgress: [...prev.inProgress], done: [...prev.done] };
      if (taskModal.mode === 'edit') {
        for (const key of Object.keys(next)) {
          next[key] = next[key].filter((t) => t.id !== taskData.id);
        }
      }
      next[columnKey] = [...next[columnKey], taskData];
      return next;
    });
  };

  return (
    <div className="p-7.5">
      {/* Header */}
      <div className="mb-5 flex w-full items-start justify-between">
        <div className="flex flex-col items-start gap-2">
          <p className="text-[20px] font-medium text-[#181818] dark:text-white">Tasks Board</p>
          <p className="text-[12px] font-medium text-[#c2c2c2] dark:text-gray-400">
            Plan, prioritize, and complete your tasks in one place...
          </p>
        </div>
        <div className="flex w-62.5 items-center gap-2 rounded-lg border border-[#f2f2f2] px-3 py-1.75 dark:border-zinc-700">
          <Search size={12} className="shrink-0 text-[#c2c2c2]" />
          <p className="text-[12px] font-medium text-[#c2c2c2]">Search tasks in board...</p>
        </div>
      </div>

      {/* Action row */}
      <div className="mb-5 flex w-full items-center justify-between">
        <button
          onClick={openNewTaskModal}
          className="flex items-center gap-2 rounded-lg bg-[#8022fe] px-3 py-2 text-[12px] font-semibold text-white"
        >
          <Plus size={10} />
          New Task
        </button>

        <div className="flex items-center gap-2.5">
            {Object.entries(FILTER_OPTIONS).map(([label, options]) => (
              <FilterDropdown key={label} options={options} />
            ))}
        </div>
      </div>

      {/* Columns */}
      <div className="flex h-167.75 items-stretch gap-4">
        {COLUMNS.map((column) => {
          const Icon = column.icon;
          const { key, label } = column;
          const cards = columns[key];
          const isTodo = key === 'todo';
          return (
            <div
              key={key}
              className="flex h-full flex-1 flex-col items-start gap-2.5 overflow-y-auto rounded-2xl border border-[#f2f2f2] bg-white p-3 dark:border-zinc-700 dark:bg-zinc-800"
            >
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon size={12} className="text-[#5d5d5d] dark:text-gray-300" />
                  <p className="text-[14px] font-medium text-[#5d5d5d] dark:text-gray-300">{label}</p>
                </div>
                {isTodo && showGhostCards ? (
                  <span className="flex items-center gap-1 rounded-md bg-[#f9f4ff] px-1.5 py-0.5 text-[12px] font-medium text-[#8022fe]">
                    <Sparkles size={10} />
                    {ghostTasks.length} AI Suggestions
                  </span>
                ) : (
                  <span className="flex w-5.5 items-center justify-center rounded-md bg-[#f2f2f2] px-1.5 py-0.5 text-[12px] font-medium text-[#5d5d5d] dark:bg-zinc-700 dark:text-gray-300">
                    {cards.length}
                  </span>
                )}
              </div>

              {isTodo && showGhostCards
                ? ghostTasks.map((task) => (
                    <GhostTaskCard
                      key={task.id}
                      task={task}
                      onDismiss={handleDismissGhost}
                      onRegenerate={handleRegenerateGhost}
                    />
                  ))
                : cards.length === 0 && !isTodo
                  ? (
                    <EmptyColumnPlaceholder
                      text={key === 'inProgress' ? 'No tasks in progress' : 'Completed tasks will appear here'}
                    />
                  )
                  : cards.length > 0
                  ? cards.map((task) => (
                      <TaskCard key={task.id} task={task} onEdit={openEditTaskModal} />
                    ))
                  : null}
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {taskModal.open && (
        <TaskFormModal
          key={taskModal.task?.id ?? 'new'}
          mode={taskModal.mode}
          initialTask={taskModal.task}
          onClose={closeTaskModal}
          onSubmit={handleSubmitTask}
        />
      )}
    </div>
  );
}
