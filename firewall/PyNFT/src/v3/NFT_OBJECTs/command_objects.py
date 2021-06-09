#!/usr/bin/env python3

from ruleset_objects import *
from typing import List, Union


# ADD_OBJ = Union[TABLE,
# 				CHAIN,
# 				RULE,
# 				SET,
# 				MAP,
# 				ELEMENT,
# 				FLOWTABLE,
# 				COUNTER,
# 				QUOTA,
# 				CT_HELPER,
# 				LIMIT,
# 				CT_TIMEOUT,
# 				CT_EXPECTATION]

# LIST_OBJ = Union[RULESET,
# 					TABLE,
# 					List[TABLE],
# 					CHAIN,
# 					List[CHAIN],
# 					SET,
# 					List[SET],
# 					MAP,
# 					List[MAP],
# 					COUNTER,
# 					List[COUNTER],
# 					QUOTA,
# 					List[QUOTA],
# 					CT_HELPER,
# 					List[CT_HELPER],
# 					LIMIT,
# 					List[LIMIT],
# 					METER,
# 					List[METER],
# 					FLOWTABLE,
# 					List[FLOWTABLE],
# 					CT_TIMEOUT,
# 					CT_EXPECTATION]


class COMMAND_OBJ(NFT_OBJ):
	objname : str = "nftables"


class CMD_ADD(COMMAND_OBJ):
	add : RULESET_OBJ				# should be ADD_OBJ

class CMD_REPLACE(COMMAND_OBJ):
	replace : RULE

class CMD_CREATE(COMMAND_OBJ):
	create : RULESET_OBJ			# should be ADD_OBJ

class CMD_INSERT(COMMAND_OBJ):
	insert : RULE

class CMD_DELETE(COMMAND_OBJ):
	delete : RULESET_OBJ			# should be ADD_OBJ

# class CMD_LIST(COMMAND_OBJ):
# 	list : LIST_OBJ

class CMD_RENAME(COMMAND_OBJ):
	rename : CHAIN
