from imp import reload
import click
import logging
import uvicorn


@click.group()
@click.argument('env', type=str)
def cli(env: str):
    root_logger = logging.getLogger()
    root_logger.setLevel(logging.DEBUG)
    formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')

    if env == 'local':
        stream_handler = logging.StreamHandler()
        stream_handler.setLevel(logging.DEBUG)
        stream_handler.setFormatter(formatter)
        root_logger.addHandler(stream_handler)
    elif env in ('production', 'staging'):
        file_handler = logging.FileHandler('test.log')
        file_handler.setLevel(logging.WARNING)
        file_handler.setFormatter(formatter)
        root_logger.addHandler(file_handler)


@cli.command()
@click.option('--reload', is_flag=True)
def run_webapp(reload: bool):
    uvicorn.run('flightlog.webapp.app:app', host='0.0.0.0', port=5000, log_level=logging.INFO, reload=reload)
