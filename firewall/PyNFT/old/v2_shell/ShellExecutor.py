#! /usr/bin/python3

import subprocess, shlex


class Executor:

	output = bytearray()

	def __init__(self, bannedIPv4 = "", bannedIPv6 = "", bannedMAC = ""):
		cmd_flushRuleset = "flush ruleset"
		cmd_addBanTable = "add table inet BanTable"
		cmd_addBanChain = "add chain inet BanTable BanChain { type filter hook input priority 0\; policy accept \; }"
		cmd_createBannedIPv4set = "add set inet BanTable BannedIPv4 { type ipv4_addr \; }"
		cmd_banSourceIPv4rule = "add rule inet BanTable BanChain ip saddr @BannedIPv4 drop"
		cmd_banDestinationIPv4rule = "add rule inet BanTable BanChain ip daddr @BannedIPv4 drop"
		cmd_createBannedIPv6set = "add set inet BanTable BannedIPv6 { type ipv6_addr \; }"
		cmd_banSourceIPv6rule = "add rule inet BanTable BanChain ip6 saddr @BannedIPv6 drop"
		cmd_banDestinationIPv6rule = "add rule inet BanTable BanChain ip6 daddr @BannedIPv6 drop"
		# cmd_createBannedMACset = "add set <idk> <depends_on_previous_param> BannedMAC { type <idk> \; }"
		# cmd_createBannedMACrule = "add rule <idk> <depends_on_previous_param> BanChain <idk> @BannedMAC drop"

		if (bannedIPv4 != ""):
			cmd_banSourceIPv4rule.replace("}", "elements={" + bannedIPv4 + "} \; }")
			cmd_banDestinationIPv4rule.replace("}", "elements={" + bannedIPv4 + "} \; }")
		if (bannedIPv6 != ""):
			cmd_banSourceIPv6rule.replace("}", "elements={" + bannedIPv6 + "} \; }")
			cmd_banDestinationIPv6rule.replace("}", "elements={" + bannedIPv6 + "} \; }")
		# if (bannedMAC != ""):
		# 	cmd_createBannedMACset.replace("}", "elements={" + bannedMAC + "} \; }")

		self.ExecuteNFTCommand(cmd_flushRuleset)
		self.ExecuteNFTCommand(cmd_addBanTable)
		self.ExecuteNFTCommand(cmd_addBanChain)
		self.ExecuteNFTCommand(cmd_createBannedIPv4set)
		self.ExecuteNFTCommand(cmd_banSourceIPv4rule)
		self.ExecuteNFTCommand(cmd_banDestinationIPv4rule)
		self.ExecuteNFTCommand(cmd_createBannedIPv6set)
		self.ExecuteNFTCommand(cmd_banSourceIPv6rule)
		self.ExecuteNFTCommand(cmd_banDestinationIPv6rule)
		# self.ExecuteNFTCommand(cmd_createBannedMACset)
		# self.ExecuteNFTCommand(cmd_createBannedMACrule)

	def ExecuteNFTCommand(self, args):
		command_line = "sudo nft " + args
		args = shlex.split(command_line)
		try:
			self.output = subprocess.check_output(args, stderr=subprocess.STDOUT)
		except subprocess.CalledProcessError as err:
			print("Error in system call :  Command \'" + str(err.cmd) + "\' returned non-zero exit status " + str(err.returncode)
					+   "\nError message : " + err.output.decode())

	def PrintLSO(self):
		print(self.output.decode())
		return self.output



	###############################
	##                           ##
	##       BASIC  ACTIONS      ##
	##                           ##
	###############################

	def ListRuleset(self, cmd = None):
		self.ExecuteNFTCommand("list ruleset")



	###############################
	##                           ##
	##      SHORTCUT ACTIONS     ##
	##                           ##
	###############################

	def BanIPv4Saddr(self, args, cmd = None):
		self.ExecuteNFTCommand("add element inet BanTable BannedIPv4 {" + args + "}")
	
	def BanIPv6Saddr(self, args, cmd = None):
		self.ExecuteNFTCommand("add element inet BanTable BannedIPv6 {" + args + "}")
	
	# def BanMACSaddr(self, args, cmd = None):
	# 	self.ExecuteNFTCommand("add element <idk> <depends_on_previous_param> BannedMAC {" + args + "}")

	def UnbanIPv4Saddr(self, args, cmd = None):
		self.ExecuteNFTCommand("delete element inet BanTable BannedIPv4 {" + args + "}")

	def UnbanIPv6Saddr(self, args, cmd = None):
		self.ExecuteNFTCommand("delete element inet BanTable BannedIPv6 {" + args + "}")
	
	# def UnbanMACSaddr(self, args, cmd = None):
	# 	self.ExecuteNFTCommand("delete element <idk> <depends_on_previous_param> BannedMAC {" + args + "}")
