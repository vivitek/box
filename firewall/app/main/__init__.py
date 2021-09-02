from flask import Flask
from flask_redis import FlaskRedis


from .config import config_by_name
redis_client = FlaskRedis()

def create_app(config_name):
    app = Flask(__name__)
    app.config.from_object(config_by_name[config_name])
    redis_client.init_app(app)
    return app
