from flask import (Blueprint, request, abort)
from flask_api import status
from pynft import Executor
from app.main.model.ip import IPBan
from app.main import db
from app.main.utils.custom_exception import CustomException

from re import search

bp = Blueprint('ip', __name__, url_prefix='/ip')
PyNFT = Executor()

IP_FORMAT = "^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])$"

def validateForm(address):
    if (not address or address == ''):
        raise CustomException('Address is missing', status.HTTP_400_BAD_REQUEST)
    if (not search(IP_FORMAT, address)):
        raise CustomException('Invalid address', status.HTTP_400_BAD_REQUEST)

@bp.route('/ban', methods=['POST'])
def banIP():
    try:
        address = request.form.get('address')
        validateForm(address)
        response = PyNFT.BanIPv4Addr(address)
        if (response['error']):
            raise Exception(response['error'])
        ruleDB = IPBan (
            address = address
        )
        db.session.add(ruleDB)
        db.session.commit()
        return response, status.HTTP_200_OK
    except CustomException as e:
        return(e.reason, e.code)
    except Exception as e:
        return (str(e), status.HTTP_500_INTERNAL_SERVER_ERROR)

@bp.route('/unban', methods=['DELETE'])
def unbanIp():
    try:
        address = request.form.get('address')
        validateForm(address)
        response = PyNFT.UnbanIPv4Addr(address)
        if (response['error']):
            raise Exception(response['error'])
        IPBan.query.filter_by(address=address).delete()
        db.session.commit()
        return response, status.HTTP_200_OK
    except CustomException as e:
        return(e.reason, e.code)
    except Exception as e:
        return (str(e), status.HTTP_500_INTERNAL_SERVER_ERROR)
