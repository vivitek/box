from . import db

from app.main.model.ip import IPBan
from app.main.model.mac import MacBan

from pynft import Executor

PyNFT = Executor()

def init_rules():
    IPArray = IPBan.query.all()
    for ip in IPArray:
        response = PyNFT.BanIPv4Addr(IPBan.query.get(str(ip)).address)
        db.session.add(ip)
        db.session.commit()
    MACArray = MacBan.query.all()
    for mac in MACArray:
        response = PyNFT.BanMACAddr(MacBan.query.get(str(mac)).address)
        db.session.add(mac)
        db.session.commit()

def init_firewall():
    PyNFT.init_pynft("", "")
    init_rules()
