from app.main import redis_client
from app.main.firewall_manager import FWManager
from app.main.bandwidth.limiter import Limiter

PyNFT = FWManager()
limiter = Limiter()


def init_rules():
    ip_array = redis_client.zrange("ipBan", 0, -1)
    for ip in ip_array:
        PyNFT.ban_ipv4(ip.decode())
    redis_client.delete("limitIP")
    mac_array = redis_client.zrange("macBan", 0, -1)
    for mac in mac_array:
        if redis_client.zrank('macBan', mac) == 1:
            PyNFT.ban_mac(mac.decode())


def init_firewall():
    init_rules()
    limiter.init_tc()
