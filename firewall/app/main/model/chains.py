from .. import db, flask_bcrypt

class Chain(db.Model):
    __tablename__ = "chains"

    id = db.Column(db.Integer, primary_key = True, autoincrement = True)
    family = db.Column(db.String(), nullable = False)
    tablename = db.Column(db.String(), nullable = False)
    chainname = db.Column(db.String(), unique = True, nullable = False)
    ctype = db.Column(db.String(), nullable = False)
    hook = db.Column(db.String(), nullable = False)
    priority = db.Column(db.Integer, nullable = False)
    policy = db.Column(db.String(), nullable = False)

    def __init__(self, family, tablename, chainname, ctype,
    hook, priority, policy):
        self.family = family
        self.tablename = tablename
        self.chainname = chainname
        self.ctype = ctype
        self.hook = hook
        self.priority = priority
        self.policy = policy

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
            'ctype': self.ctype,
            'hook': self.hook,
            'priority': self.priority,
            'policy': self.policy
        }