# Test Credentials for Local Gov Sphere Connect

## Admin Account
- **Email**: admin@city.gov
- **Password**: admin123
- **Role**: Admin
- **Permissions**: Create government officials, create workers, view all posts, manage departments

## Government Official Account
- **Email**: official@city.gov
- **Password**: official123
- **Role**: Government Official
- **Department**: Public Works
- **Permissions**: Assign tasks to workers, review completed work, manage workers

## Worker Account
- **Email**: worker@city.gov
- **Password**: worker123
- **Role**: Worker
- **Department**: Public Works
- **Designation**: Field Technician
- **Permissions**: View assigned tasks, submit proof of completion

## Citizen Account
- **Email**: citizen@example.com
- **Password**: citizen123
- **Role**: Citizen
- **Location**: Downtown
- **Permissions**: Create posts, view other posts, like and comment

## Test Flow Instructions

### 1. Admin Flow
1. Login as admin@city.gov
2. Go to "Manage Officials" - Create a new government official
3. Go to "Manage Workers" - Create a new worker
4. View analytics dashboard with real data

### 2. Government Official Flow
1. Login as official@city.gov
2. View department feed with posts
3. Assign a worker to a pending post
4. Review completed tasks
5. Manage workers in department

### 3. Worker Flow
1. Login as worker@city.gov
2. View assigned tasks
3. Submit proof of completion for a task
4. View completed tasks

### 4. Citizen Flow
1. Login as citizen@example.com
2. Create a new post with photos/videos
3. View other posts in feed
4. Like and comment on posts
5. View personal statistics

### 5. Complete Workflow Test
1. Citizen creates a post about a pothole
2. Government official assigns the task to a worker
3. Worker completes the task and submits proof
4. Government official reviews and approves the work
5. Post status updates to resolved

## API Endpoints

### Authentication
- POST `/api/auth/login` - Login user
- POST `/api/auth/register` - Register citizen
- GET `/api/auth/me` - Get current user

### Posts
- GET `/api/posts` - Get all posts
- POST `/api/posts` - Create new post
- PATCH `/api/posts/:id` - Update post

### Tasks
- GET `/api/tasks` - Get tasks for user
- POST `/api/tasks` - Create new task
- PATCH `/api/tasks/:id/status` - Update task status
- PATCH `/api/tasks/:id/review` - Review task

### Workers
- GET `/api/workers` - Get all workers
- POST `/api/workers` - Create new worker
- POST `/api/workers/login` - Worker login

### Users
- GET `/api/users` - Get users (admin only)
- POST `/api/users` - Create user (admin only)

### Upload
- POST `/api/upload/multiple` - Upload multiple files

## Database Collections

### Users
- Citizens: Can create posts, view feed
- Government Officials: Can assign tasks, review work
- Workers: Can view tasks, submit proof
- Admins: Can manage all users

### Posts
- Created by citizens
- Can have multiple media files
- Status: pending, assigned, in_progress, completed, resolved

### Tasks
- Created by government officials
- Assigned to workers
- Status: assigned, in_progress, completed, closed
- Can have work proof and remarks

## Testing Checklist

- [ ] Admin can create government officials
- [ ] Admin can create workers
- [ ] Government official can assign tasks
- [ ] Worker can view assigned tasks
- [ ] Worker can submit proof
- [ ] Government official can review tasks
- [ ] Citizen can create posts with media
- [ ] All dashboards show correct analytics
- [ ] Media upload and display works
- [ ] Authentication works for all roles
- [ ] Task workflow completes end-to-end