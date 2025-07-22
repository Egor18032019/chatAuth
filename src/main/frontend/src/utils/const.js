const SOCKET_URL = 'http://127.0.0.1:8080/ws-chat/';
// const TOPIC = '/topic/group';
const TOPIC = '/queue/message';
// const TOPIC = '/user/queue/reply';
const BASE_URL_API = "/api";
const PROJECT = "/project";
const BASE_URL_SEND = "/send";
const CHAT_HISTORY = "/chat/history";


const api = "/api";
const auth = "/auth";
const login = "/login";
const url = "http://localhost:8080";
// const url = "";

const Status = {
    SENT: "SENT",
    DELIVERED: "DELIVERED",
    RECEIVED: "RECEIVED"
};

export {
    url,
    PROJECT,
    auth,
    login,
    SOCKET_URL,
    BASE_URL_API,
    BASE_URL_SEND,
    CHAT_HISTORY,
    TOPIC,
    Status
}