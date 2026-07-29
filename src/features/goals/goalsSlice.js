import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import {
  completeGoalApi,
  createGoalApi,
  deleteGoalApi,
  fetchBoardSummaryApi,
  fetchGoalByIdApi,
  fetchGoalsApi,
  generateGoalApi,
  linkHabitsToGoalApi,
  linkTasksToGoalApi,
  updateGoalApi,
  updateGoalStatusApi,
} from './goalsAPI';
import { fetchHabitByIdApi } from '../habits/habitsAPI';
import {
  buildGoalsQueryParams,
  categoryToApi,
  mapAiGeneratedGoalForPreview,
  mapCreatePayload,
  mapGoalFromApi,
  mapLinkedHabitFromApi,
  mapLinkedTaskFromApi,
  mapUpdatePayload,
  normalizeBoardSummary,
  parseGoalsListResponse,
  statusToApi,
} from './goalsMappers';

function mergeGoalIntoState(state, mapped) {
  if (!mapped?.id) return;
  const index = state.items.findIndex((g) => String(g.id) === String(mapped.id));
  if (index !== -1) {
    state.items[index] = { ...state.items[index], ...mapped, source: state.items[index].source };
  }
  if (state.currentGoal && String(state.currentGoal.id) === String(mapped.id)) {
    state.currentGoal = { ...state.currentGoal, ...mapped, source: state.currentGoal.source };
  }
  state.boardStats = normalizeBoardSummary(null, state.items);
}

export const fetchGoals = createAsyncThunk(
  'goals/fetchGoals',
  async (queryInput = {}, { rejectWithValue }) => {
    try {
      const params = buildGoalsQueryParams(queryInput);
      const envelope = await fetchGoalsApi(params);
      return parseGoalsListResponse(envelope);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to load goals');
      return rejectWithValue(error?.response?.data?.message || 'Failed to load goals');
    }
  }
);

export const fetchBoardSummary = createAsyncThunk(
  'goals/fetchBoardSummary',
  async (_, { getState }) => {
    try {
      const data = await fetchBoardSummaryApi();
      return normalizeBoardSummary(data, getState().goals.items);
    } catch {
      return normalizeBoardSummary(null, getState().goals.items);
    }
  }
);

export const fetchGoalById = createAsyncThunk(
  'goals/fetchGoalById',
  async (goalId, { rejectWithValue }) => {
    try {
      const data = await fetchGoalByIdApi(goalId);
      // Goal payload often omits habit completions / full targetDays — hydrate from GET /habits/:id
      // so week checkmarks + Sat/Sun schedule survive refresh.
      const rawHabits = data?.linkedHabits || data?.habits || [];
      if (Array.isArray(rawHabits) && rawHabits.length > 0) {
        const enriched = await Promise.all(
          rawHabits.map(async (h) => {
            if (!h?.id) return h;
            try {
              const full = await fetchHabitByIdApi(h.id);
              if (!full || typeof full !== 'object') return h;
              return { ...h, ...full };
            } catch {
              return h;
            }
          }),
        );
        return {
          ...data,
          ...(Array.isArray(data?.linkedHabits)
            ? { linkedHabits: enriched }
            : { habits: enriched }),
        };
      }
      return data;
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to load goal');
      return rejectWithValue(error?.response?.data?.message || 'Failed to load goal');
    }
  }
);

export const createGoal = createAsyncThunk(
  'goals/createGoal',
  async (formData, { rejectWithValue }) => {
    try {
      const payload = mapCreatePayload(formData);
      const created = await createGoalApi(payload);
      return mapGoalFromApi(created, formData.source || 'manual');
    } catch (error) {
      const data = error?.response?.data;
      const fieldErrors = Array.isArray(data?.errors)
        ? data.errors.map((e) => e.msg).filter(Boolean).join('; ')
        : '';
      const message = fieldErrors || data?.message || 'Failed to create goal';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

/**
 * POST /goals/ai/generate
 * Body: { prompt, category } — category CAREER|HEALTH|FINANCE|PERSONAL|EDUCATION
 * Response data is already persisted — do not POST /goals again on Add to Board.
 */
export const generateGoal = createAsyncThunk(
  'goals/generateGoal',
  async ({ prompt, category }, { rejectWithValue }) => {
    try {
      const trimmed = String(prompt || '').trim();
      if (!trimmed) return rejectWithValue('Describe the goal you want to generate');
      const data = await generateGoalApi({
        prompt: trimmed,
        category: categoryToApi(category || 'Career'),
      });
      const preview = mapAiGeneratedGoalForPreview(data);
      if (!preview?.id) {
        return rejectWithValue('Invalid AI generate response');
      }
      return preview;
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to generate goal');
      return rejectWithValue(error?.response?.data?.message || 'Failed to generate goal');
    }
  }
);

/** Update Goal — PATCH/PUT/POST /goals/:id */
export const updateGoal = createAsyncThunk(
  'goals/updateGoal',
  async ({ goalId, formData }, { rejectWithValue }) => {
    try {
      const payload = mapUpdatePayload(formData);
      const data = await updateGoalApi(goalId, payload);
      return mapGoalFromApi(data, formData.source);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update goal');
      return rejectWithValue(error?.response?.data?.message || 'Failed to update goal');
    }
  }
);

/** Complete Goal — POST /goals/:id/complete (+ route fallbacks) */
export const completeGoal = createAsyncThunk(
  'goals/completeGoal',
  async (goalId, { rejectWithValue }) => {
    try {
      const data = await completeGoalApi(goalId);
      const mapped = mapGoalFromApi(data?.goal || data) || {
        id: goalId,
        status: 'completed',
        progress: 100,
        completedDate: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
      };
      toast.success(data?.message || 'Goal completed');
      return { ...mapped, status: mapped.status || 'completed' };
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || 'Failed to complete goal';
      toast.error(message === 'Route not found' ? 'Could not complete goal. Please try again.' : message);
      return rejectWithValue(message);
    }
  }
);

/** Pause / Activate toggle — tries /status, /pause|/activate, then Update Goal */
export const updateGoalStatus = createAsyncThunk(
  'goals/updateGoalStatus',
  async ({ goalId, status }, { rejectWithValue }) => {
    try {
      const data = await updateGoalStatusApi(goalId, statusToApi(status));
      const mapped = mapGoalFromApi(data);
      const nextStatus = mapped?.status || status;
      if (nextStatus === 'paused') {
        toast.success('Goal paused');
      } else if (nextStatus === 'active') {
        toast.success('Goal reactivated');
      } else {
        toast.success('Goal status updated');
      }
      return {
        ...(mapped || {}),
        id: mapped?.id || goalId,
        status: nextStatus,
      };
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update goal status');
      return rejectWithValue(error?.response?.data?.message || 'Failed to update goal status');
    }
  }
);

export const deleteGoal = createAsyncThunk(
  'goals/deleteGoal',
  async (goalId, { rejectWithValue }) => {
    try {
      await deleteGoalApi(goalId);
      toast.success('Goal deleted');
      return goalId;
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to delete goal');
      return rejectWithValue(error?.response?.data?.message || 'Failed to delete goal');
    }
  }
);

/** POST Link Tasks to Goal */
export const linkTasksToGoal = createAsyncThunk(
  'goals/linkTasksToGoal',
  async ({ goalId, taskIds }, { rejectWithValue }) => {
    try {
      const ids = (taskIds || []).filter(Boolean);
      if (!ids.length) return rejectWithValue('Select at least one task');
      const data = await linkTasksToGoalApi(goalId, ids);
      const mapped = mapGoalFromApi(data);
      return {
        goalId,
        goal: mapped,
        taskCount: mapped?.tasks ?? ids.length,
      };
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to link tasks');
      return rejectWithValue(error?.response?.data?.message || 'Failed to link tasks');
    }
  }
);

/** POST Link Habits to Goal */
export const linkHabitsToGoal = createAsyncThunk(
  'goals/linkHabitsToGoal',
  async ({ goalId, habitIds }, { rejectWithValue }) => {
    try {
      const ids = (habitIds || []).filter(Boolean);
      if (!ids.length) return rejectWithValue('Select at least one habit');
      const data = await linkHabitsToGoalApi(goalId, ids);
      const mapped = mapGoalFromApi(data);
      return {
        goalId,
        goal: mapped,
        habitCount: mapped?.habits ?? ids.length,
      };
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to link habits');
      return rejectWithValue(error?.response?.data?.message || 'Failed to link habits');
    }
  }
);

const initialState = {
  items: [],
  rawItems: [],
  boardStats: { active: 0, paused: 0, completedThisMonth: 0 },
  listPagination: null,
  listCount: 0,
  currentGoal: null,
  currentGoalTasks: [],
  currentGoalHabits: [],
  loadingList: false,
  loadingGoal: false,
  creating: false,
  error: null,
};

const goalsSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {
    clearCurrentGoal: (state) => {
      state.currentGoal = null;
      state.currentGoalTasks = [];
      state.currentGoalHabits = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGoals.pending, (state) => {
        // Soft refetch — keep current cards while filters/search reload
        if (state.items.length === 0) state.loadingList = true;
        state.error = null;
      })
      .addCase(fetchGoals.fulfilled, (state, action) => {
        state.loadingList = false;
        const { items, summary, pagination, count } = action.payload;
        state.rawItems = items;
        state.items = items.map((item) => mapGoalFromApi(item)).filter(Boolean);
        state.listPagination = pagination;
        state.listCount = count;
        state.boardStats = summary
          ? normalizeBoardSummary(summary)
          : normalizeBoardSummary(null, state.items);
      })
      .addCase(fetchGoals.rejected, (state, action) => {
        state.loadingList = false;
        state.error = action.payload;
      })

      .addCase(fetchBoardSummary.fulfilled, (state, action) => {
        state.boardStats = action.payload;
      })

      .addCase(fetchGoalById.pending, (state) => {
        state.loadingGoal = true;
      })
      .addCase(fetchGoalById.fulfilled, (state, action) => {
        state.loadingGoal = false;
        const data = action.payload;
        state.currentGoal = mapGoalFromApi(data);

        const linkedTasks = data?.linkedTasks || data?.tasks || [];
        const linkedHabits = data?.linkedHabits || data?.habits || [];

        state.currentGoalTasks = (Array.isArray(linkedTasks) ? linkedTasks : [])
          .map(mapLinkedTaskFromApi)
          .filter(Boolean);
        state.currentGoalHabits = (Array.isArray(linkedHabits) ? linkedHabits : [])
          .map(mapLinkedHabitFromApi)
          .filter(Boolean);

        const index = state.items.findIndex((g) => String(g.id) === String(data?.id));
        if (index !== -1) {
          const existingSource = state.items[index].source;
          state.items[index] = mapGoalFromApi(data, existingSource);
        }
      })
      .addCase(fetchGoalById.rejected, (state) => {
        state.loadingGoal = false;
        state.currentGoal = null;
      })

      .addCase(createGoal.pending, (state) => {
        state.creating = true;
      })
      .addCase(createGoal.fulfilled, (state, action) => {
        state.creating = false;
        state.items = [action.payload, ...state.items];
        state.boardStats = normalizeBoardSummary(null, state.items);
      })
      .addCase(createGoal.rejected, (state) => {
        state.creating = false;
      })

      .addCase(updateGoal.fulfilled, (state, action) => {
        mergeGoalIntoState(state, action.payload);
      })

      .addCase(completeGoal.fulfilled, (state, action) => {
        const mapped = {
          ...action.payload,
          status: 'completed',
          progress: 100,
          completedDate:
            action.payload.completedDate ||
            new Date().toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }),
        };
        mergeGoalIntoState(state, mapped);
      })

      .addCase(updateGoalStatus.fulfilled, (state, action) => {
        if (!action.payload) return;
        mergeGoalIntoState(state, action.payload);
      })

      .addCase(deleteGoal.fulfilled, (state, action) => {
        state.items = state.items.filter((g) => String(g.id) !== String(action.payload));
        if (state.currentGoal && String(state.currentGoal.id) === String(action.payload)) {
          state.currentGoal = null;
        }
        state.boardStats = normalizeBoardSummary(null, state.items);
      })

      .addCase(linkTasksToGoal.fulfilled, (state, action) => {
        const { goalId, goal, taskCount } = action.payload;
        if (goal) {
          mergeGoalIntoState(state, goal);
          return;
        }
        const index = state.items.findIndex((g) => String(g.id) === String(goalId));
        if (index !== -1) {
          state.items[index].tasks = Math.max(state.items[index].tasks || 0, taskCount);
        }
      })

      .addCase(linkHabitsToGoal.fulfilled, (state, action) => {
        const { goalId, goal, habitCount } = action.payload;
        if (goal) {
          mergeGoalIntoState(state, goal);
          return;
        }
        const index = state.items.findIndex((g) => String(g.id) === String(goalId));
        if (index !== -1) {
          state.items[index].habits = Math.max(state.items[index].habits || 0, habitCount);
        }
      });
  },
});

export const { clearCurrentGoal } = goalsSlice.actions;
export const selectGoals = (state) => state.goals.items;
export const selectBoardStats = (state) => state.goals.boardStats;
export const selectCurrentGoal = (state) => state.goals.currentGoal;
export const selectCurrentGoalTasks = (state) => state.goals.currentGoalTasks;
export const selectCurrentGoalHabits = (state) => state.goals.currentGoalHabits;
export const selectGoalsLoading = (state) => state.goals.loadingList;
export const selectGoalDetailLoading = (state) => state.goals.loadingGoal;

export default goalsSlice.reducer;
