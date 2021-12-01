from flask import Blueprint, request, abort
from flask_api import status
from app.main import redis_client
from app.main.firewall_manager import FWManager
from app.main.utils.custom_exception import CustomException
from app.main.bandwidth.limiter import Limiter

bp = Blueprint('ip', __name__, url_prefix='/ip')
PyNFT = FWManager()
limiter = Limiter()


def manage_bandwidth(address, rate):
    try:
        limit_rank = redis_client.zrank('limitIP', address)
        limit_number = redis_client.zcard('limitIP')

        if limit_rank is None:
            redis_client.zadd('limitIP', {address: int(limit_number)})
            limiter.limit(address, rate, int(limit_number) + 1)
        else:
            limiter.replace(address, limit_rank + 1, rate)
    except CustomException as e:
        return e.reason, e.code
    except Exception as e:
        return str(e), status.HTTP_500_INTERNAL_SERVER_ERROR


@bp.route('/ban', methods=['POST'])
def ban_ip():
    try:
        body = request.get_json()
        address = body.get('address')
        limit = body.get('limit')
        manage_bandwidth(address, limit)
        response = PyNFT.ban_ipv4(address)
        if response['error']:
            raise Exception(response['error'])
        redis_client.zadd('ipBan', {address: 0})
        return response, status.HTTP_200_OK
    except CustomException as e:
        return e.reason, e.code
    except Exception as e:
        return str(e), status.HTTP_500_INTERNAL_SERVER_ERROR


@bp.route('/unban', methods=['POST'])
def unban_ip():
    try:
        body = request.get_json()
        address = body.get('address')
        limit = body.get('limit')
        manage_bandwidth(address, limit)
        response = PyNFT.unban_ipv4(address)
        if response['error']:
            raise Exception(response['error'])
        redis_client.zrem('ipBan', address)
        return response, status.HTTP_200_OK
    except CustomException as e:
        return e.reason, e.code
    except Exception as e:
        return str(e), status.HTTP_500_INTERNAL_SERVER_ERROR
