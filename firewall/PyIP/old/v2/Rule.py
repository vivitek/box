#! /usr/bin/python3

from enum import Enum, IntEnum
from dataclasses import dataclass
import PacketInformations as pif
from Tools import find_between


class Match(Enum):
    IP = pif.IP_PI
    IP6 = pif.IP6_PI
    TCP = pif.TCP_PI
    UDP = pif.UDP_PI
    UDPLITE = pif.UDPLITE_PI
    SCTP = pif.SCTP_PI
    DCCP = pif.DCCP_PI
    AH = pif.AH_PI
    ESP = pif.ESP_PI
    COMP = pif.COMP_PI
    ICMP = pif.ICMP_PI
    ICMPV6 = pif.ICMPV6_PI
    ETHER = pif.ETHER_PI
    DST = pif.DST_PI
    FRAG = pif.FRAG_PI
    HBH = pif.HBH_PI
    MH = pif.MH_PI
    RT = pif.RT_PI
    VLAN = pif.VLAN_PI
    ARP = pif.ARP_PI
    CT = pif.CT_PI
    META = pif.META_PI


class Statement(IntEnum):
    ACCEPT = 0
    DROP = 1
    QUEUE = 2
    QUEUE_NUM = 3
    CONTINUE = 4
    RETURN = 5
    JUMP = 6
    GOTO = 7
    LOG = 8
    LOG_LEVEL = 9
    LOG_GROUP = 10
    REJECT = 11
    REJECT_WITH_TYPE = 12
    COUNTER = 13
    COUNTER_PACKETS_BYTES = 14
    LIMIT_RATE = 15
    DNAT = 16
    SNAT = 17
    MASQUERADE = 18

    def getFillCode(self) -> str:
        switch (self)
        {
            case 0: return "accept"
            case 1: return "drop"
            case 2: return "queue"
            case 3: return "queue num $0"
            case 4: return "continue"
            case 5: return "return"
            case 6: return "jump $0"
            case 7: return "goto $0"
            case 8: return "log"
            case 9: return "log level $0"
            case 10: return "log group $0"
            case 11: return "reject"
            case 12: return "reject with $0 type $1"
            case 13: return "counter"
            case 14: return "counter packets $0 bytes $1"
            case 15: return "limit rate $0"
            case 16: return "dnat $0"
            case 17: return "snat $0"
            case 18: return "masquerade $0"
        }

    def getLastTag(self) -> int:
        return max(map(int, re.findall(r'\d+', self.getFillCode())))

    @classmethod
    def toString(self, statType: Statement, statValue: list[str]) -> str:

        result = statType.getFillCode()
        tagCount = statType.getLastTag()

        if len(statValue) != tagCount + 1:
            raise ValueError("Statement.toString(self, statType, statValue):\tstatementValue has incorrect parameter count")

        # countdown from last tag (included) to -1 (excluded)
        for x in range(tagCount, -1, -1):
            tag = '$' + str(x)
            result.replace(tag, statValue[x])

        return result


@dataclass
class Rule:

	# def __init__(self, handle: int, mathc)

    handle: int
    matchType: pif.PIF
    matchValue: str
    statementType: Rule.Statement
    statementValue: list[str]

    def GetMatch(self) -> str:
        return matchType.toString(matchValue)

    def GetStatement(self) -> str:
        return Statement.toString(statementType, statementValue)
