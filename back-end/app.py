from flask import Flask, jsonify, request, has_request_context
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required
from datetime import timedelta, datetime
from flask_cors import CORS
from flask import Flask, jsonify, request, send_from_directory, has_request_context
import json
import os
import random
import re
import unidecode

# Importação de Blueprints
from vulnerabilidades import vulnerabilidades_bp

# Configuração Inicial
app = Flask(__name__, static_folder="../front-end", template_folder="../front-end")

# Configurações do JWT (Token)
app.config['JWT_SECRET_KEY'] = 'segredo_super_secreto'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=5)  # Token expira em 5 horas

# Ativar CORS (para permitir conexões do frontend)
CORS(app)

# Servir o index.html
@app.route('/')
def servir_index():
    return send_from_directory(app.template_folder, 'index.html')

# Servir outros arquivos (CSS, JS, etc.)
@app.route('/<path:path>')
def servir_staticos(path):
    return send_from_directory(app.static_folder, path)

# Inicializar JWT
jwt = JWTManager(app)

# Registrar Blueprints
app.register_blueprint(vulnerabilidades_bp) # Rota para vulnerabilidades

# Caminhos de Arquivos
BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # Diretório base do back-end
DATA_PATH = os.path.join(BASE_DIR, 'dados', 'contatos.json')
LOG_PATH = os.path.join(BASE_DIR, 'logs', 'acesso.log')
last_log_time = {}  # Evitar logs duplicados

# Lista de DDDs válidos para evitar geração de números errados
DDDS_VALIDOS = ["11", "21", "31", "41", "51", "61", "71", "81", "91"]

# Função para gerar contatos aleatórios sem duplicados
def gerar_contato_aleatorio(id, contatos_existentes):
    nomes = [
        "Ana Clara", "Joao Pedro", "Carlos Alberto", "Mariana Costa", "Fernanda Silva", 
        "Renata Silva", "Alvescrino Jose", "Bruno Henrique", "Gabriel Lima", "Camila Souza"
    ]

    enderecos = [
        "Rua das Palmeiras, 123", "Avenida Brasil, 500", "Rua Joao Silva, 75",
        "Alameda das Rosas, 320", "Travessa Sao Jose, 12", "Beco do Sol, 98",
        "Estrada do Campo, 45", "Praca Central, 200", "Rua Nova Esperanca, 87"
    ]
    
    telefones_existentes = {contato["telefone"] for contato in contatos_existentes}
    
    while True:  # Gera um contato até que seja único
        nome = random.choice(nomes)
        nome_sem_acentos = unidecode.unidecode(nome)  # Remove acentos
        primeiro_nome = nome_sem_acentos.split()[0].lower()

        # Gera um telefone único com um DDD válido
        ddd = random.choice(DDDS_VALIDOS)
        telefone = f"{ddd} 9{random.randint(1000, 9999)}-{random.randint(1000, 9999)}"
        if telefone in telefones_existentes:
            continue  # Se já existir, gera um novo
        
        # Gera e-mail baseado no primeiro nome
        email = f"{primeiro_nome}{random.randint(10, 99)}@gmail.com"

        novo_contato = {
            "id": id,
            "nome": nome_sem_acentos,  # Nome sem acentos
            "telefone": telefone,  # Telefone com DDD válido
            "email": email,  # E-mail formatado corretamente
            "endereco": random.choice(enderecos)
        }
        
        return novo_contato  # Retorna contato único

# Função para verificar e criar arquivos necessários
def inicializar_arquivos():
    # Gera 5 contatos iniciais
    contatos_iniciais = [gerar_contato_aleatorio(id, []) for id in range(1, 6)]
    
    # Recria o arquivo contatos.json com os valores iniciais
    with open(DATA_PATH, 'w', encoding='utf-8') as arquivo:
        json.dump(contatos_iniciais, arquivo, indent=4, ensure_ascii=False)

    # Garante que o arquivo de logs exista e seja limpo
    with open(LOG_PATH, 'w', encoding='utf-8') as arquivo:
        arquivo.write("")  # Limpa o log

# Função para carregar dados do JSON
def carregar_contatos():
    with open(DATA_PATH, 'r', encoding='utf-8') as arquivo:
        return json.load(arquivo)

# Função para salvar dados no JSON
def salvar_contatos(dados):
    with open(DATA_PATH, 'w', encoding='utf-8') as arquivo:
        json.dump(dados, arquivo, indent=4, ensure_ascii=False)


# Rota Inicial
@app.route('/')
def home():
    return jsonify({"mensagem": "Bem-vindo à Agenda de Contatos Red Team com SOC!"})

# Rota Criar Contatos
@app.route('/criar-contatos', methods=['POST'])
def criar_contatos_aleatorios():
    contatos = carregar_contatos()
    novo_id = max([contato["id"] for contato in contatos], default=0) + 1

    # Gera 5 contatos únicos aleatórios
    novos_contatos = [gerar_contato_aleatorio(novo_id + i, contatos) for i in range(5)]
    
    # Adiciona e salva os contatos
    contatos.extend(novos_contatos)
    salvar_contatos(contatos)
    
    registrar_log(f"{len(novos_contatos)} contatos aleatórios criados.")
    return jsonify({
        "mensagem": f"{len(novos_contatos)} contatos aleatórios criados com sucesso!",
        "contatos": novos_contatos
    })

# Rota para Login e geração de token JWT
@app.route('/login', methods=['POST'])
def login():
    dados = request.json
    usuario = dados.get("usuario", "admin")  # Usuário fixo

    # Gera um token JWT
    token = create_access_token(identity=usuario)
    return jsonify({"token": token})

# Rota para Listar Contatos
@app.route('/contatos', methods=['GET'])
@jwt_required()
def listar_contatos():
    contatos = carregar_contatos()  # Função que retorna a lista de contatos
    return jsonify(contatos)

# Rota Puxar Contatos para Editar
@app.route('/contatos/<int:id>', methods=['GET'])
@jwt_required()
def obter_contato(id):
    contatos = carregar_contatos()  # Função que carrega os contatos
    contato = next((c for c in contatos if c['id'] == id), None)
    if contato:
        return jsonify(contato)
    return jsonify({"erro": "Contato não encontrado"}), 404


# Rota para Adicionar Contato
@app.route('/contatos', methods=['POST'])
@jwt_required()
def adicionar_contato():
    dados = request.json

    # Campos obrigatórios
    if not dados.get("nome") or not dados.get("telefone"):
        return jsonify({"erro": "Os campos 'nome' e 'telefone' são obrigatórios!"}), 400

    # Campos opcionais
    email = dados.get("email", "")
    endereco = dados.get("endereco", "")

    email = email.strip() if email else None
    endereco = endereco.strip() if endereco else None

    contatos = carregar_contatos()
    novo_contato = {
        "id": len(contatos) + 1,
        "nome": dados["nome"].strip(),
        "telefone": dados["telefone"].strip(),
        "email": email,
        "endereco": endereco
    }
    contatos.append(novo_contato)
    salvar_contatos(contatos)
    registrar_log(f"Contato '{novo_contato['nome']}' adicionado com sucesso.", 201, dados)

    return jsonify({"mensagem": "Contato adicionado com sucesso!", "contato": novo_contato})

# Rota Buscar Contatos
@app.route('/contatos/buscar', methods=['GET'])
@jwt_required()
def buscar_contatos():
    query = request.args.get('q', '').strip().lower()  # Remove espaços extras e converte para minúsculas

    if not query:
        return jsonify({"erro": "Por favor, insira um termo válido para buscar."}), 400

    contatos = carregar_contatos()

    # Filtragem: busca por nome, email e telefone
    resultados = [
        contato for contato in contatos
        if query in contato["nome"].lower()
        or (contato["email"] and query in contato["email"].lower())
        or (query.isdigit() and query in contato["telefone"])  # Busca apenas números no telefone
    ]

    if not resultados:
        return jsonify({"mensagem": "Nenhum contato encontrado para a busca realizada."}), 404

    return jsonify(resultados), 200

# Rota para Editar Contato
@app.route('/contatos/<int:id>', methods=['PUT'])
@jwt_required()
def editar_contato(id):
    dados = request.json
    campos_permitidos = ["nome", "telefone", "email", "endereco"]
    contatos = carregar_contatos()

    for contato in contatos:
        if contato["id"] == id:
            for campo in campos_permitidos:
                if campo in dados:
                    contato[campo] = dados[campo]
            salvar_contatos(contatos)
            registrar_log(
                f"Contato ID {id} editado com sucesso.",
                status_code=200,
                dados=dados
            )
            return jsonify({"mensagem": "Contato editado com sucesso!", "contato": contato}), 200
    
    return jsonify({"erro": "Contato não encontrado!"}), 404

# Rota Deletar Contatos
@app.route('/contatos/<int:id>', methods=['DELETE'])
@jwt_required()
def deletar_contato(id):
    contatos = carregar_contatos()  # Carrega os contatos corretamente

    contato = next((c for c in contatos if c["id"] == id), None)
    if not contato:
        registrar_log(f"Tentativa de deletar contato inexistente com ID {id}.", status_code=404)
        return jsonify({"erro": "Contato não encontrado!"}), 404  # Retorna erro se o ID não existir

    # Remove o contato da lista e salva novamente
    contatos = [c for c in contatos if c["id"] != id]
    salvar_contatos(contatos)

    registrar_log(f"Contato ID {id} deletado com sucesso.", status_code=200)

    return jsonify({"mensagem": "Contato deletado com sucesso!"}), 200

# Rota para limpar contatos
@app.route('/limpar-contatos', methods=['DELETE'])
@jwt_required()
def limpar_contatos():
    salvar_contatos([])  # Salvar lista vazia no arquivo JSON
    registrar_log("Todos os contatos foram apagados.")
    return jsonify({"mensagem": "Todos os contatos foram apagados com sucesso!"})

# Rota para registrar interações
@app.route('/registrar-interacao', methods=['POST'])
@jwt_required()
def registrar_interacao():
    dados = request.json
    acao = dados.get("acao", "Ação não especificada")
    descricao = dados.get("descricao", "Descrição não especificada")
    
    registrar_log(f"Interação do Usuário: {acao} | {descricao}", status_code=200, dados=dados)
    return jsonify({"mensagem": "Interação registrada com sucesso!"}), 200

# Rota para exibir logs
@app.route('/logs', methods=['GET'])
@jwt_required()
def exibir_logs():
    usuario = get_jwt_identity()
    if not usuario:
        return jsonify({"msg": "Usuário não autenticado!"}), 401

    if os.path.exists(LOG_PATH):
        with open(LOG_PATH, 'r', encoding='utf-8') as arquivo:
            logs = arquivo.readlines()
        return jsonify({"logs": logs})

    return jsonify({"mensagem": "Nenhum log encontrado."}), 404

# Função para registrar logs detalhados
def registrar_log(mensagem, status_code=None, dados=None):
    global last_log_time

    if has_request_context():
        cliente_ip = request.headers.get('X-Forwarded-For', request.remote_addr) or "IP não identificado"
        metodo = request.method
        rota = request.path
        user_agent = request.headers.get('User-Agent', "Agente desconhecido")
    else:
        cliente_ip, metodo, rota, user_agent = "Sistema Interno", "N/A", "N/A", "N/A"

    log_entrada = {
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "ip": cliente_ip,
        "method": metodo,
        "route": rota,
        "status": status_code if status_code else "N/A",
        "data": dados if dados else "N/A",
        "user_agent": user_agent,
        "message": mensagem
    }

    # Evita log duplicado no mesmo segundo
    chave_log = f"{mensagem}-{rota}"
    agora = datetime.now().timestamp()

    if chave_log in last_log_time and (agora - last_log_time[chave_log] < 1):
        return  # Se o log for igual e no mesmo segundo, ignora

    last_log_time[chave_log] = agora  # Atualiza a última vez que esse log foi registrado

    # Salva no arquivo de logs
    with open(LOG_PATH, 'a', encoding='utf-8') as log_file:
        log_file.write(json.dumps(log_entrada) + "\n")

# Rota para limpar logs e resetar para o inicial
@app.route('/limpar-logs', methods=['DELETE'])
@jwt_required()
def limpar_logs():
    with open(LOG_PATH, 'w', encoding='utf-8') as arquivo:
        arquivo.write("")
    registrar_log("Todos os logs foram apagados.")
    return jsonify({"mensagem": "Todos os logs foram apagados com sucesso!"})

# Inicializar arquivos e rodar a aplicação
if __name__ == '__main__':
    inicializar_arquivos()  # Garante que os arquivos necessários existem
    port = int(os.environ.get("PORT", 5000))  # Pega a porta do Railway ou usa 5000 como padrão
    print(f"🚀 Servidor Flask iniciado na porta {port}!")
    app.run(host='0.0.0.0', port=port)