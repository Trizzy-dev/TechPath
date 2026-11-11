import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  archiveTask,
  deleteTask,
  getAllTasks,
  restoreTask,
  type Task,
} from "../api/taskApi";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../components/DashboardLayout";

export default function AdminTasks() {
  const { token } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState<number | null>(null);

  useEffect(() => {
    async function loadTasks() {
      try {
        const data = await getAllTasks();

        setTasks(
          [...data].sort((a, b) => a.position - b.position)
        );
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load tasks"
        );
      } finally {
        setLoading(false);
      }
    }

    loadTasks();
  }, []);

  async function handleArchive(task: Task) {
    if (!token) {
      setError("You must log in to archive a task.");
      return;
    }

    if (
      !window.confirm(
        `Archive "${task.title}"? It will no longer appear in the active learning roadmap.`
      )
    ) {
      return;
    }

    setError("");
    setProcessingId(task.id);

    try {
      await archiveTask(task.id, token);

      setTasks((current) =>
        current.map((item) =>
          item.id === task.id
            ? { ...item, isArchived: true }
            : item
        )
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to archive task"
      );
    } finally {
      setProcessingId(null);
    }
  }

  async function handleRestore(task: Task) {
    if (!token) {
      setError("You must log in to restore a task.");
      return;
    }

    setError("");
    setProcessingId(task.id);

    try {
      await restoreTask(task.id, token);

      setTasks((current) =>
        current.map((item) =>
          item.id === task.id
            ? { ...item, isArchived: false }
            : item
        )
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to restore task"
      );
    } finally {
      setProcessingId(null);
    }
  }

  async function handleDelete(task: Task) {
    if (!token) {
      setError("You must log in to delete a task.");
      return;
    }

    const confirmed = window.confirm(
      `Permanently delete "${task.title}"?\n\nAll progress records and resources associated with this task will also be deleted. This action cannot be undone.`
    );

    if (!confirmed) return;

    setError("");
    setProcessingId(task.id);

    try {
      await deleteTask(task.id, token);

      setTasks((current) =>
        current.filter((item) => item.id !== task.id)
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete task"
      );
    } finally {
      setProcessingId(null);
    }
  }

  if (loading) {
    return <main className="p-6 text-gray-600">Loading tasks...</main>;
  }

  return (
    <DashboardLayout isAdmin>
      <main className="min-h-screen bg-slate-50 p-4 sm:p-6">
        <div className="mx-auto max-w-5xl">
          <header className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Manage Tasks
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage your frontend learning roadmap.
              </p>
            </div>

            <Link
              to="/admin/tasks/new"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Add Task
            </Link>
          </header>

          {error && (
            <p
              role="alert"
              className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          {tasks.length === 0 ? (
            <section className="rounded-lg border bg-white p-6 text-center text-gray-600">
              No tasks found. Create your first task.
            </section>
          ) : (
            <section className="overflow-x-auto rounded-lg border bg-white">
              <table className="w-full text-left text-sm">
                <thead className="border-b bg-gray-50 text-gray-600">
                  <tr>
                    <th className="px-4 py-3">Position</th>
                    <th className="px-4 py-3">Task</th>
                    <th className="px-4 py-3">Difficulty</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {tasks.map((task) => (
                    <tr
                      key={task.id}
                      className={
                        task.isArchived
                          ? "bg-gray-50"
                          : "hover:bg-gray-50"
                      }
                    >
                      <td className="px-4 py-3">{task.position}</td>

                      <td className="px-4 py-3 font-medium text-gray-900">
                        {task.title}
                      </td>

                      <td className="px-4 py-3 text-gray-600">
                        {task.difficulty}
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${
                            task.isArchived
                              ? "bg-orange-100 text-orange-700"
                              : task.isPublished
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {task.isArchived
                            ? "Archived"
                            : task.isPublished
                              ? "Published"
                              : "Draft"}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Link
                            to={`/admin/tasks/${task.id}/edit`}
                            className="font-medium text-blue-600 hover:underline"
                          >
                            Edit
                          </Link>

                          {task.isArchived ? (
                            <button
                              type="button"
                              onClick={() => handleRestore(task)}
                              disabled={processingId !== null}
                              className="font-medium text-green-700 hover:underline disabled:opacity-50"
                            >
                              {processingId === task.id
                                ? "Restoring..."
                                : "Restore"}
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleArchive(task)}
                              disabled={processingId !== null}
                              className="font-medium text-orange-700 hover:underline disabled:opacity-50"
                            >
                              {processingId === task.id
                                ? "Archiving..."
                                : "Archive"}
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleDelete(task)}
                            disabled={processingId !== null}
                            className="font-medium text-red-600 hover:underline disabled:opacity-50"
                          >
                            {processingId === task.id
                              ? "Processing..."
                              : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}
        </div>
      </main>
    </DashboardLayout>
  );
}