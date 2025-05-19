# TaskMaster

A modern task management application with a beautiful UI that helps you organize your work efficiently.

## Technologies Used

### Frontend
- **Next.js**: React framework for building the UI
- **TypeScript**: For type-safe code
- **Tailwind CSS**: For styling and responsive design
- **Lucide React**: For beautiful icons

### Backend
- **FastAPI**: Modern, fast Python web framework
- **SQLite**: Simple database for storing tasks
- **Pydantic**: For data validation and settings management

## Project Structure

### Frontend
```
frontend/
├── app/                # Next.js app directory
│   ├── page.tsx        # Main page that renders TaskMaster
│   ├── globals.css     # Global styles
│   └── layout.tsx      # Layout component
├── components/         # React components
│   └── TaskMaster.tsx  # Main TaskMaster component
├── public/             # Static assets
└── package.json        # Dependencies and scripts
```

### Backend
```
backend/
├── api/                # API layer (FastAPI routers)
│   ├── tasks.py        # /tasks endpoints
│   └── stats.py        # /stats endpoints
├── dto/                # Data Transfer Objects
│   └── task.py         # Pydantic models for tasks
├── service/            # Business logic layer
│   └── task_service.py # Service functions
├── dao/                # Data Access Objects
│   └── task_dao.py     # Database operations
├── persistence/        # Database connection
│   └── database.py     # DB connection and init
└── main.py             # App entry point
```

## Features

- Create, read, update, and delete tasks
- Mark tasks as complete/incomplete
- Assign priority levels (Low, Medium, High)
- Set due dates for tasks
- View statistics about your tasks
- Colorful visual indicators for priorities
- Responsive design for desktop and mobile

## Getting Started

### Prerequisites
- Node.js (v16+)
- Python (v3.8+)
- npm or yarn

### Setting Up the Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Start the backend server:
   ```bash
   uvicorn main:app --reload
   ```

The backend will start on http://localhost:8000

### Setting Up the Frontend

1. Navigate to the frontend directory:
   ```bash
   cd new-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will start on http://localhost:3000

## API Endpoints

- `GET /tasks/` - Get all tasks
- `POST /tasks/` - Create a new task
- `GET /tasks/{id}` - Get a specific task
- `PUT /tasks/{id}` - Update a task
- `DELETE /tasks/{id}` - Delete a task
- `GET /stats/` - Get task statistics

## Project Architecture

TaskMaster uses a layered architecture:

1. **Frontend**: React components in Next.js
2. **API Layer**: RESTful endpoints in FastAPI
3. **Service Layer**: Business logic
4. **DAO Layer**: Database operations
5. **Persistence Layer**: Database connection

This separation of concerns makes the code more maintainable and easier to test.

## Contributing

Feel free to submit issues or pull requests to improve TaskMaster!

## License

This project is licensed under the MIT License.
