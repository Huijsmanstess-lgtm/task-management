# Task Manager

A full-stack task management web application with authentication 
and personal task tracking.

## What it does

- Create an account and log in securely
- Create, edit, and delete tasks
- Update task status: To Do, In Progress, Done
- Personal dashboard with all your tasks

## Tech stack

**Frontend**
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui

**Backend**
- Next.js API Routes
- MongoDB Atlas + Mongoose
- NextAuth/Auth.js
- bcryptjs password hashing
- JWT sessions + protected routes

## Getting started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account

### Installation

git clone https://github.com/Huijsmanstess-lgtm/task-management.git
cd task-management
npm install

### Environment variables

Create a `.env.local` file:

MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000

### Run locally

npm run dev

## Live demo

https://task-management-orcin-gamma.vercel.app
