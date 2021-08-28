#!/usr/bin/env python3

from pynft.executor				import Executor
import pynft.commands			as CMD
import pynft.enumerations		as ENUM
import pynft.objects			as OBJ



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
		cmd_array = [ CMD.FLUSH(flush=OBJ.RULESET()) ]
		self.__setup_ban(cmd_array, bannedIPV4, bannedMAC)
		for index, cmd in enumerate(cmd_array):
			self.nft.execute(cmd, "init_pynft [" + str(index) + "]")


	def __setup_ban(self, cmd_array, bannedIPV4, bannedMAC):
		ban_table = OBJ.TABLE(family=ENUM.ADDR_FAMILY.INET, name="BanTable")
		ban_chain = OBJ.CHAIN(
			family=ban_table.family,
			table=ban_table.name,
			name="BanChain",
			type=ENUM.CHAIN_TYPE.FILTER,
			hook=ENUM.CHAIN_HOOK.PREROUTING,
			prio=ENUM.CHAIN_PRIORITY.NF_IP_PRI_FILTER,
			policy=ENUM.CHAIN_POLICY.CONTINUE)
		cmd_array.append(CMD.ADD(add=ban_table))
		cmd_array.append(CMD.ADD(add=ban_chain))

		banned_ipv4_set = OBJ.SET(
			family=ban_table.family,
			table=ban_table.name,
			name="BannedIPv4",
			type=ENUM.SET_TYPE.IPV4_ADDR,
			elem=bannedIPV4)
		banned_mac_set = OBJ.SET(
			family=ban_table.family,
			table=ban_table.name,
			name="BannedMAC",
			type=ENUM.SET_TYPE.ETHER_ADDR,
			elem=bannedMAC)
		cmd_array.append(CMD.ADD(add=banned_ipv4_set))
		cmd_array.append(CMD.ADD(add=banned_mac_set))

		cmd_array.append(CMD.ADD(add=OBJ.RULE(
			family=ban_table.family,
			table=ban_table.name,
			chain=ban_chain.name,
			expr="ip saddr @BannedIPv4 drop"
		)))
		cmd_array.append(CMD.ADD(add=OBJ.RULE(
			family=ban_table.family,
			table=ban_table.name,
			chain=ban_chain.name,
			expr="ip daddr @BannedIPv4 drop"
		)))
		cmd_array.append(CMD.ADD(add=OBJ.RULE(
			family=ban_table.family,
			table=ban_table.name,
			chain=ban_chain.name,
			expr="ether saddr @BannedMAC drop"
		)))
		cmd_array.append(CMD.ADD(add=OBJ.RULE(
			family=ban_table.family,
			table=ban_table.name,
			chain=ban_chain.name,
			expr="ether daddr @BannedMAC drop"
		)))



	#
	#	Ban
	#

	def ban_mac(self, addr:str):
		cmdObj = CMD.ADD(add=OBJ.ELEMENT(family=ENUM.ADDR_FAMILY.INET, table="BanTable", name="BannedMAC", elem=addr))
		self.nft.execute(cmdObj, "ban_mac")

	def unban_mac(self, addr:str):
		cmdObj = CMD.DELETE(delete=OBJ.ELEMENT(family=ENUM.ADDR_FAMILY.INET, table="BanTable", name="BannedMAC", elem=addr))
		self.nft.execute(cmdObj, "unban_mac")

	def ban_ipv4(self, addr:str):
		cmdObj = CMD.ADD(add=OBJ.ELEMENT(family=ENUM.ADDR_FAMILY.INET, table="BanTable", name="BannedIPv4", elem=addr))
		self.nft.execute(cmdObj, "ban_ipv4")

	def unban_ipv4(self, addr:str):
		cmdObj = CMD.DELETE(delete=OBJ.ELEMENT(family=ENUM.ADDR_FAMILY.INET, table="BanTable", name="BannedIPv4", elem=addr))
		self.nft.execute(cmdObj, "unban_ipv4")

