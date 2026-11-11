import type { Task } from "../types/task";

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

export async function getTasks(): Promise<Task[]> {
  const response = await fetch(`${API_URL}/tasks`);

  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }

  return response.json();
}