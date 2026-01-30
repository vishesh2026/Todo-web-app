
# Todo Web App – Full Stack Web Application

A modern, feature-rich task management application built using the MERN stack (MongoDB, Express.js, React.js, Node.js).
This app helps users organize their work using boards and tasks, with full CRUD functionality and a secure authentication system including email verification.

The goal of this project is to provide a clean, practical, and scalable task management solution.

## Features

- **User Authentication**:
  - Email & password registration
  - Email verification system
  - Secure login & logout
  - Password reset functionality
  - JWT-based authentication
 
- **Board Management**:
  - Create custom boards
  - Edit board details (title, description, color)
  - Delete boards
  - View board statistics
 
- **Task Management**:
  - Create tasks within boards
  - Edit task details
  - Mark tasks as complete / incomplete
  - Delete tasks
  - View tasks by board
  - Filter tasks (all / active / completed)
  - Mark tasks as complete / incomplete
  - Delete tasks

## Backend API Documentation

### Register API

- **Endpoint**: `/api/v1/register`
- **Method**: `POST`
- **Description**: Creates a new user account with the provided email, username, and password.
- **Parameters**:
  - `email` (string): User's email address.
  - `username` (string): User's chosen username.
  - `password` (string): User's chosen password.
- **Response**:
  - `message` (string): Success message or error message if user already exists.

### Sign-In API

- **Endpoint**: `/api/v1/login`
- **Method**: `POST`
- **Description**: Allows existing users to log in with their email and password.
- **Parameters**:
  - `email` (string): User's email address.
  - `password` (string): User's password.
- **Response**:
  - `others` (object): User details excluding the password.
  - `message` (string): Error message if login fails.

### Create Task API

- **Endpoint**: `/api/v2/addTask`
- **Method**: `POST`
- **Description**: Adds a new task to the user's to-do list.
- **Parameters**:
  - `title` (string): Title of the task.
  - `body` (string): Description of the task.
  - `email` (string): User's email address.
- **Response**:
  - `list` (object): Details of the added task.

### Update Task API

- **Endpoint**: `/api/v2/updateTask/:id`
- **Method**: `PUT`
- **Description**: Updates an existing task in the user's to-do list.
- **Parameters**:
    - `title` (string): New title for the task.
    - `body` (string): New description for the task.
    - `email` (string): User's email address.
- **Response**:
    - `message` (string): Success message indicating the task was updated.

### Delete Task API

- **Endpoint**: `/api/v2/deleteTask/:id`
- **Method**: `DELETE`
- **Description**: Deletes a task from the user's to-do list.
- **Parameters**:
    - `id` (string): ID of the task to be deleted.
    - `email` (string): User's email address.
- **Response**:
    - `message` (string): Success message indicating the task was deleted.

### Get Tasks API

- **Endpoint**: `/api/v2/getTask/:id`
- **Method**: `GET`
- **Description**: Retrieves all tasks belonging to a user.
- **Parameters**:
    - `id` (string): ID of the user whose tasks are to be retrieved.
- **Response**:
    - `list` (array): Array of task objects belonging to the user.

## Technologies Used

- **Frontend**:
  - React.js: For user interfaces.
  - React Router: For Routing in applications.
  - Bootstrap: For responsive design.
  - React Icons: Icon library.
  - Axios: For making requests to the backend.

- **Backend**:
  - Node.js: For server-side logic.
  - Express.js: For building APIs and handling HTTP requests.
  - MongoDB: For storing user data and task information.
  - Mongoose: MongoDB object modeling for Node.js applications.
  - bcrypt.js: Library for hashing passwords securely.



## Getting Started
  To run this locally, follow these steps:
  
  1. Clone the repository:
      ```bash
      git clone https://github.com/vishesh2026/Todo-web-app.git
  
  2. Navigate to the project directory:
      ```bash
      cd todo-app-mern
  
  3. Install dependencies for the frontend and backend:
      ```bash
      cd frontend
      npm install
  
      cd backend
      npm install
  
  4. Start the frontend server:
      ```bash
      npm start
  
  5. Start the backend server:
      ```bash
      npm run dev


## Project Architecture

  ```bash
    
        todo-app-mern/
        ├── backend/
        │   ├── controllers/
        │   │   ├── userController.js
        │   │   ├── boardController.js
        │   │   ├── taskController.js
        │   │   └── forgotPasswordController.js
        │   ├── models/
        │   │   ├── userModel.js
        │   │   ├── boardModel.js
        │   │   └── taskModel.js
        │   ├── routes/
        │   │   ├── userRoute.js
        │   │   ├── boardRoute.js
        │   │   ├── taskRoute.js
        │   │   └── forgotPassword.js
        │   ├── middleware/
        │   │   └── requireAuth.js
        │   ├── utils/
        │   │   └── emailService.js
        │   ├── .env
        │   ├── server.js
        │   └── package.json
        │
        ├── frontend/
        │   ├── public/
        │   ├── src/
        │   │   ├── components/
        │   │   │   ├── Header/
        │   │   │   ├── Dashboard/
        │   │   │   ├── Board/
        │   │   │   ├── Task/
        │   │   │   ├── createTask/
        │   │   │   ├── forgotPassword/
        │   │   │   ├── Login.jsx
        │   │   │   ├── Register.jsx
        │   │   │   └── VerifyEmail.jsx
        │   │   ├── context/
        │   │   │   ├── TaskContext.js
        │   │   │   ├── BoardContext.js
        │   │   │   └── TokenContext.js
        │   │   ├── reducer/
        │   │   │   ├── taskReducer.js
        │   │   │   ├── boardReducer.js
        │   │   │   ├── tokenReducer.js
        │   │   │   └── userReducer.js
        │   │   ├── Axios/
        │   │   │   └── axios.js
        │   │   ├── App.js
        │   │   ├── App.css
        │   │   └── index.js
        │   ├── .env
        │   └── package.json
        │
        └── README.md

    
