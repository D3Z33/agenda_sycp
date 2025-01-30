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

Este projeto nasceu como um **desafio do módulo bônus da certificação SYCP** da **@Solyd**, onde a proposta era **praticar Python for Hackers** e desenvolver um **sistema de back-end para gerenciar uma agenda de contatos**.  

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

# 🛠️ **Troubleshooting: Da Bagunça dos papéis ao Funcionamento Perfeito** 🚀  

Este projeto foi **muito mais do que apenas um desafio técnico**. Foi uma jornada **recheada de problemas**, soluções criativas e **aprendizados práticos** sobre **integração total de sistemas**. Desde conectar tudo **localmente**, depois fazer o deploy para a **web**, garantir que **tudo conversasse entre si** e ainda implementar **segurança dinâmica**—cada etapa trouxe **novos desafios** que precisavam ser resolvidos.  

---

## 🌍 **Desafio: Conectar Tudo Localmente**  

No começo, o objetivo era simples: **rodar o back-end em Python** com uma API funcional e, depois, integrar um **front-end em HTML, CSS e JavaScript** para interagir com essa API.  

Mas rapidamente percebi que a coisa **não era tão simples**. Os primeiros problemas começaram aqui:  ... sim, quase pensei em desistir e falar: Ah, só mais um projetozinho nem vale tanto a pena !  

### ❌ **Problemas enfrentados localmente**  
- O **back-end em Flask** rodava, mas o front não conseguia **enviar requisições corretamente**.  
- As respostas da API não vinham no formato esperado pelo front, exigindo **tratamento adequado**.  
- Os **tokens JWT** criavam problemas na autenticação ao serem reutilizados indevidamente.  
- **Erros CORS** bloqueavam a comunicação entre os serviços locais.  

✅ **Solução:** Ajustar o **CORS**, padronizamos as **requisições do front**, e garantir que **o JWT fosse tratado corretamente** para evitar sessões inválidas.  

---

## 🔒 **Desafio: Fazer Endpoints Seguros e ao Mesmo Tempo Vulneráveis**  

Este era um dos **pontos mais complexos** do projeto: **como criar um sistema seguro, mas que ainda pudesse ser explorado?**  

Queria que os usuários **pudessem testar vulnerabilidades reais**, mas também **corrigir essas falhas com um clique**.  

### ❌ **Problemas enfrentados na segurança**  
- Como **permitir SQL Injection sem quebrar o banco de dados**?  
- Como criar um **XSS funcional** sem comprometer a experiência do usuário?  
- Como lidar com **autenticação insegura**, mas ainda manter uma opção segura?  
- Como garantir que, ao **clicar em corrigir**, as falhas realmente sumissem?  

✅ **Solução:** Implementar **pontos vulneráveis controlados**, onde o usuário pode explorar **SQL Injection, XSS e falhas de autenticação**. Mas **ao clicar em corrigir**, a aplicação aplica **patches dinâmicos**, tornando-se mais segura automaticamente.  

---

## ⚙️ **Desafio: Comunicação Entre Back-end em Python e Front-end em JavaScript**  

Um dos grandes desafios técnicos foi a **integração perfeita entre Python e JavaScript**. Flask e JavaScript **não se comunicam diretamente** da mesma forma que uma aplicação 100% em JS faria.  

### ❌ **Problemas enfrentados na integração**  
- O formato de resposta do Flask não era **compatível com o esperado pelo front**.  
- As requisições **não estavam sendo tratadas corretamente**, resultando em respostas vazias.  
- Algumas ações no front precisavam ser assíncronas para não travar a interface.  
- O JWT às vezes **não era reconhecido**, fazendo os usuários serem deslogados.  

✅ **Solução:** Padronizar **todas as respostas da API**, garantindo que **o front conseguisse consumir os dados corretamente**. Além disso, ajustei **as requisições para serem assíncronas**, evitando travamentos e problemas na experiência do usuário.  

---

## 🚀 **Desafio: Subir Tudo para a Web e Fazer o Deploy Funcionar**  

Com tudo funcionando localmente, chegou a hora de **subir o projeto para a web**. Foi aí que percebemos que **hospedar uma aplicação full stack é um jogo totalmente diferente**.  

### ❌ **Problemas enfrentados no deploy**  
- No **Railway**, o **back-end morria** após um tempo sem acessos.  
- O **front-end no Vercel não conseguia se comunicar com o Railway**, causando erros de conexão.  
- As URLs de API estavam erradas, pois o back-end e o front estavam em **servidores diferentes**.  
- O cache impedia que **as atualizações entrassem em vigor imediatamente**.  

✅ **Solução:** Unificamos tudo no **Railway**, garantindo que **front e back estivessem no mesmo servidor**, eliminando os problemas de comunicação. Além disso, ativamos logs para monitoramento **e criamos um ping automático** para manter o back-end ativo.  

---
# 📌 **Por fim, mas não menos importante:**  

Este projeto foi muito além de **apenas um módulo bônus de programação**. Ele se tornou um verdadeiro **laboratório de troubleshooting**, onde cada erro foi uma oportunidade para aprender **sobre deploy, segurança, comunicação entre serviços e estabilidade de aplicações web**.  

O resultado? Um **sistema funcional, interativo e educativo**, onde qualquer um pode testar falhas de segurança, explorar vulnerabilidades e aprender **como elas podem ser corrigidas na prática**.  

🛠️ **Problemas resolvidos:**  
✅ Integração perfeita entre **Python e JavaScript**.  
✅ Deploy funcional no **Railway**.  
✅ Comunicação **fluida entre front e back-end**.  
✅ Segurança **dinâmica**, onde falhas podem ser exploradas e corrigidas.  
✅ Tratamento de erros para **garantir estabilidade**.  
  - Com certeza.. teve mais, esses foram os mais comuns !

---

## **👨‍💻 Author**
### 🚀 **(@D3Z33)**
💬 **Discord:** deze_e  
💻 **GitHub:** [D3Z33](https://github.com/D3Z33)  

<br>

📩 Caso tenha **dúvidas, sugestões** (😉), me chame!  

---
