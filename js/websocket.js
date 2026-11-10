
const ServerSocket = {

    connection: null,
    reconnectTimer: null,
    reconnectAttempts: 0,
    maxReconnectAttempts: 10,

    onMessage: null,
    onStatusChange: null,

    connect() {
        if (!CONFIG.WS_URL) {
            console.warn("Endereço WebSocket não configurado.");
            return;
        }

        if (
            this.connection &&
            (
                this.connection.readyState === WebSocket.OPEN ||
                this.connection.readyState === WebSocket.CONNECTING
            )
        ) {
            return;
        }

        this.onStatusChange?.("connecting");

        this.connection = new WebSocket(CONFIG.WS_URL);

        this.connection.onopen = () => {
            console.log("WebSocket conectado.");

            this.reconnectAttempts = 0;
            this.onStatusChange?.("connected");
        };

        this.connection.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                this.onMessage?.(data);

            } catch (error) {
                console.error("Mensagem WebSocket inválida:", error);
            }
        };

        this.connection.onerror = (error) => {
            console.error("Erro WebSocket:", error);
        };

        this.connection.onclose = () => {
            this.onStatusChange?.("disconnected");
            this.reconnect();
        };
    },

    reconnect() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.warn("Limite de reconexões atingido.");
            return;
        }

        const delay = Math.min(
            1000 * Math.pow(2, this.reconnectAttempts),
            30000
        );

        this.reconnectAttempts++;

        clearTimeout(this.reconnectTimer);

        this.reconnectTimer = setTimeout(() => {
            this.connect();
        }, delay);
    },

    disconnect() {
        clearTimeout(this.reconnectTimer);

        if (this.connection) {
            this.connection.onclose = null;
            this.connection.close();
            this.connection = null;
        }

        this.onStatusChange?.("disconnected");
    }
};
