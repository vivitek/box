#!/usr/bin/env python3

from PyNFT.src.v3 import *



class Singleton(type):
    _instances = {}
    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super(Singleton, cls).__call__(*args, **kwargs)
        return cls._instances[cls]



#
#	The FWManager class serves the firewall API, providing
#	simplified firewall management functions.
#

class FWManager(metaclass=Singleton):

	def __init__(self, bannedIPV4="", bannedMAC=""):
		self.nft = Executor()
		cmd_array = [ CMD_FLUSH(flush=RULESET()) ]
		self.__setup_ban(cmd_array, bannedIPV4, bannedMAC)
		for index, cmd in enumerate(cmd_array):
			self.nft.execute(cmd, "init_pynft [" + str(index) + "]")


	def __setup_ban(self, cmd_array, bannedIPV4, bannedMAC):
		ban_table = TABLE(family=ADDR_FAMILY.INET, name="BanTable")
		ban_chain = CHAIN(
			family=ban_table.family,
			table=ban_table.name,
			name="BanChain",
			type=CHAIN_TYPE.FILTER,
			hook=CHAIN_HOOK.PREROUTING,
			prio=CHAIN_PRIORITY.NF_IP_PRI_FILTER,
			policy=CHAIN_POLICY.CONTINUE)
		cmd_array.append(CMD_ADD(add=ban_table))
		cmd_array.append(CMD_ADD(add=ban_chain))

		banned_ipv4_set = SET(
			family=ban_table.family,
			table=ban_table.name,
			name="BannedIPv4",
			type=SET_TYPE.IPV4_ADDR,
			elem=bannedIPV4)
		banned_mac_set = SET(
			family=ban_table.family,
			table=ban_table.name,
			name="BannedMAC",
			type=SET_TYPE.ETHER_ADDR,
			elem=bannedMAC)
		cmd_array.append(CMD_ADD(add=banned_ipv4_set))
		cmd_array.append(CMD_ADD(add=banned_mac_set))

		cmd_array.append(CMD_ADD(add=RULE(
			family=ban_table.family,
			table=ban_table.name,
			chain=ban_chain.name,
			expr="ip saddr @BannedIPv4 drop"
		)))
		cmd_array.append(CMD_ADD(add=RULE(
			family=ban_table.family,
			table=ban_table.name,
			chain=ban_chain.name,
			expr="ip daddr @BannedIPv4 drop"
		)))
		cmd_array.append(CMD_ADD(add=RULE(
			family=ban_table.family,
			table=ban_table.name,
			chain=ban_chain.name,
			expr="ether saddr @BannedMAC drop"
		)))
		cmd_array.append(CMD_ADD(add=RULE(
			family=ban_table.family,
			table=ban_table.name,
			chain=ban_chain.name,
			expr="ether daddr @BannedMAC drop"
		)))



	#
	#	Ban
	#

	def ban_mac(self, addr:str):
		cmdObj = CMD_ADD(add=ELEMENT(family=ADDR_FAMILY.INET, table="BanTable", name="BannedMAC", elem=addr))
		self.nft.execute(cmdObj, "ban_mac")

	def unban_mac(self, addr:str):
		cmdObj = CMD_DELETE(delete=ELEMENT(family=ADDR_FAMILY.INET, table="BanTable", name="BannedMAC", elem=addr))
		self.nft.execute(cmdObj, "unban_mac")

	def ban_ipv4(self, addr:str):
		cmdObj = CMD_ADD(add=ELEMENT(family=ADDR_FAMILY.INET, table="BanTable", name="BannedIPv4", elem=addr))
		self.nft.execute(cmdObj, "ban_ipv4")

	def unban_ipv4(self, addr:str):
		cmdObj = CMD_DELETE(delete=ELEMENT(family=ADDR_FAMILY.INET, table="BanTable", name="BannedIPv4", elem=addr))
		self.nft.execute(cmdObj, "unban_ipv4")

