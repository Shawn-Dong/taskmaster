from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.tasks import router as tasks_router
from api.stats import router as stats_router, root_info
from persistence.database import init_db

app = FastAPI(title="TaskMaster API", description="A simple task management API")
init_db()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tasks_router)
app.include_router(stats_router)

@app.get("/")
def read_root():
    return root_info()
