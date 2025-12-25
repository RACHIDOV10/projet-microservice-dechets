from fastapi import FastAPI
from api.robots import router as robot_router
from conf.consule import register, deregister

app = FastAPI(title="AI Service")
app.include_router(robot_router)

@app.on_event("startup")
def startup():
    register()
    print("✅ Registered in Consul")

@app.on_event("shutdown")
def shutdown():
    deregister()
    print("❌ Deregistered from Consul")

@app.get("/health")
def health():
    return {"status": "ok"}
