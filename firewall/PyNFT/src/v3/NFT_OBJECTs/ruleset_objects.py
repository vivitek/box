#!/usr/bin/env python3

from root import NFT_OBJ, auto_attr_check
from expressions import *
from enumerations import *
from typing import List, Union



class RULESET_OBJ(NFT_OBJ):
	objname : str = "ruleset_obj"


class RULESET(RULESET_OBJ):
	objname : str = "ruleset"

class TABLE(RULESET_OBJ):
	objname	: str				= "table"
	family	: ADDR_FAMILY		= ADDR_FAMILY.IP
	name	: str
	handle	: Union[int, None]	= None

class CHAIN(RULESET_OBJ):
	objname	: str							= "chain"
	family	: ADDR_FAMILY
	table	: str
	name	: str
	newname	: Union[str, None]				= None
	handle	: Union[int, None]				= None
	type	: Union[CHAIN_TYPE, None]		= None
	hook	: Union[CHAIN_HOOK, None]		= None
	prio	: Union[CHAIN_PRIORITY, None]	= None
	dev		: Union[str, None]				= None
	policy	: Union[CHAIN_POLICY, None]		= None

class RULE(RULESET_OBJ):
	objname	: str				= "rule"
	family	: ADDR_FAMILY
	table	: str
	chain	: str
	expr	: Union[str, None]	= None
	handle	: Union[int, None]	= None
	index	: Union[int, None]	= None
	comment	: Union[str, None]	= None

class ELEMENT(RULESET_OBJ):
	objname : str = "element"
	family	: ADDR_FAMILY
	table	: str
	name	: str
	elem	: EXPRESSIONS
ELEMENT_ARRAY = List[ELEMENT]
ELEMENTS = Union[ELEMENT, ELEMENT_ARRAY]

SET_ELEMENTS = Union[EXPRESSIONS, ELEMENTS]
class SET(RULESET_OBJ):
	objname			: str							= "set"
	family			: ADDR_FAMILY
	table			: str
	name			: str
	handle			: Union[int, None]				= None
	type			: Union[SET_TYPES, None]		= None
	policy			: Union[SET_POLICY, None]		= None
	flags			: Union[SET_FLAG_ARRAY, None]	= None
	elem			: Union[SET_ELEMENTS, None]		= None
	timeout			: Union[int, None]				= None
	gc__interval	: Union[int, None]				= None
	size			: Union[int, None]				= None

class MAP(RULESET_OBJ):
	objname			: str							= "map"
	family			: ADDR_FAMILY
	table			: str
	name			: str
	handle			: Union[int, None]				= None
	type			: Union[SET_TYPE, None]			= None
	map				: Union[str, None]				= None
	policy			: Union[SET_POLICY, None]		= None
	flags			: Union[SET_FLAG_ARRAY, None]	= None
	elem			: Union[SET_ELEMENTS, None]		= None
	timeout			: Union[int, None]				= None		# => in the doc:	NUMBER in this format: "v1dv2hv3mv4s" (ex: 3h45s)
	gc__interval	: Union[int, None]				= None
	size			: Union[int, None]				= None
