from flask import (Blueprint, request, abort, jsonify)
from flask_api import status
from pynft import Executor

from app.main.model.tables import Table
from app.main import db

bp = Blueprint('table', __name__, url_prefix='/table')
PyNFT = Executor("", "")


@bp.route('/', methods=['GET'])
def getTable():
    if (request.form.get('family') is not None and request.form.get('tablename') is not None):
        table = PyNFT.GetTable(request.form.get('family'), request.form.get('tablename'))
    else:
        table = PyNFT.GetTable()
    if (table['error'] != ''):
        return table['error'], status.HTTP_500_INTERNAL_SERVER_ERROR
    
    return table['output'], status.HTTP_200_OK


@bp.route('/', methods=['POST'])
def addTable():
    try:
        table = PyNFT.AddTable(request.form.get('family'), request.form.get('tablename'))
        if (table['error'] != ''):
            return table, status.HTTP_500_INTERNAL_SERVER_ERROR
        tableDB = Table(
            family = request.form.get('family'),
            tablename = request.form.get('tablename')
        )
        db.session.add(tableDB)
        db.session.commit()
        return table, status.HTTP_201_CREATED
    except Exception as e:
        return(str(e))


@bp.route('/', methods=['DELETE'])
def deleteTable():
    try:
        table = PyNFT.DeleteTable(request.form.get('family'), request.form.get('tablename'))
        if (table['error'] != ''):
            return table, status.HTTP_500_INTERNAL_SERVER_ERROR
        tableDB = Table.query.filter_by(tablename=request.form.get('tablename')).delete()
        db.session.commit()
        return table, status.HTTP_200_OK
    except Exception as e:
        return(str(e))


