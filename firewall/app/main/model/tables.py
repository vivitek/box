from .. import db, flask_bcrypt

class Table(db.Model):
    __tablename__ = "tables"

    id = db.Column(db.Integer, primary_key = True, autoincrement = True)
    family = db.Column(db.String(), nullable = False)
    tablename = db.Column(db.String(), unique = True, nullable = False)

    def __init__(self, family, tablename):
        self.family = family
        self.tablename = tablename

    def __repr__(self):
        return '<id {}>'.format(self.id)

    def __str__(self):
        return str(self.id)

    def serialize(self):
        return {
            'id': self.id,
            'family': self.family,
            'tablename': self.tablename
        }