from flask_api import status
from app.main.utils.custom_exception import CustomException
from re import search

def validateForm(address, regex):
    if (not address or address == ''):
        raise CustomException('Address is missing', status.HTTP_400_BAD_REQUEST)
    if (not search(regex, address)):
        raise CustomException('Invalid address', status.HTTP_400_BAD_REQUEST)