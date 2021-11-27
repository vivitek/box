from flask import Blueprint, request, abort
from flask_api import status
from app.main import redis_client
from app.main.firewall_manager import FWManager
from app.main.utils.custom_exception import CustomException
import app.main.utils.validate_form as validateForm

bp = Blueprint('ip', __name__, url_prefix='/ip')
PyNFT = FWManager()

IP_FORMAT = "^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])$"


def bandWidth():
    # applique le truc la

@bp.route('/ban', methods=['POST'])
def banIP():
    try:
        body = request.get_json()
        address = body.get('address')
        # bandwith
        # setBandwith()
        validateForm.validateForm(address, IP_FORMAT)
        response = PyNFT.ban_ipv4(address)
        if (response['error']):
            raise Exception(response['error'])
        redis_client.zadd('ipBan', {address: 0})
        return response, status.HTTP_200_OK
    except CustomException as e:
        return(e.reason, e.code)
    except Exception as e:
        return (str(e), status.HTTP_500_INTERNAL_SERVER_ERROR)

@bp.route('/unban', methods=['POST'])
def unbanIp():
    try:
        body = request.get_json()
        address = body.get('address')
        validateForm.validateForm(address, IP_FORMAT)
        response = PyNFT.unban_ipv4(address)
        if (response['error']):
            raise Exception(response['error'])
        redis_client.zrem('ipBan', address)
        return response, status.HTTP_200_OK
    except CustomException as e:
        return(e.reason, e.code)
    except Exception as e:
        return (str(e), status.HTTP_500_INTERNAL_SERVER_ERROR)
