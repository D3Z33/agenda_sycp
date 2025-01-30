let token = localStorage.getItem("token") || ""; // Recupera o token salvo
const API_URL = "http://127.0.0.1:5000"; // URL da API
let intervalId = null; // ID para controlar os logs

// Função para validar e recuperar o token
function verificarToken() {
    token = localStorage.getItem("token");
    if (!token) {
        console.warn("Token não encontrado! Redirecionando para login...");
        exibirNotificacao("Você precisa estar autenticado. Redirecionando...");
        window.location.href = "/login.html"; // Redireciona para login
        return false;
    }
    return true;
}

// Garante que todas as chamadas incluem o token nos headers
function getHeaders() {
    if (!verificarToken()) return null;
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };
}

// Função para obter e salvar o token automaticamente
function gerarToken() {
    fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario: "admin" }) // Usuário fixo
    })
        .then(response => {
            if (!response.ok) throw new Error("Erro ao autenticar.");
            return response.json();
        })
        .then(data => {
            token = data.token;
            localStorage.setItem("token", token); // Salva no localStorage
            console.log("Token gerado com sucesso:", token);
        })
        .catch(error => {
            console.error("Erro ao gerar token:", error);
            exibirNotificacao("Erro ao autenticar. Verifique o console.");
        });
}

// Função para garantir que o token é válido antes de prosseguir
function iniciarSessao() {
    if (!verificarToken()) {
        gerarToken();
        setTimeout(() => {
            verificarToken(); // Verifica novamente após gerar
        }, 1000);
    }
}

// Função para gerar 5 contatos aleatórios
function gerarContatosAleatorios() {
    fetch(`${API_URL}/criar-contatos`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
    })
        .then(response => response.json())
        .then(() => {
            listarContatos(); // Atualiza a lista após gerar contatos
            exibirNotificacao("5 contatos gerados com sucesso!");
        })
        .catch(error => console.error("Erro ao gerar contatos:", error));
}

// Função para listar todos os contatos
function listarContatos() {
    fetch(`${API_URL}/contatos`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Erro: ${response.status} - ${response.statusText}`);
            }
            return response.json();
        })
        .then((data) => {
            if (!Array.isArray(data)) {
                throw new Error("Dados recebidos não são uma lista válida.");
            }
            const resultado = document.getElementById("resultadoContatos");
            resultado.innerHTML = "";

            data.forEach((contato, index) => {
                const li = document.createElement("li");
                li.classList.add("contato-item");

                // Aplicar delay para efeito de fade-in sequencial
                li.style.animationDelay = `${index * 0.1}s`;

                li.innerHTML = `
                    <strong>ID:</strong> ${contato.id} |
                    <strong>Nome:</strong> ${contato.nome} |
                    <strong>Telefone:</strong> ${contato.telefone}
                    <button class="copy-btn" onclick="copiarTexto('${contato.telefone}')" title="Copiar Número">📋</button> |
                    <strong>Email:</strong> ${contato.email} |
                    <strong>Endereço:</strong> ${contato.endereco}
                    <button class="editarContatoBtn" data-id="${contato.id}">✏️</button>
                `;

                resultado.appendChild(li);
            });

            adicionarEventosEditar(); // Reaplica eventos após renderizar os contatos
        })
        .catch((error) => console.error("Erro ao listar contatos:", error));
}

// Função para copiar o texto do telefone
function copiarTexto(texto) {
    navigator.clipboard.writeText(texto)
        .then(() => exibirNotificacao("Número copiado para a área de transferência!"))
        .catch(() => exibirNotificacao("Erro ao copiar o número."));
}

// Função para adicionar eventos nos botões de edição
function adicionarEventosEditar() {
    const botoesEditar = document.querySelectorAll(".editarContatoBtn");

    botoesEditar.forEach((botao) => {
        botao.addEventListener("click", () => {
            const id = botao.getAttribute("data-id");
            fetch(`${API_URL}/contatos/${id}`, {
                method: "GET",
                headers: { "Authorization": `Bearer ${token}` },
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`Erro: ${response.status} - ${response.statusText}`);
                    }
                    return response.json();
                })
                .then((contato) => {
                    if (contato.erro) {
                        exibirNotificacao("Contato não encontrado.");
                        return;
                    }
                    abrirModal(contato);
                })
                .catch((error) => {
                    console.error("Erro ao buscar contato:", error);
                    exibirNotificacao("Erro ao buscar contato para edição.");
                });
        });
    });
}

// Interação do Usuário
function registrarInteracao(acao, descricao) {
    console.log(`[Interação] Ação: ${acao} | Descrição: ${descricao}`);
    fetch(`${API_URL}/registrar-interacao`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ acao, descricao }),
    })
        .then((response) => response.json())
        .then((data) => console.log(`Interação registrada: ${data.mensagem}`))
        .catch((error) => console.error("Erro ao registrar interação:", error));
}

// EventListeners de todos os botões
document.addEventListener("DOMContentLoaded", () => {
    // Configuração de eventos e inicializações
});

// Função para buscar contatos por nome
function buscarContatos() {
    const query = document.getElementById("buscarContato").value.trim();
    if (!query) {
        exibirNotificacao("Por favor, insira algo para buscar.");
        return;
    }

    fetch(`${API_URL}/contatos/buscar?q=${query}`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro: ${response.status} - ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            const resultado = document.getElementById("resultadoContatos");
            resultado.innerHTML = "";

            if (data.mensagem) {
                exibirNotificacao(data.mensagem);
            } else {
                data.forEach(contato => {
                    resultado.innerHTML += `
                        <li>
                            <strong>ID:</strong> ${contato.id} | 
                            <strong>Nome:</strong> ${contato.nome} | 
                            <strong>Telefone:</strong> ${contato.telefone}
                            <button class="editarContatoBtn" data-id="${contato.id}">✏️</button>
                        </li>
                    `;
                });

                adicionarEventosEditar(); // Reaplica eventos nos botões de edição
            }
        })
        .catch(error => console.error("Erro ao buscar contatos:", error));
}

// Função para adicionar um novo contato
function adicionarContato(event) {
    event.preventDefault();

    // Elementos dos campos de entrada
    const nomeInput = document.getElementById("nomeContato");
    const telefoneInput = document.getElementById("telefoneContato");
    const emailInput = document.getElementById("emailContato");
    const enderecoInput = document.getElementById("enderecoContato");

    if (!nomeInput || !telefoneInput) {
        console.error("Erro: Elementos do formulário não encontrados.");
        exibirNotificacao("Erro interno: Os campos de entrada não foram carregados corretamente.");
        return;
    }

    const nome = nomeInput.value.trim();
    const telefone = telefoneInput.value.trim();
    const email = emailInput ? emailInput.value.trim() || null : null;
    const endereco = enderecoInput ? enderecoInput.value.trim() || null : null;

    // Remove classes de erro antes da validação
    limparErros();

    let erro = false;

    // Validação: Nome obrigatório
    if (!nome) {
        mostrarErroCampo(nomeInput, "Nome é obrigatório!");
        erro = true;
    }

    // Validação: Telefone apenas com números (com DDD)
    if (!telefone.match(/^\d{10,11}$/)) {
        mostrarErroCampo(telefoneInput, "Telefone inválido! Use apenas números com DDD.");
        erro = true;
    }

    if (erro) return; // Se houver erro, para a execução

    // Enviar para API
    fetch(`${API_URL}/contatos`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ nome, telefone, email, endereco }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Erro: ${response.status} - ${response.statusText}`);
            }
            return response.json();
        })
        .then(() => {
            listarContatos();
            document.getElementById("formAdicionarContato").reset();
            limparErros(); // Remove os erros ao adicionar corretamente
            exibirNotificacao("Contato adicionado com sucesso!");
        })
        .catch((error) => console.error("Erro ao adicionar contato:", error));
}

// Função para exibir erro abaixo do campo e tremer
function mostrarErroCampo(campo, mensagem) {
    campo.classList.add("erro");
    campo.focus();

    // Remove mensagens anteriores para evitar duplicação
    if (campo.nextElementSibling && campo.nextElementSibling.classList.contains("tooltip-erro")) {
        campo.nextElementSibling.remove();
    }

    // Criação do tooltip de erro
    let tooltip = document.createElement("div");
    tooltip.classList.add("tooltip-erro");
    tooltip.innerHTML = `${mensagem} <br><strong>Ex: 11 9 1234-4321</strong>`; 

    // Insere abaixo do campo
    campo.parentNode.insertBefore(tooltip, campo.nextSibling);

    // Adiciona o efeito de tremor
    campo.classList.add("shake");
    setTimeout(() => campo.classList.remove("shake"), 500); // Remove a animação após 500ms

    // Remove automaticamente após 3 segundos
    setTimeout(() => {
        tooltip.classList.add("fade-out");
        setTimeout(() => tooltip.remove(), 500); // Aguarda o fade-out antes de remover
    }, 3000);
}

// Função para limpar mensagens de erro
function limparErros() {
    document.querySelectorAll(".erro-mensagem").forEach(msg => msg.remove());
    document.querySelectorAll(".erro").forEach(campo => campo.classList.remove("erro"));
}

// Função para editar um contato
function editarContato(event) {
    event.preventDefault();

    if (!verificarToken()) return;

    const id = document.getElementById("idContatoEditar").value;
    const nome = document.getElementById("nomeEditar").value.trim();
    const telefone = document.getElementById("telefoneEditar").value.trim();
    const email = document.getElementById("emailEditar").value.trim();
    const endereco = document.getElementById("enderecoEditar").value.trim();

    if (!id) {
        exibirNotificacao("ID do contato é obrigatório!");
        return;
    }

    const dados = {};
    if (nome) dados.nome = nome;
    if (telefone) dados.telefone = telefone;
    if (email) dados.email = email;
    if (endereco) dados.endereco = endereco;

    fetch(`${API_URL}/contatos/${id}`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(dados),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Erro ao editar contato.");
            }
            return response.json();
        })
        .then(() => {
            listarContatos();
            fecharModal();
            exibirNotificacao("Contato atualizado com sucesso!");
        })
        .catch((error) => console.error("Erro ao editar contato:", error));
}

// Função para deletar um contato por ID
function deletarContato() {
    if (!verificarToken()) return;

    const idInput = document.getElementById("idContatoDeletar");
    const id = idInput.value.trim();

    if (!id) {
        exibirNotificacao("ID do contato é obrigatório!", "erro");
        return;
    }

    fetch(`${API_URL}/contatos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
    })
    .then(response => response.json().then(data => ({ status: response.status, body: data }))) // Captura status + JSON
    .then(({ status, body }) => {
        if (status === 404) {
            exibirNotificacao("Contato não encontrado!", "erro");
        } else if (status === 200) {
            exibirNotificacao("Contato deletado com sucesso!", "sucesso");
            listarContatos(); // Atualiza a lista
            idInput.value = ""; // Limpa o campo após exclusão bem-sucedida
        } else {
            throw new Error(body.erro || "Erro desconhecido ao deletar contato.");
        }
    })
    .catch(error => {
        console.error("Erro ao deletar contato:", error);
        exibirNotificacao("Erro ao deletar contato. Verifique o console.", "erro");
    });
}

// Função para abrir o modal de edição
function abrirModal(contato) {
    document.getElementById("idContatoEditar").value = contato.id;
    document.getElementById("nomeEditar").value = contato.nome;
    document.getElementById("telefoneEditar").value = contato.telefone;
    document.getElementById("emailEditar").value = contato.email || "";
    document.getElementById("enderecoEditar").value = contato.endereco || "";

    const modal = document.getElementById("editarContatoModal");
    if (modal.style.display === "block") {
        console.warn("Modal já está aberto.");
        return;
    }

    modal.style.display = "block";

    const closeBtn = modal.querySelector(".close");
    closeBtn.removeEventListener("click", fecharModal);
    closeBtn.addEventListener("click", fecharModal);
}

// Função auxiliar para processar logs
function processarLogs(data, tabelaLogs) {
    tabelaLogs.innerHTML = ""; // Limpa os logs anteriores

    if (!data.logs || !Array.isArray(data.logs)) {
        console.error("Estrutura de logs inválida:", data);
        exibirNotificacao("Erro ao carregar logs. Verifique a estrutura dos dados.");
        return;
    }

    data.logs.forEach((log) => {
        try {
            const logEntry = JSON.parse(log); // Converte para JSON

            const linha = document.createElement("tr");
            linha.innerHTML = `
                <td>${logEntry.timestamp || "N/A"}</td>
                <td>${logEntry.ip || "N/A"}</td>
                <td>${logEntry.method || "N/A"}</td>
                <td>${logEntry.route || "N/A"}</td>
                <td>${logEntry.status || "N/A"}</td>
                <td>${JSON.stringify(logEntry.data) || "N/A"}</td>
                <td>${logEntry.user_agent || "N/A"}</td>
                <td>${logEntry.message || "N/A"}</td>
            `;
            tabelaLogs.appendChild(linha);
        } catch (error) {
            console.error("Erro ao processar log:", log, error);
        }
    });
}

// Função para registrar logs via API
function registrarLog(acao, descricao) {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("Token de autenticação não encontrado.");
        exibirNotificacao("Você precisa estar autenticado para registrar logs.");
        return;
    }

    fetch("/registrar-interacao", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token 
        },
        body: JSON.stringify({ acao, descricao })
    }).then(() => atualizarLogs())
    .catch(error => console.error("Erro ao registrar log:", error));
}

// Função para visualizar logs do sistema
function atualizarLogs() {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("Token de autenticação não encontrado.");
        exibirNotificacao("Você precisa estar autenticado para visualizar os logs.");
        return;
    }

    fetch("/logs", {
        headers: { "Authorization": "Bearer " + token }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        const tabelaLogs = document.getElementById("tabelaLogs").getElementsByTagName("tbody")[0];
        processarLogs(data, tabelaLogs);
    })
    .catch(error => console.error("Erro ao buscar logs:", error));
}

// Função para iniciar o polling (atualização automática dos logs)
function iniciarPollingLogs() {
    if (intervalId) {
        clearInterval(intervalId);
    }
    intervalId = setInterval(atualizarLogs, 5000); // Atualiza a cada 5 segundos
}

// Função para parar o polling
function pararPollingLogs() {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
}

// Função para limpar todos os dados (logs e contatos)
function limparTudo() {
    fetch(`${API_URL}/limpar-logs`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Erro ao limpar logs: ${response.statusText}`);
            }
            return response.json();
        })
        .then(() => {
            console.log("Logs limpos com sucesso.");

            // Só chama a limpeza de contatos se os logs forem apagados com sucesso
            return fetch(`${API_URL}/limpar-contatos`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Erro ao limpar contatos: ${response.statusText}`);
            }
            return response.json();
        })
        .then(() => {
            listarContatos();
            exibirNotificacao("Tudo foi limpo com sucesso!", "sucesso");
        })
        .catch((error) => {
            console.error("Erro ao limpar:", error);
            exibirNotificacao(`Erro ao limpar: ${error.message}`, "erro");
        });
}

// Eventos Listener de Interações
document.addEventListener("DOMContentLoaded", () => {
    gerarToken();
    listarContatos();
    iniciarPollingLogs();
    atualizarLogs(); 

    const token = localStorage.getItem("token");
    if (!token) {
        console.error("⚠ Token de autenticação não encontrado.");
        exibirNotificacao("Você precisa estar autenticado para interagir com o sistema.");
        return;
    }

    // Função genérica para adicionar event listeners
    function adicionarEvento(id, evento, callback) {
        document.getElementById(id)?.addEventListener(evento, callback);
    }

    // Eventos principais
    adicionarEvento("gerarContatos", "click", () => {
        gerarContatosAleatorios();
        registrarLog("Gerar Contatos", "Usuário clicou em 'Gerar Contatos'");
    });

    adicionarEvento("listarContatos", "click", () => {
        listarContatos();
        registrarLog("Listar Contatos", "Usuário clicou em 'Listar Contatos'");
    });

    adicionarEvento("buscarBtn", "click", () => {
        const query = document.getElementById("buscarContato").value;
        buscarContatos();
        registrarLog("Buscar Contato", `Usuário buscou por: ${query}`);
    });

    adicionarEvento("deletarContato", "click", () => {
        const id = document.getElementById("idContatoDeletar").value;
        deletarContato();
        registrarLog("Deletar Contato", `Usuário tentou deletar contato com ID: ${id}`);
    });

    adicionarEvento("formAdicionarContato", "submit", (event) => {
        event.preventDefault();
        adicionarContato(event);
        registrarLog("Adicionar Contato", "Usuário clicou em adicionar um novo contato.");
    });

    adicionarEvento("formEditarContato", "submit", (event) => {
        event.preventDefault();
        editarContato(event);
        const id = document.getElementById("idContatoEditar").value;
        registrarLog("Editar Contato", `Usuário editou o contato com ID: ${id}`);
    });

    adicionarEvento("limparTudo", "click", () => {
        limparTudo();
        registrarLog("Limpar Tudo", "Usuário limpou todos os dados do sistema.");
        setTimeout(() => atualizarLogs(), 1000);
        efeitoLimpezaTela();
    });

    // Eventos de exploração de vulnerabilidades
    document.querySelectorAll(".copy-exploit").forEach((button) => {
        button.addEventListener("click", () => {
            const exploit = button.getAttribute("data-exploit");
            navigator.clipboard.writeText(exploit);
            registrarLog("Exploit Copiado", `Exploit: ${exploit}`);
            showPopup("Exploit copiado!", `Código: ${exploit}`, "success");
        });
    });

    document.querySelectorAll(".testar-exploit").forEach((button) => {
        button.addEventListener("click", () => {
            const exploit = button.getAttribute("data-exploit");
            registrarLog("Exploit Testado", `Teste realizado: ${exploit}`);
            showPopup("Exploit Testado", "Teste concluído com sucesso!", "info");
        });
    });

    document.querySelectorAll(".corrigir-falha").forEach((button) => {
        button.addEventListener("click", () => {
            const vuln = button.getAttribute("data-vuln");
            registrarLog("Correção Aplicada", `Falha corrigida: ${vuln}`);
            showPopup("Correção Aplicada", `Por favor, teste novamente a vulnerabilidade: ${vuln}`, "warning");
        });
    });

    // Registra interação quando o usuário **passa o mouse** sobre botões importantes
    // document.querySelectorAll("button").forEach((button) => {
        // button.addEventListener("mousemove", () => {
            // registrarLog("Interação com Botão", `Usuário passou o mouse sobre: ${button.innerText}`);
        // });
    // });
});

// Efeito de limpeza ao clicar em "Limpar Tudo"
function efeitoLimpezaTela() {
    const body = document.body;
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.background = "rgba(255, 0, 0, 0.8)";
    overlay.style.zIndex = "1000";
    overlay.style.animation = "explosion 1s ease-out forwards";
    body.appendChild(overlay);

    setTimeout(() => {
        body.removeChild(overlay);
    }, 1000);
}

// Função para exibir pop-ups de sucesso, erro ou aviso
function showPopup(title, message, type) {
    const popup = document.createElement("div");
    popup.classList.add("popup", type);
    popup.innerHTML = `<h3>${title}</h3><p>${message}</p>`;
    document.body.appendChild(popup);

    setTimeout(() => {
        popup.classList.add("fade-out");
        setTimeout(() => popup.remove(), 500);
    }, 2500);
}

// Abre o modal de edição com os dados do contato
function abrirModal(contato) {
    document.getElementById("idContatoEditar").value = contato.id;
    document.getElementById("nomeEditar").value = contato.nome;
    document.getElementById("telefoneEditar").value = contato.telefone;
    document.getElementById("emailEditar").value = contato.email || "";
    document.getElementById("enderecoEditar").value = contato.endereco || "";

    const modal = document.getElementById("editarContatoModal");
    if (modal) {
        modal.style.display = "block";

        // Fecha ao clicar no botão X (Remove múltiplos event listeners)
        const closeBtn = modal.querySelector(".close");
        if (closeBtn) {
            closeBtn.removeEventListener("click", fecharModal);
            closeBtn.addEventListener("click", fecharModal);
        }

        // Fecha ao clicar fora do modal
        modal.addEventListener("click", (event) => {
            if (event.target === modal) {
                fecharModal();
            }
        });
    }
}

// Fecha o modal
function fecharModal() {
    const modal = document.getElementById("editarContatoModal");
    if (modal) {
        modal.style.display = "none";
    }
}

// Copia o texto do número para a área de transferência
function copiarTexto(texto) {
    navigator.clipboard.writeText(texto).then(() => {
        showPopup("Número Copiado!", `Copiado para a área de transferência: ${texto}`, "success");
    }).catch((error) => {
        console.error("Erro ao copiar número:", error);
        showPopup("Erro", "Não foi possível copiar o número.", "error");
    });
}

// Adiciona eventos aos ícones de copiar
function adicionarEventoCopiar() {
    document.querySelectorAll(".icon-clipboard").forEach((botao) => {
        botao.removeEventListener("click", copiarTexto);
        botao.addEventListener("click", () => {
            const texto = botao.getAttribute("data-telefone");
            copiarTexto(texto);
        });
    });
}

// Atualiza a lista de contatos e adiciona eventos de cópia
function atualizarListaContatos() {
    listarContatos().then(() => {
        adicionarEventoCopiar();
    });
}

// Inicializa funções ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
    iniciarSessao(); // Garante que o token está válido

    setTimeout(() => {
        if (document.getElementById("editarContatoModal")) {
            atualizarLogs(); // Só chama se o modal de edição existir
            iniciarPollingLogs(); // Inicia a atualização dos logs
        }
    }, 1000); // Aguarda 1 segundo para evitar erros de token inválido
});

// Mostrar/Esconder painel de exploração de Pentest
document.getElementById("botaoPentest").addEventListener("click", function() {
    const painel = document.getElementById("painelPentest");
    
    // Alterna a classe corretamente
    if (painel.classList.contains("oculto")) {
        painel.classList.remove("oculto");
        this.innerHTML = "⬇️ Ocultar Exploração";
    } else {
        painel.classList.add("oculto");
        this.innerHTML = "🔎 Quer fazer um Pentest neste site?";
    }
});

// Função para exibir notificações centralizadas no topo
function exibirNotificacao(mensagem) {
    const container = document.getElementById("notificacao-container");

    const notificacao = document.createElement("div");
    notificacao.classList.add("notificacao");
    notificacao.innerHTML = mensagem;

    container.appendChild(notificacao);

    // Remove a notificação após 3 segundos com efeito de fade-out
    setTimeout(() => {
        notificacao.classList.add("fadeOut");
        setTimeout(() => {
            notificacao.remove();
        }, 500);
    }, 3000);
}