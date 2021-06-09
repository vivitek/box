#!/usr/bin/env python3

from typing import NamedTuple
from firewall.PyNFT.src.v3.NFT_OBJECTs.enumerations import ADDR_FAMILY, CHAIN_HOOK, CHAIN_POLICY, CHAIN_PRIORITY, CHAIN_TYPE, SET_TYPE
from firewall.PyNFT.src.v3.NFT_OBJECTs.command_objects import CMD_ADD
import nftables
import json
from NFT_OBJ.command_objects import *



#
#	The NFT_Executor class serves the firewall api
# 	It offers firewall management actions
#

class NFT_Executor:



	#
	#	Initialize
	#

	nft = nftables.Nftables()

	def init_pynft(self, bannedIPv4:str="", bannedMAC:str=""):
		self.nft.set_json_output(True)
		cmd_flush_ruleset = CMD_FLUSH(RULESET())
		self.execute_JSON(cmd_flush_ruleset.bake(), "init flush ruleset")
		self.__setup_ban(bannedIPv4, bannedMAC)

	def __setup_ban(self, bannedIPV4, bannedMAC):
		all_commands = []
		ban_table = TABLE(family=ADDR_FAMILY.INET, name="BanTable")
		ban_chain = CHAIN(
			family=ban_table.family,
			table=ban_table.name,
			name="BanChain",
			type=CHAIN_TYPE.FILTER,
			hook=CHAIN_HOOK.PREROUTING,
			priority=CHAIN_PRIORITY.NF_IP_PRI_FILTER,
			policy=CHAIN_POLICY.CONTINUE)
		all_commands.append(CMD_ADD(ban_table))
		all_commands.append(CMD_ADD(ban_chain))

		banned_ipv4_set = SET(
			family=ban_table.family,
			table=ban_table.name,
			chain=ban_chain.name,
			name="BannedIPv4",
			type=SET_TYPE.IPV4_ADDR,
			elem=bannedIPV4)
		banned_mac_set = SET(
			family=ban_table.family,
			table=ban_table.name,
			chain=ban_chain.name,
			name="BannedMAC",
			type=SET_TYPE.ETHER_ADDR,
			elem=bannedMAC)
		all_commands.append(CMD_ADD(banned_ipv4_set))
		all_commands.append(CMD_ADD(banned_mac_set))
		
		all_commands.append(CMD_ADD(RULE(
			family=ban_table.family,
			table=ban_table.name,
			chain=ban_chain.name,
			expr="ip saddr @BannedIPv4 drop"
		)))
		all_commands.append(CMD_ADD(RULE(
			family=ban_table.family,
			table=ban_table.name,
			chain=ban_chain.name,
			expr="ip daddr @BannedIPv4 drop"
		)))
		all_commands.append(CMD_ADD(RULE(
			family=ban_table.family,
			table=ban_table.name,
			chain=ban_chain.name,
			expr="ether saddr @BannedMAC drop"
		)))
		all_commands.append(CMD_ADD(RULE(
			family=ban_table.family,
			table=ban_table.name,
			chain=ban_chain.name,
			expr="ether daddr @BannedMAC drop"
		)))




	#
	#	Execute / Format / Print
	#

	def __execute_JSON(self, json_cmd, cmdName):
		if (self.nft.json_validate(json_cmd) == False):
			warning.warn("WARNING: " + cmdName + " => command has invalid syntax")
			return None
		else:
			return self.__format_response(self.nft.json_cmd(json_cmd), cmdName)

	def __format_response(self, retTuple, cmdName):
		return {
			"cmd" : cmdName,
			"rc" : retTuple[0],
			"output" : retTuple[1],
			"error" : retTuple[2]
		}

	def print_cmd_output(self, output, indentOutput = 2):
		print("Print Command Output => " + output["cmd"])
		print("return value :\t\t{}".format(output["rc"]))
		print("output :\t\t{}".format(json.dumps(output["output"], indent=indentOutput)))
		if (output["rc"] != 0):
			print("error :\t\t\t{}".format(output["error"]))
		print()



	#
	#	Ban
	#

	def ban_mac(self, addr:str):
		cmdObj = CMD_ADD(ELEMENT(family=ADDR_FAMILY.INET, table="BanTable", name="BannedMAC", elem=addr))
		self.__execute_JSON(cmdObj, "ban_mac")

	def unban_mac(self, addr:str):
		cmdObj = CMD_DELETE(ELEMENT(family=ADDR_FAMILY.INET, table="BanTable", name="BannedMAC", elem=addr))
		self.__execute_JSON(cmdObj, "unban_mac")

	def ban_ipv4(self, addr:str):
		cmdObj = CMD_ADD(ELEMENT(family=ADDR_FAMILY.INET, table="BanTable", name="BannedIPv4", elem=addr))
		self.__execute_JSON(cmdObj, "ban_ipv4")

	def unban_ipv4(self, addr:str):
		cmdObj = CMD_DELETE(ELEMENT(family=ADDR_FAMILY.INET, table="BanTable", name="BannedIPv4", elem=addr))
		self.__execute_JSON(cmdObj, "unban_ipv4")
