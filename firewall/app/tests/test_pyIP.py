import os
import json
import unittest
from pyIP import Executor

PyIP = Executor()

class TestShortcutRules(unittest.TestCase):
	def test_BanIP(self):
		print("\nTesting:  vincipit.com / 152.228.163.210")
		response = os.system("ping -c 1 vincipit.com")
		self.assertEqual(0, response)
		print("Banning : 152.228.163.210")
		output = PyIP.BanIpSaddr("152.228.163.210")
		self.assertEqual(output, None)
		response = os.system("ping -c 1 vincipit.com")
		self.assertNotEqual(0, response)

	def test_UnbanIP(self):
		print("\nUnbanning : 152.228.163.210")
		output = PyIP.UnbanIpSaddr("152.228.163.210", 1)
		self.assertEqual(output, None)
		response = os.system("ping -c 1 vincipit.com")
		self.assertEqual(0, response)
