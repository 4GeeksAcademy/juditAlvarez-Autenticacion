import bcrypt
from flask import request, jsonify, Blueprint
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, create_refresh_token
from werkzeug.security import generate_password_hash, check_password_hash
from .models import db, Usuarios, Movimientos, Alertas_programadas, Objetivo, Eventos
from .utils import generate_sitemap, APIException, generate_random_password
from flask_cors import CORS
from flask_migrate import Migrate
app = Flask(__name__)
CORS(app)  # Permitir CORS para todas las rutas

bcrypt = Bcrypt(app)

api = Blueprint('api', __name__)

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }
    return jsonify(response_body), 200

@app.route('/login', methods=['POST'])
def login():
    # Obtén el correo electrónico y la contraseña del JSON del cuerpo de la solicitud
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # Busca al usuario en la base de datos
    user = User.query.filter_by(email=email).first()

    # Verifica si el usuario existe
    if user is None:
        return jsonify({"msg": "El usuario no existe"}), 401

    # Verifica la contraseña
    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"msg": "La contraseña es incorrecta."}), 401

    # Crea un token de acceso para el usuario (necesitas implementar esta función)
    access_token = create_access_token(identity=user.id)
    return jsonify(access_token=access_token), 200

if __name__ == '__main__':
    app.run(debug=True)
