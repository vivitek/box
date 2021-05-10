from flask import (Blueprint, request, abort)
from flask_api import status
from pynft import Executor
from app.main.model.rules import Rule, MacBan, IPBan

from app.main import db

bp = Blueprint('rule', __name__, url_prefix='/rule')
PyNFT = Executor("", "")

@bp.route('/', methods=['POST'])
def addRule():
    try:
        args = [request.form.get('family'), request.form.get('tablename'), request.form.get('chainname'),
        request.form.get('addrtype'), request.form.get('addrspecification'), request.form.get('address'),
        request.form.get('statement')]
        rule = PyNFT.AddRule(args, None)
        if (rule == 'Error'):
            return 'Error', status.HTTP_500_INTERNAL_SERVER_ERROR
        ruleDB = Rule(
            family = request.form.get('family'),
            tablename = request.form.get('tablename'),
            chainname = request.form.get('chainname'),
            addrtype = request.form.get('addrtype'),
            addrspecification = request.form.get('addrspecification'),
            address = request.form.get('address'),
            statement = request.form.get('statement'),
        )
        db.session.add(ruleDB)
        db.session.commit()
        return rule, status.HTTP_201_CREATED
    except Exception as e:
        return(str(e)), status.HTTP_500_INTERNAL_SERVER_ERROR

@bp.route('/banIP', methods=['GET', 'POST'])
def banIP():
    try:
        response, rule = PyNFT.BanIpSaddr(request.args.get('address'))
        if (response['error'] != ''):
            return response['error'], status.HTTP_500_INTERNAL_SERVER_ERROR
        ruleDB = IPBan (
            address = request.args.get('address'),
            handle = rule['handle'][0]
        )
        db.session.add(ruleDB)
        db.session.commit()
        return response, status.HTTP_201_CREATED
    except Exception as e:
        return (str(e), status.HTTP_500_INTERNAL_SERVER_ERROR)

@bp.route('/unbanIP', methods=['GET', 'DELETE'])
def unbanIp():
    try:
        response, rule = PyNFT.UnbanIpSaddr(request.args.get('address'))
        if (response['error'] != ''):
            return response['error'], status.HTTP_500_INTERNAL_SERVER_ERROR
        ruleDB = IPBan.query.filter_by(address=request.args.get('address')).delete()
        db.session.commit()
        return response, status.HTTP_200_OK
    except Exception as e:
        return (str(e), status.HTTP_500_INTERNAL_SERVER_ERROR)

@bp.route('/banMAC', methods=['GET', 'POST'])
def banMac():
    try:
        response, rule = PyNFT.BanMacSaddr(request.args.get('address'))
        if (response['error'] != ''):
            return response['error'], status.HTTP_500_INTERNAL_SERVER_ERROR
        ruleDB = MacBan (
            address = request.args.get('address'),
            handle = rule['handle'][0]
        )
        db.session.add(ruleDB)
        db.session.commit()
        return response, status.HTTP_201_CREATED
    except Exception as e:
        return (str(e), status.HTTP_500_INTERNAL_SERVER_ERROR)

@bp.route('/unbanMAC', methods=['GET', 'DELETE'])
def unbanMac():
    try:
        response, rule = PyNFT.UnbanMacSaddr(request.args.get('address'))
        if (response['error'] != ''):
            return response['error'], status.HTTP_500_INTERNAL_SERVER_ERROR
        ruleDB = MacBan.query.filter_by(address=request.args.get('address')).delete()
        db.session.commit()
        return response, status.HTTP_200_OK
    except Exception as e:
        return (str(e), status.HTTP_500_INTERNAL_SERVER_ERROR)

@bp.route('/', methods=['DELETE'])
def deleteRules():
    
    try:
        ruleDB = Rule.query.filter_by(address=request.form.get('address'))
        ruleObject = ruleDB.first()
        args = [ruleObject.family, ruleObject.tablename, ruleObject.chainname, ruleObject.handle]
        rule = PyNFT.DeleteRule(args, None)
        ruleDB.delete()
        db.session.commit()
        if (rule == 'Error'):
            return rule, status.HTTP_500_INTERNAL_SERVER_ERROR
        return rule, status.HTTP_200_OK
    except Exception as e:
        return(str(e)), status.HTTP_500_INTERNAL_SERVER_ERROR
