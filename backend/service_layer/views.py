from database_layer.models import *
from database_layer.database import *
from flask import make_response
import json
from cryptography.fernet import Fernet
from os import path
import datetime 
import jwt
from pathlib import Path
p = path.join(str(Path(__file__).resolve().parents[1]))
config = json.load(open(path.join(p, 'database_layer/config.json')))


def encrypt_pwd(password):
  key=b'imjNJDkYflFAwrPdmkVPZvj6uFlhrBkQHUQrAQgdMW8='
  fernet = Fernet(key)
  encrypted = fernet.encrypt(password.encode())
  return encrypted


def decrypt_pwd(token):
  token = bytes(token,encoding='utf-8')
  key= b'imjNJDkYflFAwrPdmkVPZvj6uFlhrBkQHUQrAQgdMW8='
  fernet = Fernet(key)
  password = fernet.decrypt(token).decode()
  return password


def encode_auth_token(user_id):
  """
  Generates the Auth Token
  :return: string
  """
  try:
      payload = {
          'exp': datetime.datetime.utcnow() + datetime.timedelta(days=0, seconds=1800),
          'iat': datetime.datetime.utcnow(),
          'sub': user_id
      }
      return jwt.encode(
          payload,
          'my_precious',
          algorithm='HS256'
      )
  except Exception as e:
      return e


def decode_auth_token(auth_header):
  """
  Validates the auth token
  :param auth_token:
  :return: integer|string
  """
  if auth_header:
    try:
        auth_token = auth_header.split(" ")[1]
    except IndexError:
      return 'Malformed bearer token!'
    try:
        token = jwt.decode(auth_token, config.get('secret_key'), algorithms=["HS256"])
        return token
    except jwt.ExpiredSignatureError:
        return 'Token expired. Please log in again!'
    except jwt.InvalidTokenError:
        return 'Invalid token. Please try again!'
  else:
    return 'Please provide a valid bearer token!'


def log_in(data):
  try:
    user = db_session.query(User).filter_by(email=data.get('email')).first()
    if user:
      if data.get('password') == decrypt_pwd(user.password):
        auth_token = encode_auth_token(user.id)
        response = {
            'success': 'true',
            'data': {
              'token': auth_token,
              'user':{
                'name': user.name,
                'email': user.email
              }
            }
        }
      else:
        response = {
            'success': 'false',
            'data': {
              'error': 'Wrong password. Please try again!'
            }
        }
    else:
      response = {
          'success': 'false',
          'data': {
            'error': 'Invalid username. Please try again!'
          }
      }
    return response
  except Exception as e:
    response = {
        'success': 'fail',
        'data': {
          'error': 'Something went wrong!'
        }
    }
    return response


def create_user(data):
  # check if user already exists
  user = db_session.query(User).filter_by(email=data.get('email')).first()
  if not user:
    try:
      encryptedpwd = encrypt_pwd(data.get('password'))
      user = User(
          name = data.get('name'),
          email=data.get('email'),
          password=encryptedpwd
      )
      db_session.add(user)
      db_session.commit()

      
      response = {
          'success': 'true',
          'data': {
            'message': 'Successfully registered! Redirecting to login page...'
          }
      }
      return response
        
    except Exception as e:
      db_session.rollback()
      response = {
          'success': 'false',
          'data': {
            'error': 'Something went wrong!'
          }
      }
      return response
  else:
    response = {
        'success': 'false',
        'data': {
          'error': 'User already exists. Please log in!'
        }
    }
    return response


def get_products():
  products = db_session.query(Product)
  prod_list = [{
    'id': product.id,
    'name': product.name,
    'description': product.description,
    'price': product.price,
    'image_url': product.image_url
  } for product in products]
  response = {
    'success': 'true',
    'data': {
      'products' :prod_list
    }
  }
  return response


def create_product(data):
  try:
    product = Product(
        name = data.get('name'),
        description = data.get('description'),
        price = data.get('price'),
        image_url = data.get('image_url'),
    )
    db_session.add(product)
    db_session.commit()

    response = {
        'success': 'true',
        'data': {
          'message': 'Product successfully created!'
        }
    }
    return response
      
  except Exception as e:
    db_session.rollback()
    response = {
        'success': 'false',
        'data': {
          'error': 'Something went wrong!'
        }
    }
    return response


def order(data):
  try:
    order = Order(
        user_id = data.get('user_id'),
        product_id = data.get('product_id'),
        quantity = data.get('quantity')
    )
    db_session.add(order)
    db_session.commit()

    response = {
        'success': 'true',
        'data': {
          'order_id': str(order.user_id).zfill(2) + str(order.product_id).zfill(2) + str(order.user_id).zfill(3)
        }
    }
    return response
      
  except Exception as e:
    db_session.rollback()
    response = {
        'success': 'false',
        'data': {
          'error': 'Something went wrong!'
        }
    }
    return response