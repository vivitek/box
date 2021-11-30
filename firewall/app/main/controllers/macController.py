from flask import Blueprint, request, abort
from flask_api import status
from app.main import redis_client
from app.main.firewall_manager import FWManager
from app.main.utils.custom_exception import CustomException
import app.main.utils.validate_form as validateForm

MAC_FORMAT = "^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})|([0-9a-fA-F]{4}\\.[0-9a-fA-F]{4}\\.[0-9a-fA-F]{4})$"

bp = Blueprint('mac', __name__, url_prefix='/mac')
PyNFT = FWManager()


def manage_ban(address, is_ban):
    try:
        validateForm.validateForm(address, MAC_FORMAT)
        address_rank = redis_client.zrank('macBan')
        banned = 1 if is_ban is True else 0

        if address_rank is None:
            redis_client.zadd('macBan', {address: banned})
        else:
            redis_client.zrem('macBan', address)
            redis_client.zadd('macBan', {address: banned})
        if is_ban:
            response = PyNFT.ban_mac(address)
            if response['error']:
                raise Exception(response['error'])
        else:
            response = PyNFT.unban_mac(address)
            if response['error']:
                raise Exception(response['error'])
    except CustomException as e:
        return e.reason, e.code
    except Exception as e:
        return str(e), status.HTTP_500_INTERNAL_SERVER_ERROR


@bp.route('/', methods=['POST'])
def manage_mac():
    try:
        body = request.get_json()
        mac_address = body.get('address')
        is_ban = body.get('isBanned')
        manage_ban(mac_address, is_ban)
        return 'Changes Applied', status.HTTP_200_OK
    except Exception as e:
        return str(e), status.HTTP_500_INTERNAL_SERVER_ERROR
        