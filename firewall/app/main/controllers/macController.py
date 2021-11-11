from flask import Blueprint, request, abort
from flask_api import status
from app.main import redis_client
from app.main.firewall_manager import FWManager
from app.main.utils.custom_exception import CustomException
import app.main.utils.validate_form as validateForm
from app.main.bandwidth.bandwidthManager import Bandwidth

MAC_FORMAT = "^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})|([0-9a-fA-F]{4}\\.[0-9a-fA-F]{4}\\.[0-9a-fA-F]{4})$"

bp = Blueprint('mac', __name__, url_prefix='/mac')
PyNFT = FWManager()
bandwidth = Bandwidth()

@bp.route('/ban', methods=['POST'])
def banMac():
    try:
        body = request.get_json()
        address = body.get('address')
        validateForm.validateForm(address, MAC_FORMAT)
        response = PyNFT.ban_mac(address)
        if (response['error']):
            raise Exception(response['error'])
        redis_client.zadd('macBan', {address: 0})
        return response, status.HTTP_200_OK
    except CustomException as e:
        return(e.reason, e.code)
    except Exception as e:
        return (str(e), status.HTTP_500_INTERNAL_SERVER_ERROR)

@bp.route('/unban', methods=['POST'])
def unbanMac():
    try:
        body = request.get_json()
        address = body.get('address')
        validateForm.validateForm(address, MAC_FORMAT)
        response = PyNFT.unban_mac(address)
        if (response['error']):
            raise Exception(response['error'])
        redis_client.zrem('macBan', address)
        return response, status.HTTP_200_OK
    except CustomException as e:
        return (e.reason, e.code)
    except Exception as e:
        return (str(e), status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@bp.route('/limit', methods=['POST'])
def limitMac():
    try:
        address = request.form.get('address')
        limit = request.form.get('limit')
        validateForm.validateForm(address, MAC_FORMAT)
        limitRank = redis_client.zrank('limitMac', limit)
        limitNumber = redis_client.zcard('limitMac')

        if (limitRank == None):
            redis_client.zadd('limitMac', {limit: int(limitNumber) + 1})
            bandwidth.rule_limit(limit, int(limitNumber) + 1)
            bandwidth.limit_mac(address, int(limitNumber) + 1)
        else:
            # bandwidth.rule_limit(limit, limitRank)
            bandwidth.limit_mac(address, limitRank + 1)
        return 'Addess has been limited', status.HTTP_200_OK
    except CustomException as e:
        return (e.reason, e.code)
    except Exception as e:
        return (str(e), status.HTTP_500_INTERNAL_SERVER_ERROR)
        