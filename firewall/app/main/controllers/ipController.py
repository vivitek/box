from flask import (Blueprint, request, abort)
from flask_api import status
from pynft import Executor
from app.main.model.ip import IPBan
from app.main import db

import re

bp = Blueprint('ip', __name__, url_prefix='/ip')
PyNFT = Executor()

regex = "^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])$"

@bp.route('/ban', methods=['POST'])
def banIP():
    try:
        if (request.form.get('address') == None or request.form.get('address') == ''):
            return 'Address is missing', status.HTTP_400_BAD_REQUEST
        if (not re.search(regex, request.form.get('address'))):
            return 'Invalid IP address', status.HTTP_400_BAD_REQUEST
        response = PyNFT.BanIPv4Addr(request.form.get('address'))
        if (response['error'] != ''):
            return response['error'], status.HTTP_500_INTERNAL_SERVER_ERROR
        ruleDB = IPBan (
            address = request.form.get('address')
        )
        db.session.add(ruleDB)
        db.session.commit()
        return response, status.HTTP_200_OK
    except Exception as e:
        return (str(e), status.HTTP_500_INTERNAL_SERVER_ERROR)

@bp.route('/unban', methods=['DELETE'])
def unbanIp():
    try:
        if (request.form.get('address') == None or request.form.get('address') == ''):
            return 'Address is missing', status.HTTP_400_BAD_REQUEST
        if (not re.search(regex, request.form.get('address'))):
            return 'Invalid IP address', status.HTTP_400_BAD_REQUEST
        response = PyNFT.UnbanIPv4Addr(request.form.get('address'))
        if (response['error'] != ''):
            return response['error'], status.HTTP_500_INTERNAL_SERVER_ERROR
        ruleDB = IPBan.query.filter_by(address=request.form.get('address')).delete()
        db.session.commit()
        return response, status.HTTP_200_OK
    except Exception as e:
        return (str(e), status.HTTP_500_INTERNAL_SERVER_ERROR)
