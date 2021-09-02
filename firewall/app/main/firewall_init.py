from . import db

from app.main.model.ip import IPBan
from app.main.model.mac import MacBan
from app.main.firewall_manager import FWManager

PyNFT = FWManager()

def init_rules():
    IPArray = IPBan.query.all()
    for ip in IPArray:
        response = PyNFT.ban_ipv4(IPBan.query.get(str(ip)).address)
        db.session.add(ip)
        db.session.commit()
    MACArray = MacBan.query.all()
    for mac in MACArray:
        response = PyNFT.ban_man(MacBan.query.get(str(mac)).address)
        db.session.add(mac)
        db.session.commit()

def init_firewall():
    init_rules()
