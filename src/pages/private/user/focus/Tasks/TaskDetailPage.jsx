import { useCallback, useEffect, useState } from 'react';
import { Navigate, useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import TaskDetailPanel from './components/TaskDetailPanel';
import TaskFormModal from './components/TaskFormModal';
import DeleteConfirmModal from '../../../../../components/ui/DeleteConfirmModal';
import {
  clearCurrentTask,
  completeTask,
  createTask,
  deleteTask,
  fetchSubtasks,
  fetchTaskById,
  fetchTasksSummary,
  selectCurrentSubtasks,
  selectCurrentTask,
  selectTasksLoadingTask,
  updateTask,
  updateTaskStatus,
} from '../../../../../features/tasks/tasksSlice';
import { mapTaskFromApi } from '../../../../../features/tasks/tasksMappers';

/**
 * Full-page task detail at /user/tasks/:taskId
 * Refresh-safe (URL holds the task id) — same pattern as GoalDetailPage.
 */
export default function TaskDetailPage() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { setTaskDetail, setBackToTasksBoard } = useOutletContext() || {};
  const currentTask = useSelector(selectCurrentTask);
  const currentSubtasks = useSelector(selectCurrentSubtasks);
  const loadingTask = useSelector(selectTasksLoadingTask);
  const [detailFetchDone, setDetailFetchDone] = useState(false);
  const [triggerSubtasksAi, setTriggerSubtasksAi] = useState(false);
  const [triggerImproveAi, setTriggerImproveAi] = useState(false);
  const [taskModal, setTaskModal] = useState({ open: false, task: null });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingTask, setDeletingTask] = useState(false);

  const task =
    currentTask && String(currentTask.id) === String(taskId)
      ? {
          ...currentTask,
          subtasks: currentSubtasks ?? currentTask.subtasks ?? [],
        }
      : null;

  useEffect(() => {
    if (!taskId) {
      setDetailFetchDone(true);
      return undefined;
    }
    let cancelled = false;
    setDetailFetchDone(false);
    Promise.all([
      dispatch(fetchTaskById(taskId)),
      dispatch(fetchSubtasks(taskId)),
    ]).finally(() => {
      if (!cancelled) setDetailFetchDone(true);
    });
    return () => {
      cancelled = true;
      dispatch(clearCurrentTask());
    };
  }, [dispatch, taskId]);

  useEffect(() => {
    setTaskDetail?.(task?.title ?? null);
    return () => setTaskDetail?.(null);
  }, [task?.title, setTaskDetail]);

  const goToBoard = useCallback(() => {
    navigate('/user/tasks');
  }, [navigate]);

  useEffect(() => {
    setBackToTasksBoard?.(goToBoard);
    return () => setBackToTasksBoard?.(null);
  }, [setBackToTasksBoard, goToBoard]);

  const refreshTask = useCallback(async () => {
    if (!taskId) return null;
    const byId = await dispatch(fetchTaskById(taskId));
    const subs = await dispatch(fetchSubtasks(taskId));
    if (!fetchTaskById.fulfilled.match(byId)) return null;
    const mapped = mapTaskFromApi(byId.payload);
    const subtasks = fetchSubtasks.fulfilled.match(subs)
      ? subs.payload.subtasks
      : mapped.subtasks || [];
    return { ...mapped, subtasks };
  }, [dispatch, taskId]);

  const handleUpdateTaskFields = async (id, fields) => {
    const ALLOWED_KEYS = new Set([
      'title',
      'description',
      'category',
      'linkedGoal',
      'goalId',
      'tags',
    ]);
    const safeFields = Object.fromEntries(
      Object.entries(fields).filter(([key]) => ALLOWED_KEYS.has(key))
    );
    if (Object.keys(safeFields).length === 0) return;
    const formData = { ...safeFields };
    if (safeFields.linkedGoal && !safeFields.goalId) {
      formData.goalId = safeFields.linkedGoal;
    }
    await dispatch(updateTask({ taskId: id, formData }));
    await refreshTask();
  };

  const handleChangeStatus = async (status) => {
    if (!taskId || !status) return null;
    const result = await dispatch(updateTaskStatus({ taskId, status }));
    const refreshed = await refreshTask();
    if (refreshed) return refreshed;
    return updateTaskStatus.fulfilled.match(result) ? result.payload : null;
  };

  const handleCompleteSubtask = async (subtask) => {
    if (!taskId || !subtask?.id || subtask.done || subtask.completed) return null;
    const mins = Number(subtask.estimatedMinutes ?? subtask.minutes);
    await dispatch(
      completeTask({
        taskId: subtask.id,
        actualMinutes: Number.isFinite(mins) && mins > 0 ? mins : undefined,
      })
    ).unwrap();
    const subs = await dispatch(fetchSubtasks(taskId));
    const subtasks = fetchSubtasks.fulfilled.match(subs) ? subs.payload.subtasks : [];
    return {
      id: taskId,
      subtasks,
      steps:
        subtasks.length > 0
          ? `${subtasks.filter((s) => s.done).length}/${subtasks.length} Steps`
          : undefined,
    };
  };

  const handleAddSubtask = async (title) => {
    const trimmed = String(title || '').trim();
    if (!taskId || !trimmed) return null;
    await dispatch(
      createTask({
        title: trimmed,
        description: trimmed,
        category: task?.category || 'Career',
        priority: task?.priority || 'MEDIUM',
        parentId: taskId,
        source: 'manual',
      })
    ).unwrap();
    const subs = await dispatch(fetchSubtasks(taskId));
    const subtasks = fetchSubtasks.fulfilled.match(subs) ? subs.payload.subtasks : [];
    return {
      id: taskId,
      subtasks,
      steps:
        subtasks.length > 0
          ? `${subtasks.filter((s) => s.done).length}/${subtasks.length} Steps`
          : undefined,
    };
  };

  const handleRequestDelete = (t) => {
    if (!t?.id) return;
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!task?.id) return;
    setDeletingTask(true);
    try {
      await dispatch(deleteTask(task.id)).unwrap();
      setDeleteModalOpen(false);
      await dispatch(fetchTasksSummary());
      navigate('/user/tasks');
    } catch {
      /* toast from slice */
    } finally {
      setDeletingTask(false);
    }
  };

  const autoAiAction = triggerImproveAi ? 'improve' : triggerSubtasksAi ? 'breakdown' : null;

  if (!detailFetchDone || (loadingTask && !task)) return null;
  if (detailFetchDone && !task) {
    return <Navigate to="/user/tasks" replace />;
  }

  return (
    <div className="relative flex min-h-full flex-col py-7.5 max-lg:min-h-0 max-lg:py-4 max-lg:sm:py-6">
      <TaskDetailPanel
        task={task}
        onUpdateTaskFields={(fields) => handleUpdateTaskFields(task.id, fields)}
        onChangeStatus={handleChangeStatus}
        onCompleteSubtask={handleCompleteSubtask}
        onAddSubtask={handleAddSubtask}
        onEdit={(t) => setTaskModal({ open: true, task: t })}
        onDelete={handleRequestDelete}
        onRefreshTask={refreshTask}
        autoAiAction={autoAiAction}
        onAutoAiActionConsumed={() => {
          setTriggerSubtasksAi(false);
          setTriggerImproveAi(false);
        }}
        onTriggerSubtasksAi={() => setTriggerSubtasksAi(true)}
        onTriggerImproveAi={() => setTriggerImproveAi(true)}
      />

      {taskModal.open && (
        <TaskFormModal
          key={taskModal.task?.id ?? 'edit'}
          mode="edit"
          initialTask={taskModal.task}
          onClose={() => setTaskModal({ open: false, task: null })}
          onSubmit={async (form) => {
            if (!taskModal.task?.id) return;
            await dispatch(updateTask({ taskId: taskModal.task.id, formData: form }));
            await refreshTask();
          }}
        />
      )}

      <DeleteConfirmModal
        open={deleteModalOpen}
        title="Delete Task"
        itemName={task?.title}
        entityLabel="task"
        submitting={deletingTask}
        onClose={() => {
          if (deletingTask) return;
          setDeleteModalOpen(false);
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
