
const Api = {

    token: localStorage.getItem("token"),

    async request(endpoint, options = {}) {
        const headers = {
            "Content-Type": "application/json",
            ...options.headers
        };

        if (this.token) {
            headers.Authorization = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(
                `${CONFIG.API_URL}${endpoint}`,
                {
                    ...options,
                    headers
                }
            );

            const contentType = response.headers.get("content-type");

            const data = contentType?.includes("application/json")
                ? await response.json()
                : await response.text();

            if (!response.ok) {
                throw new Error(
                    data?.detail ||
                    data?.message ||
                    data ||
                    `Erro HTTP ${response.status}`
                );
            }

            return data;

        } catch (error) {
            console.error("Erro na API:", error);
            throw error;
        }
    },

    get(endpoint) {
        return this.request(endpoint, {
            method: "GET"
        });
    },

    post(endpoint, body) {
        return this.request(endpoint, {
            method: "POST",
            body: JSON.stringify(body)
        });
    },

    put(endpoint, body) {
        return this.request(endpoint, {
            method: "PUT",
            body: JSON.stringify(body)
        });
    },

    delete(endpoint, body) {
        return this.request(endpoint, {
            method: "DELETE",
            ...(body !== undefined && {
                body: JSON.stringify(body)
            })
        });
    },

    setToken(token) {
        this.token = token;
        localStorage.setItem("token", token);
    },

    logout() {
        this.token = null;
        localStorage.removeItem("token");
    }
};
