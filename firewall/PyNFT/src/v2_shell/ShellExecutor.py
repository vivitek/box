#! /usr/bin/python3

import subprocess, shlex, json



class Executor:

	output = bytearray()



	###############################
	##                           ##
	##  Initialization  Methods  ##
	##                           ##
	###############################

	def init_pynft(self, bannedIPv4="", bannedIPv6="", bannedMAC=""):
		self.createBannedSets(bannedIPv4, bannedIPv6, bannedMAC)
		if (bannedIPv4 != ""):
			self.BanIPv4Addr(bannedIPv4)
		if (bannedIPv6 != ""):
			self.BanIPv6Addr(bannedIPv6)
		if (bannedMAC != ""):
			self.BanMACAddr(bannedMAC)

	def createBannedSets(self, bannedIPv4, bannedIPv6, bannedMAC):
		cmd_addBanTable = "add table inet BanTable"
		cmd_addBanChain = "add chain inet BanTable BanChain { type filter hook prerouting priority 0\; policy accept \; }"
		cmd_createBannedIPv4set		= "add set inet BanTable BannedIPv4 { type ipv4_addr \; }"
		cmd_createBannedIPv6set		= "add set inet BanTable BannedIPv6 { type ipv6_addr \; }"
		cmd_createBannedMACset		= "add set inet BanTable BannedMAC { type ether_addr \; }"
		cmd_banSourceIPv4rule		= "add rule inet BanTable BanChain ip saddr @BannedIPv4 drop"
		cmd_banDestinationIPv4rule	= "add rule inet BanTable BanChain ip daddr @BannedIPv4 drop"
		cmd_banSourceIPv6rule		= "add rule inet BanTable BanChain ip6 saddr @BannedIPv6 drop"
		cmd_banDestinationIPv6rule	= "add rule inet BanTable BanChain ip6 daddr @BannedIPv6 drop"
		cmd_banSourceMACrule		= "add rule inet BanTable BanChain ether saddr @BannedMAC drop"
		cmd_banDestinationMACrule	= "add rule inet BanTable BanChain ether daddr @BannedMAC drop"

		if (bannedIPv4 != ""):
			cmd_createBannedIPv4set.replace("}", "elements={" + bannedIPv4 + "} \; }")
		if (bannedIPv6 != ""):
			cmd_createBannedIPv6set.replace("}", "elements={" + bannedIPv6 + "} \; }")
		if (bannedMAC != ""):
			cmd_createBannedMACset.replace("}", "elements={" + bannedMAC + "} \; }")

		self.ExecuteNFTCommand(cmd_addBanTable)
		self.ExecuteNFTCommand(cmd_addBanChain)
		self.ExecuteNFTCommand(cmd_createBannedIPv4set)
		self.ExecuteNFTCommand(cmd_banSourceIPv4rule)
		self.ExecuteNFTCommand(cmd_banDestinationIPv4rule)
		self.ExecuteNFTCommand(cmd_createBannedIPv6set)
		self.ExecuteNFTCommand(cmd_banSourceIPv6rule)
		self.ExecuteNFTCommand(cmd_banDestinationIPv6rule)
		self.ExecuteNFTCommand(cmd_createBannedMACset)
		self.ExecuteNFTCommand(cmd_banSourceMACrule)
		self.ExecuteNFTCommand(cmd_banDestinationMACrule)





	###############################
	##                           ##
	##  Shell Execution Methods  ##
	##                           ##
	###############################

	def ExecuteNFTCommand(self, args, cmdName=""):
		retCode = 0
		output = ""
		errors = ""
		command_line = "sudo nft " + args
		args = shlex.split(command_line)
		try:
			output = subprocess.check_output(args, stderr=subprocess.STDOUT)
		except subprocess.CalledProcessError as err:
			retCode = err.returncode
			errors = err.output.decode()
		return {
			"cmd" : cmdName,
			"rc" : retCode,
			"output" : output.decode(),
			"error" : errors
		}

	def PrintCMDoutput(self, output, indentOutput=2):
		print("Print Command Output => " + output["cmd"])
		print("return value :\t\t{}".format(output["rc"]))
		print("output :\t\t{}".format(json.dumps(output["output"], indent=indentOutput)))
		if (output["rc"] != 0):
			print("error :\t\t\t{}".format(output["error"]))
		print()





	###############################
	##                           ##
	##   Customization Methods   ##
	##                           ##
	###############################

	###
	### Ruleset Methods
	###

	def PrintRuleset(self, cmd=None):
		"""Print Ruleset on standard output"""
		return self.ExecuteNFTCommand("list ruleset")


	###
	### Table Methods
	###

	def FlushRuleset(self):
		"""Flush entire Ruleset"""
		return self.ExecuteNFTCommand("flush ruleset")

	def AddTable(self, family:str, tableName:str):
		"""Add a Table to Ruleset"""
		return self.ExecuteNFTCommand("add table " + family + " " + tableName)

	def DeleteTable(self, family:str, identifier:str):
		"""Delete specified Table from Ruleset"""
		if (identifier.isdecimal()):
			identifier = "handle " + identifier
		return self.ExecuteNFTCommand("delete table " + family + " " + identifier)


	###
	### Chain Methods
	###

	def FlushTable(self, family:str, tableName:str):
		"""Delete all Rules in specified Table"""
		return self.ExecuteNFTCommand("flush table " + family + " " + tableName)

	def AddChain(self, family:str, tableName:str, chainName:str, chainType:str="filter", chainHook:str="prerouting", chainPrio:str="0", chainPolicy:str="accept"):
		"""Add a Chain to specified Table"""
		return self.ExecuteNFTCommand("add chain " + str(family) + " " + str(tableName) + " " + str(chainName) + " { type " + str(chainType) + " hook " + str(chainHook) + " priority " + str(chainPrio)  + " ; policy " + str(chainPolicy) + " ; }")
	
	def RenameChain(self, family:str, tableName:str, chainName:str, chainNewName:str):
		"""Rename specified Chain"""
		return self.ExecuteNFTCommand("rename chain " + family + " " + tableName + " " + chainName + " " + chainNewName)

	def DeleteChain(self, family:str, tableName:str, identifier:str):
		"""Delete specified Chain"""
		if (identifier.isdecimal()):
			identifier = "handle " + identifier
		return self.ExecuteNFTCommand("delete chain " + family + " " + tableName + " " + identifier)


	###
	### Rule Methods
	###

	def FlushChain(self, family:str, tableName:str, chainName:str):
		"""Delete all Rules in specified Chain"""
		return self.ExecuteNFTCommand("flush chain " + family + " " + tableName + " " + chainName)

	def AddRule(self):
		return None

	def InsertRule(self):
		return None

	def ReplaceRule(self):
		return None

	def DeleteRule(self, family:str, tableName:str, chainName:str, ruleHandle:int):
		"""Delete specified Rule"""
		if (ruleHandle.isdecimal()):
			ruleHandle = "handle " + ruleHandle
		return self.ExecuteNFTCommand("delete rule " + family + " " + tableName + " " + chainName + " " + ruleHandle)






	###############################
	##                           ##
	##      Shortcut Methods     ##
	##                           ##
	###############################

	def BanIPv4Addr(self, args, cmd=None):
		return self.ExecuteNFTCommand("add element inet BanTable BannedIPv4 { " + args + " }")
	def BanIPv6Addr(self, args, cmd=None):
		return self.ExecuteNFTCommand("add element inet BanTable BannedIPv6 { " + args + " }")
	def BanMACAddr(self, args, cmd=None):
		return self.ExecuteNFTCommand("add element inet BanTable BannedMAC { " + args + " }")

	def UnbanIPv4Addr(self, args, cmd=None):
		return self.ExecuteNFTCommand("delete element inet BanTable BannedIPv4 { " + args + " }")
	def UnbanIPv6Addr(self, args, cmd=None):
		return self.ExecuteNFTCommand("delete element inet BanTable BannedIPv6 { " + args + " }")
	def UnbanMACAddr(self, args, cmd=None):
		return self.ExecuteNFTCommand("delete element inet BanTable BannedMAC { " + args + " }")
