import boto3
from fastapi import FastAPI
from fastapi import File
from fastapi.middleware.cors import CORSMiddleware
from flightlog.lib.igc_parser import FlightLog


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


@app.post('/extract-flight-log/file')
def extract_points_from_igc(igc: bytes = File()):
    igc_str = igc.decode('utf8')
    return FlightLog(igc_str)


@app.get('/extract-flight-log/s3/{file_name}')
def extract_flight_log_from_s3(file_name: str):
    s3 = boto3.resource('s3')
    obj = s3.Object('flightlog-igc-files-testing', file_name)
    return FlightLog(obj.get()['Body'].read().decode('utf8'))
