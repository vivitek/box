import os
import json
import unittest
from pynft import Executor
from pynft import Executor_v2_shell

PyNFT_shell = Executor_v2_shell()
PyNFT = Executor()



#
#	PyNFT v2_shell tests
#

class TestIPv4Blacklist(unittest.TestCase):
	def testBanUnban(self):
		PyNFT_shell.BanIPv4Saddr("vincipit.com")
		response = os.system("ping -c 1 vincipit.com")
		self.assertNotEqual(0, response)
		PyNFT_shell.UnbanIPv4Saddr("vincipit.com")
		response = os.system("ping -c 1 vincipit.com")
		self.assertEqual(0, response)

# class TestIPv6Blacklist(unittest.TestCase):
# 	def testBanUnban(self):
# 		PyNFT_shell.BanIPv6Saddr("vincipit.com")			# vincipit.com does not auto resolve to IPv6 addr
# 		response = os.system("ping -c 1 vincipit.com")
# 		self.assertNotEqual(0, response)
# 		PyNFT_shell.UnbanIPv6Saddr("vincipit.com")			# vincipit.com does not auto resolve to IPv6 addr
# 		response = os.system("ping -c 1 vincipit.com")
# 		self.assertEqual(0, response)



#
#	PyNFT v2 tests
#

# class TestRulesetManipulation(unittest.TestCase):
# 	def test_GetRuleset(self):
# 		# SETUP
# 		result = PyNFT.FlushRuleset()
# 		self.assertEqual(0, result['rc'])
# 		result = PyNFT.AddTable("ip", "FooTable")
# 		self.assertEqual(0, result['rc'])
# 		result = PyNFT.AddTable("ip6", "BarTable")
# 		self.assertEqual(0, result['rc'])
# 		# TEST 1
# 		result = PyNFT.GetRuleset()
# 		self.assertEqual(0, result['rc'])
# 		self.assertEqual(3, len(result['output']['nftables']))

# 	def test_FlushRuleset(self):
# 		# TEST 1
# 		result = PyNFT.FlushRuleset()
# 		self.assertEqual(0, result['rc'])


# class TestTableCustomization(unittest.TestCase):
# 	def test_GetTable(self):
# 		# SETUP
# 		result = PyNFT.FlushRuleset()
# 		self.assertEqual(0, result['rc'])
# 		result = PyNFT.AddTable("inet", "FooTable")
# 		self.assertEqual(0, result['rc'])
# 		result = PyNFT.AddChain("inet", "FooTable", "FooChain")
# 		self.assertEqual(0, result['rc'])
# 		result = PyNFT.AddTable("inet", "BarTable")
# 		self.assertEqual(0, result['rc'])
# 		result = PyNFT.AddChain("inet", "BarTable", "BarChain")
# 		self.assertEqual(0, result['rc'])
# 		result = PyNFT.AddTable("bridge", "ZekTable")
# 		self.assertEqual(0, result['rc'])
# 		result = PyNFT.AddChain("bridge", "ZekTable", "ZekChain")
# 		self.assertEqual(0, result['rc'])
# 		# TEST 1 (no arguments)
# 		result = PyNFT.GetTable()
# 		self.assertEqual(0, result['rc'])
# 		self.assertEqual(4, len(result['output']['nftables']))
# 		for index, item in enumerate(result['output']['nftables'][1:]):
# 			keys = item.keys()
# 			self.assertEqual(1, len(keys))
# 			for key in keys:
# 				self.assertEqual("table", key)
# 		# TEST 2 (1 argument)
# 		result = PyNFT.GetTable("inet")
# 		self.assertEqual(0, result['rc'])
# 		self.assertEqual(3, len(result['output']['nftables']))
# 		for index, item in enumerate(result['output']['nftables'][1:]):
# 			self.assertEqual("inet", item['table']['family'])
# 		# TEST 3 (2 arguments)
# 		result = PyNFT.GetTable("inet", "FooTable")
# 		self.assertEqual(0, result['rc'])
# 		self.assertEqual(3, len(result['output']['nftables']))
# 		for index, item in enumerate(result['output']['nftables']):
# 			for key in item.keys():
# 				if index == 1:
# 					self.assertEqual("table", key)
# 				elif index == 2:
# 					self.assertEqual("chain", key)
# 		result = PyNFT.FlushRuleset()
# 		self.assertEqual(0, result['rc'])


# 	def test_AddTable(self):
# 		# SETUP
# 		result = PyNFT.FlushRuleset()
# 		self.assertEqual(0, result['rc'])
# 		result = PyNFT.AddTable("inet", "filter")
# 		self.assertEqual(0, result['rc'])
# 		# TEST 1
# 		result = PyNFT.GetTable()
# 		self.assertEqual(0, result['rc'])
# 		self.assertEqual(2, len(result['output']['nftables']))
# 		self.assertEqual("inet", result['output']['nftables'][1]['table']['family'])
# 		self.assertEqual("filter", result['output']['nftables'][1]['table']['name'])

# 	def test_FlushTable(self):
# 		# SETUP
# 		result = PyNFT.FlushRuleset()
# 		self.assertEqual(0, result['rc'])
# 		result = PyNFT.AddTable("inet", "FooTable")
# 		self.assertEqual(0, result['rc'])
# 		result = PyNFT.AddChain("inet", "FooTable", "FooChain")
# 		self.assertEqual(0, result['rc'])
# 		# TEST 1
# 		result = PyNFT.FlushTable("inet", "FooTable")
# 		self.assertEqual(0, result['rc'])
# 		result = PyNFT.GetTable("inet", "FooTable")
# 		self.assertEqual(0, result['rc'])
# 		self.assertEqual(3, len(result['output']['nftables']))

# 	def test_DeleteTable(self):
# 		# SETUP
# 		result = PyNFT.FlushRuleset()
# 		self.assertEqual(0, result['rc'])
# 		result = PyNFT.AddTable("inet", "FooTable")
# 		self.assertEqual(0, result['rc'])
# 		result = PyNFT.AddTable("inet", "BarTable")
# 		self.assertEqual(0, result['rc'])
# 		BarTableHandle = result['output']['nftables'][1]['table']['handle']
# 		# TEST 1 (DeleteTable with name)
# 		result = PyNFT.DeleteTable("inet", "FooTable")
# 		self.assertEqual(0, result['rc'])
# 		result = PyNFT.GetTable()
# 		self.assertEqual(0, result['rc'])
# 		self.assertEqual(2, len(result['output']['nftables']))
# 		self.assertEqual("inet", result['output']['nftables'][1]['table']['family'])
# 		self.assertEqual("BarTable", result['output']['nftables'][1]['table']['name'])
# 		# TEST 2 (DeleteTable with handle)
# 		result = PyNFT.DeleteTable("inet", str(BarTableHandle))
# 		self.assertEqual(0, result['rc'])
# 		result = PyNFT.GetRuleset()
# 		self.assertEqual(0, result['rc'])
# 		self.assertEqual(1, len(result['output']['nftables']))

# class TestChainCustomization(unittest.TestCase):
# 	def test_AddGetRenameDeleteChain(self):
# 		# SETUP (AddChain)
# 		result = PyNFT.FlushRuleset()
# 		self.assertEqual(0, result['rc'])
# 		result = PyNFT.AddTable("inet", "FooTable")
# 		self.assertEqual(0, result['rc'])
# 		result = PyNFT.AddChain("inet", "FooTable", "FooChain")
# 		self.assertEqual(0, result['rc'])
# 		# TEST 1 (GetChain)
# 		result = PyNFT.GetChain("inet", "FooTable", "FooChain")
# 		self.assertEqual(0, result['rc'])
# 		self.assertEqual(2, len(result['output']['nftables']))
# 		self.assertEqual("inet", result['output']['nftables'][1]['chain']['family'])
# 		self.assertEqual("FooTable", result['output']['nftables'][1]['chain']['table'])
# 		self.assertEqual("FooChain", result['output']['nftables'][1]['chain']['name'])
# 		# TEST 2 (RenameChain)
# 		result = PyNFT.RenameChain("inet", "FooTable", "FooChain", "ModifiedFooChain")
# 		self.assertEqual(0, result['rc'])
# 		result = PyNFT.GetChain("inet", "FooTable", "ModifiedFooChain")
# 		self.assertEqual(0, result['rc'])
# 		self.assertEqual(2, len(result['output']['nftables']))
# 		self.assertEqual("inet", result['output']['nftables'][1]['chain']['family'])
# 		self.assertEqual("FooTable", result['output']['nftables'][1]['chain']['table'])
# 		self.assertEqual("ModifiedFooChain", result['output']['nftables'][1]['chain']['name'])
# 		# TEST 3 (DeleteChain)
# 		result = PyNFT.DeleteChain("inet", "FooTable", "ModifiedFooChain")
# 		self.assertEqual(0, result['rc'])
# 		result = PyNFT.GetTable("inet", "FooTable")
# 		self.assertEqual(0, result['rc'])
# 		self.assertEqual(2, len(result['output']['nftables']))
# 		self.assertEqual("inet", result['output']['nftables'][1]['table']['family'])
# 		self.assertEqual("FooTable", result['output']['nftables'][1]['table']['name'])

# class TestShortcutRules(unittest.TestCase):
# 	def test_BanUnbanIP(self):
# 		# SETUP (AddChain)
# 		result = PyNFT.FlushRuleset()
# 		self.assertEqual(0, result['rc'])
# 		result = PyNFT.AddTable("inet", "BanTable")
# 		self.assertEqual(0, result['rc'])
# 		result = PyNFT.AddChain("inet", "BanTable", "BanChain")
# 		self.assertEqual(0, result['rc'])
# 		# TEST 1 (BanIP)
# 		print() # for test output beauty only
# 		nftRes, ruleInfo = PyNFT.BanIpSaddr("vincipit.com")
# 		self.assertEqual(0, nftRes['rc'])
# 		self.assertEqual("inet", ruleInfo['family'])
# 		self.assertEqual("BanTable", ruleInfo['tableName'])
# 		self.assertEqual("BanChain", ruleInfo['chainName'])
# 		self.assertEqual("vincipit.com", ruleInfo['address'])
# 		result = PyNFT.GetChain("inet", "BanTable", "BanChain")
# 		self.assertEqual(0, result['rc'])
# 		response = os.system("ping -c 1 vincipit.com")
# 		self.assertNotEqual(0, response)
# 		# TEST 2 (UnbanIP)
# 		nftRes, ruleInfo = PyNFT.UnbanIpSaddr("vincipit.com")
# 		self.assertEqual(0, nftRes['rc'])
# 		self.assertEqual("inet", ruleInfo['family'])
# 		self.assertEqual("BanTable", ruleInfo['tableName'])
# 		self.assertEqual("BanChain", ruleInfo['chainName'])
# 		self.assertEqual("vincipit.com", ruleInfo['address'])
# 		response = os.system("ping -c 1 vincipit.com")
# 		self.assertEqual(0, response)




if __name__ == "__main__":
    unittest.main()