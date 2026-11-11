export type Resource = {
  id: number;
  taskId: number;
  title: string;
  url: string;
  type: string;
};

export type ResourceInput = {
  title: string;
  url: string;
  type: string;
};

const API_URL = "http://localhost:5000";

export async function getTaskResources(
  taskId: number
): Promise<Resource[]> {
  const response = await fetch(
    `${API_URL}/api/resources/task/${taskId}`
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to fetch resources"
    );
  }

  return result;
}

export async function getAdminTaskResources(
  taskId: number,
  token: string
): Promise<Resource[]> {
  const response = await fetch(
    `${API_URL}/api/resources/task/${taskId}/all`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to fetch task resources"
    );
  }

  return result;
}

export async function createResource(
  taskId: number,
  data: ResourceInput,
  token: string
): Promise<Resource> {
  const response = await fetch(
    `${API_URL}/api/resources/task/${taskId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to create resource"
    );
  }

  return result;
}

export async function updateResource(
  resourceId: number,
  data: Partial<ResourceInput>,
  token: string
): Promise<Resource> {
  const response = await fetch(
    `${API_URL}/api/resources/${resourceId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to update resource"
    );
  }

  return result;
}

export async function deleteResource(
  resourceId: number,
  token: string
): Promise<void> {
  const response = await fetch(
    `${API_URL}/api/resources/${resourceId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const result = await response.json();

    throw new Error(
      result.message || "Failed to delete resource"
    );
  }
}