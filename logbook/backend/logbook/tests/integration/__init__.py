import os


DATABASE_URI = "postgresql+psycopg://root:secret@flightlog-db:5432/logbook"
os.environ['DATABASE_URI'] = DATABASE_URI
