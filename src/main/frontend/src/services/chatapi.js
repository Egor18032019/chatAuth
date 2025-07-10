import Axios from "axios";
import { BASE_URL_API, BASE_URL_SEND } from "../utils/const";
const api = Axios.create({
    baseURL: BASE_URL_API
});

const token ="eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjpbIlJPTEVfVVNFUiJdLCJpZCI6MTAwMDAxLCJlbWFpbCI6InVzZXJAdXNlci5jb20iLCJzdWIiOiJ1c2VyIiwiaWF0IjoxNzUyMTUxODg2LCJleHAiOjE3NTIyOTU4ODZ9.yET_BX5pUPtv_vehcDyHtf2gc6mWGD9NiEQX2KpnwOQ"

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
