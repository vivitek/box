#! /usr/bin/python3

from enum import Enum
from dataclasses import dataclass

class Family(Enum):
	IP = 0
	ARP = 1
	IP6 = 2
	BRIDGE = 3
	INET = 4
	NETDEV = 5

@dataclass
class Table():
    name: str
    family: Family
	handle: int