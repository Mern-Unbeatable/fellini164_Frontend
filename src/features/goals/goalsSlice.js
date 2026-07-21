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
import {
  buildGoalsQueryParams,
  isUuid,
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
      let goal = mapGoalFromApi(created, formData.source || 'manual');

      const taskIds = (formData.linkedTasks || []).filter(isUuid);
      const habitIds = (formData.linkedHabits || []).filter(isUuid);

      if (taskIds.length) {
        try {
          await linkTasksToGoalApi(goal.id, taskIds);
          goal = { ...goal, tasks: taskIds.length };
        } catch {
          /* optional until real task IDs exist */
        }
      }

      if (habitIds.length) {
        try {
          await linkHabitsToGoalApi(goal.id, habitIds);
          goal = { ...goal, habits: habitIds.length };
        } catch {
          /* optional until real habit IDs exist */
        }
      }

      return goal;
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to create goal');
      return rejectWithValue(error?.response?.data?.message || 'Failed to create goal');
    }
  }
);

/**
 * POST /goals/ai/generate
 * Body (Postman contract used here): { prompt: string }
 * Response data is an already-persisted goal — do not POST /goals again on Add to Board.
 */
export const generateGoal = createAsyncThunk(
  'goals/generateGoal',
  async ({ prompt }, { rejectWithValue }) => {
    try {
      const trimmed = String(prompt || '').trim();
      if (!trimmed) return rejectWithValue('Describe the goal you want to generate');
      const data = await generateGoalApi({ prompt: trimmed });
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

/** Complete Goal — PATCH /goals/:id/complete (fallback status) */
export const completeGoal = createAsyncThunk(
  'goals/completeGoal',
  async (goalId, { rejectWithValue }) => {
    try {
      const data = await completeGoalApi(goalId);
      return mapGoalFromApi(data) || {
        id: goalId,
        status: 'completed',
        progress: 100,
        completedDate: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
      };
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to complete goal');
      return rejectWithValue(error?.response?.data?.message || 'Failed to complete goal');
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
      return {
        ...(mapped || {}),
        id: mapped?.id || goalId,
        status,
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
        state.loadingList = true;
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
