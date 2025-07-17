import Axios from "axios";
import { BASE_URL_API, BASE_URL_SEND, CHAT_HISTORY } from "../utils/const";

// Создаем экземпляр axios с базовыми настройками
const api = Axios.create({
  baseURL: BASE_URL_API,
  timeout: 10000, // 10 секунд таймаут
});

// Функция для получения токена с проверкой
const getAuthToken = () => {
  const userData = localStorage.getItem("user");
  if (!userData) {
    throw new Error("No authentication token found");
  }

  try {
    const { token } = JSON.parse(userData);
    return token;
  } catch (error) {
    console.error("Failed to parse user data:", error);
    throw new Error("Invalid user data in localStorage");
  }
};

const giveMeAllPrevMessage = {
  getHistory: async (roomId) => {
    const token = getAuthToken();
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    const response = await api.get(CHAT_HISTORY + "/" + roomId, config);

    // Логируем ответ для отладки
    console.log('Получили ' + response.data.length + " сообщений. ");

    return response.data;
  }
}

const sendChatApi = {
  sendMessage: async (chatId, username, text) => {
    try {
      console.log(`Sending message from ${username}: ${text}`);

      const token = getAuthToken();

      const message = {
        chatId: chatId,
        sender: username,
        content: text,
        timestamp: new Date().toISOString(),
        status: "SENT" //todo сделать enumsS
      };

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      const response = await api.post(BASE_URL_SEND,
        message,
        config);

      // Логируем ответ для отладки
      console.log('Message sent successfully:', response.data);

      return response.data;

    } catch (error) {
      console.error('Error sending message:', error);

      // Обрабатываем разные типы ошибок
      if (error.response) {
        // Сервер ответил с кодом ошибки
        throw new Error(`Request failed with status ${error.response.status}`);
      } else if (error.request) {
        // Запрос был сделан, но ответа не было
        throw new Error("No response received from server");
      } else {
        // Ошибка при настройке запроса
        throw new Error(`Error setting up request: ${error.message}`);
      }
    }
  },
  sendFile: async () => {
    console.log("нужно ли нам ?")
  }
};

 
const sendToServer = async (data) => {
  const token = getAuthToken();
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };

  try {
    const response = await api.post("/location", data, config);
    console.log('Отправлено на сервер:', response);
  } catch (error) {
    console.error('Ошибка отправки, сохраняем в очередь:', error);

  }
};


export {
  sendChatApi,
  giveMeAllPrevMessage,
  sendToServer
}