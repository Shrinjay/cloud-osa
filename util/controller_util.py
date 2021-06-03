from flask import jsonify
from json import JSONDecodeError

QUERY_LOOKUP = {
    "IDN": "http://flaskosa.herokuapp.com/cmd/IDN",
    "LIM": "http://flaskosa.herokuapp.com/cmd/LIM",
    "STATE": "http://flaskosa.herokuapp.com/cmd/STATE"
}


def validate_trace_response(response):
    try:
        response.json()
        return True
    except JSONDecodeError:
        return False


def parse_command_response(client_res, response):
    if "OK" in response.text:
        client_res['status'] = "success"
        client_res['data'] = response.text
        return jsonify(client_res)
    else:
        client_res['status'] = "failure"
        return jsonify(client_res)


def validate_query(command):
    return command in QUERY_LOOKUP


def get_query_url(command):
    return QUERY_LOOKUP[command]