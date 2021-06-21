from flask import (Blueprint, request, abort)
from flask_api import status
from pynft import Executor
from app.main.model.ip import IPBan
from app.main import db

from re import search

bp = Blueprint('ip', __name__, url_prefix='/ip')
PyNFT = Executor()

IP_FORMAT = "^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])$"

def validateForm(address): 
    if (not address or address == ''):
            return 'Address is missing', status.HTTP_400_BAD_REQUEST
    if (not search(IP_FORMAT, address)):
        return 'Invalid IP address', status.HTTP_400_BAD_REQUEST
    return True

@bp.route('/ban', methods=['POST'])
def banIP():
    try:
        address = request.form.get('address')
        isValid = validateForm(address)
        if (isValid != True):
            return isValid
        response = PyNFT.BanIPv4Addr(address)
        if (response['error'] != ''):
            return response['error'], status.HTTP_500_INTERNAL_SERVER_ERROR
        ruleDB = IPBan (
            address = address
        )
        db.session.add(ruleDB)
        db.session.commit()
        return response, status.HTTP_200_OK
    except Exception as e:
        return (str(e), status.HTTP_500_INTERNAL_SERVER_ERROR)

@bp.route('/unban', methods=['DELETE'])
def unbanIp():
    try:
        address = request.form.get('address')
        isValid = validateForm(address)
        if (isValid != True):
            return isValid
        response = PyNFT.UnbanIPv4Addr(address)
        if (response['error'] != ''):
            return response['error'], status.HTTP_500_INTERNAL_SERVER_ERROR
        ruleDB = IPBan.query.filter_by(address=address).delete()
        db.session.commit()
        return response, status.HTTP_200_OK
    except Exception as e:
        return (str(e), status.HTTP_500_INTERNAL_SERVER_ERROR)
