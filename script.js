// =====================================
// CRAFTWATCH - JAVASCRIPT
// =====================================

// LOGIN DEMONSTRATIVO
const DEMO_EMAIL = "admin@craftwatch.local";
const DEMO_PASSWORD = "admin123";

const $ = (selector) => document.querySelector(selector);

let whitelist = [
    { name: "Gui", date: "12/10/2026" },
    { name: "Steve", date: "14/10/2026" },
    { name: "Notch", date: "20/10/2026" }
];

// =====================================
// DADOS DEMONSTRATIVOS
// =====================================

const logs = [
    {
        type: "JOIN",
        time: "12:08:42",
        player: "Gui",
        message: "Gui entrou no jogo"
    },
    {
        type: "INFO",
        time: "12:05:18",
        player: "Server",
        message: "Preparing spawn area: 100%"
    },
    {
        type: "QUIT",
        time: "11:58:03",
        player: "Alex",
        message: "Alex saiu do jogo"
    },
    {
        type: "WARN",
        time: "11:42:51",
        player: "Server",
        message: "Can't keep up! Is the server overloaded?"
    },
    {
        type: "JOIN",
        time: "11:30:12",
        player: "Steve",
        message: "Steve entrou no jogo"
    },
    {
        type: "ERROR",
        time: "10:57:36",
        player: "Server",
        message: "Falha ao carregar um recurso"
    },
    {
        type: "JOIN",
        time: "10:21:09",
        player: "Notch",
        message: "Notch entrou no jogo"
    },
    {
        type: "INFO",
        time: "09:45:00",
        player: "Server",
        message: 'Done! For help, type "help"'
    }
];

const players = [
    {
        name: "Gui",
        time: "42h 18m",
        joins: 86,
        kills: 32,
        online: true
    },
    {
        name: "Steve",
        time: "28h 04m",
        joins: 51,
        kills: 18,
        online: true
    },
    {
        name: "Alex",
        time: "19h 32m",
        joins: 38,
        kills: 24,
        online: false
    },
    {
        name: "Notch",
        time: "15h 10m",
        joins: 27,
        kills: 41,
        online: true
    },
    {
        name: "Herobrine",
        time: "8h 45m",
        joins: 14,
        kills: 9,
        online: false
    },
    {
        name: "CreeperBR",
        time: "5h 20m",
        joins: 9,
        kills: 6,
        online: false
    }
];

// =====================================
// LOGIN
// =====================================

$("#loginForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const email = $("#email").value.trim();
    const password = $("#password").value;

    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {

        $("#loginScreen").classList.add("hidden");
        $("#app").classList.remove("hidden");

        $("#currentDate").textContent =
            new Intl.DateTimeFormat("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric"
            }).format(new Date());

        renderOverview();
        renderLogs();
        renderPlayers();
        renderWhitelist();

    } else {
        $("#loginError").textContent =
            "E-mail ou senha incorretos.";
    }
});

// LOGOUT

$("#logoutButton").addEventListener("click", function() {

    $("#app").classList.add("hidden");
    $("#loginScreen").classList.remove("hidden");

    $("#password").value = "";
    $("#loginError").textContent = "";

});

// =====================================
// NAVEGAÇÃO
// =====================================

const pageNames = {
    overview: ["Visão geral", "VISÃO GERAL"],
    logs: ["Logs do servidor", "LOGS"],
    players: ["Jogadores", "JOGADORES"],
    whitelist: ["Whitelist", "WHITELIST"],
    terminal: ["Terminal", "TERMINAL"]
};

function navigate(page) {

    document.querySelectorAll(".page").forEach(section => {
        section.classList.remove("active-page");
    });

    $("#page-" + page).classList.add("active-page");

    document.querySelectorAll(".nav-item").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.page === page
        );
    });

    $("#pageTitle").textContent = pageNames[page][0];
    $("#breadcrumb").textContent = pageNames[page][1];

    $("#sidebar").classList.remove("open");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

document.querySelectorAll(".nav-item").forEach(button => {
    button.addEventListener("click", function() {
        navigate(this.dataset.page);
    });
});

document.querySelectorAll("[data-go]").forEach(button => {
    button.addEventListener("click", function() {
        navigate(this.dataset.go);
    });
});

// MENU MOBILE

$("#mobileMenu").addEventListener("click", function() {
    $("#sidebar").classList.toggle("open");
});

// =====================================
// FUNÇÕES AUXILIARES
// =====================================

function escapeHTML(value) {

    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);

}

let toastTimer;

function showToast(message) {

    const toast = $("#toast");

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);

}

// =====================================
// DASHBOARD
// =====================================

function renderOverview() {

    const recentEvents = logs.slice(0, 4);

    $("#recentEvents").innerHTML = recentEvents.map(log => {

        let icon = "i";

        if (log.type === "JOIN") icon = "↗";
        if (log.type === "QUIT") icon = "↙";
        if (log.type === "WARN") icon = "!";
        if (log.type === "ERROR") icon = "×";

        return `
            <div class="event-row">

                <span class="event-icon">${icon}</span>

                <div class="event-copy">
                    <strong>${escapeHTML(log.message)}</strong>
                    <small>${escapeHTML(log.player)} · ${log.type}</small>
                </div>

                <span class="event-time">${log.time}</span>

            </div>
        `;

    }).join("");

    $("#topPlayers").innerHTML = players.slice(0, 4).map(player => {

        return `
            <div class="mini-player">

                <div class="avatar">
                    <img
                        src="https://mc-heads.net/avatar/${encodeURIComponent(player.name)}/64"
                        alt=""
                        onerror="this.parentElement.textContent='♙'"
                    >
                </div>

                <div>
                    <strong>${escapeHTML(player.name)}</strong>
                    <small>
                        ${player.online ? "● Online" : "○ Offline"}
                        · ${player.time}
                    </small>
                </div>

                <b>${player.joins}</b>

            </div>
        `;

    }).join("");

}

// =====================================
// LOGS
// =====================================

function renderLogs() {

    const search = $("#logSearch").value.toLowerCase();
    const type = $("#typeFilter").value;

    const filteredLogs = logs.filter(log => {

        const matchesType =
            type === "all" || log.type === type;

        const matchesSearch = [
            log.player,
            log.message,
            log.type
        ].join(" ").toLowerCase().includes(search);

        return matchesType && matchesSearch;

    });

    $("#logCount").textContent = filteredLogs.length;

    if (filteredLogs.length === 0) {

        $("#logsTable").innerHTML = `
            <tr>
                <td colspan="4" class="empty-row">
                    Nenhum evento encontrado.
                </td>
            </tr>
        `;

        return;
    }

    $("#logsTable").innerHTML = filteredLogs.map(log => {

        return `
            <tr>

                <td>
                    <span class="tag ${log.type}">
                        ${log.type}
                    </span>
                </td>

                <td>${log.time}</td>

                <td>${escapeHTML(log.player)}</td>

                <td>${escapeHTML(log.message)}</td>

            </tr>
        `;

    }).join("");

}

$("#logSearch").addEventListener("input", renderLogs);
$("#typeFilter").addEventListener("change", renderLogs);

$("#clearFilters").addEventListener("click", function() {

    $("#logSearch").value = "";
    $("#typeFilter").value = "all";

    renderLogs();

});

// EXPORTAR CSV

$("#exportLogs").addEventListener("click", function() {

    const rows = [
        ["Tipo", "Horário", "Jogador", "Mensagem"],

        ...logs.map(log => [
            log.type,
            log.time,
            log.player,
            log.message
        ])
    ];

    const csv = "\uFEFF" + rows.map(row => {

        return row.map(value => {

            return '"' + String(value).replace(/"/g, '""') + '"';

        }).join(";");

    }).join("\n");

    const blob = new Blob(
        [csv],
        { type: "text/csv;charset=utf-8;" }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "craftwatch-logs.csv";

    link.click();

    URL.revokeObjectURL(url);

    showToast("CSV exportado com sucesso!");

});

// =====================================
// JOGADORES
// =====================================

function renderPlayers() {

    const search = $("#playerSearch").value.toLowerCase();

    const filteredPlayers = players.filter(player =>
        player.name.toLowerCase().includes(search)
    );

    if (filteredPlayers.length === 0) {

        $("#playersGrid").innerHTML = `
            <div class="empty-row">
                Nenhum jogador encontrado.
            </div>
        `;

        return;
    }

    $("#playersGrid").innerHTML = filteredPlayers.map(player => {

        return `
            <article class="player-card">

                <div class="player-card-head">

                    <div class="avatar">
                        <img
                            src="https://mc-heads.net/avatar/${encodeURIComponent(player.name)}/64"
                            alt="Skin de ${escapeHTML(player.name)}"
                            onerror="this.parentElement.textContent='♙'"
                        >
                    </div>

                    <div>
                        <strong>${escapeHTML(player.name)}</strong>
                        <small>Jogador do servidor</small>
                    </div>

                    ${player.online
                        ? '<span class="online-badge">● ONLINE</span>'
                        : ''
                    }

                </div>

                <div class="player-metrics">

                    <div>
                        <span>TEMPO DE JOGO</span>
                        <strong>${player.time}</strong>
                    </div>

                    <div>
                        <span>ENTRADAS</span>
                        <strong>${player.joins}</strong>
                    </div>

                    <div>
                        <span>ABATES*</span>
                        <strong>${player.kills}</strong>
                    </div>

                </div>

            </article>
        `;

    }).join("");

}

$("#playerSearch").addEventListener("input", renderPlayers);

// =====================================
// WHITELIST
// =====================================

function renderWhitelist() {

    const search = $("#whitelistSearch").value.toLowerCase();

    const filtered = whitelist.filter(player =>
        player.name.toLowerCase().includes(search)
    );

    $("#whitelistCount").textContent =
        `${whitelist.length} jogador(es) na lista`;

    if (filtered.length === 0) {

        $("#whitelistTable").innerHTML = `
            <tr>
                <td colspan="4" class="empty-row">
                    Nenhum jogador encontrado.
                </td>
            </tr>
        `;

        return;
    }

    $("#whitelistTable").innerHTML = filtered.map(player => {

        return `
            <tr>

                <td>
                    <strong>${escapeHTML(player.name)}</strong>
                </td>

                <td>${player.date}</td>

                <td>
                    <span class="status">● AUTORIZADO</span>
                </td>

                <td>
                    <button
                        class="remove-button"
                        data-remove="${escapeHTML(player.name)}"
                    >
                        Remover
                    </button>
                </td>

            </tr>
        `;

    }).join("");

    document.querySelectorAll("[data-remove]").forEach(button => {

        button.addEventListener("click", function() {

            const name = this.dataset.remove;

            whitelist = whitelist.filter(player =>
                player.name !== name
            );

            renderWhitelist();

            showToast(name + " removido da lista demonstrativa.");

        });

    });

}

$("#whitelistSearch").addEventListener("input", renderWhitelist);

// ABRIR MODAL

$("#openAddWhitelist").addEventListener("click", function() {

    $("#modal").classList.remove("hidden");
    $("#newPlayer").focus();

});

// FECHAR MODAL

document.querySelectorAll("[data-close]").forEach(button => {

    button.addEventListener("click", function() {
        $("#modal").classList.add("hidden");
    });

});

// ADICIONAR JOGADOR

$("#whitelistForm").addEventListener("submit", function(event) {

    event.preventDefault();

    const name = $("#newPlayer").value.trim();

    if (!/^[A-Za-z0-9_]{3,16}$/.test(name)) {

        showToast("Nickname inválido!");

        return;
    }

    const alreadyExists = whitelist.some(player =>
        player.name.toLowerCase() === name.toLowerCase()
    );

    if (alreadyExists) {

        showToast("Esse jogador já está na whitelist.");

        return;
    }

    whitelist.push({
        name: name,
        date: new Intl.DateTimeFormat("pt-BR").format(new Date())
    });

    $("#newPlayer").value = "";
    $("#modal").classList.add("hidden");

    renderWhitelist();

    showToast(name + " adicionado à lista demonstrativa.");

});

// =====================================
// TERMINAL
// =====================================

function terminalLine(message, className = "") {

    const line = document.createElement("p");

    if (className) {
        line.className = className;
    }

    line.textContent = message;

    $("#terminalOutput").appendChild(line);

    $("#terminalOutput").scrollTop =
        $("#terminalOutput").scrollHeight;

}

function runCommand(command) {

    const cmd = command.trim();

    if (!cmd) return;

    terminalLine(
        "[DEMO] admin@craftwatch:~$ " + cmd,
        "terminal-green"
    );

    const responses = {

        "list":
            "There are 4 of a max of 20 players online: Gui, Steve, Notch, Alex",

        "time set day":
            "Set the time to 1000",

        "weather clear":
            "Set the weather to clear",

        "save-all":
            "Saved the game",

        "help":
            "Available commands: list, say, time set day, weather clear, save-all"

    };

    let response;

    if (cmd.startsWith("say ")) {

        response = "[Server] " + cmd.substring(4);

    } else {

        response = responses[cmd] ||
            "Comando registrado apenas na demonstração.";

    }

    terminalLine("[DEMO] " + response);

    $("#commandInput").value = "";

}

// EXECUTAR COMANDO

$("#commandForm").addEventListener("submit", function(event) {

    event.preventDefault();

    runCommand($("#commandInput").value);

});

// ATALHOS

document.querySelectorAll("[data-command]").forEach(button => {

    button.addEventListener("click", function() {

        runCommand(this.dataset.command);

    });

});

// LIMPAR TERMINAL

$("#clearTerminal").addEventListener("click", function() {

    $("#terminalOutput").innerHTML = "";

    showToast("Terminal limpo.");

});