#! /usr/bin/python3

from enum import Enum

class PackInfo(Enum):
    def toString(self):
        return self.name.lower().replace("_", " ")

class IP_PI(PackInfo):
    DSCP = 0
    LENGTH = 1
    ID = 2
    FRAG-OFF = 3
    TTL = 4
    PROTOCOL = 5
    CHECKSUM = 6
    SADDR = 7
    DADDR = 8
    VERSION = 9
    HDRLENGTH = 10

class IP6_PI(PackInfo):
    DSCP = 0
    FLOWLABEL = 1
    LENGTH = 2
    NEXTHDR = 3
    HOPLIMIT = 4
    SADDR = 5
    DADDR = 6
    VERSION = 7

class TCP_PI(PackInfo):
    DPORT = 0
    SPORT = 1
    SEQUENCE = 2
    ACKSEQ = 3
    FLAGS = 4
    WINDOW = 5
    CHECKSUM = 6
    URGPTR = 7
    DOFF = 8

class UDP_PI(PackInfo):
    DPORT = 0
    SPORT = 1
    LENGTH = 2
    CHECKSUM = 3

class UDPLITE_PI(PackInfo):
    DPORT = 0
    SPORT = 1
    CHECKSUM = 2

class SCTP_PI(PackInfo):
    DPORT = 0
    SPORT = 1
    CHECKSUM = 2
    VTAG = 3

class DCCP_PI(PackInfo):
    DPORT = 0
    SPORT = 1
    TYPE = 2

class AH_PI(PackInfo):
    HDRLENGTH = 0
    RESERVED = 1
    SPI = 2
    SEQUENCE = 3

class ESP_PI(PackInfo):
    SPI = 0
    SEQUENCE = 1

class COMP_PI(PackInfo):
    NEXTHDR = 0
    FLAGS = 1
    CPI = 2

class ICMP_PI(PackInfo):
    TYPE = 0
    CODE = 1
    CHECKSUM = 2
    ID = 3
    SEQUENCE = 4
    MTU = 5
    GATEWAY = 6

class ICMPV6_PI(PackInfo):
    TYPE = 0
    CODE = 1
    CHECKSUM = 2
    ID = 3
    SEQUENCE = 4
    MTU = 5
    MAX-DELAY = 6

class ETHER_PI(PackInfo):
    SADDR = 0
    TYPE = 1

class DST_PI(PackInfo):
    NEXTHDR = 0
    HDRLENGTH = 1

class FRAG_PI(PackInfo):
    NEXTHDR = 0
    RESERVED = 1
    FRAG-OFF = 2
    MORE-FRAGMENTS = 3
    ID = 4

class HBH_PI(PackInfo):
    NEXTHDR = 0
    HDRLENGTH = 1

class MH_PI(PackInfo):
    NEXTHDR = 0
    HDRLENGTH = 1
    TYPE = 2
    RESERVED = 3
    CHECKSUM = 4

class RT_PI(PackInfo):
    NEXTHDR = 0
    HDRLENGTH = 1
    TYPE = 2
    SEG-LEFT = 3

class VLAN_PI(PackInfo):
    ID = 0
    CFI = 1
    PCP = 2

class ARP_PI(PackInfo):
    PTYPE = 0
    HTYPE = 1
    HLEN = 2
    PLEN = 3
    OPERATION = 4

class CT_PI(PackInfo):
    STATE = 0
    DIRECTION = 1
    STATUS = 2
    MARK = 3
    EXPIRATION = 4
    HELPER = 5
    ORIGINAL_BYTES = 6
    REPLY_BYTES = 7
    ORIGINAL_PACKETS = 8
    REPLY_PACKETS = 9
    ORIGINAL_SADDR = 10
    REPLY_SADDR = 11
    ORIGINAL_DADDR = 12
    REPLY_DADDR = 13
    ORIGINAL_L3PROTO = 14
    REPLY_L3PROTO = 15
    ORIGINAL_PROTOCOL = 16
    REPLY_PROTOCOL = 17
    ORIGINAL_PROTODST = 18
    REPLY_PROTODST = 19
    ORIGINAL_PROTOSRC = 20
    REPLY_PROTOSRC = 21

class META_PI(PackInfo):
    IIFNAME = 0
    OIFNAME = 1
    IIF = 2
    OIF = 3
    IIFTYPE = 4
    OIFTYPE = 5
    LENGTH = 6
    PROTOCOL = 7
    NFPROTO = 8
    L4PROTO = 9
    MARK = 10
    PRIORITY = 11
    SKUID = 12
    SKGID = 13
    RTCLASSID = 14
    PKTTYPE = 15
    CPU = 16
    IIFGROUP = 17
    OIFGROUP = 18
    CGROUP = 19
