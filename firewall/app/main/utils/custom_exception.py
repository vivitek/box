class CustomException(Exception):
    def __init__(self, reason, code):
        self.reason = reason
        self.code = code