#! /usr/bin/python3

from enum import Enum
from dataclasses import dataclass



@dataclass
class Chain():

	class Type(Enum):
		FILTER = 0
		ROUTE = 1
		NAT = 2

	class Hook(Enum):
		PREROUTING = 0
		INPUT = 1
		FORWARD = 2
		OUTPUT = 3
		POSTROUTING = 4
		INGRESS = 5

	class Policy(Enum):
		ACCEPT = 0
		DROP = 1
		QUEUE = 2
		CONTINUE = 3
		RETURN = 4

    name: str
    chainType: Chain.Type
    hook: Chain.Hook
    priority: int
	dev: str
    policy: Chain.Policy