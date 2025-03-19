# TaskMate - A Simple To-Do List with Authentication 
## Overview
TaskMate is a full-stack web application designed to help users efficiently manage their daily tasks in a structured and organized way. It provides secure user authentication using JWT, ensuring that each user can only access and manage their own tasks. The application is built with **React** for the frontend and **Node.js with Express.js** for the backend, utilizing **MongoDB** as the database.
With TaskMate, users can:
- **Register & Log in securely** to keep their tasks private.
- **Create, edit, and delete tasks** in a simple and intuitive interface.
- **View and Manage their tasks** with a clear and responsive design.
- **Access their to-do list from any device**, as it is mobile-friendly.
- **Ensure data security** with password hashing and token-based authentication.

## Features of TaskMate
**1. User Authentication (JWT-based)**
- Users can sign up, login and logout securely.
- Passwords are hashed for security using bcrypt.
- JWT (JSON Web Tokens) ensures secure user sessions.
  
**2. Task Management (CRUD Operations)**
- Users can create, view, edit, and delete tasks.
- Each user can only access their own tasks for privacy.

**3. Secure Task Access**
- Every task is associated with a specific user.
- Unauthorized users cannot view or modify other users' tasks.

**4. Responsive & User-Friendly Design**
- Fully optimized for mobile, tablet, and desktop users.
- Clean UI using Bootstrap for a seamless experience.

**5. Form Validation (Client & Server-side)**
- Input fields are validated before submitting data.
- Prevents empty fields, invalid inputs, and duplicate entries.

**6. Error Handling for Seamless User Experience**
- Friendly error messages guide users when issue arises.
- API responses include meaningful status codes for debugging.

## Tech Stack
### Frontend
- React with Vite
- React Router for navigation
- Bootstrap for styling

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- JSON Web Tokens (JWT) for authentication
- bcrypt for password hashing

## Installation & Setup
### Prerequisites
Ensure you have Node.js and MongoDB (not necessary, can use Atlas) installed on your system.
### Clone the Repository
```sh
git clone https://github.com/suryateja213/ToDoApp_Challenge.git
```
### Backend Setup
```sh
cd backend
npm install
```
Create a `.env` file in the backend root directory and add:
```sh
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```
- #### For MongoDB Atlas:
If you are using MongoDB Atlas, the connection string looks like this:
```sh
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<database_name>?retryWrites=true&w=majority
```
- #### For Localhost (Local MongoDB):
If you're running MongoDB locally (on your own machine), the connection string looks like this:
```sh
MONGO_URI=mongodb://localhost:27017/<database_name>
```
#### Start the backend Server
```sh
npm run dev
```
### Frontend Setup
```sh
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`
## API Endpoints
**Authentication**
- **POST** `/api/register` - Registers a new user
- **POST** `/api/login` - Log in a user

**Tasks**
- **GET** `/api/tasks` - Get all tasks for the logged-in user
- **POST** - `/api/tasks` - Add a new task
- **PUT** - `/api/tasks/:id` - Update a task
- **DELETE** - `/api/tasks/:id` - Delete a task

## Live Demo
You can access the website here: (https://storied-starlight-30cb3d.netlify.app/)
 



 




