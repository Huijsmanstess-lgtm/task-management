# Task Management App

A modern full-stack task management application built with Next.js 15, TypeScript, Tailwind CSS, Prisma, MongoDB, NextAuth, and shadcn/ui.

## Features

- User authentication with NextAuth
- Task creation and management
- Modern UI with shadcn/ui components
- MongoDB database with Prisma ORM
- Responsive design with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB database

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up your database:
   - Install MongoDB if you haven't already
   - Start MongoDB service
   - Update the `DATABASE_URL` in `.env` with your MongoDB connection string

3. Set up Prisma:
   ```bash
   npx prisma db push
   npx prisma generate
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
DATABASE_URL="mongodb://localhost:27017/your_database_name"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

## Project Structure

- `app/` - Next.js app directory
- `lib/` - Utility functions and configurations
- `components/` - Reusable UI components
- `prisma/` - Database schema and migrations

## Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Prisma** - Database ORM
- **MongoDB** - NoSQL database
- **NextAuth** - Authentication library
- **shadcn/ui** - UI component library
