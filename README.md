# Task Management API

A RESTful API for task management with user authentication and CRUD operations.

## Features ✅
- ✅ User registration and authentication with JWT
- ✅ Create, read, update, delete tasks
- ✅ Task categorization with colors
- ✅ Priority levels (LOW, MEDIUM, HIGH, URGENT)
- ✅ Due dates for tasks
- ✅ User-specific task management
- ✅ Input validation with Joi
- ✅ Secure password hashing with bcrypt

## Tech Stack
- Node.js & Express.js
- SQLite database with Prisma ORM
- JWT Authentication
- bcryptjs for password hashing
- Joi for validation
- Helmet for security

## Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and update values
4. Generate Prisma client: `npx prisma generate`
5. Push database schema: `npx prisma db push`
6. Run development server: `npm run dev`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Tasks (Protected)
- `GET /api/tasks` - Get user's tasks
- `GET /api/tasks/:id` - Get specific task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### User Profile (Protected)
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

## Development Progress
- [x] Day 1: Project setup and basic server
- [x] Day 2: Database design with Prisma
- [x] Day 3: Route structure and middleware
- [x] Day 4: JWT authentication utilities
- [x] Day 5: User registration and login
- [x] Day 6: Complete CRUD operations
- [x] Day 7: Authentication middleware and security