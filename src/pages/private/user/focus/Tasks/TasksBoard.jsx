import {
  Plus,
  Search,
  Sparkles,
  MoreHorizontal,
  ChevronRight,
  ChevronDown,
  ListTodo,
  Loader2,
  CheckCircle2,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { useState } from 'react';
import NewPlanModal from '../../planng/DailyPlan/components/NewPlanModal';

const PRIORITY_STYLES = {
  URGENT: 'bg-[rgba(220,38,38,0.05)] text-[#dc2626]',
  HIGH: 'bg-[rgba(249,115,22,0.05)] text-[#f97316]',
  MEDIUM: 'bg-[rgba(202,138,4,0.05)] text-[#ca8a04]',
  LOW: 'bg-[rgba(34,197,94,0.05)] text-green-600',
};

// AI-suggested ghost tasks shown only when the To Do column has no real tasks yet.
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

const FILTERS = ['All Status', 'All Priority', 'All Category', 'All Source', 'All Date'];

function GhostTaskCard({ task }) {
  return (
    <div
      className="group flex h-43.5 w-full flex-col items-start justify-between overflow-hidden rounded-2xl border border-dashed border-[#e9e9e9] bg-white transition-all hover:border-solid hover:border-gray-100 hover:bg-gray-50 hover:shadow-[0px_2px_4px_0px_rgba(0,0,0,0.03)] dark:bg-zinc-800 dark:hover:bg-zinc-700"
    >
      <div className="flex w-full flex-col items-start gap-2.5 p-3">
        <div className="flex w-full flex-col items-start gap-2 opacity-40 group-hover:opacity-100">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-1">
              <span
                className={`rounded-md px-1.5 py-0.5 text-[12px] font-medium uppercase ${PRIORITY_STYLES[task.priority]}`}
              >
                {task.priority}
              </span>
              <span className="flex items-center gap-1 rounded-md bg-[#f9f4ff] px-1.5 py-0.5 text-[12px] font-medium text-[#8022fe]">
                <Sparkles size={10} />
                AI
              </span>
            </div>
            <MoreHorizontal size={14} className="text-gray-300" />
          </div>
          <div className="flex w-full flex-col items-start gap-1">
            <p className="w-full text-[16px] font-medium text-[#181818]">{task.title}</p>
            <p className="w-full overflow-hidden text-ellipsis text-[12px] whitespace-nowrap text-gray-300">
              {task.description}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 opacity-40 group-hover:opacity-100">
          {task.tags.map((tag) => (
            <span
              key={tag.label}
              className="flex items-center gap-1.5 rounded-md border border-gray-100 px-1.5 py-0.5 text-[12px] font-medium text-gray-400 dark:border-zinc-700 dark:text-gray-300"
            >
              {tag.icon && <tag.icon size={12} />}
              {tag.label}
            </span>
          ))}
          {task.steps && (
            <span className="rounded-md border border-gray-100 px-1.5 py-0.5 text-[12px] font-medium text-gray-400 dark:border-zinc-700 dark:text-gray-300">
              {task.steps}
            </span>
          )}
        </div>
      </div>

      {/* Default footer: due date */}
      <div className="flex h-10.5 w-full items-center justify-center border-t border-dashed border-[#e9e9e9] px-3 py-2.5 opacity-40 group-hover:hidden">
        <p className="text-[12px]">
          <span className="text-gray-200">Due:</span> <span className="text-gray-400">{task.due}</span>
        </p>
      </div>

      {/* Hover footer: AI suggestion + Accept */}
      <div className="hidden h-10.5 w-full items-center justify-between border-t border-gray-100 px-3 py-2.5 group-hover:flex dark:border-zinc-700">
        <p className="text-[12px] font-medium text-gray-200 dark:text-gray-400">
          AI suggested based on your profile
        </p>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-md bg-[#f9f4ff] px-2 py-0.5 text-[12px] font-medium text-[#8022fe]"
        >
          Accept Task
          <ChevronRight size={10} />
        </button>
      </div>
    </div>
  );
}

function EmptyColumnPlaceholder({ text }) {
  return (
    <div className="flex w-full items-center justify-center pt-2.5">
      <p className="flex-1 text-center text-[12px] font-medium text-gray-200 dark:text-gray-500">{text}</p>
    </div>
  );
}

const COLUMNS = [
  { key: 'todo', label: 'To Do', icon: ListTodo },
  { key: 'inProgress', label: 'In Progress', icon: Loader2 },
  { key: 'done', label: 'Done', icon: CheckCircle2 },
];

export default function TasksBoard() {
  const [modalOpen, setModalOpen] = useState(false);

  // Real task data per column. Empty for now — only ghost (AI-suggested) cards render in To Do.
  const [columns] = useState({ todo: [], inProgress: [], done: [] });

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);
  const handleSavePlan = (data) => {
    console.log('Saved plan:', data);
  };

  return (
    <div className="p-7.5">
      {/* Header */}
      <div className="mb-5 flex w-full items-start justify-between">
        <div className="flex flex-col items-start gap-2">
          <p className="text-[20px] font-medium text-[#181818] dark:text-white">Tasks Board</p>
          <p className="text-[12px] font-medium text-gray-200 dark:text-gray-400">
            Plan, prioritize, and complete your tasks in one place...
          </p>
        </div>
        <div className="flex w-62.5 items-center gap-2 rounded-lg border border-gray-100 px-3 py-1.75 dark:border-zinc-700">
          <Search size={12} className="shrink-0 text-gray-200" />
          <p className="text-[12px] font-medium text-gray-200">Search tasks in board...</p>
        </div>
      </div>

      {/* Action row */}
      <div className="mb-5 flex w-full items-center justify-between">
        <button
          onClick={handleOpenModal}
          className="flex items-center gap-2 rounded-lg bg-[#8022fe] px-3 py-2 text-[12px] font-semibold text-white"
        >
          <Plus size={10} />
          New Task
        </button>

        <div className="flex items-center gap-5">
          <div className="flex items-center gap-1 rounded-lg border border-gray-100 p-1 dark:border-zinc-700">
            <span className="rounded bg-gray-100 px-2 py-0.75 text-[12px] font-medium text-[#181818] dark:bg-zinc-700 dark:text-white">
              Board
            </span>
            <span className="flex w-12.5 items-center justify-center px-2 py-0.75 text-[12px] font-medium text-gray-200">
              List
            </span>
          </div>
          <div className="h-4 w-px bg-gray-100 dark:bg-zinc-700" />
          <div className="flex items-center gap-2.5">
            {FILTERS.map((label) => (
              <button
                key={label}
                type="button"
                className="flex w-30 items-center justify-between rounded-lg border border-gray-100 px-3 py-1.75 text-[12px] font-medium text-[#181818] dark:border-zinc-700 dark:text-white"
              >
                {label}
                <ChevronDown size={10} className="text-gray-300" />
              </button>
            ))}
          </div>
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
              className="flex h-full flex-1 flex-col items-start gap-2.5 overflow-y-auto rounded-2xl border border-gray-100 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-800"
            >
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon size={12} className="text-gray-400 dark:text-gray-300" />
                  <p className="text-[14px] font-medium text-gray-400 dark:text-gray-300">{label}</p>
                </div>
                {isTodo && cards.length === 0 ? (
                  <span className="flex items-center gap-1 rounded-md bg-[#f9f4ff] px-1.5 py-0.5 text-[12px] font-medium text-[#8022fe]">
                    <Sparkles size={10} />
                    3 AI Suggestions
                  </span>
                ) : (
                  <span className="flex w-5.5 items-center justify-center rounded-md bg-gray-100 px-1.5 py-0.5 text-[12px] font-medium text-gray-400 dark:bg-zinc-700 dark:text-gray-300">
                    {cards.length}
                  </span>
                )}
              </div>

              {isTodo && cards.length === 0 ? (
                GHOST_TASKS.map((task) => <GhostTaskCard key={task.id} task={task} />)
              ) : cards.length === 0 ? (
                <EmptyColumnPlaceholder
                  text={key === 'inProgress' ? 'No tasks in progress' : 'Completed tasks will appear here'}
                />
              ) : null}
            </div>
          );
        })}
      </div>

      {/* Modal */}
      <NewPlanModal open={modalOpen} onClose={handleCloseModal} onSave={handleSavePlan} />
    </div>
  );
}
