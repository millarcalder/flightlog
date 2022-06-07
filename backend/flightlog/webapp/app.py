import logging
from fastapi import FastAPI
from fastapi import File
from fastapi.middleware.cors import CORSMiddleware
from flightlog.lib.igc_parser import extract_path


app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post('/parse-igc/get-path')
def get_path_from_igc(igc: bytes = File()):
    igc_str = igc.decode('utf8')
    return extract_path(igc_str)
