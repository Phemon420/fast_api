from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from contextlib import asynccontextmanager
from app.util.init_db import create_tables
from app.router.auth import authRouter
from app.util.protectroute import UserOutput,get_current_user
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI,Request, Query, Depends, HTTPException
import requests
import logging


@asynccontextmanager
async def lifespan(app : FastAPI):
    # Intializes the db tables when the application starts up
    print("created")
    create_tables()
    yield 

app = FastAPI(lifespan=lifespan)
app.include_router(router=authRouter, tags=["auth"])

origins = [
    "http://localhost:3000",  # React development server
    "http://127.0.0.1:3000",  # Another form of localhost for React
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows the listed origins
    allow_credentials=True,  # Allows cookies to be sent
    allow_methods=["GET", "POST", "PUT", "DELETE"],  # Allowed HTTP methods
    allow_headers=["X-Custom-Header", "Content-Type"],  # Allowed headers
)

@app.get("/health")
def health():
    return {"status" : "Running...."}

@app.get("/protected")
def read_protected(user : UserOutput = Depends(get_current_user)):
    return {"data" : user}


FATSECRET_API_URL = "https://platform.fatsecret.com/rest/recipes/search/v3"
BEARER_TOKEN = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjEwOEFEREZGRjZBNDkxOUFBNDE4QkREQTYwMDcwQzE5NzNDRjMzMUUiLCJ0eXAiOiJhdCtqd3QiLCJ4NXQiOiJFSXJkX19ha2tacWtHTDNhWUFjTUdYUFBNeDQifQ.eyJuYmYiOjE3MzgyMzM1NDMsImV4cCI6MTczODMxOTk0MywiaXNzIjoiaHR0cHM6Ly9vYXV0aC5mYXRzZWNyZXQuY29tIiwiYXVkIjoiYmFzaWMiLCJjbGllbnRfaWQiOiIwMTM5ZjI5YzhmYmI0YzdjOWFmNTUyNTEwMDgzZTY5ZCIsInNjb3BlIjpbImJhc2ljIl19.Ci85hnfgHLB4ln7EYhuljSANqJ8IKpfDWyRo3Z5k8kFl7Rf8ToBCClqSe2E0eeMB__IZAqOT0UTCZoslr5kVgqHKslSdpwopzRlu8BOzYdBNQUmCl1oVQANrX4paAjyeAtSqGZTJiU7r3QzLHKD1dBrAeb0GvprXYn5PRGLDFwNoyXzlf5-m90D6YiXOBpyckpDWxMvhrnz9XORQ8h1r83uu3TCi0vAjne7FuK3rsAWw2m9iIkhMKr4LM4jlc14r9Ww9NSeZrIMkIi8CJ4ojyuQQ3d7RAE76oCXBI_jyb80imtZVvMoenb7QzF1kFgSp5MJGpxZhT6r60xCrv-sjaQHTFV3OzCqJFhxkhIyJEzdvO_buMoAfr_yWJDMAQIBvAA73oBq7lu85QI58BF7FuebT56NvjyObOl20lL9vB_Er9IcbmFI9FtIekzzqs0p1RlymmLOGbkWYdVDAwlKelQM04cAeeOhv247Mkvu2bQ2yQ31YFH-y94rVCmlux-Cd1x4aotggR_uXYLWWYuwLlg8YSpku4ZxLQfAU-nlL7ga1ruaVCvE_g4YEieyW_e3v4sDIQflkFG7ZmoVI-Pp4qePS-D6-1DOPGLaN8DB7hq5nV2JCtxugQQHymJFTwJmTcL1nT-B4y8IBxmbbdeOBvsESdPVjk8dckfiEb_ItJf4"


logging.basicConfig(level=logging.INFO)


@app.get("/search-recipes")
async def search_recipes(request: Request):
    query_params = dict(request.query_params)

    logging.info(f"Received request with params: {query_params}")
    logging.info(f"Request URL: {FATSECRET_API_URL}?{requests.compat.urlencode(query_params)}")


    headers = {
        "Authorization": f"Bearer {BEARER_TOKEN}",
        "Accept": "application/json"
    }

    try:
        response = requests.get(FATSECRET_API_URL, headers=headers, params=query_params)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        logging.error(f"Error calling FatSecret API: {e}")
        logging.error(f"Response content: {response.text}")
        raise HTTPException(status_code=500, detail=str(e))
    