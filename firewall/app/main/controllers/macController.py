from flask import (Blueprint, request, abort)
from flask_api import status
from pynft import Executor
from app.main.model.rules import MacBan
from app.main import db

bp = Blueprint('mac', __name__, url_prefix='/mac')
PyNFT = Executor()

@bp.route('/banMAC', methods=['POST'])
def banMac():
    try:
        if (request.form.get('address') == None):
            return 'Address is missing', status.HTTP_400_BAD_REQUEST
        response = PyNFT.BanMACAddr(request.form.get('address'), None)
        if (response['error'] != ''):
            return response['error'], status.HTTP_500_INTERNAL_SERVER_ERROR
        ruleDB = MacBan (
            address = request.form.get('address'),
            handle = 0
        )
        db.session.add(ruleDB)
        db.session.commit()
        return response, status.HTTP_200_OK
    except Exception as e:
        return (str(e), status.HTTP_500_INTERNAL_SERVER_ERROR)

@bp.route('/unbanMAC', methods=['DELETE'])
def unbanMac():
    try:
        if (request.form.get('address') == None):
            return 'Address is missing', status.HTTP_400_BAD_REQUEST
        response = PyNFT.UnbanMACAddr(request.form.get('address'))
        if (response['error'] != ''):
            return response['error'], status.HTTP_500_INTERNAL_SERVER_ERROR
        ruleDB = MacBan.query.filter_by(address=request.form.get('address')).delete()
        db.session.commit()
        return response, status.HTTP_200_OK
    except Exception as e:
        return (str(e), status.HTTP_500_INTERNAL_SERVER_ERROR)