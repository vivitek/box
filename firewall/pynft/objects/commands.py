#!/usr/bin/env python3

import nftables
from PyNFT.objects.ruleset_objects import *
from typing import List, Union



#
#	Command Unions
#

ADD_OBJ = Union[TABLE,
				CHAIN,
				RULE,
				SET,
				MAP,
				ELEMENT ]
				# FLOWTABLE,
				# COUNTER,
				# QUOTA,
				# CT_HELPER,
				# LIMIT,
				# CT_TIMEOUT,
				# CT_EXPECTATION ]

LIST_OBJ = Union[RULESET,
				TABLES,
				CHAINS,
				SETS,
				MAPS ]
				# COUNTERS,
				# QUOTAS,
				# CT_HELPERS,
				# LIMITS,
				# METERS,
				# FLOWTABLES,
				# CT_TIMEOUT,
				# CT_EXPECTATION ]

# RESET_OBJ = Union[COUNTERS, QUOTAS]

FLUSH_OBJ = Union[RULESET, TABLE, CHAIN, SET, MAP ] # , METER]



#
#	Command Objects
#

class COMMAND_OBJ(NFT_OBJ):
	objname : str = ""


class CMD_ADD(COMMAND_OBJ):
	add : ADD_OBJ

class CMD_REPLACE(COMMAND_OBJ):
	replace : RULE

class CMD_CREATE(COMMAND_OBJ):
	create : ADD_OBJ

class CMD_INSERT(COMMAND_OBJ):
	insert : RULE

class CMD_DELETE(COMMAND_OBJ):
	delete : ADD_OBJ

class CMD_LIST(COMMAND_OBJ):
	list : LIST_OBJ

# class CMD_RESET(COMMAND_OBJ):
# 	reset : RESET_OBJ

class CMD_FLUSH(COMMAND_OBJ):
	flush : FLUSH_OBJ

class CMD_RENAME(COMMAND_OBJ):
	rename : CHAIN
