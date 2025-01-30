import jwt
import os
import time
from decouple import config

JWT_SECRET = "Phemon_coder"
JWT_ALGORITHM = "HS256"


class AuthHandler(object):

    @staticmethod
    def sign_jwt(user_id : int) -> str:
        payload = {
            "user_id" : user_id,
            "expires": time.time() + 9000
        }

        token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
        return token

    @staticmethod
    def decode_jwt(token : str) -> dict:
        try:
            decoded_token = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
            return decoded_token if decoded_token["expires"] >= time.time() else None
        except:
            print("unable to decode the token")
            return None
            