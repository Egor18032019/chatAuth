import Axios from "axios";
import { BASE_URL_API, BASE_URL_SEND, CHAT_HISTORY, PROJECT, JournalEntry } from "../utils/const";

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

const getHistory = async (roomId) => {
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

const sendToServer = async (data, token) => {

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

const giveMeMainProjects = async (token) => {

  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
  const response = await api.get(PROJECT, config);
  console.log('Получено с сервера:', response.data.length);
  return response;
};

const giveMeMainJournalEntry = async (token, project) => {

  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
  const url = JournalEntry + "/" + project;
  const response = await api.get(url, config);
  console.log('Получено с сервера:', response.data.journalEntries.length);
  return response;
};

const downloadWithAuth = async (fileUrl, filename) => {
  const token = getAuthToken();
  const response = await fetch(fileUrl, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename || "file";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
// Сохранение журнала авторского надзора
const saveAuthorSupervisionJournal = async (token, projectName, data) => {
  const response = await fetch('/api/author-supervision-journal', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      projectName, // chatId
      ...data
    })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Ошибка сохранения' }));
    throw new Error(error.message || `Ошибка: ${response.status}`);
  }

  return response.json();
};

// Получение журнала авторского надзора
const getAuthorSupervisionJournal = async (token, projectName) => {
  const response = await fetch(`/api/author-supervision-journal/${projectName}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    if (response.status === 404) return { data: null }; // Журнал ещё не создан
    throw new Error('Не удалось загрузить данные');
  }

  return response.json();
};
export {
  sendChatApi,
  getAuthorSupervisionJournal,
  saveAuthorSupervisionJournal,
  getHistory,
  giveMeMainJournalEntry,
  giveMeMainProjects,
  downloadWithAuth,
  sendToServer
}