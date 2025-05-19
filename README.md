# TaskMaster

TaskMaster is a modern, full-stack task management application that helps you organize your tasks with a beautiful, responsive UI. It features a Next.js/React frontend and FastAPI backend with a clean, layered architecture.

## Project Overview

TaskMaster implements a complete task management system with:

- **User-friendly interface** with vibrant gradients and color-coded priorities
- **Task organization** with titles, descriptions, due dates, and priority levels
- **Statistics dashboard** to track task completion metrics
- **Responsive design** that works on desktop and mobile devices
- **API-driven backend** with a clean, layered architecture

## Tech Stack

### Frontend
- **Next.js 15+** - React framework with App Router
- **TypeScript** - For type safety
- **Tailwind CSS** - For styling and responsive design
- **Lucide React** - For beautiful icons

### Backend
- **FastAPI** - Modern Python web framework
- **Pydantic** - For data validation
- **SQLite** - For data storage
- **Layered Architecture** - API, Service, DAO, and Persistence layers

## Project Structure

```
TaskMaster/
├── backend/                # Python FastAPI backend
│   ├── api/                # API endpoints
│   ├── dto/                # Data Transfer Objects
│   ├── service/            # Business logic
│   ├── dao/                # Data Access Objects
│   ├── persistence/        # Database connection
│   └── main.py             # App entry point
│
└── new-frontend/           # Next.js frontend
    ├── app/                # Next.js app directory
    ├── components/         # React components
    ├── public/             # Static assets
    └── package.json        # Dependencies
```

## Getting Started

To run the TaskMaster application:

1. **Start the backend:**
   ```bash
   cd backend
   
   # Optional: Create and activate virtual environment
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   
   # Install dependencies
   pip install -r requirements.txt
   
   # Start the backend server
   uvicorn main:app --reload
   ```

2. **Start the frontend:**
   ```bash
   cd new-frontend
   
   # Install dependencies
   npm install
   
   # Start the development server
   npm run dev
   ```

3. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## Features

- **Create tasks** with title, description, due date, and priority
- **Update tasks** to modify details or mark as complete
- **Delete tasks** when they're no longer needed
- **Filter tasks** by completion status
- **View statistics** about task completion rates
- **Visual indicators** for task priorities and due dates

## Architecture

TaskMaster follows a clean, layered architecture pattern:

1. **API Layer** (FastAPI): Handles HTTP requests and responses
2. **DTO Layer** (Pydantic): Defines data structures for input/output
3. **Service Layer**: Implements business logic
4. **DAO Layer**: Handles database operations
5. **Persistence Layer**: Manages database connections and transactions

This separation of concerns makes the code more maintainable, testable, and scalable.

## License

This project is licensed under the MIT License.