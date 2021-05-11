from . import db

from app.main.controllers.tableController import Table
from app.main.controllers.chainsController import Chain
from app.main.controllers.rulesController import Rule, IPBan, MacBan

from pynft import Executor

PyNFT = Executor()

def init_tables():
    tablesArray = Table.query.all()
    for table in tablesArray:
        PyNFT.AddTable(Table.query.get(str(table)).family,
        Table.query.get(str(table)).tablename)

def init_chains():
    chainsArray = Chain.query.all()
    for chain in chainsArray:
        PyNFT.AddChain(Chain.query.get(str(chain)).family,
        Chain.query.get(str(chain)).tablename,
        Chain.query.get(str(chain)).chainname,
        Chain.query.get(str(chain)).ctype,
        Chain.query.get(str(chain)).hook,
        Chain.query.get(str(chain)).priority,
        Chain.query.get(str(chain)).policy)

def init_rules():
    IPArray = IPBan.query.all()
    for ip in IPArray:
        response = PyNFT.BanIPv4Addr(IPBan.query.get(str(ip)).address)
        ip.handle = 0
        db.session.add(ip)
        db.session.commit()
    MACArray = MacBan.query.all()
    for mac in MACArray:
        response = PyNFT.BanMACAddr(MacBan.query.get(str(mac)).address)
        mac.handle = 0
        db.session.add(mac)
        db.session.commit()

def init_firewall():
    if (db.session.query(Table.id).filter_by(tablename='BanTable').first() is None):
        tableDB = Table(
            family = 'inet',
            tablename =  'BanTable'
        )
        chainDB = Chain(
            family = 'inet',
            tablename = 'BanTable',
            chainname = 'BanChain',
            ctype = 'filter',
            hook = 'input',
            priority = '0',
            policy = 'accept'
        )
        db.session.add(tableDB)
        db.session.add(chainDB)
        db.session.commit()
    PyNFT.init_pynft("", "")
    init_tables()
    init_chains()
    init_rules()

