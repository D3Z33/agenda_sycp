from flask import Blueprint, request, jsonify

# Blueprint para vulnerabilidades
vulnerabilidades_bp = Blueprint('vulnerabilidades', __name__)

# Base de dados
usuarios = [
    {"id": 1, "nome": "admin", "senha": "12345"},
    {"id": 2, "nome": "user1", "senha": "f234#$tbfv876"},
    {"id": 3, "nome": "user2", "senha": "bt4y65YU¨%$Y%#$f"},
    {"id": 4, "nome": "user3", "senha": "23f423f3*(&*¨v)"},
    {"id": 5, "nome": "user4", "senha": "dfc432g45!E#@HRTY^^"}
]

# Controle de status das vulnerabilidades
status_vulnerabilidades = {
    "SQL Injection": True,
    "XSS (Cross-Site Scripting)": True,
    "IDOR (Insecure Direct Object Reference)": True
}

# Lista das vulnerabilidades detectadas
vulnerabilidades = [
    {
        "nome": "SQL Injection",
        "risco": "Alto",
        "exploit": "admin' OR '1'='1",
        "correção": "Use consultas parametrizadas para prevenir SQL Injection."
    },
    {
        "nome": "XSS (Cross-Site Scripting)",
        "risco": "Médio",
        "exploit": "'script>alert('XSS!')</script'",
        "correção": "Escape os inputs do usuário e use Content Security Policy (CSP)."
    },
    {
        "nome": "IDOR (Insecure Direct Object Reference)",
        "risco": "Crítico",
        "exploit": "Escolha o User no IDOR Abaixo 1, 2, 3, 4 ou 5",
        "correção": "Verifique permissões antes de retornar dados sensíveis."
    }
]

# API de Vulnerabilidades Detectadas
@vulnerabilidades_bp.route("/vulnerabilidades", methods=["GET"])
def get_vulnerabilidades():
    from app import registrar_log  # Importação dentro da função
    registrar_log("Listagem de vulnerabilidades acessada.", status_code=200)
    return jsonify(vulnerabilidades)

# Corrigir vulnerabilidades no backend
@vulnerabilidades_bp.route("/vulnerabilidades/corrigir", methods=["POST"])
def corrigir_vulnerabilidade():
    from app import registrar_log
    """
    Corrige uma vulnerabilidade específica.
    """
    data = request.json
    vulnerabilidade = data.get("vulnerabilidade")

    if vulnerabilidade not in status_vulnerabilidades:
        return jsonify({"mensagem": "Vulnerabilidade não encontrada!"}), 404

    status_vulnerabilidades[vulnerabilidade] = False
    registrar_log(f"{vulnerabilidade} foi corrigida.", status_code=200)
    return jsonify({"mensagem": f"{vulnerabilidade} corrigida com sucesso!"})

# Resetar vulnerabilidades
@vulnerabilidades_bp.route("/vulnerabilidades/reset", methods=["POST"])
def resetar_vulnerabilidades():
    from app import registrar_log
    """
    Reseta todas as vulnerabilidades para o estado inicial.
    """
    for chave in status_vulnerabilidades.keys():
        status_vulnerabilidades[chave] = True
    registrar_log("Todas as vulnerabilidades foram resetadas.", status_code=200)
    return jsonify({"mensagem": "Todas as vulnerabilidades foram resetadas!"})


# ======================
# SQL Injection (Exploração e Correção)
# ======================

@vulnerabilidades_bp.route('/vulnerabilidades/sql-injection', methods=['POST'])
def sql_injection_vulneravel():
    from app import registrar_log
    """
    SQL Injection se não estiver corrigido.
    """
    if not status_vulnerabilidades["SQL Injection"]:
        return jsonify({"mensagem": "Proteção ativada! SQL Injection não é mais possível."})

    consulta_usuario = request.json.get("nome")
    resultado = [u for u in usuarios if consulta_usuario in u["nome"]]
    registrar_log(f"SQL Injection testado com '{consulta_usuario}'", status_code=200, dados={"entrada": consulta_usuario})

    return jsonify({
        "resultado": resultado,
        "mensagem": "Vulnerável a SQL Injection: Entrada não sanitizada!"
    })


# ======================
# XSS (Cross-Site Scripting)
# ======================

@vulnerabilidades_bp.route('/vulnerabilidades/xss', methods=['POST'])
def xss_vulneravel():
    from app import registrar_log
    """
    XSS se não estiver corrigido.
    """
    if not status_vulnerabilidades["XSS (Cross-Site Scripting)"]:
        return jsonify({"mensagem": "Proteção ativada! XSS bloqueado."})

    entrada_usuario = request.json.get("comentario")
    
    resposta_json = {
        "mensagem": "Vulnerável a XSS: Entrada não sanitizada!",
        "entrada": entrada_usuario
    }

    registrar_log("XSS testado", status_code=200, dados=resposta_json)

    return jsonify(resposta_json)


# ======================
# IDOR (Insecure Direct Object References)
# ======================

@vulnerabilidades_bp.route('/vulnerabilidades/idor', methods=['GET'])
def idor_vulneravel():
    from app import registrar_log
    """
    IDOR se não estiver corrigido.
    """
    if not status_vulnerabilidades["IDOR (Insecure Direct Object Reference)"]:
        return jsonify({"mensagem": "Proteção ativada! IDOR não é mais possível."})

    id_usuario = int(request.args.get("id", 0))
    resultado = next((u for u in usuarios if u["id"] == id_usuario), None)
    registrar_log(f"IDOR testado no usuário ID {id_usuario}", status_code=200, dados={"id_testado": id_usuario})

    return jsonify({
        "resultado": resultado,
        "mensagem": "Vulnerável a IDOR: Não verifica permissões!"
    })