
const CONFIG = {
    API_URL: "http://localhost:8000",

    // Preencher quando o backend disponibilizar o WebSocket
    WS_URL: "",

    ENDPOINTS: {
        login: "/auth/login",

        serverPower: "/server/power",
        serverCommand: "/server/command",

        javaWhitelist: {
            list: "/server/list_whitelist",
            add: "/server/add_whitelist",
            remove: "/server/remove_whitelist"
        },

        bedrockWhitelist: {
            list: "/server/list_fwhitelist",
            add: "/server/add_fwhitelist",
            remove: "/server/remove_fwhitelist"
        },

        users: {
            byId: "/user/user_by_id",
            create: "/user/create_user",
            update: "/user/update_user",
            remove: "/user/remove_user"
        }
    }
};
