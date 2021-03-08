from .. import db, flask_bcrypt

class Rule(db.Model):
    __tablename__ = "rules"

    id = db.Column(db.Integer, primary_key = True, autoincrement = True)
    family = db.Column(db.String(), nullable = False)
    tablename = db.Column(db.String(), nullable = False)
    chainname = db.Column(db.String(), nullable = False)
    addrtype = db.Column(db.String(), nullable = False)
    addrspecification = db.Column(db.String(), nullable = False)
    address = db.Column(db.String(), nullable = False)
    statement = db.Column(db.String(), nullable = False)
    handle = db.Column(db.String(), nullable = False)

    def __init__(self, family, tablename, chainname, addrtype,
    addrspecification, address, statement, handle):
        self.family = family
        self.tablename = tablename
        self.chainname = chainname
        self.addrtype = addrtype
        self.addrspecification = addrspecification
        self.address = address
        self.statement = statement
        self.handle = handle

    def __repr__(self):
        return '<id {}>'.format(self.id)
    
    def __str__(self):
        return str(self.id)

    def serialize(self):
        return {
            'id': self.id,
            'family': self.family,
            'tablename': self.tablename,
            'chainname': self.chainname,
            'addrtype': self.addrtype,
            'addrspecification': self.addrspecification,
            'address': self.address,
            'statement': self.statement,
            'handle': self.handle
        }

class IPBan(db.Model):
    __tablename__ = "IPBan"

    id = db.Column(db.Integer, primary_key = True, autoincrement = True)
    address = db.Column(db.String(), nullable = False)
    handle = db.Column(db.String(), nullable = False)

    def __init__(self, address, handle):
        self.address = address
        self.handle = handle

    def __repr__(self):
        return '<id {}>'.format(self.id)

    def __str__(self):
        return str(self.id)

    def serialize(self):
        return {
            'id': self.id,
            'address': self.address,
            'handle': self.handle
        }

class MacBan(db.Model):
    __tablename__ = "MacBan"

    id = db.Column(db.Integer, primary_key = True, autoincrement = True)
    address = db.Column(db.String(), nullable = False)
    handle = db.Column(db.String(), nullable = False)

    def __init__(self, address, handle):
        self.address = address
        self.handle = handle

    def __repr__(self):
        return '<id {}>'.format(self.id)

    def __str__(self):
        return str(self.id)

    def serialize(self):
        return {
            'id': self.id,
            'address': self.address,
            'handle': self.handle
        }