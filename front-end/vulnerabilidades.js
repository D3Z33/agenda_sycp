// Carregar  Vulnerabilidades
document.addEventListener("DOMContentLoaded", () => {
    carregarVulnerabilidades();
    configurarToggleVulnerabilidades();
});

// Mostrar/Esconder painel de vulnerabilidades
function configurarToggleVulnerabilidades() {
    const vulnSection = document.getElementById("vulnerabilidadesSection");
    const toggleButton = document.getElementById("toggleVulnSection");

    if (toggleButton) {
        toggleButton.addEventListener("click", () => {
            if (vulnSection.classList.contains("hidden")) {
                vulnSection.classList.remove("hidden");
                toggleButton.innerHTML = "⬇️ Ocultar Vulnerabilidades";
            } else {
                vulnSection.classList.add("hidden");
                toggleButton.innerHTML = "🔍 Explorar Vulnerabilidades";
            }
        });
    }
}

// Função para registrar logs no backend
function registrarLog(acao, descricao) {
    fetch("/registrar-interacao", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token") // Adiciona o token JWT
        },
        body: JSON.stringify({ acao, descricao })
    })
    .then(response => response.json())
    .then(() => carregarLogs()) // Atualiza os logs em tempo real
    .catch(error => console.error("Erro ao registrar log:", error));
}

// Função para carregar logs em tempo real
function carregarLogs() {
    fetch("/logs", {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    })
    .then(response => response.json())
    .then(data => {
        const tabelaLogs = document.getElementById("tabelaLogs").querySelector("tbody");
        tabelaLogs.innerHTML = "";

        data.logs.forEach((log) => {
            const linha = document.createElement("tr");
            linha.innerHTML = `
                <td>${log.timestamp}</td>
                <td>${log.ip}</td>
                <td>${log.method}</td>
                <td>${log.route}</td>
                <td>${log.status}</td>
                <td>${JSON.stringify(log.data)}</td>
                <td>${log.user_agent}</td>
                <td>${log.message}</td>
            `;
            tabelaLogs.appendChild(linha);
        });
    })
    .catch(error => console.error("Erro ao carregar logs:", error));
}

// Adiciona eventos de log para cada ação
document.addEventListener("click", (event) => {
    if (event.target.classList.contains("copy-exploit")) {
        const exploit = event.target.getAttribute("data-exploit");
        registrarLog("Exploit copiado", `Exploit usado: ${exploit}`);
    }

    if (event.target.classList.contains("corrigir-falha")) {
        const vuln = event.target.getAttribute("data-vuln");
        registrarLog("Correção aplicada", `Falha corrigida: ${vuln}`);
    }

    if (event.target.classList.contains("testar-exploit")) {
        const vuln = event.target.getAttribute("data-vuln");
        registrarLog("Exploit testado", `Vulnerabilidade testada: ${vuln}`);
    }
});

// Captura eventos de mouseover (passar o mouse)
//document.addEventListener("mouseover", (event) => {
  //  if (event.target.classList.contains("soc-alert")) {
    //    registrarLog("Usuário visualizou alerta", `Alerta: ${event.target.innerText}`);
    //}
//});

// Carregar vulnerabilidades do backend
function carregarVulnerabilidades() {
    fetch("/vulnerabilidades")
        .then(response => response.json())
        .then(data => {
            const tabela = document.getElementById("tabelaVulnerabilidades").querySelector("tbody");
            tabela.innerHTML = "";

            data.forEach((falha, index) => {
                const linha = document.createElement("tr");
                linha.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${falha.nome}</td>
                    <td><span class="risk-${falha.risco.toLowerCase()}">${falha.risco}</span></td>
                    <td>
                        <button class="copy-exploit" data-exploit="${falha.exploit}">📋 Copiar Exploit</button>
                    </td>
                    <td>
                        <button class="corrigir-falha" data-vuln="${falha.nome}" data-corrigir="${falha.correção}">🛠 Corrigir</button>
                    </td>
                `;
                tabela.appendChild(linha);
            });

            ativarEventos();
            atualizarPainelSOC(data);
        })
        .catch(error => console.error("Erro ao carregar vulnerabilidades:", error));
}

// Ativar eventos nos botões
function ativarEventos() {
    document.querySelectorAll(".copy-exploit").forEach(button => {
        button.addEventListener("click", copiarExploit);
    });

    document.querySelectorAll(".corrigir-falha").forEach(button => {
        button.addEventListener("click", corrigirVulnerabilidade);
    });

    document.getElementById("resetarVulnerabilidades")?.addEventListener("click", resetarVulnerabilidades);
}

// Copiar código do exploit
function copiarExploit(event) {
    const exploit = event.target.getAttribute("data-exploit");

    if (!exploit || exploit.trim() === "") {
        showPopup("Erro!", "Exploit não encontrado.", "error");
        return;
    }

    navigator.clipboard.writeText(exploit)
        .then(() => {
            showPopup("EXPLOIT COPIADO!", `Código: <span style="color:#0f0;">${exploit}</span>`, "success");
        })
        .catch(err => {
            showPopup("Erro!", "Falha ao copiar exploit.", "error");
            console.error("Erro ao copiar exploit:", err);
        });
}

// Testar SQL Injection
function testarSQLInjection() {
    const sqlInput = document.getElementById("sqlInput").value;

    fetch("/vulnerabilidades/sql-injection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: sqlInput })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("sqlResult").innerHTML = `<strong>Resposta:</strong> ${JSON.stringify(data)}`;
    })
    .catch(error => console.error("Erro ao testar SQL Injection:", error));
}

// Testar XSS
function testarXSS() {
    const xssInput = document.getElementById("xssInput").value;

    fetch("/vulnerabilidades/xss", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comentario: xssInput })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("xssResult").innerHTML = `
            <strong>Resposta:</strong> ${JSON.stringify(data, null, 2)}
        `;
    })
    .catch(error => {
        console.error("Erro ao testar XSS:", error);
        document.getElementById("xssResult").innerHTML = `<strong>Erro ao testar exploit XSS.</strong>`;
    });
}

// Testar IDOR
function testarIDOR() {
    const idorInput = document.getElementById("idorInput").value;

    fetch(`/vulnerabilidades/idor?id=${idorInput}`)
    .then(response => response.json())
    .then(data => {
        document.getElementById("idorResult").innerHTML = `<strong>Resposta:</strong> ${JSON.stringify(data)}`;
    })
    .catch(error => console.error("Erro ao testar IDOR:", error));
}

// Corrigir vulnerabilidade
function corrigirVulnerabilidade(event) {
    const vuln = event.target.getAttribute("data-vuln");
    const correcao = event.target.getAttribute("data-corrigir");

    fetch("/vulnerabilidades/corrigir", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vulnerabilidade: vuln })
    })
    .then(response => response.json())
    .then(data => {
        showPopup("Correção Aplicada!", data.mensagem, "info");
        carregarVulnerabilidades(); // Recarregar vulnerabilidades
    })
    .catch(error => console.error("Erro ao corrigir vulnerabilidade:", error));
}

// Resetar vulnerabilidades
function resetarVulnerabilidades() {
    fetch("/vulnerabilidades/reset", { method: "POST" })
        .then(response => response.json())
        .then(data => {
            showPopup("Vulnerabilidades Resetadas!", data.mensagem, "warning");
            carregarVulnerabilidades();
        })
        .catch(error => console.error("Erro ao resetar vulnerabilidades:", error));
}

// Mostrar pop-up estilizado
function showPopup(title, message, type) {
    const popup = document.createElement("div");
    popup.classList.add("popup", type);
    popup.innerHTML = `<h3>${title}</h3><p>${message}</p>`;
    document.body.appendChild(popup);

    setTimeout(() => {
        popup.classList.add("fade-out");
        setTimeout(() => popup.remove(), 500);
    }, 3000);
}

// Atualizar painel SOC
function atualizarPainelSOC(vulnerabilidades) {
    const painel = document.getElementById("soc-alerts");
    painel.innerHTML = ""; 

    vulnerabilidades.forEach(vuln => {
        const alerta = document.createElement("div");
        alerta.classList.add("soc-alert", `risk-${vuln.risco.toLowerCase()}`);
        alerta.innerHTML = `<strong>${vuln.nome} (${vuln.risco})</strong> detectado no sistema!`;
        painel.appendChild(alerta);
    });
}