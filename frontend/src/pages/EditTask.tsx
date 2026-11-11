import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { getTaskById, updateTask } from "../api/taskApi";
import {
  getAdminTaskResources,
  createResource,
  updateResource,
  deleteResource,
  type Resource,
  type ResourceInput,
} from "../api/resourceApi";

import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../components/DashboardLayout";

const emptyResource: ResourceInput = {
  title: "",
  url: "",
  type: "",
};

export default function EditTask() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [position, setPosition] = useState("1");
  const [difficulty, setDifficulty] = useState("");
  const [isPublished, setIsPublished] = useState(false);

  const [resources, setResources] = useState<Resource[]>([]);
  const [resourceForm, setResourceForm] =
    useState<ResourceInput>(emptyResource);
  const [editingResourceId, setEditingResourceId] =
    useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resourceSaving, setResourceSaving] = useState(false);
  const [deletingResourceId, setDeletingResourceId] =
    useState<number | null>(null);

  const [error, setError] = useState("");
  const [resourceError, setResourceError] = useState("");
  const [resourceMessage, setResourceMessage] = useState("");

  useEffect(() => {
    async function loadTask() {
      try {
        if (
          !taskId ||
          !Number.isInteger(Number(taskId)) ||
          Number(taskId) <= 0
        ) {
          throw new Error("Invalid task ID");
        }

        const id = Number(taskId);

        if (!token) {
            throw new Error("You must log in to access this page.");
          }

        const [task, taskResources] = await Promise.all([
          getTaskById(id),
          getAdminTaskResources(id, token!),
        ]);

        setTitle(task.title);
        setDescription(task.description);
        setPosition(String(task.position));
        setDifficulty(task.difficulty);
        setIsPublished(task.isPublished);
        setResources(taskResources);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load task"
        );
      } finally {
        setLoading(false);
      }
    }

    loadTask();
  }, [taskId, token]);

  async function handleSubmit(
    event: React.SubmitEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!token) {
      setError("You must log in to update a task.");
      return;
    }

    if (
      !taskId ||
      !Number.isInteger(Number(taskId)) ||
      Number(taskId) <= 0
    ) {
      setError("Invalid task ID.");
      return;
    }

    setError("");
    setSaving(true);

    try {
      await updateTask(
        Number(taskId),
        {
          title: title.trim(),
          description: description.trim(),
          position: Number(position),
          difficulty: difficulty.trim(),
          isPublished,
        },
        token
      );

      navigate("/admin/tasks");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to update task"
      );
    } finally {
      setSaving(false);
    }
  }

  function handleResourceInput(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) {
    const { name, value } = event.target;

    setResourceForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function resetResourceForm() {
    setResourceForm(emptyResource);
    setEditingResourceId(null);
    setResourceError("");
    setResourceMessage("");
  }

  function handleEditResource(resource: Resource) {
    setEditingResourceId(resource.id);
    setResourceForm({
      title: resource.title,
      url: resource.url,
      type: resource.type,
    });
    setResourceError("");
    setResourceMessage("");
  }

  async function handleResourceSubmit(
    event: React.SubmitEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!token || !taskId) {
      setResourceError("You must be logged in to manage resources.");
      return;
    }

    setResourceSaving(true);
    setResourceError("");
    setResourceMessage("");

    try {
      const id = Number(taskId);
      const data = {
        title: resourceForm.title.trim(),
        url: resourceForm.url.trim(),
        type: resourceForm.type.trim(),
      };

      if (editingResourceId !== null) {
        const updatedResource = await updateResource(
          editingResourceId,
          data,
          token
        );

        setResources((current) =>
          current.map((resource) =>
            resource.id === editingResourceId
              ? updatedResource
              : resource
          )
        );

        setResourceMessage("Resource updated successfully.");
      } else {
        const newResource = await createResource(
          id,
          data,
          token
        );

        setResources((current) => [...current, newResource]);
        setResourceMessage("Resource added successfully.");
      }

      setResourceForm(emptyResource);
      setEditingResourceId(null);
    } catch (error) {
      setResourceError(
        error instanceof Error
          ? error.message
          : "Failed to save resource."
      );
    } finally {
      setResourceSaving(false);
    }
  }

  async function handleDeleteResource(resourceId: number) {
    if (!token) {
      setResourceError("You must be logged in to delete resources.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this resource?")) {
      return;
    }

    setDeletingResourceId(resourceId);
    setResourceError("");
    setResourceMessage("");

    try {
      await deleteResource(resourceId, token);

      setResources((current) =>
        current.filter((resource) => resource.id !== resourceId)
      );

      if (editingResourceId === resourceId) {
        resetResourceForm();
      }

      setResourceMessage("Resource deleted successfully.");
    } catch (error) {
      setResourceError(
        error instanceof Error
          ? error.message
          : "Failed to delete resource."
      );
    } finally {
      setDeletingResourceId(null);
    }
  }

  if (loading) {
    return (
      <DashboardLayout isAdmin>
        <p className="p-6 text-gray-600">Loading task...</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout isAdmin>
      <main className="min-h-screen bg-slate-50 p-4 sm:p-6">
        <section className="mx-auto max-w-3xl">
          <Link
            to="/admin/tasks"
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back to Tasks
          </Link>

          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            Edit Task
          </h1>

          <p className="mt-1 text-sm text-gray-600">
            Update the details and learning resources for this task.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-4 rounded-xl border bg-white p-5 sm:p-6"
          >
            <div>
              <label
                htmlFor="title"
                className="mb-1 block text-sm font-medium"
              >
                Task Title
              </label>

              <input
                id="title"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
                className="w-full rounded-md border p-2 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-1 block text-sm font-medium"
              >
                Description
              </label>

              <textarea
                id="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                required
                rows={4}
                className="w-full rounded-md border p-2 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="position"
                className="mb-1 block text-sm font-medium"
              >
                Position
              </label>

              <input
                id="position"
                type="number"
                min="1"
                value={position}
                onChange={(event) => setPosition(event.target.value)}
                required
                className="w-full rounded-md border p-2 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="difficulty"
                className="mb-1 block text-sm font-medium"
              >
                Difficulty
              </label>

              <select
                id="difficulty"
                value={difficulty}
                onChange={(event) => setDifficulty(event.target.value)}
                required
                className="w-full rounded-md border bg-white p-2 outline-none focus:border-blue-500"
              >
                <option value="">Select difficulty</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(event) =>
                  setIsPublished(event.target.checked)
                }
                className="size-4"
              />
              Publish this task
            </label>

            {error && (
              <p role="alert" className="text-sm text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving Changes..." : "Save Changes"}
            </button>
          </form>

          {/* Resource management */}
          <section className="mt-8 rounded-xl border bg-white p-5 sm:p-6">
            <h2 className="text-xl font-bold text-gray-900">
              Learning Resources
            </h2>

            <p className="mt-1 text-sm text-gray-600">
              Add tutorials, documentation, and other materials for learners.
            </p>

            <form
              onSubmit={handleResourceSubmit}
              className="mt-5 space-y-4 border-b pb-6"
            >
              <h3 className="font-semibold text-gray-800">
                {editingResourceId !== null
                  ? "Edit Resource"
                  : "Add Resource"}
              </h3>

              <div>
                <label
                  htmlFor="resourceTitle"
                  className="mb-1 block text-sm font-medium"
                >
                  Resource Title
                </label>

                <input
                  id="resourceTitle"
                  name="title"
                  value={resourceForm.title}
                  onChange={handleResourceInput}
                  required
                  placeholder="e.g. React Official Documentation"
                  className="w-full rounded-md border p-2 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="resourceUrl"
                  className="mb-1 block text-sm font-medium"
                >
                  Resource URL
                </label>

                <input
                  id="resourceUrl"
                  name="url"
                  type="url"
                  value={resourceForm.url}
                  onChange={handleResourceInput}
                  required
                  placeholder="https://example.com"
                  className="w-full rounded-md border p-2 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="resourceType"
                  className="mb-1 block text-sm font-medium"
                >
                  Resource Type
                </label>

                <select
                  id="resourceType"
                  name="type"
                  value={resourceForm.type}
                  onChange={handleResourceInput}
                  required
                  className="w-full rounded-md border bg-white p-2 outline-none focus:border-blue-500"
                >
                  <option value="">Select resource type</option>
                  <option value="Documentation">Documentation</option>
                  <option value="Tutorial">Tutorial</option>
                  <option value="Video">Video</option>
                  <option value="Article">Article</option>
                  <option value="Exercise">Exercise</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {resourceError && (
                <p role="alert" className="text-sm text-red-600">
                  {resourceError}
                </p>
              )}

              {resourceMessage && (
                <p role="status" className="text-sm text-green-600">
                  {resourceMessage}
                </p>
              )}

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={resourceSaving}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {resourceSaving
                    ? "Saving..."
                    : editingResourceId !== null
                      ? "Update Resource"
                      : "Add Resource"}
                </button>

                {editingResourceId !== null && (
                  <button
                    type="button"
                    onClick={resetResourceForm}
                    className="rounded-md border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <div className="mt-6">
              <h3 className="font-semibold text-gray-800">
                Existing Resources ({resources.length})
              </h3>

              {resources.length === 0 ? (
                <p className="mt-3 text-sm text-gray-500">
                  No resources have been added to this task yet.
                </p>
              ) : (
                <ul className="mt-3 divide-y">
                  {resources.map((resource) => (
                    <li
                      key={resource.id}
                      className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900">
                          {resource.title}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          {resource.type}
                        </p>

                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 block break-all text-sm text-blue-600 hover:underline"
                        >
                          {resource.url}
                        </a>
                      </div>

                      <div className="flex shrink-0 gap-3">
                        <button
                          type="button"
                          onClick={() => handleEditResource(resource)}
                          className="text-sm font-medium text-blue-600 hover:underline"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteResource(resource.id)
                          }
                          disabled={deletingResourceId === resource.id}
                          className="text-sm font-medium text-red-600 hover:underline disabled:opacity-50"
                        >
                          {deletingResourceId === resource.id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </section>
      </main>
    </DashboardLayout>
  );
}