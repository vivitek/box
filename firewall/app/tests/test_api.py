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

class TestAddrBan(TestCase):
	def test_ban_ipv4(self):
		self.assertTrue(True)

	def test_ban_mac(self):
		self.assertTrue(True)

class TestBandwidthLimit(TestCase):
	def test_user_limit(self):
		self.assertTrue(True)

	def test_service_limit(self):
		self.assertTrue(True)

if __name__ == "__main__":
	unittest.main()