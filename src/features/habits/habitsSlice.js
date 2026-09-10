import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import {
  completeHabitTodayApi,
  createHabitApi,
  deleteHabitApi,
  fetchHabitsApi,
  fetchHabitsStatsOverviewApi,
  fetchHabitsSummaryApi,
  generateHabitApi,
  improveHabitApi,
  markHabitStatusCompletedApi,
  undoHabitCompletionApi,
  updateHabitApi,
  updateHabitStatusApi,
} from './habitsAPI';
import {
  buildHabitsQueryParams,
  categoryToApi,
  mapAiGeneratedHabitForPreview,
  mapCreatePayload,
  mapHabitFromApi,
  mapUpdatePayload,
  normalizeBoardSummary,
  parseHabitsListResponse,
  statusToApi,
} from './habitsMappers';

function mergeHabitIntoState(state, mapped) {
  if (!mapped?.id) return;
  const index = state.items.findIndex((h) => String(h.id) === String(mapped.id));
  if (index !== -1) {
    state.items[index] = { ...state.items[index], ...mapped };
  }
  state.boardStats = normalizeBoardSummary(null, state.items);
}

export const fetchHabits = createAsyncThunk(
  'habits/fetchHabits',
  async (queryInput = {}, { rejectWithValue }) => {
    try {
      const params = buildHabitsQueryParams(queryInput);
      const envelope = await fetchHabitsApi(params);
      return parseHabitsListResponse(envelope);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to load habits');
      return rejectWithValue(error?.response?.data?.message || 'Failed to load habits');
    }
  }
);

export const fetchHabitsSummary = createAsyncThunk(
  'habits/fetchHabitsSummary',
  async (_, { getState }) => {
    try {
      const data = await fetchHabitsSummaryApi();
      return normalizeBoardSummary(data, getState().habits.items);
    } catch {
      return normalizeBoardSummary(null, getState().habits.items);
    }
  }
);

export const fetchHabitsStatsOverview = createAsyncThunk(
  'habits/fetchHabitsStatsOverview',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchHabitsStatsOverviewApi();
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to load habit stats');
    }
  }
);

export const createHabit = createAsyncThunk(
  'habits/createHabit',
  async (formData, { rejectWithValue }) => {
    try {
      const payload = mapCreatePayload(formData);
      const created = await createHabitApi(payload);
      return mapHabitFromApi(created, formData.source || 'manual');
    } catch (error) {
      const data = error?.response?.data;
      const fieldErrors = Array.isArray(data?.errors)
        ? data.errors.map((e) => e.msg).filter(Boolean).join('; ')
        : '';
      const message = fieldErrors || data?.message || 'Failed to create habit';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

/**
 * POST /habits/ai/generate — server persists immediately; Add to Board refreshes only.
 */
export const generateHabit = createAsyncThunk(
  'habits/generateHabit',
  async ({ prompt, category, goalId }, { rejectWithValue }) => {
    try {
      const trimmed = String(prompt || '').trim();
      if (!trimmed) return rejectWithValue('Describe the habit you want to generate');
      const body = {
        prompt: trimmed,
        category: categoryToApi(category || 'Career'),
      };
      if (goalId) body.goalId = goalId;
      const data = await generateHabitApi(body);
      const preview = mapAiGeneratedHabitForPreview(data);
      if (!preview?.id) {
        return rejectWithValue('Invalid AI generate response');
      }
      return preview;
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to generate habit');
      return rejectWithValue(error?.response?.data?.message || 'Failed to generate habit');
    }
  }
);

export const updateHabit = createAsyncThunk(
  'habits/updateHabit',
  async ({ habitId, formData }, { rejectWithValue }) => {
    try {
      const payload = mapUpdatePayload(formData);
      const data = await updateHabitApi(habitId, payload);
      toast.success('Habit updated');
      return mapHabitFromApi(data, formData.source);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update habit');
      return rejectWithValue(error?.response?.data?.message || 'Failed to update habit');
    }
  }
);

/** Today's check-in — POST /habits/:id/complete (supports multi-slot progress) */
export const completeHabitToday = createAsyncThunk(
  'habits/completeHabitToday',
  async ({ habitId, notes }, { rejectWithValue }) => {
    try {
      const payload = notes ? { notes } : {};
      const result = await completeHabitTodayApi(habitId, payload);
      if (result?.message) toast.success(result.message);
      return mapHabitFromApi(result?.habit) || { id: habitId };
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to complete habit');
      return rejectWithValue(error?.response?.data?.message || 'Failed to complete habit');
    }
  }
);

/** Undo today's check-in — DELETE /habits/:id/complete */
export const undoHabitCompletion = createAsyncThunk(
  'habits/undoHabitCompletion',
  async (habitId, { rejectWithValue }) => {
    try {
      const data = await undoHabitCompletionApi(habitId);
      return mapHabitFromApi(data) || { id: habitId };
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to undo completion');
      return rejectWithValue(error?.response?.data?.message || 'Failed to undo completion');
    }
  }
);

/** Menu Complete — PATCH /habits/:id/complete-status */
export const markHabitCompleted = createAsyncThunk(
  'habits/markHabitCompleted',
  async (habitId, { rejectWithValue }) => {
    try {
      const data = await markHabitStatusCompletedApi(habitId);
      toast.success('Habit completed');
      return (
        mapHabitFromApi(data) || {
          id: habitId,
          status: 'completed',
        }
      );
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to mark habit completed');
      return rejectWithValue(error?.response?.data?.message || 'Failed to mark habit completed');
    }
  }
);

/** Pause / Activate — PATCH /habits/:id/pause | /activate */
export const updateHabitStatus = createAsyncThunk(
  'habits/updateHabitStatus',
  async ({ habitId, status }, { rejectWithValue }) => {
    try {
      const data = await updateHabitStatusApi(habitId, statusToApi(status));
      const mapped = mapHabitFromApi(data);
      const nextStatus = mapped?.status || status;
      if (nextStatus === 'paused') {
        toast.success('Habit paused');
      } else if (nextStatus === 'active') {
        toast.success('Habit activated');
      } else {
        toast.success('Habit status updated');
      }
      return {
        ...(mapped || {}),
        id: mapped?.id || habitId,
        status: nextStatus,
      };
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update habit status');
      return rejectWithValue(error?.response?.data?.message || 'Failed to update habit status');
    }
  }
);

export const improveHabit = createAsyncThunk(
  'habits/improveHabit',
  async ({ habitId, instructions }, { rejectWithValue }) => {
    try {
      const trimmed = String(instructions || '').trim();
      if (!trimmed) return rejectWithValue('Enter improvement instructions');
      const data = await improveHabitApi(habitId, { instructions: trimmed });
      return mapHabitFromApi(data) || { id: habitId };
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to improve habit');
      return rejectWithValue(error?.response?.data?.message || 'Failed to improve habit');
    }
  }
);

export const deleteHabit = createAsyncThunk(
  'habits/deleteHabit',
  async (habitId, { rejectWithValue }) => {
    try {
      await deleteHabitApi(habitId);
      return habitId;
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to delete habit');
      return rejectWithValue(error?.response?.data?.message || 'Failed to delete habit');
    }
  }
);

const initialState = {
  items: [],
  boardStats: {
    active: 0,
    paused: 0,
    completed: 0,
    total: 0,
    completedToday: 0,
    remainingToday: 0,
  },
  statsOverview: null,
  listPagination: null,
  listCount: 0,
  loadingList: false,
  creating: false,
  error: null,
};

const habitsSlice = createSlice({
  name: 'habits',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHabits.pending, (state) => {
        if (state.items.length === 0) state.loadingList = true;
        state.error = null;
      })
      .addCase(fetchHabits.fulfilled, (state, action) => {
        state.loadingList = false;
        const { items, summary, pagination, count } = action.payload;
        state.items = items.map((item) => mapHabitFromApi(item)).filter(Boolean);
        state.listPagination = pagination;
        state.listCount = count;
        state.boardStats = summary
          ? normalizeBoardSummary(summary)
          : normalizeBoardSummary(null, state.items);
      })
      .addCase(fetchHabits.rejected, (state, action) => {
        state.loadingList = false;
        state.error = action.payload;
      })

      .addCase(fetchHabitsSummary.fulfilled, (state, action) => {
        state.boardStats = action.payload;
      })

      .addCase(fetchHabitsStatsOverview.fulfilled, (state, action) => {
        state.statsOverview = action.payload;
      })

      .addCase(createHabit.pending, (state) => {
        state.creating = true;
      })
      .addCase(createHabit.fulfilled, (state, action) => {
        state.creating = false;
        if (action.payload?.id) {
          state.items = [action.payload, ...state.items.filter((h) => h.id !== action.payload.id)];
        }
        state.boardStats = normalizeBoardSummary(null, state.items);
      })
      .addCase(createHabit.rejected, (state) => {
        state.creating = false;
      })

      .addCase(updateHabit.fulfilled, (state, action) => {
        mergeHabitIntoState(state, action.payload);
      })

      .addCase(completeHabitToday.fulfilled, (state, action) => {
        if (!action.payload?.id) return;
        // Mapper already sets days / dayProgress / todayProgress from API habit
        mergeHabitIntoState(state, action.payload);
      })

      .addCase(undoHabitCompletion.fulfilled, (state, action) => {
        if (!action.payload?.id) return;
        const todayIdx = (() => {
          const day = new Date().getDay();
          return day === 0 ? 6 : day - 1;
        })();
        const days = Array.isArray(action.payload.days)
          ? [...action.payload.days]
          : Array(7).fill('empty');
        if (days[todayIdx] === 'checked') days[todayIdx] = 'empty';
        mergeHabitIntoState(state, { ...action.payload, days });
      })

      .addCase(markHabitCompleted.fulfilled, (state, action) => {
        mergeHabitIntoState(state, {
          ...action.payload,
          status: 'completed',
        });
      })

      .addCase(updateHabitStatus.fulfilled, (state, action) => {
        if (!action.payload) return;
        mergeHabitIntoState(state, action.payload);
      })

      .addCase(improveHabit.fulfilled, (state, action) => {
        mergeHabitIntoState(state, action.payload);
      })

      .addCase(deleteHabit.fulfilled, (state, action) => {
        state.items = state.items.filter((h) => String(h.id) !== String(action.payload));
        state.boardStats = normalizeBoardSummary(null, state.items);
      });
  },
});

export const selectHabits = (state) => state.habits.items;
export const selectHabitsBoardStats = (state) => state.habits.boardStats;
export const selectHabitsStatsOverview = (state) => state.habits.statsOverview;
export const selectHabitsLoading = (state) => state.habits.loadingList;

export default habitsSlice.reducer;
