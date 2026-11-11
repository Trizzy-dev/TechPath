export type Progress = {
  id: number;
  userId: number;
  taskId: number;
  status: string;
  startedAt: string | null;
  completedAt: string | null;
};

const API_URL = "http://localhost:5000";

export async function getUserProgress(
  token: string
): Promise<Progress[]> {
  const response = await fetch(
    `${API_URL}/api/progress`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch progress");
  }

  return response.json();
}

export async function startTask(
  token: string,
  taskId: number
): Promise<Progress> {
  const response = await fetch(
    `${API_URL}/api/progress/task/${taskId}/start`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to start task"
    );
  }

  return result;
}

export async function completeTask(
  token: string,
  taskId: number
): Promise<Progress> {
  const response = await fetch(
    `${API_URL}/api/progress/task/${taskId}/complete`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to complete task"
    );
  }

  return result;
}