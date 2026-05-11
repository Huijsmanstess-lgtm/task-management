import mongoose, { Schema, Document } from 'mongoose';

export const PROJECT_STATUSES = ['active', 'completed', 'on-hold'] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export interface IProject extends Document {
  name: string;
  description?: string;
  status: ProjectStatus;
  color: string;
  taskCount: number;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [120, 'Name cannot be more than 120 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    status: {
      type: String,
      enum: PROJECT_STATUSES,
      default: 'active',
      required: [true, 'Status is required'],
    },
    color: {
      type: String,
      required: [true, 'Color label is required'],
      default: 'sky',
    },
    taskCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
