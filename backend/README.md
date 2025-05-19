# TaskMaster Backend

## Project Structure

```
backend/
│
├── api/                    # API layer (FastAPI routers)
│   ├── __init__.py
│   ├── tasks.py            # /tasks endpoints
│   └── stats.py            # /stats and root endpoint
│
├── dto/                    # Data Transfer Objects (Pydantic models)
│   ├── __init__.py
│   └── task.py
│
├── service/                # Business logic layer
│   ├── __init__.py
│   └── task_service.py
│
├── dao/                    # Data Access Objects (DB queries)
│   ├── __init__.py
│   └── task_dao.py
│
├── persistence/            # Data persistence (DB connection/init)
│   ├── __init__.py
│   └── database.py
│
├── main.py                 # App entry point, CORS, router includes
└── requirements.txt
```

## Layer Descriptions

- **api/**: FastAPI routers. Only handle HTTP requests/responses and call the service layer.
- **dto/**: Pydantic models for request/response validation and serialization.
- **service/**: Business logic, validation, and orchestration. Calls DAO functions.
- **dao/**: Direct database operations (CRUD, queries). No business logic.
- **persistence/**: Database connection and initialization.
- **main.py**: FastAPI app setup, CORS, and router inclusion.

## How to Run

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
2. Start the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```
   (Run this command from the `backend/` directory.)

## Adding New Features
- **New endpoint?** Add a route in `api/`, business logic in `service/`, DB code in `dao/`, and update DTOs as needed.
- **New model?** Add it to `dto/`.
- **New DB table/logic?** Add to `dao/` and `persistence/`.

## Notes
- All layers are decoupled for maintainability and testability.
- Only the API layer should import FastAPI.
- Only the DAO and persistence layers should interact with the database directly. 