import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getPublishedTasks, type Task } from "../api/taskApi";
import {
  getUserProgress,
  type Progress,
  startTask,
  completeTask,
} from "../api/progressApi";

import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../components/DashboardLayout";

function Roadmap() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const { token } = useAuth();

  useEffect(() => {
    async function loadRoadmap() {
      try {
        setLoading(true);
        setError("");

        if (!token) {
          throw new Error("You are not logged in.");
        }

        const [tasksData, progressData] = await Promise.all([
          getPublishedTasks(),
          getUserProgress(token),
        ]);

        setTasks(tasksData);
        setProgress(progressData);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to load roadmap."
        );
      } finally {
        setLoading(false);
      }
    }

    loadRoadmap();
  }, [token]);

  function getTaskStatus(task: Task) {
    return (
      progress.find((item) => item.taskId === task.id)?.status ??
      "not_started"
    );
  }

  function isTaskLocked(task: Task) {
    if (task.position === 1) return false;

    const previousTask = tasks.find(
      (item) => item.position === task.position - 1
    );

    if (!previousTask) return true;

    return getTaskStatus(previousTask) !== "completed";
  }

  async function handleStartTask(taskId: number) {
    if (!token) return;

    try {
      setActionLoading(taskId);
      setError("");

      const newProgress = await startTask(token, taskId);

      setProgress((current) =>
        current.some((item) => item.taskId === taskId)
          ? current.map((item) =>
              item.taskId === taskId ? newProgress : item
            )
          : [...current, newProgress]
      );
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to start task."
      );
    } finally {
      setActionLoading(null);
    }
  }

  async function handleCompleteTask(taskId: number) {
    if (!token) return;

    try {
      setActionLoading(taskId);
      setError("");

      const updatedProgress = await completeTask(token, taskId);

      setProgress((current) =>
        current.map((item) =>
          item.taskId === taskId ? updatedProgress : item
        )
      );
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to complete task."
      );
    } finally {
      setActionLoading(null);
    }
  }

  const completedTasks = tasks.filter(
    (task) => getTaskStatus(task) === "completed"
  ).length;

  const percentage = tasks.length
    ? Math.round((completedTasks / tasks.length) * 100)
    : 0;

  if (loading) {
    return (
      <p className="p-6 text-gray-600">Loading roadmap...</p>
    );
  }

  if (error && tasks.length === 0) {
    return (
      <div className="p-6">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-3 rounded bg-blue-600 px-4 py-2 text-white"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <DashboardLayout>
    <main className="mx-auto max-w-4xl  space-y-6 p-4 sm:p-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">
          Frontend Development Roadmap
        </h1>
        <p className="mt-1 text-gray-600">
          Learn step by step and track your progress.
        </p>
      </header>

      <section className="rounded-lg border bg-white p-4">
        <div className="flex justify-between text-sm">
          <span className="font-medium">Your Progress</span>
          <span>{percentage}%</span>
        </div>

        <div className="mt-3 h-2 rounded-full bg-gray-200">
          <div
            className="h-2 rounded-full bg-blue-600 transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <p className="mt-2 text-sm text-gray-600">
          {completedTasks} of {tasks.length} tasks completed
        </p>
      </section>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {tasks.length === 0 ? (
        <p className="rounded-lg border p-6 text-gray-600">
          No published tasks are available yet.
        </p>
      ) : (
        <section className="space-y-3">
          {tasks.map((task) => {
            const status = getTaskStatus(task);
            const locked = isTaskLocked(task);
            const busy = actionLoading === task.id;

            return (
              <article
                key={task.id}
                className="rounded-lg border bg-white p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="font-semibold text-gray-900">
                      {task.position}. {task.title}
                    </h2>

                    <p className="mt-1 text-sm text-gray-600">
                      {task.difficulty}
                    </p>

                    <p className="mt-2 text-sm">
                      Status:{" "}
                      <span
                        className={
                          status === "completed"
                            ? "font-medium text-green-600"
                            : status === "in_progress"
                              ? "font-medium text-amber-600"
                              : "text-gray-600"
                        }
                      >
                        {locked
                          ? "Locked"
                          : status === "in_progress"
                            ? "In Progress"
                            : status === "completed"
                              ? "Completed"
                              : "Not Started"}
                      </span>
                    </p>
                  </div>

                  {locked && (
                    <span className="text-sm text-gray-500">
                      🔒 Locked
                    </span>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    to={`/tasks/${task.id}`}
                    className="rounded border px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    View Task
                  </Link>

                  {!locked && status === "not_started" && (
                    <button
                      onClick={() => handleStartTask(task.id)}
                      disabled={busy}
                      className="rounded bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                      {busy ? "Starting..." : "Start Task"}
                    </button>
                  )}

                  {!locked && status === "in_progress" && (
                    <button
                      onClick={() => handleCompleteTask(task.id)}
                      disabled={busy}
                      className="rounded bg-green-600 px-3 py-2 text-sm text-white hover:bg-green-700 disabled:opacity-50"
                    >
                      {busy ? "Completing..." : "Complete Task"}
                    </button>
                  )}

                  {status === "completed" && (
                    <span className="self-center text-sm text-green-600">
                      ✓ Completed
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
    </DashboardLayout>
  );
}

export default Roadmap;