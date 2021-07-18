import flask
from backend import tableController as table
from backend import ruleController as rule
from backend import chainController as chain

def create_app(test_config=None):
    app = flask.Flask(__name__, instance_relative_config=True)
    app.config["DEBUG"] = True

    app.register_blueprint(table.bp)
    app.register_blueprint(rule.bp)
    app.register_blueprint(chain.bp)

    return app
