

import { Plus, Edit2, Trash2, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import NewPlanModal from '../../planng/DailyPlan/components/NewPlanModal';

// Individual Card Component
const TaskCard = ({ card }) => (
  <div className="rounded-lg bg-[#F7F3FF] p-4 dark:bg-[#1C162B]">
    <div className="mb-3 flex items-start justify-between">
      <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-500 dark:bg-green-900 dark:text-green-300">
        {card.priority}
      </span>
      <div className="flex gap-2">
        <button className="rounded p-1 text-gray-600 dark:text-gray-300">
          <Edit2 size={16} />
        </button>
        <button className="rounded p-1 text-gray-600 dark:text-gray-300">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
    <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 md:text-lg">{card.title}</h3>
    <div className="mt-2 flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm  text-gray-600 dark:text-gray-300 ">
        <div className="h-4 w-4 rounded-full border-2 border-gray-400 dark:border-gray-500"></div>
        {card.date}
      </div>
      <button className="flex gap-2 rounded  bg-white dark:bg-zinc-700 text-gray-900 dark:text-gray-100 px-2 py-1 text-base">
        To Do <ChevronDown />
      </button>
    </div>
  </div>
);

// Column Component
const Column = ({ title, cards, colKey, onAddCard }) => (
  <div className="w-full rounded-lg bg-white dark:bg-zinc-800 p-4">
    <div className="mb-6 flex items-center justify-between">
      <h2 className="text-base font-semibold text-gray-900 dark:text-white">{title}</h2>
      {cards.length > 0 && (
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-200 text-xs font-semibold text-purple-700">
          {cards.length}
        </span>
      )}
    </div>

    <div className="space-y-4">
      {cards.map((card) => (
        <TaskCard key={card.id} card={card} />
      ))}
    </div>

    <button
      onClick={() => onAddCard(colKey)}
      className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#E0E5ED] dark:bg-zinc-600 py-3 font-semibold text-gray-600 dark:text-white transition"
    >
      <Plus size={20} />
      Add Card
    </button>
  </div>
);

export default function TasksBoard() {
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleSavePlan = (data) => {
    console.log('Saved plan:', data);
  };

  const [columns, setColumns] = useState({
    col1: [
      { id: 1, title: 'Review Goals', date: 'Sun, Dec 14', priority: 'LOW' },
      { id: 2, title: 'Review Goals', date: 'Sun, Dec 14', priority: 'LOW' },
    ],
    col2: [
      { id: 3, title: 'Review Goals', date: 'Sun, Dec 14', priority: 'LOW' },
      { id: 4, title: 'Review Goals', date: 'Sun, Dec 14', priority: 'LOW' },
      { id: 5, title: 'Review Goals', date: 'Sun, Dec 14', priority: 'LOW' },
      { id: 6, title: 'Review Goals', date: 'Sun, Dec 14', priority: 'LOW' },
    ],
    col3: [
      { id: 7, title: 'Review Goals', date: 'Sun, Dec 14', priority: 'LOW' },
      { id: 8, title: 'Review Goals', date: 'Sun, Dec 14', priority: 'LOW' },
    ],
  });

  const addCard = (colKey) => {
    const newCard = {
      id: Date.now(),
      title: 'New Task',
      date: 'Sun, Dec 14',
      priority: 'LOW',
    };
    setColumns((prev) => ({
      ...prev,
      [colKey]: [...prev[colKey], newCard],
    }));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tasks Board</h1>
        <button
          onClick={handleOpenModal}
          className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 font-semibold text-white"
        >
          <Plus size={20} />
          New Task
        </button>
      </div>

      {/* Columns */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(columns).map(([key, cards], idx) => (
          <Column
            key={key}
            title={`Column ${idx + 1}`}
            cards={cards}
            colKey={key}
            onAddCard={addCard}
          />
        ))}
      </div>

      {/* Modal */}
      <NewPlanModal open={modalOpen} onClose={handleCloseModal} onSave={handleSavePlan} />
    </div>
  );
}
