import os
import unittest

from flask import send_from_directory
from flask_migrate import Migrate, MigrateCommand
from flask_script import Manager
from flask_swagger_ui import get_swaggerui_blueprint

from app.main import create_app, db, firewall_init
from app.main.model import tables
from app.main.model import chains
from app.main.model import rules

from app.main.controllers import tableController as table
from app.main.controllers import chainsController as chains
from app.main.controllers import rulesController as rules
from app.main.controllers import ipController as ip
from app.main.controllers import macController as mac

app = create_app(os.getenv('BOILERPLATE_ENV') or 'dev')

SWAGGER_URL = '/api/docs'
API_URL = '/docs/swagger.yml'

app.register_blueprint(table.bp)
app.register_blueprint(rules.bp)
app.register_blueprint(chains.bp)
app.register_blueprint(ip.bp)
app.register_blueprint(mac.bp)

swaggerui_blueprint = get_swaggerui_blueprint(
    SWAGGER_URL, 
    API_URL,
    config={
        'app_name': "Test application"
    }
)

app.register_blueprint(swaggerui_blueprint, url_prefix=SWAGGER_URL)

@app.route("/docs/swagger.yml")
def specs():
    return send_from_directory(os.getcwd(), "firewall/docs/swagger.yml")

app.app_context().push()

manager = Manager(app)

migrate = Migrate(app, db)

manager.add_command('db', MigrateCommand)

@manager.command
def run():
    firewall_init.init_firewall()
    app.run()

@manager.command
def test():
    """Runs the unit tests."""
    tests = unittest.TestLoader().discover('app/tests', pattern='test*.py')
    result = unittest.TextTestRunner(verbosity=2).run(tests)
    if result.wasSuccessful():
        return 0
    return 1

@manager.command
def testAPI():
    """Runs the unit tests."""
    tests = unittest.TestLoader().discover('app/tests', pattern='test_api*.py')
    result = unittest.TextTestRunner(verbosity=2).run(tests)
    if result.wasSuccessful():
        return 0
    return 1

@manager.command
def testPYNFT():
    """Runs the unit tests."""
    tests = unittest.TestLoader().discover('app/tests', pattern='test_pynft*.py')
    result = unittest.TextTestRunner(verbosity=2).run(tests)
    if result.wasSuccessful():
        return 0
    return 1

if __name__ == '__main__':
    manager.run()