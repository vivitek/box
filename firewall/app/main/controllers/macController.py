from flask import (Blueprint, request, abort)
from flask_api import status
from pynft import Executor
from app.main.model.mac import MacBan
from app.main import db

from re import search

MAC_FORMAT = "^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})|([0-9a-fA-F]{4}\\.[0-9a-fA-F]{4}\\.[0-9a-fA-F]{4})$"

bp = Blueprint('mac', __name__, url_prefix='/mac')
PyNFT = Executor()

def validateForm(address):
    if (not address or address == ''):
        return 'Address is missing', status.HTTP_400_BAD_REQUEST
    if (not search(MAC_FORMAT, address)):
        return 'Invalid address', status.HTTP_400_BAD_REQUEST
    return True

@bp.route('/ban', methods=['POST'])
def banMac():
    try:
        address = request.form.get('address');
        isValid = validateForm(address)
        if (isValid != True):
            return isValid
        response = PyNFT.BanMACAddr(address, None)
        if (response['error'] != ''):
            return response['error'], status.HTTP_500_INTERNAL_SERVER_ERROR
        ruleDB = MacBan (
            address = address
        )
        db.session.add(ruleDB)
        db.session.commit()
        return response, status.HTTP_200_OK
    except Exception as e:
        return (str(e), status.HTTP_500_INTERNAL_SERVER_ERROR)

@bp.route('/unban', methods=['DELETE'])
def unbanMac():
    try:
        address = request.form.get('address')
        isValid = validateForm(address)
        if (isValid != True):
            return isValid
        response = PyNFT.UnbanMACAddr(address)
        if (response['error'] != ''):
            return response['error'], status.HTTP_500_INTERNAL_SERVER_ERROR
        MacBan.query.filter_by(address=address).delete()
        db.session.commit()
        return response, status.HTTP_200_OK
    except Exception as e:
        return (str(e), status.HTTP_500_INTERNAL_SERVER_ERROR)