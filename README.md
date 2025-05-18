# TaskMaster Project

TaskMaster is a simple task management application built with FastAPI (backend) and React (frontend). This project is designed as a learning exercise for fullstack development, focusing on the fundamentals of building a web application with a REST API and a reactive frontend.

## Features

- Create, read, update, and delete tasks
- Mark tasks as complete/incomplete
- Set task priority levels
- View task statistics (total, completed, pending)
- Simple and intuitive user interface

## Project Structure

```
taskmaster/
├── backend/               # FastAPI backend
│   ├── main.py            # All FastAPI code in one file
│   ├── database.py        # Database setup
│   └── requirements.txt   # Python dependencies
└── frontend/              # React frontend
    ├── public/
    │   └── index.html     # HTML template
    ├── src/
    │   ├── components/    # React components
    │   │   ├── App.js     # Main App component
    │   │   ├── TaskList.js # Task list component
    │   │   └── TaskForm.js # Form for creating/editing tasks
    │   ├── App.css        # Main CSS styles
    │   └── index.js       # React entry point
    └── package.json       # Node.js dependencies
```

## Getting Started

### Prerequisites

- Python 3.7+
- Node.js 14+
- npm or yarn

## To Run the Program

### 1. Backend (FastAPI)

1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. (Optional) Activate your Python virtual environment:
   ```bash
   source ../venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```
   The backend will run at [http://localhost:8000](http://localhost:8000)

### 2. Frontend (React)

1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm start
   ```
   The frontend will run at [http://localhost:3000](http://localhost:3000)

### 3. Access the App

- Open your browser and go to [http://localhost:3000](http://localhost:3000)
- You can now use the TaskMaster app!

---

For production builds or more advanced usage, see the rest of this README or project documentation.

## Backend Implementation Guide

The backend is built with FastAPI and uses SQLite for data persistence. Here's what you need to implement:

1. Create and configure the FastAPI application ✓
2. Set up the database connection and initialize tables ✓
3. Implement the API endpoints:
   - `POST /tasks/` - Create a new task
   - `GET /tasks/` - Get all tasks
   - `GET /tasks/{id}` - Get a specific task
   - `PUT /tasks/{id}` - Update a task
   - `DELETE /tasks/{id}` - Delete a task
   - `GET /stats/` - Get task statistics

Look for `TODO` comments in the code to guide your implementation.

## Frontend Implementation Guide

The frontend is built with React and uses functional components with hooks for state management. Here's what you need to implement:

1. Set up the main App component with state management ✓
2. Create the TaskForm component for adding/editing tasks ✓
3. Create the TaskList component for displaying tasks ✓
4. Implement the following functionality:
   - Fetching tasks from the API
   - Adding new tasks
   - Editing existing tasks
   - Deleting tasks
   - Toggling task completion status
   - Displaying task statistics

Look for `TODO` comments in the code to guide your implementation.

## API Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| POST | /tasks/ | Create a new task |
| GET | /tasks/ | Get all tasks |
| GET | /tasks/{id} | Get a specific task |
| PUT | /tasks/{id} | Update a task |
| DELETE | /tasks/{id} | Delete a task |
| GET | /stats/ | Get task statistics |

## Data Models

### Task

```
{
  "id": integer,
  "title": string,
  "description": string (optional),
  "due_date": string (ISO format date, optional),
  "priority": integer (1=Low, 2=Medium, 3=High, default=1),
  "is_completed": boolean (default=false)
}
```

### TaskStats

```
{
  "total": integer,
  "completed": integer,
  "pending": integer
}
```

## Learning Objectives

This project will help you learn:

1. **Backend Development**
   - Creating a RESTful API with FastAPI
   - Database operations with SQLite
   - Request validation with Pydantic models
   - Error handling in API endpoints

2. **Frontend Development**
   - Building a React application with functional components
   - State management with React hooks
   - Making HTTP requests to an API
   - Form handling and validation
   - Conditional rendering

3. **Fullstack Integration**
   - Connecting a React frontend to a FastAPI backend
   - Data flow between client and server
   - Handling asynchronous operations

## Extension Ideas

Once you've completed the basic implementation, you might want to extend the project with these features:

1. User authentication
2. Task categories/tags
3. Task search and filtering
4. Due date notifications
5. Data visualization for task statistics
6. Mobile responsiveness improvements
7. Dark/light theme toggle

## Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [SQLite Documentation](https://www.sqlite.org/docs.html)

## License

This project is open source and available under the [MIT License](LICENSE).