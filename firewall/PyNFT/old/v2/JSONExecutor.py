#!/usr/bin/env python3

import nftables
import json
from enum import Enum
from PyNFT.src.JSONGenerator import PreGenCmd

class JSONExecutor:

	nft = nftables.Nftables()


	def __init__(self):
		self.nft.set_json_output(True)


	def ExecuteJSON(self, cmdOBJ, cmdName):
		if (type(cmdOBJ) != dict):
			warning.warn("WARNING: ExecuteJSON(" + cmdName + ") => parameter has invalid type")
		elif (self.nft.json_validate(cmdOBJ) == False):
			warning.warn("WARNING: ExecuteJSON(" + cmdName + ") => command has invalid syntax")
		else:
			return self.formatResponse(self.nft.json_cmd(cmdOBJ), cmdName)
		return None

	def formatResponse(self, retTuple, cmdName):
		return {
			"cmd" : cmdName,
			"rc" : retTuple[0],
			"output" : retTuple[1],
			"error" : retTuple[2]
		}

	def PrintCMDoutput(self, output, indentOutput = 2):
		print("Print Command Output => " + output["cmd"])
		print("return value :\t\t{}".format(output["rc"]))
		print("output :\t\t{}".format(json.dumps(output["output"], indent=indentOutput)))
		if (output["rc"] != 0):
			print("error :\t\t\t{}".format(output["error"]))
		print()



###
### Customization Methods
###

	###
	### Ruleset Methods
	###

	def PrintRuleset(self, indentOutput = 2):
		"""Print the Ruleset to stdout"""
		output = self.ExecuteJSON(json.loads(PreGenCmd["listRuleset"]), "PrintRuleset")
		print("Ruleset :\n{}\n".format(json.dumps(output["output"], indent=indentOutput)))

	def GetRuleset(self):
		"""Return the complete Ruleset in JSON format"""
		result = self.ExecuteJSON(json.loads(PreGenCmd["listRuleset"]), "GetRuleset")
		return result

	def FlushRuleset(self):
		"""Flush the entire Ruleset"""
		return self.ExecuteJSON(json.loads(PreGenCmd["flushRuleset"]), "FlushRuleset")


	###
	### Table Methods
	###

	def GetTable(self, family : str = "all", tableName : str = "all"):
		"""Return Table information in JSON format"""
		cmdName = "GetTable"
		toLoad = PreGenCmd["getTable"].replace("THE_FAMILY", family).replace("THE_TABLE_NAME", tableName)

		if (family == "all"):
			toLoad = PreGenCmd["getAllTables"]
			cmdName = "GetAllTables"
		elif (tableName == "all"):
			toLoad = PreGenCmd["getFamilyTables"].replace("THE_FAMILY", family)
			cmdName = "GetFamilyTables"

		cmd_getTable = json.loads(toLoad)
		return self.ExecuteJSON(cmd_getTable, cmdName)

	def AddTable(self, family : str, tableName : str):
		"""Add a Table to the Ruleset"""
		toLoad = PreGenCmd["addTable"].replace("THE_FAMILY", family).replace("THE_TABLE_NAME", tableName)
		cmd_addTable = json.loads(toLoad)
		self.ExecuteJSON(cmd_addTable, "AddTable")
		return self.GetTable(family, tableName)

	def FlushTable(self, family : str, tableName : str):
		"""Delete all Rules in specified Table"""
		toLoad = PreGenCmd["flushTable"].replace("THE_FAMILY", family).replace("THE_TABLE_NAME", tableName)
		cmd_flushTable = json.loads(toLoad)
		self.ExecuteJSON(cmd_flushTable, "FlushTable")
		return self.GetTable(family, tableName)

	def DeleteTable(self, family : str, identifier : str):
		"""Delete specified Table from Ruleset"""
		identifierTAG = "THE_TABLE_HANDLE" if identifier.isdecimal() else "THE_TABLE_NAME"
		cmdKey = "delTableHandle" if identifier.isdecimal() else "delTableName"
		toLoad = PreGenCmd[cmdKey].replace("THE_FAMILY", family).replace(identifierTAG, identifier)
		cmd_delTable = json.loads(toLoad)
		return self.ExecuteJSON(cmd_delTable, "DeleteTable")


	###
	### Chain Methods
	###

	def GetChain(self, family : str, tableName : str, chainName : str):
		"""Return specified Chain's information in JSON format"""
		toLoad = PreGenCmd['getChain'].replace("THE_FAMILY", family).replace("THE_TABLE_NAME", tableName).replace("THE_CHAIN_NAME", chainName)
		cmd_getChain = json.loads(toLoad)
		return self.ExecuteJSON(cmd_getChain, "GetChain")

	def AddChain(self, family : str, tableName : str, chainName : str, chainType = "filter", chainHook = "prerouting", chainPrio = 0, chainPolicy = "accept"):
		"""Add a Chain to the specified Table"""
		toLoad = PreGenCmd['addChain'].replace("THE_FAMILY", family).replace("THE_TABLE_NAME", tableName).replace("THE_CHAIN_NAME", chainName).replace("THE_CHAIN_TYPE", chainType).replace("THE_CHAIN_HOOK", chainHook).replace("THE_CHAIN_PRIO", str(chainPrio)).replace("THE_CHAIN_POLICY", chainPolicy)
		cmd_addChain = json.loads(toLoad)
		return self.ExecuteJSON(cmd_addChain, "AddChain")
	
	def RenameChain(self, family : str, tableName : str, chainName : str, chainNewName):
		"""Rename the specified Chain"""
		toLoad = PreGenCmd['renameChain'].replace("THE_FAMILY", family).replace("THE_TABLE_NAME", tableName).replace("THE_CHAIN_NAME", chainName).replace("THE_CHAIN_NEWNAME", chainNewName)
		cmd_renameChain = json.loads(toLoad)
		return self.ExecuteJSON(cmd_renameChain, "RenameChain")

	def FlushChain(self, family : str, tableName : str, chainName : str):
		"""Delete all Rules in specified Chain"""
		toLoad = PreGenCmd['flushChain'].replace("THE_FAMILY", family).replace("THE_TABLE_NAME", tableName).replace("THE_CHAIN_NAME", chainName)
		cmd_flushChain = json.loads(toLoad)
		return self.ExecuteJSON(cmd_flushChain, "FlushChain")

	def DeleteChain(self, family : str, tableName : str, identifier : str):
		"""Delete the specified Chain"""
		identifierTAG = "THE_CHAIN_HANDLE" if identifier.isdecimal() else "THE_CHAIN_NAME"
		cmdIndex = "delChainHandle" if identifier.isdecimal() else "delChainName"
		toLoad = PreGenCmd[cmdIndex].replace("THE_FAMILY", family).replace("THE_TABLE_NAME", tableName).replace(identifierTAG, identifier)
		cmd_delChain = json.loads(toLoad)
		return self.ExecuteJSON(cmd_delChain, "DeleteChain")


	###
	### Rule Methods
	###

	def AddRule(self):
		return None

	def InsertRule(self):
		return None

	def ReplaceRule(self):
		return None

	def DeleteRule(self, family : str, tableName : str, chainName : str, ruleHandle : int):
		"""Delete the specified Rule"""
		toLoad = PreGenCmd["delRule"].replace("THE_FAMILY", family).replace("THE_TABLE_NAME", tableName).replace("THE_CHAIN_NAME", chainName).replace("THE_RULE_HANDLE", str(ruleHandle))
		cmd_delRule = json.loads(toLoad)
		return self.ExecuteJSON(cmd_delRule, "DeleteRule")



###
### Shortcut Methods
###

	def BanMacSaddr(self, addr : str):
		"""Add Rule to default Table/Chain to ban the specified MAC address"""
		toLoad = PreGenCmd["banMAC"].replace("THE_MAC_ADDR", addr)
		cmd_addRuleBanIP = json.loads(toLoad)
		addRuleRes = self.ExecuteJSON(cmd_addRuleBanIP, "BanMacSaddr")
		print("Banned MAC address: " + addr)
		handles = []
		getChainRes = self.GetChain("inet", "BanTable", "BanChain")
		for item in getChainRes['output']['nftables']:
			for key in item.keys():
				if (key == "rule" and (item[key]['comment'] == addr or item[key]['expr'][0]['match']['right'] == addr)):
					handles.append(item[key]['handle'])
		if len(handles) >= 1:
			ruleInfo = {
			 	"family": "inet",
		 		"tableName": "BanTable",
		 		"chainName": "BanChain",
		 		"address": addr,
		 		"handle": handles
			}
			return (addRuleRes, ruleInfo)
		else:
			return (None, None)
		

	def UnbanMacSaddr(self, addr : str):
		handles = []
		getChainRes = self.GetChain("inet", "BanTable", "BanChain")
		for item in getChainRes['output']['nftables']:
			for key in item.keys():
				if (key == "rule" and (item[key]['comment'] == addr or item[key]['expr'][0]['match']['right'] == addr)):
					delRuleRes = self.DeleteRule("inet", "BanTable", "BanChain", str(item[key]['handle']))
					handles.append(item[key]['handle'])
					print("Unbanned MAC address: " + addr)

		if len(handles) >= 1:
			ruleInfo = {
			 	"family": "inet",
		 		"tableName": "BanTable",
		 		"chainName": "BanChain",
		 		"address": addr,
		 		"handle": handles
			}
			return (delRuleRes, ruleInfo)
		else:
			return (None, None)

	def BanIpSaddr(self, addr : str):
		"""Add Rule to default Table/Chain to ban the specified IP address"""
		toLoad = PreGenCmd["banIP"].replace("THE_IP_ADDR", addr)
		cmd_addRuleBanIP = json.loads(toLoad)
		print("Banned IP address: " + addr)
		addRuleRes = self.ExecuteJSON(cmd_addRuleBanIP, "BanIPSaddr")
		handles = []
		getChainRes = self.GetChain("inet", "BanTable", "BanChain")
		for item in getChainRes['output']['nftables']:
			for key in item.keys():
				if (key == "rule" and (item[key]['comment'] == addr or item[key]['expr'][0]['match']['right'] == addr)):
					handles.append(item[key]['handle'])
		if len(handles) >= 1:
			ruleInfo = {
			 	"family": "inet",
		 		"tableName": "BanTable",
		 		"chainName": "BanChain",
		 		"address": addr,
		 		"handle": handles
			}
			return (addRuleRes, ruleInfo)
		else:
			return (None, None)

	def UnbanIpSaddr(self, addr : str, onlyFirst : bool = False):
		"""Add Rule to default Table/Chain to ban the specified IP address"""
		handles = []
		getChainRes = self.GetChain("inet", "BanTable", "BanChain")
		for item in getChainRes['output']['nftables']:
			for key in item.keys():
				if (key == "rule" and (item[key]['comment'] == addr or item[key]['expr'][0]['match']['right'] == addr)):
					delRuleRes = self.DeleteRule("inet", "BanTable", "BanChain", str(item[key]['handle']))
					handles.append(item[key]['handle'])
					print("Unbanned IP address: " + addr)


		if len(handles) == 1:
			ruleInfo = {
			 	"family": "inet",
		 		"tableName": "BanTable",
		 		"chainName": "BanChain",
		 		"address": addr,
		 		"handle": handles[0]
			}
			return (delRuleRes, ruleInfo)

		elif len(handles) > 1:
			ruleInfos = []
			for handle in handles:
				ruleInfos.append({
					"family": "inet",
		 			"tableName": "BanTable",
		 			"chainName": "BanChain",
		 			"address": addr,
		 			"handle": handle
				})
			return (delRuleRes, ruleInfos)

		else:
			return None
			