import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getAllTasks, type Task } from "../api/taskApi";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../components/DashboardLayout";

export default function AdminDashboard() {
  const { user, token } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTasks() {
      if (!token) {
        setError("Please log in to access the admin dashboard.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await getAllTasks();

        setTasks(
          [...data].sort((a, b) => a.position - b.position)
        );
      } catch (error) {
        console.error(error);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load admin dashboard."
        );
      } finally {
        setLoading(false);
      }
    }

    loadTasks();
  }, [token]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-6 text-gray-600">
        Loading admin dashboard...
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <p className="text-red-600">{error}</p>
      </main>
    );
  }

  const archived = tasks.filter(
    (task) => task.isArchived
  ).length;

  const activeTasks = tasks.filter(
    (task) => !task.isArchived
  );

  const published = activeTasks.filter(
    (task) => task.isPublished
  ).length;

  const drafts = activeTasks.filter(
    (task) => !task.isPublished
  ).length;

  const overview = [
    {
      label: "Total Tasks",
      value: tasks.length,
      color: "text-blue-600",
    },
    {
      label: "Published",
      value: published,
      color: "text-green-600",
    },
    {
      label: "Drafts",
      value: drafts,
      color: "text-amber-600",
    },
    {
      label: "Archived",
      value: archived,
      color: "text-gray-600",
    },
  ];

  return (
    <DashboardLayout isAdmin>
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-blue-600">
              ADMIN DASHBOARD
            </p>

            <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
              Welcome{user?.name ? `, ${user.name}` : ""}!
            </h1>

            <p className="mt-2 text-gray-600">
              Manage TechPath's learning tasks and roadmap.
            </p>
          </div>

          <Link
            to="/admin/tasks/new"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            + Create Task
          </Link>
        </header>

        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {overview.map((item) => (
            <article
              key={item.label}
              className="rounded-xl border bg-white p-5"
            >
              <p className="text-sm text-gray-500">
                {item.label}
              </p>

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
                Roadmap Tasks
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Manage task order and publication status.
              </p>
            </div>

            <Link
              to="/admin/tasks"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              Manage All →
            </Link>
          </div>

          {tasks.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-gray-500">
                No tasks have been created yet.
              </p>

              <Link
                to="/admin/tasks/new"
                className="mt-3 inline-block text-sm font-medium text-blue-600 hover:underline"
              >
                Create your first task
              </Link>
            </div>
          ) : (
            <div className="mt-5 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b text-gray-500">
                    <th className="px-3 py-3 font-medium">Position</th>
                    <th className="px-3 py-3 font-medium">Task</th>
                    <th className="px-3 py-3 font-medium">Difficulty</th>
                    <th className="px-3 py-3 font-medium">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {tasks.slice(0, 8).map((task) => (
                    <tr
                      key={task.id}
                      className="border-b last:border-0"
                    >
                      <td className="px-3 py-4">
                        {task.position}
                      </td>

                      <td className="px-3 py-4 font-medium text-gray-900">
                        {task.title}
                      </td>

                      <td className="px-3 py-4 text-gray-600">
                        {task.difficulty}
                      </td>

                      <td className="px-3 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            task.isArchived
                              ? "bg-gray-100 text-gray-600"
                              : task.isPublished
                                ? "bg-green-100 text-green-700"
                                : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {task.isArchived
                            ? "Archived"
                            : task.isPublished
                              ? "Published"
                              : "Draft"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {tasks.length > 8 && (
                <Link
                  to="/admin/tasks"
                  className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline"
                >
                  View all {tasks.length} tasks →
                </Link>
              )}
            </div>
          )}
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <Link
            to="/admin/tasks"
            className="rounded-xl border bg-white p-5 transition hover:border-blue-300"
          >
            <h3 className="font-semibold text-gray-900">
              Manage Tasks
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Edit, publish, archive, and restore learning tasks.
            </p>
          </Link>

          <Link
            to="/admin/tasks/new"
            className="rounded-xl border bg-white p-5 transition hover:border-blue-300"
          >
            <h3 className="font-semibold text-gray-900">
              Create a Task
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Add a new step to the TechPath learning roadmap.
            </p>
          </Link>
        </section>
      </div>
    </main>
    </DashboardLayout>
  );
}