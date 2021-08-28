import unittest
import os

from flask import current_app
from flask_testing import TestCase

from manage import app

class TestDevelopmentConfig(TestCase):
	def create_app(self):
		app.config.from_object('app.main.config.DevelopmentConfig')
		return app

	def test_app_is_development(self):
		self.assertTrue(app.config['DEBUG'] is True)
		self.assertFalse(current_app is None)

class TestTestingConfig(TestCase):
	def create_app(self):
		app.config.from_object('app.main.config.TestingConfig')
		return app

	def test_app_is_testing(self):
		self.assertTrue(app.config['DEBUG'])

class TestProductionConfig(TestCase):
	def create_app(self):
		app.config.from_object('app.main.config.ProductionConfig')
		return app

	def test_app_is_production(self):
		self.assertTrue(app.config['DEBUG'] is False)

# class TableTest(TestCase):
# 	def create_app(self):
# 		app.config.from_object('app.main.config.TestingConfig')
# 		return app

# 	def test_successful_create(self):
# 		response = self.client.post('/table/', data=dict(family='inet', tablename='filter'))
# 		self.assertEqual(201, response.status_code)

# 	def test_successful_get(self):
# 		response = self.client.get('/table/')
# 		self.assertEqual(200, response.status_code)

# class ChainTest(TestCase):
# 	def create_app(self):
# 		app.config.from_object('app.main.config.TestingConfig')
# 		return app

# 	def test_successful_create(self):
# 		response = self.client.post('/table/', data=dict(family='inet', tablename='filter'))
# 		self.assertEqual(201, response.status_code)
# 		response = self.client.post('/chains/', data=dict(
# 			family='inet',
# 			tablename='filter',
# 			chainname='input',
# 			type='filter',
# 			hook='input',
# 			device='null',
# 			priority='0',
# 			policy='accept'
# 		))
# 		self.assertEqual(201, response.status_code)

# class RuleTest(TestCase):
# 	def create_app(self):
# 		app.config.from_object('app.main.config.TestingConfig')
# 		return app

# 	def test_successful_create(self):
# 		response = self.client.post('/table/', data=dict(family='inet', tablename='filter'))
# 		self.assertEqual(201, response.status_code)
# 		response = self.client.post('/chains/', data=dict(
# 			family='inet',
# 			tablename='filter',
# 			chainname='input',
# 			type='filter',
# 			hook='input',
# 			device='null',
# 			priority='0',
# 			policy='accept'
# 		))
# 		self.assertEqual(201, response.status_code)
# 		response = self.client.post('/rule/', data=dict(
# 			family='inet',
# 			tablename='filter',
# 			chainname='input',
# 			matches='ether saddr 0:0:0:0:0:0',
# 			statements='drop'
# 		))
# 		self.assertEqual(201, response.status_code)

if __name__ == "__main__":
	unittest.main()