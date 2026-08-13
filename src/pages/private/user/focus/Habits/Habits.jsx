import {
  Plus,
  Search,
  Sparkles,
  RotateCw,
  Flame,
  X,
} from 'lucide-react';
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import NewHabitsModal from './components/NewHabitsModal';
import HabitRow from './components/HabitRow';
import GhostHabitRow from './components/GhostHabitRow';
import DeleteConfirmModal from '../../../../../components/ui/DeleteConfirmModal';
import {
  FILTER_CONFIG,
  DEFAULT_FILTERS,
  FilterDropdown,
} from './components/HabitFilters';
import TypewriterText from '../../../../../components/ui/TypewriterText';
import {
  completeHabitToday,
  createHabit,
  deleteHabit,
  fetchHabits,
  fetchHabitsStatsOverview,
  fetchHabitsSummary,
  improveHabit,
  markHabitCompleted,
  selectHabits,
  selectHabitsBoardStats,
  selectHabitsLoading,
  undoHabitCompletion,
  updateHabit,
  updateHabitStatus,
} from '../../../../../features/habits/habitsSlice';
import {
  getTodayIndex,
  habitMatchesClientFilters,
  isUuid,
  mapOnboardingHabitSuggestion,
} from '../../../../../features/habits/habitsMappers';
import {
  acceptOnboardingSuggestionApi,
  dismissOnboardingSuggestionApi,
  fetchOnboardingHabitSuggestionsApi,
  regenerateOnboardingSuggestionApi,
} from '../../../../../features/habits/habitsAPI';

const HABITS_SUBTITLE_PHRASES = [
  'Build daily habits and keep your streaks alive...',
  'Let AI suggest habits based on your goals...',
  'Stay consistent, one check-in at a time...',
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const TODAY_INDEX = getTodayIndex();

function resolveForceEmptyBoard() {
  return import.meta.env.DEV && new URLSearchParams(window.location.search).get('empty') === '1';
}

function clearForceEmptyQuery() {
  const url = new URL(window.location.href);
  if (url.searchParams.get('empty') !== '1') return;
  url.searchParams.delete('empty');
  const search = url.searchParams.toString();
  window.history.replaceState({}, '', `${url.pathname}${search ? `?${search}` : ''}${url.hash}`);
}

function suggestionErrorMessage(error, fallback) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
}

function habitMatchesSearch(habit, query) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [
    habit.title,
    habit.description,
    ...(habit.tags || []).map((t) => t.label),
  ]
    .join(' ')
    .toLowerCase();
  return haystack.includes(q);
}

function ImproveHabitModal({ open, habit, onClose, onSubmit, submitting }) {
  const [instructions, setInstructions] = useState('');

  if (!open || !habit) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex w-full max-w-[450px] flex-col overflow-hidden rounded-2xl border border-[#f2f2f2] bg-[#fcfcfc] dark:border-zinc-700 dark:bg-zinc-900">
        <div className="flex items-center justify-between border-b border-[#f2f2f2] px-3 py-2.5 dark:border-zinc-700">
          <p className="text-[12px] font-medium text-[#5d5d5d] dark:text-gray-300">Improve habit</p>
          <button type="button" onClick={onClose} className="text-[#5d5d5d] dark:text-gray-300">
            <X size={14} />
          </button>
        </div>
        <div className="flex flex-col gap-4 p-3">
          <p className="text-[12px] font-medium text-[#181818] dark:text-white">{habit.title}</p>
          <textarea
            rows={4}
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="e.g. Make it easier to follow every weekday morning"
            className="w-full resize-none rounded-xl border border-[#f2f2f2] bg-white px-3 py-2 text-[12px] text-[#181818] outline-none focus:border-[#8022fe] dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
          />
          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="flex flex-1 items-center justify-center rounded-lg bg-[#f2f2f2] px-3 py-2 text-[12px] font-medium text-[#5d5d5d] dark:bg-zinc-700 dark:text-gray-300"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!instructions.trim() || submitting}
              onClick={() => onSubmit(instructions.trim())}
              className={`flex flex-1 items-center justify-center rounded-lg px-3 py-2 text-[12px] font-semibold ${
                instructions.trim() && !submitting
                  ? 'bg-[#8022fe] text-white'
                  : 'cursor-not-allowed bg-[#f1f1f1] text-[#dedede]'
              }`}
            >
              {submitting ? 'Improving...' : 'Improve'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Habits() {
  const dispatch = useDispatch();
  const habits = useSelector(selectHabits);
  const boardStats = useSelector(selectHabitsBoardStats);
  const loadingList = useSelector(selectHabitsLoading);

  const [habitModal, setHabitModal] = useState({
    open: false,
    mode: 'create',
    habit: null,
  });
  const [improveModal, setImproveModal] = useState({ open: false, habit: null });
  const [improveSubmitting, setImproveSubmitting] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, habit: null });
  const [deletingHabit, setDeletingHabit] = useState(false);
  const [ghostHabits, setGhostHabits] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(() =>
    resolveForceEmptyBoard(),
  );
  const [busySuggestionId, setBusySuggestionId] = useState(null);
  const wasBoardEmpty = useRef(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState(DEFAULT_FILTERS);

  const forceEmpty = resolveForceEmptyBoard();

  const loadHabits = useCallback(() => {
    if (forceEmpty) return Promise.resolve();
    return dispatch(
      fetchHabits({
        filters: activeFilters,
        search: searchQuery,
        page: 1,
        limit: 50,
      })
    );
  }, [dispatch, activeFilters, searchQuery, forceEmpty]);

  const loadSuggestions = useCallback(async () => {
    setLoadingSuggestions(true);
    try {
      const list = await fetchOnboardingHabitSuggestionsApi();
      setGhostHabits(list.map(mapOnboardingHabitSuggestion).filter(Boolean));
    } catch (error) {
      setGhostHabits([]);
      toast.error(suggestionErrorMessage(error, 'Could not load AI suggestions.'));
    } finally {
      setLoadingSuggestions(false);
    }
  }, []);

  useEffect(() => {
    if (forceEmpty) return undefined;
    const delay = searchQuery.trim() ? 300 : 0;
    const timer = setTimeout(() => {
      loadHabits();
      dispatch(fetchHabitsSummary());
      dispatch(fetchHabitsStatsOverview());
    }, delay);
    return () => clearTimeout(timer);
  }, [loadHabits, searchQuery, dispatch, forceEmpty]);

  useEffect(() => {
    const empty = forceEmpty || (!loadingList && habits.length === 0);
    if (empty && !wasBoardEmpty.current) {
      loadSuggestions();
    }
    wasBoardEmpty.current = empty;
  }, [forceEmpty, loadingList, habits.length, loadSuggestions]);

  const updateFilter = (key, value) => setActiveFilters((prev) => ({ ...prev, [key]: value }));

  const handleOpenModal = () => setHabitModal({ open: true, mode: 'create', habit: null });
  const handleCloseModal = () => setHabitModal({ open: false, mode: 'create', habit: null });

  const handleSaveHabit = async (data) => {
    if (!data?.title && !data?.alreadyPersisted) return;
    if (data.alreadyPersisted) {
      await loadHabits();
      await dispatch(fetchHabitsSummary());
      return;
    }
    if (habitModal.mode === 'edit' && habitModal.habit?.id) {
      await dispatch(updateHabit({ habitId: habitModal.habit.id, formData: data }));
    } else {
      await dispatch(createHabit(data));
    }
    await loadHabits();
    await dispatch(fetchHabitsSummary());
  };

  const handleAcceptGhost = async (ghost) => {
    const suggestionId = ghost?.suggestionId || ghost?.id;
    if (!suggestionId || busySuggestionId || !isUuid(suggestionId)) return;
    setBusySuggestionId(suggestionId);
    try {
      await acceptOnboardingSuggestionApi(suggestionId);
      setGhostHabits((prev) => prev.filter((h) => String(h.id) !== String(suggestionId)));
      clearForceEmptyQuery();
      await dispatch(
        fetchHabits({
          filters: activeFilters,
          search: searchQuery,
          page: 1,
          limit: 50,
        }),
      );
      await dispatch(fetchHabitsSummary());
    } catch (error) {
      toast.error(suggestionErrorMessage(error, 'Could not accept suggestion.'));
    } finally {
      setBusySuggestionId(null);
    }
  };

  const handleToggleDay = async (habitId, dayIndex) => {
    if (dayIndex !== TODAY_INDEX) return;
    const habit = habits.find((h) => h.id === habitId);
    if (!habit || habit.status === 'completed' || habit.status === 'paused') return;
    const current = habit.days?.[dayIndex];
    if (current === 'unscheduled') return;

    if (current === 'checked') {
      await dispatch(undoHabitCompletion(habitId));
    } else {
      await dispatch(completeHabitToday({ habitId }));
    }
    await loadHabits();
    await dispatch(fetchHabitsSummary());
  };

  const boardHabits = useMemo(() => (forceEmpty ? [] : habits), [forceEmpty, habits]);
  const boardIsEmpty = boardHabits.length === 0;

  const filteredGhostHabits = useMemo(
    () =>
      ghostHabits.filter(
        (h) => habitMatchesSearch(h, searchQuery) && habitMatchesClientFilters(h, activeFilters)
      ),
    [ghostHabits, searchQuery, activeFilters]
  );

  const filteredHabits = useMemo(
    () =>
      boardHabits.filter(
        (h) => habitMatchesSearch(h, searchQuery) && habitMatchesClientFilters(h, activeFilters)
      ),
    [boardHabits, searchQuery, activeFilters]
  );

  const activeCount = boardStats.active;
  const pausedCount = boardStats.paused;
  const completedCount = boardStats.completed;

  const handleDismissGhost = async (id) => {
    if (!id || busySuggestionId || !isUuid(id)) return;
    setBusySuggestionId(id);
    try {
      await dismissOnboardingSuggestionApi(id);
      setGhostHabits((prev) => prev.filter((h) => String(h.id) !== String(id)));
    } catch (error) {
      toast.error(suggestionErrorMessage(error, 'Could not dismiss suggestion.'));
    } finally {
      setBusySuggestionId(null);
    }
  };

  const handleRegenerateGhost = async (id) => {
    if (!id || busySuggestionId || !isUuid(id)) return;
    setBusySuggestionId(id);
    try {
      const data = await regenerateOnboardingSuggestionApi(id);
      const next =
        mapOnboardingHabitSuggestion(data) ||
        mapOnboardingHabitSuggestion(data?.suggestions?.[0]);
      if (next) {
        setGhostHabits((prev) =>
          prev.map((h) => (String(h.id) === String(id) ? next : h)),
        );
      }
    } catch (error) {
      toast.error(suggestionErrorMessage(error, 'Could not regenerate suggestion.'));
    } finally {
      setBusySuggestionId(null);
    }
  };

  const handleEditHabit = (habit) => {
    setHabitModal({ open: true, mode: 'edit', habit });
  };

  const handleImproveHabit = (habit) => {
    setImproveModal({ open: true, habit });
  };

  const handleImproveSubmit = async (instructions) => {
    if (!improveModal.habit?.id) return;
    setImproveSubmitting(true);
    try {
      const result = await dispatch(
        improveHabit({ habitId: improveModal.habit.id, instructions })
      );
      if (improveHabit.fulfilled.match(result)) {
        setImproveModal({ open: false, habit: null });
        await loadHabits();
      }
    } finally {
      setImproveSubmitting(false);
    }
  };

  const handleCompleteHabit = async (habit) => {
    if (!habit?.id || habit.status === 'completed') return;
    await dispatch(markHabitCompleted(habit.id));
    await loadHabits();
    await dispatch(fetchHabitsSummary());
  };

  const handlePauseHabit = async (habit) => {
    const nextStatus = habit.status === 'paused' ? 'active' : 'paused';
    await dispatch(updateHabitStatus({ habitId: habit.id, status: nextStatus }));
    await loadHabits();
    await dispatch(fetchHabitsSummary());
  };

  const handleRequestDeleteHabit = (habit) => {
    if (!habit?.id) return;
    setDeleteModal({ open: true, habit });
  };

  const handleCloseDeleteModal = () => {
    if (deletingHabit) return;
    setDeleteModal({ open: false, habit: null });
  };

  const handleConfirmDeleteHabit = async () => {
    const id = deleteModal.habit?.id;
    if (!id) return;
    setDeletingHabit(true);
    try {
      await dispatch(deleteHabit(id)).unwrap();
      setDeleteModal({ open: false, habit: null });
      await dispatch(fetchHabitsSummary());
    } catch {
      /* toast from slice */
    } finally {
      setDeletingHabit(false);
    }
  };

  return (
    <div className="relative flex min-h-full flex-col py-7.5 max-lg:min-h-0 max-lg:py-4 max-lg:sm:py-6">
      <div className="mb-5 flex w-full items-start justify-between max-lg:mb-4 max-lg:flex-col max-lg:gap-4">
        <div className="flex flex-col items-start gap-2">
          <p className="text-[20px] font-medium text-[#181818] dark:text-white">Habits Board</p>
          <TypewriterText
            phrases={HABITS_SUBTITLE_PHRASES}
            className="text-[12px] font-medium text-[#c2c2c2] dark:text-gray-400 max-lg:text-sm"
          />
        </div>
        <label className="flex w-62.5 items-center gap-2 rounded-lg border border-[#f2f2f2] bg-white px-3 py-1.75 focus-within:border-[#e9e9e9] dark:border-zinc-700 dark:bg-zinc-800 dark:focus-within:border-zinc-600 max-lg:w-full max-lg:py-2">
          <Search size={14} className="shrink-0 text-[#c2c2c2]" aria-hidden />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search habits in board..."
            aria-label="Search habits in board"
            className="w-full bg-transparent text-[12px] font-medium text-[#181818] outline-none placeholder:text-[#c2c2c2] dark:text-white max-lg:text-base"
          />
        </label>
      </div>

      <div className="mb-5 flex w-full items-center justify-between max-lg:mb-4 max-lg:flex-col max-lg:items-stretch max-lg:gap-4">
        <button
          type="button"
          onClick={handleOpenModal}
          className="flex items-center gap-2 rounded-lg bg-[#8022fe] px-3 py-2 text-[12px] font-semibold text-white max-lg:w-full max-lg:justify-center max-lg:py-2.5 max-lg:text-base"
        >
          <Plus size={14} strokeWidth={2.5} className="shrink-0 text-white" />
          New Habit
        </button>

        <div className="flex items-center gap-2.5 max-lg:w-full max-lg:flex-col max-lg:gap-2">
          {FILTER_CONFIG.map(({ key, defaultLabel, options }) => (
            <FilterDropdown
              key={key}
              defaultLabel={defaultLabel}
              options={options}
              value={activeFilters[key]}
              onChange={(value) => updateFilter(key, value)}
            />
          ))}
        </div>
      </div>

      <div className="relative flex min-h-0 w-full flex-1 flex-col gap-2.5 overflow-hidden rounded-2xl border border-[#f2f2f2] bg-white p-3 max-lg:h-auto max-lg:flex-none dark:border-zinc-700 dark:bg-zinc-800">
        <div className="flex items-center max-lg:flex-wrap max-lg:gap-2 lg:px-3.25">
          {boardIsEmpty ? (
            <div className="flex w-56 shrink-0 items-center gap-2 max-lg:w-auto 2xl:w-97">
              <RotateCw size={16} className="shrink-0 text-[#c2c2c2]" />
              <span className="flex shrink-0 items-center gap-1 rounded-[6px] bg-[#f9f4ff] px-[6px] py-[2px] text-xs font-medium text-[#8022fe]">
                <Sparkles size={10} />
                {filteredGhostHabits.length} AI Suggestions
              </span>
            </div>
          ) : (
            <div className="flex w-56 shrink-0 items-center gap-2 max-lg:w-auto 2xl:w-97">
              <RotateCw size={16} className="shrink-0 text-[#c2c2c2]" />
              <p className="text-sm font-medium text-[#5d5d5d] dark:text-gray-300">{activeCount} active</p>
              <span className="rounded-[6px] bg-[#f2f2f2] px-[6px] py-[2px] text-xs font-medium text-[#5d5d5d] dark:bg-zinc-700 dark:text-gray-300">
                {pausedCount} paused
                <span className="max-xl:hidden">
                  {' '}
                  <span className="text-[#c2c2c2]">•</span> {completedCount} completed
                </span>
              </span>
            </div>
          )}
          <div className="flex w-24 shrink-0 items-center gap-2 max-lg:hidden 2xl:w-43.75">
            <Flame size={12} className="shrink-0 text-[#5d5d5d] dark:text-gray-300" />
            <p className="text-sm font-medium text-[#5d5d5d] dark:text-gray-300">Streak</p>
          </div>
          <div className="flex flex-1 items-center justify-between pr-8 max-lg:hidden 2xl:pr-41">
            {DAYS.map((day, i) => (
              <div key={day} className="flex w-10 items-center justify-center gap-1">
                <p
                  className={`text-sm font-medium ${
                    i === TODAY_INDEX ? 'text-[#8022fe]' : 'text-[#5d5d5d] dark:text-gray-300'
                  }`}
                >
                  {day}
                </p>
                {i === TODAY_INDEX && <span className="size-1 shrink-0 rounded-full bg-[#8022fe]" />}
              </div>
            ))}
          </div>
        </div>

        <div className="scrollbar-hidden relative -mx-3 flex flex-1 flex-col gap-2.5 overflow-y-auto px-3 lg:min-h-0 max-lg:max-h-[min(70vh,560px)]">
          {loadingList && boardIsEmpty && !forceEmpty ? (
            <p className="py-10 text-center text-sm font-medium text-[#c2c2c2] dark:text-gray-500">
              Loading habits...
            </p>
          ) : boardIsEmpty && loadingSuggestions && filteredGhostHabits.length === 0 ? (
            <p className="py-10 text-center text-sm font-medium text-[#c2c2c2] dark:text-gray-500">
              Loading suggestions…
            </p>
          ) : boardIsEmpty ? (
            filteredGhostHabits.length === 0 ? (
              <p className="py-10 text-center text-sm font-medium text-[#c2c2c2] dark:text-gray-500">
                No habits to show yet.
              </p>
            ) : (
              filteredGhostHabits.map((habit) => (
                <GhostHabitRow
                  key={habit.id}
                  habit={habit}
                  busy={String(busySuggestionId) === String(habit.id)}
                  onAccept={handleAcceptGhost}
                  onDismiss={handleDismissGhost}
                  onRegenerate={handleRegenerateGhost}
                />
              ))
            )
          ) : filteredHabits.length === 0 ? (
            <p className="py-10 text-center text-sm font-medium text-[#c2c2c2] dark:text-gray-500">
              No habits match your search.
            </p>
          ) : (
            filteredHabits.map((habit) => (
              <HabitRow
                key={habit.id}
                habit={habit}
                todayIndex={TODAY_INDEX}
                onToggleDay={handleToggleDay}
                onEdit={handleEditHabit}
                onImprove={handleImproveHabit}
                onComplete={handleCompleteHabit}
                onPause={handlePauseHabit}
                onDelete={handleRequestDeleteHabit}
              />
            ))
          )}
        </div>

        {!boardIsEmpty && filteredHabits.length > 0 && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-15 rounded-b-2xl bg-gradient-to-b from-transparent to-white dark:to-zinc-800" />
        )}
      </div>

      <NewHabitsModal
        key={
          habitModal.open
            ? `${habitModal.mode}-${habitModal.habit?.id ?? 'new'}`
            : 'closed'
        }
        open={habitModal.open}
        mode={habitModal.mode}
        initialHabit={habitModal.habit}
        onClose={handleCloseModal}
        onSave={handleSaveHabit}
      />

      <ImproveHabitModal
        key={improveModal.open ? improveModal.habit?.id ?? 'improve' : 'closed'}
        open={improveModal.open}
        habit={improveModal.habit}
        submitting={improveSubmitting}
        onClose={() => setImproveModal({ open: false, habit: null })}
        onSubmit={handleImproveSubmit}
      />

      <DeleteConfirmModal
        open={deleteModal.open}
        title="Delete Habit"
        itemName={deleteModal.habit?.title}
        entityLabel="habit"
        submitting={deletingHabit}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDeleteHabit}
      />
    </div>
  );
}
