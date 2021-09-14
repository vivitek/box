from app.main import redis_client
from app.main.firewall_manager import FWManager

PyNFT = FWManager()

def init_rules():
    IPArray = redis_client.zrange("ipBan", 0, -1)
    for ip in IPArray:
        response = PyNFT.ban_ipv4(ip.decode())
    MACArray = redis_client.zrange("macBan", 0, -1)
    for mac in MACArray:
        response = PyNFT.ban_mac(mac.decode())

def init_firewall():
    init_rules()
