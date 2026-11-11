import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import DashboardLayout from "../components/DashboardLayout";

import {
  getAccessibleTaskById,
  type Task,
} from "../api/taskApi";

import {
  getTaskResources,
  type Resource,
} from "../api/resourceApi";

import {
  getUserProgress,
  startTask,
  completeTask,
  type Progress,
} from "../api/progressApi";

import { useAuth } from "../context/AuthContext";

export default function TaskDetails() {
  const { taskId } = useParams();
  const { token } = useAuth();

  const [task, setTask] = useState<Task | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    async function loadTaskDetails() {
      if (
        !taskId ||
        !token ||
        !Number.isInteger(Number(taskId)) ||
        Number(taskId) <= 0
      ) {
        setError("Invalid task ID or you are not logged in.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const id = Number(taskId);

        const [taskData, resourcesData, progressData] =
          await Promise.all([
            getAccessibleTaskById(id, token),
            getTaskResources(id),
            getUserProgress(token),
          ]);

        setTask(taskData);
        setResources(resourcesData);

        const taskProgress = progressData.find(
          (item) => item.taskId === id
        );

        setProgress(taskProgress ?? null);
      } catch (error) {
        console.error(error);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load task."
        );
      } finally {
        setLoading(false);
      }
    }

    loadTaskDetails();
  }, [taskId, token]);

  async function handleStartTask() {
    if (!token || !task || actionLoading) return;

    try {
      setActionLoading(true);
      setError("");

      const newProgress = await startTask(token, task.id);
      setProgress(newProgress);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to start task."
      );
    } finally {
      setActionLoading(false);
    }
  }

  async function handleCompleteTask() {
    if (
      !token ||
      !task ||
      actionLoading ||
      progress?.status !== "in_progress"
    ) {
      return;
    }

    try {
      setActionLoading(true);
      setError("");

      const updatedProgress = await completeTask(token, task.id);
      setProgress(updatedProgress);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to complete task."
      );
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <p className="text-gray-600">Loading task...</p>
      </DashboardLayout>
    );
  }

  if (!task) {
    return (
      <DashboardLayout>
        <div className="space-y-4">
          <p role="alert" className="text-red-600">
            {error || "Task not found."}
          </p>

          <Link
            to="/roadmap"
            className="inline-block text-blue-600 hover:underline"
          >
            ← Back to Roadmap
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const status = progress?.status ?? "not_started";

  const statusStyles = {
    not_started: "bg-gray-100 text-gray-700",
    in_progress: "bg-amber-100 text-amber-700",
    completed: "bg-green-100 text-green-700",
  };

  const statusLabels = {
    not_started: "Not Started",
    in_progress: "In Progress",
    completed: "Completed",
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl space-y-6">
        <Link
          to="/roadmap"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          ← Back to Roadmap
        </Link>

        <section className="rounded-xl border bg-white p-5 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
              {task.difficulty}
            </span>

            <span className="text-sm text-gray-500">
              Step {task.position}
            </span>
          </div>

          <h1 className="mt-4 text-2xl font-bold text-gray-900 sm:text-3xl">
            {task.title}
          </h1>

          <div className="mt-5 whitespace-pre-line text-sm leading-7 text-gray-900 sm:text-base">
            {task.description}
          </div>
        </section>

        <section className="rounded-xl border bg-white p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Your Progress
          </h2>

          <div className="mt-3">
            <span
              className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${statusStyles[status as keyof typeof statusStyles] ?? statusStyles.not_started}`}
            >
              {statusLabels[status as keyof typeof statusLabels] ?? status}
            </span>
          </div>

          {error && (
            <p role="alert" className="mt-4 text-sm text-red-600">
              {error}
            </p>
          )}

          {!progress && (
            <button
              onClick={handleStartTask}
              disabled={actionLoading}
              className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {actionLoading ? "Starting..." : "Start Task"}
            </button>
          )}

          {status === "in_progress" && (
            <button
              onClick={handleCompleteTask}
              disabled={actionLoading}
              className="mt-5 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {actionLoading ? "Completing..." : "Mark as Completed"}
            </button>
          )}

          {status === "completed" && (
            <p className="mt-4 text-sm font-medium text-green-700">
              ✓ You have completed this task.
            </p>
          )}
        </section>

        <section className="rounded-xl border bg-white p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Learning Resources
          </h2>

          {resources.length === 0 ? (
            <p className="mt-3 text-sm text-gray-500">
              No resources available yet.
            </p>
          ) : (
            <ul className="mt-4 divide-y">
              {resources.map((resource) => (
                <li
                  key={resource.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {resource.title}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {resource.type}
                    </p>
                  </div>

                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-blue-600 hover:underline"
                  >
                    Open Resource ↗
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}