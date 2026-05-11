import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import Task from '@/lib/models/Task';
import Project from '@/lib/models/Project';

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const name = typeof body.name === 'string' ? body.name.trim() : undefined;
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : undefined;
    const currentPassword = body.currentPassword;
    const newPassword = body.newPassword;

    if (!name && !email && !newPassword) {
      return NextResponse.json({ error: 'No changes provided.' }, { status: 400 });
    }

    await connectDB();

    const user = await User.findById(session.user.id).select('+password');
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const updates: Record<string, any> = {};
    if (name) updates.name = name;
    if (email && email !== user.email) {
      const existing = await User.findOne({ email });
      if (existing) {
        return NextResponse.json({ error: 'Email is already in use.' }, { status: 409 });
      }
      updates.email = email;
    }

    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: 'Current password is required to change your password.' }, { status: 400 });
      }

      const valid = await bcrypt.compare(currentPassword, user.password);
      if (!valid) {
        return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 401 });
      }

      updates.password = await bcrypt.hash(newPassword, 12);
    }

    await User.findByIdAndUpdate(session.user.id, updates, { new: true });
    return NextResponse.json({ message: 'Account updated successfully.' });
  } catch (error) {
    console.error('PATCH /api/user error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    await Promise.all([
      Task.deleteMany({ userId: session.user.id }),
      Project.deleteMany({ userId: session.user.id }),
      User.deleteOne({ _id: session.user.id }),
    ]);

    return NextResponse.json({ message: 'Account deleted successfully.' });
  } catch (error) {
    console.error('DELETE /api/user error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
