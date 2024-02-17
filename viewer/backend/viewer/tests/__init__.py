import os
from pathlib import Path

TEST_FILES_DIR = f"{Path(os.path.dirname(os.path.realpath(__file__))).parents[3]}/data"
TEST_S3_BUCKET = "flightlog-igc-files"
