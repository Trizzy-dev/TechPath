import { db } from "../../prisma/db";

export async function getPublishedResourcesByTask(
  taskId: number
) {
  const task = await db.orm.public.Task
    .where({
      id: taskId,
      isPublished: true,
    })
    .first();

  if (!task) {
    throw new Error("TASK_NOT_FOUND");
  }

  return db.orm.public.Resource
    .where({ taskId })
    .all();
}

export async function getAllResourcesByTask(taskId: number) {
  const task = await db.orm.public.Task
    .where({ id: taskId })
    .first();

  if (!task) {
    throw new Error("TASK_NOT_FOUND");
  }

  return db.orm.public.Resource
    .where({ taskId })
    .all();
}

export async function getResourceById(id: number) {
  return db.orm.public.Resource
    .where({ id })
    .first();
}

export async function createResource(data: {
  taskId: number;
  title: string;
  url: string;
  type: string;
}) {
  const task = await db.orm.public.Task
    .where({ id: data.taskId })
    .first();

  if (!task) {
    throw new Error("TASK_NOT_FOUND");
  }

  return db.orm.public.Resource.create({
    taskId: data.taskId,
    title: data.title,
    url: data.url,
    type: data.type,
  });
}

export async function updateResource(
  id: number,
  data: {
    title?: string;
    url?: string;
    type?: string;
  }
) {
  const resource = await getResourceById(id);

  if (!resource) {
    throw new Error("RESOURCE_NOT_FOUND");
  }

  const updatedResource = await db.orm.public.Resource
    .where({ id })
    .update(data);

  if (!updatedResource) {
    throw new Error("RESOURCE_NOT_FOUND");
  }

  return updatedResource;
}

export async function deleteResource(id: number) {
  const resource = await getResourceById(id);

  if (!resource) {
    throw new Error("RESOURCE_NOT_FOUND");
  }

  return db.orm.public.Resource
    .where({ id })
    .delete();
}