from .. import db, flask_bcrypt

class MacBan(db.Model):
    __tablename__ = "MacBan"

    id = db.Column(db.Integer, primary_key = True, autoincrement = True)
    address = db.Column(db.String(), nullable = False)

    def __init__(self, address):
        self.address = address

    def __repr__(self):
        return '<id {}>'.format(self.id)

    def __str__(self):
        return str(self.id)

    def serialize(self):
        return {
            'id': self.id,
            'address': self.address
        }