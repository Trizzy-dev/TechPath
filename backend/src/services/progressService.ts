import { db } from "../../prisma/db";

export async function getUserProgress(userId: number) {
  return db.orm.public.Progress
    .where({ userId })
    .all();
}

export async function getTaskProgress(
  userId: number,
  taskId: number
) {
  return db.orm.public.Progress
    .where({ userId, taskId })
    .first();
}

export async function startTask(
  userId: number,
  taskId: number
) {
  const task = await db.orm.public.Task
    .where({
      id: taskId,
      isPublished: true,
      isArchived: false,
    })
    .first();

  if (!task) {
    throw new Error("TASK_NOT_FOUND");
  }

  const existingProgress = await getTaskProgress(
    userId,
    taskId
  );

  if (existingProgress) {
    return existingProgress;
  }

  // The first task is always unlocked
  if (task.position > 1) {
    const previousTask = await db.orm.public.Task
      .where({
        position: task.position - 1,
        isPublished: true,
        isArchived: false,
      })
      .first();

    if (previousTask) {
      const previousProgress =
        await getTaskProgress(
          userId,
          previousTask.id
        );

      if (
        !previousProgress ||
        previousProgress.status !== "completed"
      ) {
        throw new Error("TASK_LOCKED");
      }
    }
  }

  return db.orm.public.Progress.create({
    userId,
    taskId,
    status: "in_progress",
    startedAt: new Date().toISOString(),
  });
}

export async function completeTask(
  userId: number,
  taskId: number
) {
  const existingProgress = await getTaskProgress(
    userId,
    taskId
  );

  if (!existingProgress) {
    throw new Error("PROGRESS_NOT_FOUND");
  }

  return db.orm.public.Progress
    .where({
      id: existingProgress.id,
    })
    .update({
      status: "completed",
      completedAt: new Date().toISOString(),
    });
}

export async function getProgressSummary(
  userId: number
) {
  const tasks = await db.orm.public.Task
    .where({
      isPublished: true,
      isArchived: false,
    })
    .all();

  const progress = await getUserProgress(userId);

  const completed = progress.filter(
    (item) =>
      item.status === "completed" &&
      tasks.some((task) => task.id === item.taskId)
  ).length;

  const inProgress = progress.filter(
    (item) =>
      item.status === "in_progress" &&
      tasks.some((task) => task.id === item.taskId)
  ).length;

  const total = tasks.length;

  const remaining = total - completed;

  const percentage =
    total === 0
      ? 0
      : Math.round((completed / total) * 100);

  return {
    total,
    completed,
    inProgress,
    remaining,
    percentage,
  };
}