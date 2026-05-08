"use server";

import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Task, { TASK_STATUSES } from '@/lib/models/Task';

const TASK_STATUS_VALUES = ['todo', 'in-progress', 'done'] as const;

const taskSchema = z.object({
  title: z.string().min(1, { message: 'Titel is verplicht.' }).max(150, { message: 'Titel mag maximaal 150 tekens zijn.' }),
  description: z.string().max(1000, { message: 'Beschrijving mag maximaal 1000 tekens zijn.' }).optional(),
  status: z.enum(TASK_STATUS_VALUES),
});

export type CreateTaskInput = z.infer<typeof taskSchema>;

export async function createTask(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error('Je moet ingelogd zijn om een taak aan te maken.');
  }

  const rawData = {
    title: formData.get('title'),
    description: formData.get('description'),
    status: formData.get('status'),
  };

  const parseResult = taskSchema.safeParse({
    title: typeof rawData.title === 'string' ? rawData.title.trim() : '',
    description: typeof rawData.description === 'string' ? rawData.description.trim() : '',
    status: typeof rawData.status === 'string' ? rawData.status : 'todo',
  });

  if (!parseResult.success) {
    const message = parseResult.error.issues.map((issue) => issue.message).join(' ');
    throw new Error(message || 'Ongeldige taakgegevens.');
  }

  await connectDB();

  await Task.create({
    title: parseResult.data.title,
    description: parseResult.data.description,
    status: parseResult.data.status,
    userId: session.user.id,
  });

  revalidatePath('/dashboard');
}

export async function updateTask(taskId: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error('Je moet ingelogd zijn om deze taak te bewerken.');
  }

  const rawData = {
    title: formData.get('title'),
    description: formData.get('description'),
    status: formData.get('status'),
  };

  const parseResult = taskSchema.safeParse({
    title: typeof rawData.title === 'string' ? rawData.title.trim() : '',
    description: typeof rawData.description === 'string' ? rawData.description.trim() : '',
    status: typeof rawData.status === 'string' ? rawData.status : 'todo',
  });

  if (!parseResult.success) {
    const message = parseResult.error.issues.map((issue) => issue.message).join(' ');
    throw new Error(message || 'Ongeldige taakgegevens.');
  }

  await connectDB();

  const updatedTask = await Task.findOneAndUpdate(
    { _id: taskId, userId: session.user.id },
    {
      title: parseResult.data.title,
      description: parseResult.data.description,
      status: parseResult.data.status,
    },
    { new: true }
  ).lean();

  if (!updatedTask) {
    throw new Error('Taak niet gevonden of je hebt geen rechten om deze taak te bewerken.');
  }

  revalidatePath('/dashboard');
  return updatedTask;
}

export async function deleteTask(taskId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error('Je moet ingelogd zijn om deze taak te verwijderen.');
  }

  await connectDB();

  const deletedTask = await Task.findOneAndDelete({
    _id: taskId,
    userId: session.user.id,
  }).lean();

  if (!deletedTask) {
    throw new Error('Taak niet gevonden of je hebt geen rechten om deze taak te verwijderen.');
  }

  revalidatePath('/dashboard');
  return deletedTask;
}
