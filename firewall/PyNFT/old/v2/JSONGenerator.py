import nftables
import json
from enum import Enum

PreGenCmd = {
	"banIP":			'{ "nftables": [ { "add": { "rule": { "family": "inet", "table": "BanTable", "chain": "BanChain", "expr": [ { "match": { "left": { "payload": { "protocol": "ip", "field": "saddr" }}, "right": "THE_IP_ADDR", "op": "==" }}, { "drop": null } ], "comment": "THE_IP_ADDR"}}}     	]}',
	"banMAC":			'{ "nftables": [ { "add": { "rule": { "family": "inet", "table": "BanTable", "chain": "BanChain", "expr": [ { "match": { "left": { "payload": { "protocol": "ether", "field": "saddr" }}, "right": "THE_MAC_ADDR", "op": "==" }}, { "drop": null } ], "comment": "THE_MAC_ADDR"}}}	]}',

	"listRuleset":		'{ "nftables": [ { "list":	{ "ruleset": null }} ]}',
	"flushRuleset":		'{ "nftables": [ { "flush":	{ "ruleset": null }} ]}',

	"getAllTables":		'{ "nftables": [ { "list":		{ "tables": { }}}		]}',
	"getFamilyTables":	'{ "nftables": [ { "list":		{ "tables": { "family": "THE_FAMILY" }}}		]}',
	"getTable":			'{ "nftables": [ { "list":		{ "table": { "family": "THE_FAMILY", "name": "THE_TABLE_NAME" }}}		]}',
	"addTable":			'{ "nftables": [ { "add":		{ "table": { "family": "THE_FAMILY", "name": "THE_TABLE_NAME" }}}		]}',
	"flushTable":		'{ "nftables": [ { "flush":		{ "table": { "family": "THE_FAMILY", "name": "THE_TABLE_NAME" }}}		]}',
	"delTableName":		'{ "nftables": [ { "delete":	{ "table": { "family": "THE_FAMILY", "name": "THE_TABLE_NAME" }}}		]}',
	"delTableHandle":	'{ "nftables": [ { "delete":	{ "table": { "family": "THE_FAMILY", "handle": THE_TABLE_HANDLE }}}		]}',

	"getChain":			'{ "nftables": [ { "list":		{ "chain": { "family": "THE_FAMILY", "table": "THE_TABLE_NAME", "name": "THE_CHAIN_NAME" }}}	]}',
	"addChain":			'{ "nftables": [ { "add":		{ "chain": { "family": "THE_FAMILY", "table": "THE_TABLE_NAME", "name": "THE_CHAIN_NAME", "type": "THE_CHAIN_TYPE", "hook": "THE_CHAIN_HOOK", "prio": THE_CHAIN_PRIO, "policy": "THE_CHAIN_POLICY" }}}	]}',
	"renameChain":		'{ "nftables": [ { "rename":	{ "chain": { "family": "THE_FAMILY", "table": "THE_TABLE_NAME", "name": "THE_CHAIN_NAME", "newname": "THE_CHAIN_NEWNAME" }}}	]}',
	"flushChain":		'{ "nftables": [ { "flush":		{ "chain": { "family": "THE_FAMILY", "table": "THE_TABLE_NAME", "name": "THE_CHAIN_NAME" }}}	]}',
	"delChainName":		'{ "nftables": [ { "delete":	{ "chain": { "family": "THE_FAMILY", "table": "THE_TABLE_NAME", "name": "THE_CHAIN_NAME" }}}	]}',
	"delChainHandle":	'{ "nftables": [ { "delete":	{ "chain": { "family": "THE_FAMILY", "table": "THE_TABLE_NAME", "handle": THE_CHAIN_HANDLE }}}	]}',

	"addRule":			'{ "nftables": [ { "add":		{ "rule": { "family": "THE_FAMILY", "table": "THE_TABLE_NAME", "chain": "THE_CHAIN_NAME", "expr": [  ]}}} ]}', # { "match": { "left": {}, "right": {}, "op": "THE_OPERATOR"  }}
	"insertRule":		'{ "nftables": [ { "insert":	{ "rule": { "family": "THE_FAMILY", "table": "THE_TABLE_NAME", "chain": "THE_CHAIN_NAME", "handle": THE_RULE_HANDLE, "expr": [  ]}}} ]}',
	"replaceRule":		'{ "nftables": [ { "replace":	{ "rule": { "family": "THE_FAMILY", "table": "THE_TABLE_NAME", "chain": "THE_CHAIN_NAME", "handle": THE_RULE_HANDLE, "expr": [  ]}}} ]}',
	"delRule":			'{ "nftables": [ { "delete":	{ "rule": { "family": "THE_FAMILY", "table": "THE_TABLE_NAME", "chain": "THE_CHAIN_NAME", "handle": THE_RULE_HANDLE}}} ]}',
}
