import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getPublishedTasks, type Task } from "../api/taskApi";
import { getUserProgress, type Progress } from "../api/progressApi";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../components/DashboardLayout";

export default function Dashboard() {
  const { user, token } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      if (!token) {
        setError("Please log in to view your dashboard.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const [taskData, progressData] = await Promise.all([
          getPublishedTasks(),
          getUserProgress(token),
        ]);

        setTasks(taskData.filter((task) => !task.isArchived));
        setProgress(progressData);
      } catch (error) {
        console.error(error);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load dashboard."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [token]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-6 text-gray-600">
        Loading dashboard...
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <p className="text-red-600">{error}</p>

        <Link to="/login" className="mt-3 inline-block text-blue-600">
          Go to Login
        </Link>
      </main>
    );
  }

  const taskIds = new Set(tasks.map((task) => task.id));

  const activeProgress = progress.filter((item) =>
    taskIds.has(item.taskId)
  );

  const completed = activeProgress.filter(
    (item) => item.status === "completed"
  ).length;

  const inProgress = activeProgress.filter(
    (item) => item.status === "in_progress"
  ).length;

  const total = tasks.length;

  const percentage =
    total === 0 ? 0 : Math.round((completed / total) * 100);

  const continueLearning = tasks
    .filter((task) =>
      activeProgress.some(
        (item) =>
          item.taskId === task.id &&
          item.status === "in_progress"
      )
    )
    .sort((a, b) => a.position - b.position);

  const overview = [
    {
      label: "Available Tasks",
      value: total,
      color: "text-blue-600",
    },
    {
      label: "Completed",
      value: completed,
      color: "text-green-600",
    },
    {
      label: "In Progress",
      value: inProgress,
      color: "text-amber-600",
    },
    {
      label: "Remaining",
      value: Math.max(total - completed, 0),
      color: "text-purple-600",
    },
  ];

  return (
    <DashboardLayout>
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-6xl space-y-8">
        <header>
          <p className="text-sm font-medium text-blue-600">
            LEARNER DASHBOARD
          </p>

          <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
            Welcome back{user?.name ? `, ${user.name}` : ""}!
          </h1>

          <p className="mt-2 text-gray-600">
            Keep learning and take the next step in your tech journey.
          </p>
        </header>

        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {overview.map((item) => (
            <article
              key={item.label}
              className="rounded-xl border bg-white p-5"
            >
              <p className="text-sm text-gray-500">{item.label}</p>

              <p className={`mt-3 text-3xl font-bold ${item.color}`}>
                {item.value}
              </p>
            </article>
          ))}
        </section>

        <section className="rounded-xl border bg-white p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Overall Progress
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Your completed tasks across the active roadmap.
              </p>
            </div>

            <span className="text-2xl font-bold text-blue-600">
              {percentage}%
            </span>
          </div>

          <div
            className="mt-5 h-3 overflow-hidden rounded-full bg-gray-100"
            role="progressbar"
            aria-label="Overall learning progress"
            aria-valuenow={percentage}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full rounded-full bg-blue-600 transition-all"
              style={{ width: `${percentage}%` }}
            />
          </div>

          <p className="mt-3 text-sm text-gray-500">
            {completed} of {total} available tasks completed.
          </p>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-gray-900">
              Continue Learning
            </h2>

            <Link
              to="/roadmap"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              View Roadmap →
            </Link>
          </div>

          {continueLearning.length === 0 ? (
            <div className="rounded-xl border bg-white p-6 text-center">
              <h3 className="font-medium text-gray-800">
                Nothing in progress yet
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Start a task from your roadmap to see it here.
              </p>

              <Link
                to="/roadmap"
                className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Explore Roadmap
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {continueLearning.map((task) => (
                <article
                  key={task.id}
                  className="flex items-center justify-between gap-4 rounded-xl border bg-white p-5"
                >
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">
                      Step {task.position} · {task.difficulty}
                    </p>

                    <h3 className="mt-1 truncate font-semibold text-gray-900">
                      {task.title}
                    </h3>

                    <p className="mt-1 text-sm text-amber-600">
                      In Progress
                    </p>
                  </div>

                  <Link
                    to={`/tasks/${task.id}`}
                    className="shrink-0 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Continue
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <Link
            to="/roadmap"
            className="rounded-xl border bg-white p-5 transition hover:border-blue-300"
          >
            <h3 className="font-semibold text-gray-900">
              Learning Roadmap
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Explore the ordered frontend learning path.
            </p>
          </Link>

          <Link
            to="/progress"
            className="rounded-xl border bg-white p-5 transition hover:border-blue-300"
          >
            <h3 className="font-semibold text-gray-900">
              Detailed Progress
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Review your learning progress.
            </p>
          </Link>
        </section>
      </div>
    </main>
    </DashboardLayout>
  );
}