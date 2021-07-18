#!/usr/bin/env python3

import iptc

class IpTablesExecutor:

	def BanIpSaddr(self, saddr, chainName="INPUT", tableName=iptc.Table.FILTER):
		table = iptc.Table(tableName)
		if (table.is_chain(chainName)):
			rule = iptc.Rule()
			rule.src = saddr
			target = rule.create_target("DROP")
			iptc.Chain(table, chainName).insert_rule(rule)

	def UnbanIpSaddr(self, saddr, ruleNum=0, chainName="INPUT", tableName=iptc.Table.FILTER):
		table = iptc.Table(tableName)
		if (table.is_chain(chainName) == False):
			return

		chain = iptc.Chain(table, chainName)

		if (ruleNum > 0):
			chain.delete_rule(chain.rules[ruleNum - 1])
			return

		for rule in chain.rules:
			print(rule.src)
			if (rule.src.startswith(saddr)):
				chain.delete_rule(rule)
