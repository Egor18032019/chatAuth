import Axios from "axios";
import { BASE_URL_API, BASE_URL_SEND } from "../utils/const";
const api = Axios.create({
    baseURL: BASE_URL_API
});

const token = "1eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjpbIlJPTEVfVVNFUiJdLCJpZCI6MTAwMDAxLCJlbWFpbCI6InVzZXJAdXNlci5jb20iLCJzdWIiOiJ1c2VyIiwiaWF0IjoxNzUyMTQ0MzI5LCJleHAiOjE3NTIyODgzMjl9.f1WLCPgRDKP2z7HjqPZygTaxVGMd7qOVSfZBv0Dt7WQ"
const chatAPI = {
    // getMessages: (groupId) => {
    //     return api.get(`messages/${groupId}`);
    // },
    sendMessage: (username, text) => {
        console.log('sendMessage ' + text);
        let msg = {
            sender: username,
            content: text
        }
        // Добавляем заголовки в конфигурацию запроса

        const config = {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        };
        return api.post(BASE_URL_SEND, msg, config)
    }
}


export default chatAPI;
