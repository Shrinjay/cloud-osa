from flask import Blueprint, jsonify, request
from util.controller_util import parse_command_response, validate_trace_response, validate_query, get_query_url
import requests

controller = Blueprint('controller', __name__)


@controller.route('/start')
def start():
    response = requests.get('http://flaskosa.herokuapp.com/cmd/START')
    client_res = {
        'command': 'START'
    }

    return parse_command_response(client_res, response)


@controller.route('/stop')
def stop():
    response = requests.get('http://flaskosa.herokuapp.com/cmd/STOP')
    client_res = {
        'command': 'STOP'
    }

    return parse_command_response(client_res, response)


@controller.route('/trace')
def trace(command = "TRACE"):
    response = requests.get('http://flaskosa.herokuapp.com/cmd/TRACE')
    client_res = {
        'command': command
    }

    if validate_trace_response(response):
        client_res['status'] = "success"
        client_res['data'] = response.json()
        return jsonify(client_res)
    else:
        client_res['status'] = "false"
        return jsonify(client_res)


@controller.route('/single')
def single():
    response = requests.get('http://flaskosa.herokuapp.com/cmd/SINGLE')

    if "OK" in response.text:
        return trace("SINGLE")
    else:
        client_res = {
            'command': "SINGLE",
            "status": "failed"
        }

        return jsonify(client_res)


@controller.route('/query')
def query():
    client_res = {
        'command': "QUERY"
    }

    if "query" not in request.args:
        client_res['status'] = "failed"
        return jsonify(client_res)

    command = request.args.get('query')

    if validate_query(command):
        response = requests.get(get_query_url(command))
        client_res['data'] = response.text

        if "+READY>" in response.text:
            client_res['status'] = "success"

        else:
            client_res['status'] = "failed"

        return jsonify(client_res)

    else:
        client_res['status'] = "failed"
        return jsonify(client_res)


@controller.route('/limits')
def setLimits():
    client_res = {
        'command': 'SET LIMITS'
    }

    payload = request.args.get('limits')
    response = requests.get(f"http://flaskosa.herokuapp.com/cmd/LIM/{payload}")

    client_res['data'] = response.text

    if "+READY>" in response.text and "ERROR" not in response.text:
        client_res['status'] = "success"

    else:
        client_res['status'] = "failed"

    return jsonify(client_res)



