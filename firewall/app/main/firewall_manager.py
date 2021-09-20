#!/usr/bin/env python3

from pynft.executor				import Executor
import pynft.enumerations		as ENUM
import pynft.expressions		as EXP
import pynft.statements			as STAT
import pynft.objects			as OBJ
import pynft.commands			as CMD



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

	def __init__(self, bannedIPV4=None, bannedMAC=None):
		self.nft = Executor()
		cmd_array = [ CMD.FLUSH(flush=OBJ.RULESET()) ]
		self.__setup_ban(cmd_array, bannedIPV4, bannedMAC)
		for index, cmd in enumerate(cmd_array):
			self.nft.execute(cmd, "init_pynft [" + str(index) + "] => " + cmd.bake())


	def __setup_ban(self, cmd_array, bannedIPV4, bannedMAC):

		#	Add BanTable and BanChain
		#
		ban_table = OBJ.TABLE(family=ENUM.ADDR_FAMILY.INET, name="BanTable")
		ban_chain = OBJ.CHAIN(
			family=ban_table.family,
			table=ban_table.name,
			name="BanChain",
			type=ENUM.CHAIN_TYPE.FILTER,
			hook=ENUM.CHAIN_HOOK.OUTPUT,
			prio=ENUM.CHAIN_PRIORITY.NF_IP_PRI_FILTER,
			policy=ENUM.CHAIN_POLICY.ACCEPT)
		cmd_array.append(CMD.ADD(add=ban_table))
		cmd_array.append(CMD.ADD(add=ban_chain))

		#	Add BannedIPv4 and BannedMAC sets
		#
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

		#	Add rule dropping packets with @BannedIPv4 and @BannedMAC adresses
		#
		ref_payload_daddr = EXP.REFERENCE_PAYLOAD(protocol="ip", field="daddr")
		the_payload = EXP.PAYLOAD(payload=ref_payload_daddr)
		the_match = STAT.MATCH(left=the_payload, right="@BannedIPv4", op=ENUM.OPERATOR.EQUAL)
		cmd_array.append(CMD.ADD(add=OBJ.RULE(
			family=ban_table.family,
			table=ban_table.name,
			chain=ban_chain.name,
			expr=[the_match, STAT.VERDICT_DROP()]
		)))
		ref_payload_daddr = EXP.REFERENCE_PAYLOAD(protocol="ether", field="daddr")
		the_payload = EXP.PAYLOAD(payload=ref_payload_daddr)
		the_match = STAT.MATCH(left=the_payload, right="@BannedMAC", op=ENUM.OPERATOR.EQUAL)
		cmd_array.append(CMD.ADD(add=OBJ.RULE(
			family=ban_table.family,
			table=ban_table.name,
			chain=ban_chain.name,
			expr=[the_match, STAT.VERDICT_DROP()]
		)))



	#
	#	Ban Addrs
	#

	def ban_mac(self, addr:str):
		cmdObj = CMD.ADD(add=OBJ.ELEMENT(family=ENUM.ADDR_FAMILY.INET, table="BanTable", name="BannedMAC", elem=addr))
		return self.nft.execute(cmdObj, "ban_mac: " + addr)

	def unban_mac(self, addr:str):
		cmdObj = CMD.DELETE(delete=OBJ.ELEMENT(family=ENUM.ADDR_FAMILY.INET, table="BanTable", name="BannedMAC", elem=addr))
		return self.nft.execute(cmdObj, "unban_mac: " + addr)

	def ban_ipv4(self, addr:str):
		cmdObj = CMD.ADD(add=OBJ.ELEMENT(family=ENUM.ADDR_FAMILY.INET, table="BanTable", name="BannedIPv4", elem=addr))
		return self.nft.execute(cmdObj, "ban_ipv4: " + addr)

	def unban_ipv4(self, addr:str):
		cmdObj = CMD.DELETE(delete=OBJ.ELEMENT(family=ENUM.ADDR_FAMILY.INET, table="BanTable", name="BannedIPv4", elem=addr))
		return self.nft.execute(cmdObj, "unban_ipv4: " + addr)



	#
	#	Band-width management
	#
