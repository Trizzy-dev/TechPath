import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { createTask } from "../api/taskApi";
import {
  createResource,
  type ResourceInput,
} from "../api/resourceApi";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../components/DashboardLayout";

export default function CreateTask() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [position, setPosition] = useState("1");
  const [difficulty, setDifficulty] = useState("");
  const [isPublished, setIsPublished] = useState(false);

  const [resources, setResources] = useState<ResourceInput[]>([]);
  const [resourceTitle, setResourceTitle] = useState("");
  const [resourceUrl, setResourceUrl] = useState("");
  const [resourceType, setResourceType] = useState("Tutorial");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function addResource() {
    if (!resourceTitle.trim() || !resourceUrl.trim()) {
      setError("Enter both the resource title and URL.");
      return;
    }

    setResources((current) => [
      ...current,
      {
        title: resourceTitle.trim(),
        url: resourceUrl.trim(),
        type: resourceType,
      },
    ]);

    setResourceTitle("");
    setResourceUrl("");
    setResourceType("Tutorial");
    setError("");
  }

  function removeResource(index: number) {
    setResources((current) =>
      current.filter((_, resourceIndex) => resourceIndex !== index)
    );
  }

  async function handleSubmit(
    event: React.SubmitEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!token) {
      setError("You must log in to create a task.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const task = await createTask(
        {
          title: title.trim(),
          description: description.trim(),
          position: Number(position),
          difficulty: difficulty.trim(),
          isPublished,
        },
        token
      );

      for (const resource of resources) {
        await createResource(task.id, resource, token);
      }

      navigate("/admin/tasks");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to create task or save its resources."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardLayout isAdmin>
      <main className="min-h-screen bg-slate-50 p-4 sm:p-6">
        <section className="mx-auto max-w-2xl">
          <Link
            to="/admin/tasks"
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back to Tasks
          </Link>

          <h1 className="mt-4 text-2xl font-bold text-black">
            Create Task
          </h1>

          <p className="mt-1 text-sm text-gray-600">
            Add a new task and its learning resources.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-6 rounded-lg border bg-white p-5 sm:p-6"
          >
            <div>
              <label
                htmlFor="title"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Task Title
              </label>

              <input
                id="title"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Description
              </label>

              <textarea
                id="description"
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                required
                rows={4}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="position"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Roadmap Position
              </label>

              <input
                id="position"
                type="number"
                value={position}
                onChange={(event) => setPosition(event.target.value)}
                min="1"
                step="1"
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="difficulty"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Difficulty
              </label>

              <input
                id="difficulty"
                type="text"
                value={difficulty}
                onChange={(event) =>
                  setDifficulty(event.target.value)
                }
                placeholder="e.g. Beginner"
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(event) =>
                  setIsPublished(event.target.checked)
                }
                className="h-4 w-4 accent-blue-600"
              />
              Publish this task immediately
            </label>

            <hr />

            <section>
              <h2 className="text-lg font-semibold text-gray-900">
                Learning Resources
              </h2>

              <p className="mt-1 text-sm text-gray-600">
                Add tutorials, documentation, videos, or other
                materials for this task.
              </p>

              <div className="mt-4 space-y-3">
                <input
                  type="text"
                  value={resourceTitle}
                  onChange={(event) =>
                    setResourceTitle(event.target.value)
                  }
                  placeholder="Resource title"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                />

                <input
                  type="url"
                  value={resourceUrl}
                  onChange={(event) =>
                    setResourceUrl(event.target.value)
                  }
                  placeholder="https://example.com"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                />

                <select
                  value={resourceType}
                  onChange={(event) =>
                    setResourceType(event.target.value)
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                >
                  <option value="Tutorial">Tutorial</option>
                  <option value="Documentation">Documentation</option>
                  <option value="Video">Video</option>
                  <option value="Article">Article</option>
                  <option value="Exercise">Exercise</option>
                  <option value="Other">Other</option>
                </select>

                <button
                  type="button"
                  onClick={addResource}
                  className="rounded-md border border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
                >
                  + Add Resource
                </button>
              </div>

              {resources.length > 0 && (
                <div className="mt-4 space-y-2">
                  {resources.map((resource, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-3 rounded-md border p-3"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-gray-800">
                          {resource.title}
                        </p>
                        <p className="truncate text-sm text-gray-500">
                          {resource.url}
                        </p>
                        <span className="text-xs text-blue-600">
                          {resource.type}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeResource(index)}
                        className="shrink-0 text-sm text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {error && (
              <p role="alert" className="text-sm text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {loading ? "Creating Task..." : "Create Task"}
            </button>
          </form>
        </section>
      </main>
    </DashboardLayout>
  );
}