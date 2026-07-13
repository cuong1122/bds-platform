from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import app.models  # đảm bảo mọi model được đăng ký trước khi mapper configure
from app.api.v1.router import api_router

app = FastAPI(title="BDS Platform API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)


@app.get("/")
def read_root():
    return {"message": "BDS Platform API is running"}


@app.get("/health")
def health_check():
    return {"status": "ok"}
