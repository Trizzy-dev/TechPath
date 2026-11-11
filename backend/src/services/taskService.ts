import { db } from "../../prisma/db";

export async function getTasks() {
  return db.orm.public.Task
    .orderBy((task) => task.position.asc())
    .all();
}

export async function getPublishedTasks() {
  return db.orm.public.Task
    .where({
      isPublished: true,
      isArchived: false,
    })
    .orderBy((task) => task.position.asc())
    .all();
}

export async function getTaskById(id: number) {
  return db.orm.public.Task
    .where({ id })
    .first();
}

export async function getPublishedTaskById(id: number) {
  return db.orm.public.Task
    .where({
      id,
      isPublished: true,
      isArchived: false,
    })
    .first();
}

export async function createTask(data: {
  title: string;
  description: string;
  position: number;
  difficulty: string;
  isPublished?: boolean;
}) {
  return db.orm.public.Task.create({
    title: data.title,
    description: data.description,
    position: data.position,
    difficulty: data.difficulty,
    isPublished: data.isPublished ?? false,
  });
}

export async function updateTask(
  id: number,
  data: {
    title?: string;
    description?: string;
    position?: number;
    difficulty?: string;
    isPublished?: boolean;
  }
) {
  return db.orm.public.Task
    .where({ id })
    .update(data);
}

export async function archiveTask(id: number) {
  return db.orm.public.Task
    .where({ id })
    .update({ isArchived: true });
}

export async function restoreTask(id: number) {
  return db.orm.public.Task
    .where({ id })
    .update({ isArchived: false });
}

export async function deleteTask(id: number) {
  return db.transaction(async (tx) => {
    // Check whether the task exists
    const task = await tx.orm.public.Task
      .where({ id })
      .first();

    if (!task) {
      return null;
    }

    // Delete all progress records associated with the task
    await tx.orm.public.Progress
      .where({ taskId: id })
      .deleteAll();

    // Delete all resources associated with the task
    await tx.orm.public.Resource
      .where({ taskId: id })
      .deleteAll();

    // Delete the task itself
    await tx.orm.public.Task
      .where({ id })
      .delete();

    return task;
  });
}

export async function getAccessibleTaskById(
  userId: number,
  taskId: number
) {
  const task = await db.orm.public.Task
    .where({
      id: taskId,
      isPublished: true,
    })
    .first();

  if (!task) {
    return null;
  }

  if (!task.isArchived) {
    return task;
  }

  const progress = await db.orm.public.Progress
    .where({
      userId,
      taskId,
    })
    .first();

  return progress ? task : null;
}