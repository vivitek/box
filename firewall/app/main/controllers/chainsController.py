from flask import (Blueprint, request, abort)
from flask_api import status
from pynft import Executor
from app.main.model.chains import Chain

from app.main import db

bp = Blueprint('chains', __name__, url_prefix='/chains')
PyNFT = Executor("", "")

@bp.route('/', methods=['GET'])
def getChain():
    try:
        chain = PyNFT.GetChain(request.form.get('family'),
        request.form.get('tablename'),
        request.form.get('chainname'))
        if (chain['error'] != ''):
            return chain['error'], status.HTTP_500_INTERNAL_SERVER_ERROR
        return chain, status.HTTP_200_OK
    except Exception as e:
        return(str(e), status.HTTP_500_INTERNAL_SERVER_ERROR)

@bp.route('/', methods=['POST'])
def addChains():
    try:
        if (request.form.get('type') and request.form.get('hook')
        and request.form.get('priority') and request.form.get('policy')):        
            chain = PyNFT.AddChain(request.form.get('family'),
            request.form.get('tablename'),
            request.form.get('chainname'),
            request.form.get('type'),
            request.form.get('hook'),
            request.form.get('priority'),
            request.form.get('policy'))
        else:
            chain = PyNFT.AddChain(request.form.get('family'),
            request.form.get('tablename'),
            request.form.get('chainname'))
        print(chain)
        if (chain['error'] != ''):
            return chain['error'], status.HTTP_500_INTERNAL_SERVER_ERROR
        chainDB = Chain(
            family = request.form.get('family'),
            tablename = request.form.get('tablename'),
            chainname = request.form.get('chainname'),
            ctype = request.form.get('type') or 'filter',
            hook = request.form.get('hook') or 'prerouting',
            priority = request.form.get('priority') or '0',
            policy = request.form.get('policy') or 'accept'
        )
        db.session.add(chainDB)
        db.session.commit()
        return chain, status.HTTP_201_CREATED
    except Exception as e:
        return(str(e), status.HTTP_500_INTERNAL_SERVER_ERROR)

@bp.route('/', methods=['DELETE'])
def deleteChains():
    try:
        chain = PyNFT.DeleteChain(request.form.get('family'),
        request.form.get('tablename'),
        request.form.get('chainname'))
        if (chain['error'] != ''):
            return chain['error'], status.HTTP_500_INTERNAL_SERVER_ERROR
        chainDB = Chain.query.filter_by(chainname=request.form.get('chainname')).delete()
        db.session.commit()
        return chain, status.HTTP_200_OK
    except Exception as e:
        return(str(e), status.HTTP_500_INTERNAL_SERVER_ERROR)
