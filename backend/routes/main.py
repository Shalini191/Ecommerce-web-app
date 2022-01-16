from crypt import methods
from flask import Flask, request, jsonify
from service_layer.views import *
from flask_cors import cross_origin
app = Flask(__name__)

@app.teardown_appcontext
def shutdown_dbsession(exception=None):
    db_session.remove()


@app.route('/')
def index():
    return jsonify("Hello World!")


@app.route("/login", methods=["post"])
@cross_origin(supports_credentials=True)
def login():
    data = request.get_json()['data']
    res = log_in(data)
    return jsonify(res)


@app.route("/signup", methods=["post"])
@cross_origin(supports_credentials=True)
def signup():
    data = request.get_json()['data']
    res = create_user(data)
    return jsonify(res)


@app.route("/products", methods=["get"])
@cross_origin(supports_credentials=True)
def products():
    auth = decode_auth_token(request.headers.get('Authorization'))
    if not isinstance(auth, str):
        res = get_products()
    else:
        res = {
            'sucess': 'false',
            'data': {
                'error': auth
            }
        }
    return jsonify(res)


@app.route("/product", methods=["post"])
@cross_origin(supports_credentials=True)
def post_product():
    auth = decode_auth_token(request.headers.get('Authorization'))
    if not isinstance(auth, str):
        data = request.get_json()['data']
        res = create_product(data)
    else:
        res = {
            'sucess': 'false',
            'data': {
                'error': auth
            }
        }
    return jsonify(res)


@app.route("/order", methods=["post"])
@cross_origin(supports_credentials=True)
def order_product():
    auth = decode_auth_token(request.headers.get('Authorization'))
    if not isinstance(auth, str):
        data = request.get_json()['data']
        data['user_id'] = auth['sub']
        res = order(data)
    else:
        res = {
            'sucess': 'false',
            'data': {
                'error': auth
            }
        }
    return jsonify(res)