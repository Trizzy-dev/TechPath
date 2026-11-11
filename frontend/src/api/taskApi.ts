export type Task = {
  id: number;
  title: string;
  description: string;
  position: number;
  difficulty: string;
  isPublished: boolean;
  isArchived?: boolean;
};

const API_URL = import.meta.env.VITE_API_URL;

export async function getAllTasks(): Promise<Task[]> {
  const response = await fetch(`${API_URL}/api/tasks`);

  if (!response.ok) {
    throw new Error("Failed to fetch all tasks");
  }

  return response.json();
}

export async function getPublishedTasks(): Promise<Task[]> {
  const response = await fetch(
    `${API_URL}/api/tasks/published`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }

  return response.json();
}

export async function getTaskById(taskId: number): Promise<Task> {
const response = await fetch(`${API_URL}/api/tasks/${taskId}`);
const result = await response.json();

if (!response.ok) {
throw new Error(result.message || "Failed to fetch task");
}

return result;
}

export async function getAccessibleTaskById(
  taskId: number,
  token: string
): Promise<Task> {
  const response = await fetch(
    `${API_URL}/api/tasks/accessible/${taskId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to fetch task"
    );
  }

  return result;
}

export async function getPublishedTaskById(
  taskId: number
): Promise<Task> {
  const response = await fetch(
    `${API_URL}/api/tasks/published/${taskId}`
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to fetch task"
    );
  }

  return result;
}

export async function createTask(
  data: Omit<Task, "id">,
  token: string
): Promise<Task> {
  const response = await fetch(`${API_URL}/api/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to create task");
  }

  return result;
}


export async function updateTask(
taskId: number,
data: Omit<Task, "id">,
token: string
): Promise<Task> {
const response = await fetch(`${API_URL}/api/tasks/${taskId}`, {
method: "PATCH",
headers: {
"Content-Type": "application/json",
Authorization: `Bearer ${token}`,
},
body: JSON.stringify(data),
});

const result = await response.json();

if (!response.ok) {
throw new Error(result.message || "Failed to update task");
}

return result;
}


export async function deleteTask(
  taskId: number,
  token: string
): Promise<void> {
  const response = await fetch(`${API_URL}/api/tasks/${taskId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.message || "Failed to delete task");
  }
}

export async function archiveTask(
  taskId: number,
  token: string
): Promise<void> {
  const response = await fetch(
    `${API_URL}/api/tasks/${taskId}/archive`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to archive task");
  }
}

export async function restoreTask(
  taskId: number,
  token: string
): Promise<void> {
  const response = await fetch(
    `${API_URL}/api/tasks/${taskId}/restore`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to restore task");
  }
}