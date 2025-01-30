<h1 align="center">📌 Agenda de Contatos - SYCP 🔥</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white">
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white">  
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white">
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black">  
  <img src="https://img.shields.io/badge/Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white">
</p>

---

## 🚀 **Sobre o Projeto**  

Este projeto nasceu como um **desafio do módulo bônus da certificação SYCP** da **@Solyd**, onde a proposta era **praticar Python** e desenvolver um **sistema de back-end para gerenciar uma agenda de contatos**.  

Mas... **fomos um pouquinho além!** 😏  

🔹 Criei uma **API completa** para gerenciar contatos 📇  
🔹 Desenvolvi **uma interface web totalmente funcional** 🖥️  
🔹 Publiquei o **back e front no Railway** para acesso online 🌍  
🔹 Adicionei **3 falhas reais** do **OWASP ZAP Top 10** 🛡️💀  

Agora qualquer pessoa pode **se sentir um hacker** por alguns instantes, explorando vulnerabilidades e **vendo o SOC reagir aos ataques em tempo real!**  

🛠️ **Interaja com a aplicação:**  
🔗 **[https://agendasycp-production.up.railway.app/](https://agendasycp-production.up.railway.app/)**  

📌 **Repositório no GitHub:**  
🔗 **[https://github.com/D3Z33/agenda_sycp](https://github.com/D3Z33/agenda_sycp)**  

---

## 🏆 **Principais Funcionalidades**
✅ **CRUD Completo**: Adicionar, remover, listar e buscar contatos  

✅ **Autenticação JWT**: Tokens individuais para cada sessão.... ou não ?  

✅ **Front-end interativo**: Simples, intuitivo e moderno  

✅ **Exploração de Vulnerabilidades OWASP** 🔥  

&nbsp;&nbsp;&nbsp;&nbsp;🔹 **SQL Injection (SQLi)**  
&nbsp;&nbsp;&nbsp;&nbsp;🔹 **Cross-Site Scripting (XSS)**  
&nbsp;&nbsp;&nbsp;&nbsp;🔹 **Autenticação Fraca (Auth Bypass)**  

✅ **SOC Monitoramento**: Acompanhe os ataques em tempo real 📊  

✅ **Deploy completo no Railway**: **Back + Front-end no mesmo serviço** 🚀  

---

## 🔧 **Tecnologias Utilizadas**
📌 **Back-End**:  
- **Python + Flask** 🚀  
- **Flask-JWT-Extended** (Autenticação JWT) 🔐  
- **Flask-CORS** (Permitir comunicação com o front-end)  
- **SQLite + JSON** (Armazenamento de contatos)  


📌 **Front-End**:  
- **HTML, CSS, JavaScript (Vanilla)**  
- **Fetch API** (Para comunicação com a API)


📌 **Infraestrutura**:  
- **Railway** (Back + Front no mesmo serviço)  
- **Deploy Automatizado** via GitHub Actions  

---

## 📡 **API - Endpoints Disponíveis**
A **Agenda de Contatos - SYCP** disponibiliza os seguintes endpoints:

🔹 **Autenticação e Sessão**  
```bash
POST /login - Autenticação e geração de token JWT Automática
POST /logout - Encerrar sessão
```

🔹 **Gerenciamento de Contatos**  
```bash
GET /contatos - Lista todos os contatos
POST /criar-contato - Adiciona um novo contato
DELETE /deletar-contato/{id} - Remove um contato pelo ID
```

🔹 **Exploração de Vulnerabilidades (para Pentest)**  
```plaintext
GET /vulnerabilidades/sql-injection - Teste de SQLi
GET /vulnerabilidades/xss - Teste de XSS
GET /vulnerabilidades/idor - Teste de autenticação fraca
```

---

## 🔥 **OWASP ZAP Top 10: Teste na Prática!**
Adicionei **as 3 falhas mais comuns no OWASP** para tornar o projeto **realista e desafiador**:  

1️⃣ **SQL Injection (SQLi)**  
> **Tente logar com:** `' OR 1=1 -- '`   .... ou simplesmente, clique em copiar  
  - Será que o sistema valida corretamente as entradas?  

2️⃣ **Cross-Site Scripting (XSS)**  
> **Insira no campo de nome:** `<script>alert("XSS!")</script>`   .... ou simplesmente, clique em copiar    
  - O JavaScript será executado ou o sistema bloqueia a injeção?  

3️⃣ **Bypass de Autenticação**  
> **Tente acessar um endpoint protegido sem um token JWT válido.**  ... temos apenas 5 users no banco de dados  
  - Será que a API expõe informações sensíveis?  

<br>

💡 **A melhor parte?** Assim que você explorar uma falha, **o SOC gera alertas em tempo real**, e o sistema pode se **auto-corrigir** para se proteger contra ataques! 😈💻  
  - A correção depende de você, as falhas já explorei !

---

## 💻 **Como Rodar o Projeto Localmente**
Caso queira testar o projeto no seu ambiente, siga os passos:

### **1️⃣ Clone o repositório**
```bash
git clone https://github.com/D3Z33/agenda_sycp.git
cd agenda_sycp
```

### **2️⃣ Instale as dependências**
```bash
pip install -r requirements.txt
```

### **3️⃣ Rode o Back-End**
```bash
python back-end/app.py
```

### **4️⃣ Rode o Front-End**
Basta abrir o arquivo `index.html` no navegador.

---

## **👨‍💻 Author**
### 🚀 **(@D3Z33)**
💬 **Discord:** deze_e  
💻 **GitHub:** [D3Z33](https://github.com/D3Z33)  

<br>

📩 Caso tenha **dúvidas, sugestões** (😉), me chame!  

---
