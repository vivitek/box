from app.main import redis_client

from pynft import Executor

PyNFT = Executor()

def init_rules():
    IPArray = redis_client.zrange("ipBan", 0, -1)
    for ip in IPArray:
        response = PyNFT.BanIPv4Addr(ip.decode())
    MACArray = redis_client.zrange("macBan", 0, -1)
    for mac in MACArray:
        response = PyNFT.BanMACAddr(mac.decode())

def init_firewall():
    PyNFT.init_pynft("", "")
    init_rules()
