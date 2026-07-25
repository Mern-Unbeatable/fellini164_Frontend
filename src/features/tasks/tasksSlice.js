import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import {
  acceptTaskSuggestionApi,
  completeTaskApi,
  createTaskApi,
  deleteTaskApi,
  dismissTaskSuggestionApi,
  fetchSubtasksApi,
  fetchTaskAiSuggestionsApi,
  fetchTaskByIdApi,
  fetchTasksApi,
  fetchTasksSummaryApi,
  generateTaskApi,
  skipTaskApi,
  suggestTaskAiApi,
  undoTaskAiApi,
  updateTaskApi,
  updateTaskStatusApi,
} from './tasksAPI';
import {
  buildTasksQueryParams,
  categoryToApi,
  mapAiGeneratedTaskForPreview,
  mapCreatePayload,
  mapSubtaskFromApi,
  mapTaskFromApi,
  mapUpdatePayload,
  normalizeBoardSummary,
  parseTasksListResponse,
  statusApiFromUi,
  tasksToColumns,
} from './tasksMappers';

function mergeTaskIntoState(state, mapped) {
  if (!mapped?.id) return;
  const index = state.items.findIndex((t) => String(t.id) === String(mapped.id));
  if (index !== -1) {
    state.items[index] = { ...state.items[index], ...mapped };
  } else {
    state.items = [mapped, ...state.items];
  }
  state.columns = tasksToColumns(state.items);
  state.boardStats = normalizeBoardSummary(null, state.items);
  if (state.currentTask && String(state.currentTask.id) === String(mapped.id)) {
    state.currentTask = { ...state.currentTask, ...mapped };
  }
}

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (queryInput = {}, { rejectWithValue }) => {
    try {
      const params = buildTasksQueryParams(queryInput);
      const envelope = await fetchTasksApi(params);
      return parseTasksListResponse(envelope);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to load tasks');
      return rejectWithValue(error?.response?.data?.message || 'Failed to load tasks');
    }
  }
);

export const fetchTasksSummary = createAsyncThunk(
  'tasks/fetchTasksSummary',
  async (_, { getState }) => {
    try {
      const data = await fetchTasksSummaryApi();
      return normalizeBoardSummary(data, getState().tasks.items);
    } catch {
      return normalizeBoardSummary(null, getState().tasks.items);
    }
  }
);

export const fetchTaskById = createAsyncThunk(
  'tasks/fetchTaskById',
  async (taskId, { rejectWithValue }) => {
    try {
      return await fetchTaskByIdApi(taskId);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to load task');
      return rejectWithValue(error?.response?.data?.message || 'Failed to load task');
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (formData, { rejectWithValue }) => {
    try {
      const payload = mapCreatePayload(formData);
      const created = await createTaskApi(payload);
      return mapTaskFromApi(created, formData.source || 'manual');
    } catch (error) {
      const data = error?.response?.data;
      const fieldErrors = Array.isArray(data?.errors)
        ? data.errors.map((e) => e.msg).filter(Boolean).join('; ')
        : '';
      const message = fieldErrors || data?.message || 'Failed to create task';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const generateTask = createAsyncThunk(
  'tasks/generateTask',
  async ({ prompt, category, goalId }, { rejectWithValue }) => {
    try {
      const trimmed = String(prompt || '').trim();
      if (!trimmed) return rejectWithValue('Describe the task you want to generate');
      const body = {
        prompt: trimmed,
        category: categoryToApi(category || 'Career'),
      };
      if (goalId) body.goalId = goalId;
      const data = await generateTaskApi(body);
      const preview = mapAiGeneratedTaskForPreview(data);
      if (!preview?.id) return rejectWithValue('Invalid AI generate response');
      return preview;
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to generate task');
      return rejectWithValue(error?.response?.data?.message || 'Failed to generate task');
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ taskId, formData }, { rejectWithValue }) => {
    try {
      const payload = mapUpdatePayload(formData);
      const data = await updateTaskApi(taskId, payload);
      return mapTaskFromApi(data, formData.source);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update task');
      return rejectWithValue(error?.response?.data?.message || 'Failed to update task');
    }
  }
);

export const updateTaskStatus = createAsyncThunk(
  'tasks/updateTaskStatus',
  async ({ taskId, status }, { rejectWithValue }) => {
    try {
      const apiStatus = statusApiFromUi(status);
      const data = await updateTaskStatusApi(taskId, apiStatus);
      return mapTaskFromApi(data) || { id: taskId, status, apiStatus, columnKey: undefined };
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update status');
      return rejectWithValue(error?.response?.data?.message || 'Failed to update status');
    }
  }
);

export const completeTask = createAsyncThunk(
  'tasks/completeTask',
  async ({ taskId, actualMinutes }, { rejectWithValue }) => {
    try {
      const payload =
        actualMinutes != null && actualMinutes !== ''
          ? { actualMinutes: Number(actualMinutes) }
          : {};
      const data = await completeTaskApi(taskId, payload);
      return mapTaskFromApi(data) || { id: taskId, status: 'Done', columnKey: 'done' };
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to complete task');
      return rejectWithValue(error?.response?.data?.message || 'Failed to complete task');
    }
  }
);

export const skipTask = createAsyncThunk(
  'tasks/skipTask',
  async ({ taskId, reason }, { rejectWithValue }) => {
    try {
      const data = await skipTaskApi(taskId, { reason: reason || 'Skipped' });
      return mapTaskFromApi(data);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to skip task');
      return rejectWithValue(error?.response?.data?.message || 'Failed to skip task');
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (taskId, { rejectWithValue }) => {
    try {
      await deleteTaskApi(taskId);
      return taskId;
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to delete task');
      return rejectWithValue(error?.response?.data?.message || 'Failed to delete task');
    }
  }
);

export const fetchSubtasks = createAsyncThunk(
  'tasks/fetchSubtasks',
  async (taskId, { rejectWithValue }) => {
    try {
      const list = await fetchSubtasksApi(taskId);
      return {
        taskId,
        subtasks: list.map(mapSubtaskFromApi).filter(Boolean),
      };
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to load subtasks');
    }
  }
);

export const suggestTaskAi = createAsyncThunk(
  'tasks/suggestTaskAi',
  async ({ taskId, action, message, regenerate }, { rejectWithValue }) => {
    try {
      const body = { action };
      if (message) body.message = message;
      if (regenerate === true) body.regenerate = true;
      return await suggestTaskAiApi(taskId, body);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'AI suggestion failed');
      return rejectWithValue(error?.response?.data?.message || 'AI suggestion failed');
    }
  }
);

export const fetchTaskAiSuggestions = createAsyncThunk(
  'tasks/fetchTaskAiSuggestions',
  async ({ taskId, status = 'pending' }, { rejectWithValue }) => {
    try {
      return await fetchTaskAiSuggestionsApi(taskId, status);
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to load suggestions');
    }
  }
);

export const acceptTaskSuggestion = createAsyncThunk(
  'tasks/acceptTaskSuggestion',
  async (suggestionId, { rejectWithValue }) => {
    try {
      return await acceptTaskSuggestionApi(suggestionId);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to apply suggestion');
      return rejectWithValue(error?.response?.data?.message || 'Failed to apply suggestion');
    }
  }
);

export const dismissTaskSuggestion = createAsyncThunk(
  'tasks/dismissTaskSuggestion',
  async (suggestionId, { rejectWithValue }) => {
    try {
      return await dismissTaskSuggestionApi(suggestionId);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to dismiss suggestion');
      return rejectWithValue(error?.response?.data?.message || 'Failed to dismiss suggestion');
    }
  }
);

export const undoTaskAi = createAsyncThunk(
  'tasks/undoTaskAi',
  async (taskId, { rejectWithValue }) => {
    try {
      return await undoTaskAiApi(taskId);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to undo AI changes');
      return rejectWithValue(error?.response?.data?.message || 'Failed to undo AI changes');
    }
  }
);

const emptyColumns = { todo: [], inProgress: [], done: [] };

const initialState = {
  items: [],
  columns: emptyColumns,
  boardStats: {
    todo: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0,
    dueToday: 0,
    total: 0,
  },
  listPagination: null,
  listCount: 0,
  currentTask: null,
  currentSubtasks: [],
  aiSuggestion: null,
  loadingList: false,
  loadingTask: false,
  creating: false,
  error: null,
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearCurrentTask: (state) => {
      state.currentTask = null;
      state.currentSubtasks = [];
      state.aiSuggestion = null;
    },
    clearAiSuggestion: (state) => {
      state.aiSuggestion = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        if (state.items.length === 0) state.loadingList = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loadingList = false;
        const { items, summary, pagination, count } = action.payload;
        state.items = items.map((item) => mapTaskFromApi(item)).filter(Boolean);
        state.columns = tasksToColumns(state.items);
        state.listPagination = pagination;
        state.listCount = count;
        state.boardStats = summary
          ? normalizeBoardSummary(summary)
          : normalizeBoardSummary(null, state.items);
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loadingList = false;
        state.error = action.payload;
      })

      .addCase(fetchTasksSummary.fulfilled, (state, action) => {
        state.boardStats = action.payload;
      })

      .addCase(fetchTaskById.pending, (state) => {
        state.loadingTask = true;
      })
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        state.loadingTask = false;
        const mapped = mapTaskFromApi(action.payload);
        state.currentTask = mapped;
        state.currentSubtasks = Array.isArray(action.payload?.subtasks)
          ? action.payload.subtasks.map(mapSubtaskFromApi).filter(Boolean)
          : mapped?.subtasks || [];
        mergeTaskIntoState(state, mapped);
      })
      .addCase(fetchTaskById.rejected, (state) => {
        state.loadingTask = false;
      })

      .addCase(createTask.pending, (state) => {
        state.creating = true;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.creating = false;
        mergeTaskIntoState(state, action.payload);
      })
      .addCase(createTask.rejected, (state) => {
        state.creating = false;
      })

      .addCase(updateTask.fulfilled, (state, action) => {
        mergeTaskIntoState(state, action.payload);
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        mergeTaskIntoState(state, action.payload);
      })
      .addCase(completeTask.fulfilled, (state, action) => {
        mergeTaskIntoState(state, {
          ...action.payload,
          status: 'Done',
          columnKey: 'done',
        });
      })
      .addCase(skipTask.fulfilled, (state, action) => {
        mergeTaskIntoState(state, action.payload);
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => String(t.id) !== String(action.payload));
        state.columns = tasksToColumns(state.items);
        state.boardStats = normalizeBoardSummary(null, state.items);
        if (state.currentTask && String(state.currentTask.id) === String(action.payload)) {
          state.currentTask = null;
          state.currentSubtasks = [];
        }
      })

      .addCase(fetchSubtasks.fulfilled, (state, action) => {
        state.currentSubtasks = action.payload.subtasks;
        const mapped = state.items.find((t) => String(t.id) === String(action.payload.taskId));
        if (mapped) {
          mergeTaskIntoState(state, {
            ...mapped,
            subtasks: action.payload.subtasks,
            steps:
              action.payload.subtasks.length > 0
                ? `${action.payload.subtasks.filter((s) => s.done).length}/${action.payload.subtasks.length} Steps`
                : undefined,
          });
        }
      })

      .addCase(suggestTaskAi.fulfilled, (state, action) => {
        state.aiSuggestion = action.payload;
      })
      .addCase(fetchTaskAiSuggestions.fulfilled, (state, action) => {
        state.aiSuggestion = action.payload?.latest || action.payload?.suggestions?.[0] || null;
      })
      .addCase(acceptTaskSuggestion.fulfilled, (state, action) => {
        state.aiSuggestion = null;
        if (action.payload?.task) {
          mergeTaskIntoState(state, mapTaskFromApi(action.payload.task));
          state.currentTask = mapTaskFromApi(action.payload.task);
          state.currentSubtasks = Array.isArray(action.payload.task.subtasks)
            ? action.payload.task.subtasks.map(mapSubtaskFromApi).filter(Boolean)
            : [];
        }
      })
      .addCase(dismissTaskSuggestion.fulfilled, (state) => {
        state.aiSuggestion = null;
      })
      .addCase(undoTaskAi.fulfilled, (state, action) => {
        state.aiSuggestion = null;
        if (action.payload?.task) {
          mergeTaskIntoState(state, mapTaskFromApi(action.payload.task));
          state.currentTask = mapTaskFromApi(action.payload.task);
        }
      });
  },
});

export const { clearCurrentTask, clearAiSuggestion } = tasksSlice.actions;
export const selectTasks = (state) => state.tasks.items;
export const selectTaskColumns = (state) => state.tasks.columns;
export const selectTasksBoardStats = (state) => state.tasks.boardStats;
export const selectTasksLoading = (state) => state.tasks.loadingList;
export const selectCurrentTask = (state) => state.tasks.currentTask;
export const selectCurrentSubtasks = (state) => state.tasks.currentSubtasks;
export const selectTaskAiSuggestion = (state) => state.tasks.aiSuggestion;

export default tasksSlice.reducer;
