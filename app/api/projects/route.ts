import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Project, { PROJECT_STATUSES } from '@/lib/models/Project';

const serializeProject = (project: any) => ({
  ...project,
  _id: project._id.toString(),
  userId: project.userId.toString(),
  createdAt: project.createdAt.toISOString(),
  updatedAt: project.updatedAt.toISOString(),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const projects = await Project.find({ userId: session.user.id }).sort({ createdAt: -1 }).lean();
    return NextResponse.json(projects.map(serializeProject));
  } catch (error) {
    console.error('GET /api/projects error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const name = body.name?.trim();
    const description = body.description?.trim() || '';
    const status = body.status || 'active';
    const color = body.color?.trim() || 'sky';

    if (!name) {
      return NextResponse.json({ error: 'Name is required.' }, { status: 400 });
    }

    if (!PROJECT_STATUSES.includes(status)) {
      return NextResponse.json({ error: 'Invalid status.' }, { status: 400 });
    }

    await connectDB();
    const project = await Project.create({
      name,
      description,
      status,
      color,
      taskCount: 0,
      userId: session.user.id,
    });

    return NextResponse.json(serializeProject(project.toObject()), { status: 201 });
  } catch (error) {
    console.error('POST /api/projects error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
