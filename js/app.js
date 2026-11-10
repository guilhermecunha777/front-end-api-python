
const App = {

    async login(email, password) {
        const response = await Api.post(
            CONFIG.ENDPOINTS.login,
            { email, password }
        );

        // Ajustar conforme o JSON real retornado pelo backend
        const token =
            response.access_token ||
            response.token;

        if (!token) {
            throw new Error("Token não encontrado na resposta.");
        }

        Api.setToken(token);

        return response;
    },

    async serverPower(action) {
        const validActions = ["start", "stop", "restart"];

        if (!validActions.includes(action)) {
            throw new Error("Ação inválida.");
        }

        return await Api.post(
            CONFIG.ENDPOINTS.serverPower,
            { action }
        );
    },

    async sendCommand(command) {
        if (!command.trim()) return;

        return await Api.post(
            CONFIG.ENDPOINTS.serverCommand,
            { command }
        );
    },

    async getWhitelist(type) {
        const endpoint = type === "java"
            ? CONFIG.ENDPOINTS.javaWhitelist.list
            : CONFIG.ENDPOINTS.bedrockWhitelist.list;

        return await Api.get(endpoint);
    },

    async addWhitelist(type, player) {
        const endpoint = type === "java"
            ? CONFIG.ENDPOINTS.javaWhitelist.add
            : CONFIG.ENDPOINTS.bedrockWhitelist.add;

        return await Api.post(endpoint, { player });
    },

    async removeWhitelist(type, player) {
        const endpoint = type === "java"
            ? CONFIG.ENDPOINTS.javaWhitelist.remove
            : CONFIG.ENDPOINTS.bedrockWhitelist.remove;

        return await Api.post(endpoint, { player });
    },

    async getUser(id) {
        const endpoint =
            `${CONFIG.ENDPOINTS.users.byId}?id=${encodeURIComponent(id)}`;

        return await Api.get(endpoint);
    },

    async createUser(user) {
        return await Api.post(
            CONFIG.ENDPOINTS.users.create,
            user
        );
    },

    async updateUser(user) {
        return await Api.put(
            CONFIG.ENDPOINTS.users.update,
            user
        );
    },

    async removeUser(id) {
        return await Api.delete(
            CONFIG.ENDPOINTS.users.remove,
            { id }
        );
    }
};


// ===============================
// CONSOLE
// ===============================

function addLog(message, type = "normal") {

    const consoleOutput =
        document.getElementById("consoleOutput");

    const line = document.createElement("p");

    line.className = `log ${type}`;
    line.textContent = message;

    consoleOutput.appendChild(line);

    consoleOutput.scrollTop =
        consoleOutput.scrollHeight;
}


// ===============================
// WEBSOCKET
// ===============================

ServerSocket.onStatusChange = (status) => {

    const element = document.getElementById("wsStatus");

    element.className = `status ${status}`;

    const labels = {
        connected: "WebSocket conectado",
        disconnected: "WebSocket desconectado",
        connecting: "Conectando WebSocket..."
    };

    element.textContent = labels[status] || status;
};


ServerSocket.onMessage = (data) => {

    switch (data.type) {

        case "log":
            addLog(data.message);
            break;

        case "status":
            document.getElementById("serverStatus").textContent =
                data.status;
            break;

        case "player_join":
            addLog(`${data.player} entrou no servidor`, "success");
            break;

        case "player_leave":
            addLog(`${data.player} saiu do servidor`, "warning");
            break;

        case "error":
            addLog(data.message, "error");
            break;

        default:
            console.log("Evento recebido:", data);
    }
};


// ===============================
// CONTROLE DO SERVIDOR
// ===============================

document.getElementById("startButton")
    .addEventListener("click", () => power("start"));

document.getElementById("stopButton")
    .addEventListener("click", () => power("stop"));

document.getElementById("restartButton")
    .addEventListener("click", () => power("restart"));


async function power(action) {

    try {
        const response = await App.serverPower(action);

        addLog(`Solicitação enviada: ${action}`, "success");

        console.log(response);

    } catch (error) {
        addLog(error.message, "error");
    }
}


// ===============================
// ENVIO DE COMANDOS
// ===============================

document.getElementById("commandForm")
    .addEventListener("submit", async (event) => {

        event.preventDefault();

        const input =
            document.getElementById("commandInput");

        const command = input.value.trim();

        if (!command) return;

        addLog(`> ${command}`, "system-log");

        try {
            await App.sendCommand(command);

            input.value = "";

        } catch (error) {
            addLog(error.message, "error");
        }
    });


// ===============================
// LIMPAR CONSOLE
// ===============================

document.getElementById("clearConsole")
    .addEventListener("click", () => {

        document.getElementById("consoleOutput").innerHTML = "";

    });


// ===============================
// LOGOUT
// ===============================

document.getElementById("logoutButton")
    .addEventListener("click", () => {

        ServerSocket.disconnect();
        Api.logout();

        window.location.reload();
    });


// ===============================
// INICIALIZAÇÃO
// ===============================

if (Api.token) {
    ServerSocket.connect();
}
