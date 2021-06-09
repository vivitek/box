#!/usr/bin/env python3

from typing import List, Union
from root import NFT_OBJ

class EXPRESSION(NFT_OBJ):
	objname : str = "expression"

EXPRESSION_ARRAY = List[EXPRESSION]
EXPRESSIONS = Union[EXPRESSION, EXPRESSION_ARRAY]