import os
import unittest

from flask_migrate import Migrate, MigrateCommand
from flask_script import Manager

from app.main import create_app, db, firewall_init
from app.main.model import tables
from app.main.model import chains
from app.main.model import rules

from app.main.controllers import tableController as table
from app.main.controllers import chainsController as chains
from app.main.controllers import rulesController as rules

app = create_app(os.getenv('BOILERPLATE_ENV') or 'dev')

app.register_blueprint(table.bp)
app.register_blueprint(rules.bp)
app.register_blueprint(chains.bp)

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