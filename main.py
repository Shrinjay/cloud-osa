from flask import Flask
from controller import controller
from flask_cors import CORS

app = Flask(__name__)
app.register_blueprint(controller)
CORS(app)
app.run(port=5000)
