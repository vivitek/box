import os
import json
import unittest
from pynft import Executor

PyNFT_shell = Executor()

#
#	PyNFT v2_shell tests
#

class TestBasicNFTCommands(unittest.TestCase):
	def listRuleset(self):
		PyNFT_shell.ListRuleset()
		self.assertEqual(0, 0)

class TestIPv4Blacklist(unittest.TestCase):
	def testBanUnban(self):
		PyNFT_shell.BanIPv4Saddr("vincipit.com")
		response = os.system("ping -c 1 vincipit.com")
		self.assertNotEqual(0, response)
		PyNFT_shell.UnbanIPv4Saddr("vincipit.com")
		response = os.system("ping -c 1 vincipit.com")
		self.assertEqual(0, response)

if __name__ == "__main__":
    unittest.main()
