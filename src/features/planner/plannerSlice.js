import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import {
  acceptPlannerSuggestionApi,
  completePlannerItemApi,
  createPlannerPlanApi,
  dismissPlannerSuggestionApi,
  fetchPlannerAvailableApi,
  fetchPlannerBoardApi,
  fetchPlannerSuggestionApi,
  fetchPlannerSummaryApi,
  suggestPlannerAiApi,
  undoPlannerAiApi,
  updatePlannerItemApi,
} from './plannerAPI';
import {
  boardToPlansMap,
  formatIsoDate,
  mapAvailableFromApi,
  mapPlannerBoardFromApi,
  mapPlannerItemFromApi,
  normalizePlannerSummary,
  VIEW_UI_TO_API,
} from './plannerMappers';

function applyBoardToState(state, boardEnvelope, fallbackDateKey) {
  const mapped = mapPlannerBoardFromApi(boardEnvelope);
  state.board = mapped;
  state.plans = boardToPlansMap(mapped, fallbackDateKey);
  const itemCount =
    mapped.items?.length ||
    Object.values(mapped.itemsByDate || {}).reduce((n, list) => n + (list?.length || 0), 0);
  state.hasAcceptedPlan = itemCount > 0;
}

export const fetchPlannerSummary = createAsyncThunk(
  'planner/fetchSummary',
  async (date, { rejectWithValue }) => {
    try {
      return await fetchPlannerSummaryApi(date);
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to load planner summary');
    }
  }
);

export const fetchPlannerBoard = createAsyncThunk(
  'planner/fetchBoard',
  async ({ viewType = 'Daily', date } = {}, { rejectWithValue }) => {
    try {
      const apiView = VIEW_UI_TO_API[viewType] || viewType || 'DAILY';
      const dateKey = typeof date === 'string' ? date : formatIsoDate(date);
      const board = await fetchPlannerBoardApi({ viewType: apiView, date: dateKey });
      return { board, dateKey, viewType: apiView };
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to load planner board');
      return rejectWithValue(error?.response?.data?.message || 'Failed to load planner board');
    }
  }
);

export const fetchPlannerAvailable = createAsyncThunk(
  'planner/fetchAvailable',
  async (date, { rejectWithValue }) => {
    try {
      const envelope = await fetchPlannerAvailableApi(date);
      return mapAvailableFromApi(envelope);
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to load available items');
    }
  }
);

export const createPlannerPlan = createAsyncThunk(
  'planner/createPlan',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await createPlannerPlanApi(payload);
      return data;
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to create plan';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const suggestPlannerAi = createAsyncThunk(
  'planner/suggestAi',
  async ({ payload, dateQuery }, { rejectWithValue }) => {
    try {
      return await suggestPlannerAiApi(payload, dateQuery);
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to get AI suggestion';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const fetchPlannerSuggestion = createAsyncThunk(
  'planner/fetchSuggestion',
  async (suggestionId, { rejectWithValue }) => {
    try {
      return await fetchPlannerSuggestionApi(suggestionId);
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to load suggestion');
    }
  }
);

export const acceptPlannerSuggestion = createAsyncThunk(
  'planner/acceptSuggestion',
  async (suggestionId, { rejectWithValue }) => {
    try {
      return await acceptPlannerSuggestionApi(suggestionId);
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to accept plan';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const dismissPlannerSuggestion = createAsyncThunk(
  'planner/dismissSuggestion',
  async (suggestionId, { rejectWithValue }) => {
    try {
      return await dismissPlannerSuggestionApi(suggestionId);
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to dismiss suggestion';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const undoPlannerAi = createAsyncThunk(
  'planner/undoAi',
  async (_, { rejectWithValue }) => {
    try {
      return await undoPlannerAiApi();
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to undo AI change';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const updatePlannerItem = createAsyncThunk(
  'planner/updateItem',
  async ({ plannerItemId, payload }, { rejectWithValue }) => {
    try {
      return await updatePlannerItemApi(plannerItemId, payload);
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to update planner item';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const completePlannerItem = createAsyncThunk(
  'planner/completeItem',
  async (plannerItemId, { rejectWithValue }) => {
    try {
      return await completePlannerItemApi(plannerItemId);
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to complete item';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  summary: null,
  board: null,
  plans: {},
  available: { tasks: [], habits: [], date: null },
  hasAcceptedPlan: false,
  lastSuggestionId: null,
  status: 'idle',
  error: null,
  aiStatus: 'idle',
};

const plannerSlice = createSlice({
  name: 'planner',
  initialState,
  reducers: {
    setPlannerPlansLocal(state, action) {
      state.plans = action.payload || {};
    },
    setHasAcceptedPlanLocal(state, action) {
      state.hasAcceptedPlan = Boolean(action.payload);
    },
    clearPlannerSuggestion(state) {
      state.lastSuggestionId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlannerSummary.fulfilled, (state, action) => {
        state.summary = normalizePlannerSummary(action.payload);
      })
      .addCase(fetchPlannerBoard.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPlannerBoard.fulfilled, (state, action) => {
        state.status = 'succeeded';
        applyBoardToState(state, action.payload.board, action.payload.dateKey);
      })
      .addCase(fetchPlannerBoard.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to load board';
      })
      .addCase(fetchPlannerAvailable.fulfilled, (state, action) => {
        state.available = action.payload;
      })
      .addCase(createPlannerPlan.pending, (state) => {
        state.aiStatus = 'loading';
      })
      .addCase(createPlannerPlan.fulfilled, (state, action) => {
        state.aiStatus = 'succeeded';
        const board = action.payload?.board;
        const dateKey = action.payload?.date || action.payload?.startDate;
        if (board) applyBoardToState(state, board, dateKey);
        toast.success(action.payload?.message || 'Plan created');
      })
      .addCase(createPlannerPlan.rejected, (state) => {
        state.aiStatus = 'failed';
      })
      .addCase(suggestPlannerAi.pending, (state) => {
        state.aiStatus = 'loading';
      })
      .addCase(suggestPlannerAi.fulfilled, (state, action) => {
        state.aiStatus = 'succeeded';
        state.lastSuggestionId = action.payload?.suggestionId || null;
      })
      .addCase(suggestPlannerAi.rejected, (state) => {
        state.aiStatus = 'failed';
      })
      .addCase(acceptPlannerSuggestion.fulfilled, (state, action) => {
        const board = action.payload?.board;
        const dateKey = board?.date || action.payload?.items?.[0]?.date;
        if (board) applyBoardToState(state, board, dateKey);
        else if (Array.isArray(action.payload?.items)) {
          applyBoardToState(
            state,
            { viewType: 'DAILY', date: dateKey, items: action.payload.items },
            dateKey
          );
        }
        state.lastSuggestionId = null;
        toast.success(action.payload?.message || 'Plan accepted');
      })
      .addCase(dismissPlannerSuggestion.fulfilled, (state) => {
        state.lastSuggestionId = null;
      })
      .addCase(undoPlannerAi.fulfilled, (state, action) => {
        const board = action.payload?.board;
        const dateKey = board?.date || board?.startDate;
        if (board) applyBoardToState(state, board, dateKey);
        toast.success(action.payload?.message || 'AI change undone');
      })
      .addCase(completePlannerItem.fulfilled, (state, action) => {
        const mapped = mapPlannerItemFromApi(action.payload?.item || action.payload);
        if (!mapped?.date) return;
        const list = state.plans[mapped.date] || [];
        state.plans[mapped.date] = list.map((item) =>
          String(item.plannerItemId || item.id) === String(mapped.plannerItemId || mapped.id)
            ? { ...item, ...mapped }
            : item
        );
      })
      .addCase(updatePlannerItem.fulfilled, (state, action) => {
        const mapped = mapPlannerItemFromApi(action.payload?.item || action.payload);
        if (!mapped?.date) return;
        const list = state.plans[mapped.date] || [];
        state.plans[mapped.date] = list.map((item) =>
          String(item.plannerItemId || item.id) === String(mapped.plannerItemId || mapped.id)
            ? { ...item, ...mapped }
            : item
        );
      });
  },
});

export const { setPlannerPlansLocal, setHasAcceptedPlanLocal, clearPlannerSuggestion } =
  plannerSlice.actions;
export default plannerSlice.reducer;
