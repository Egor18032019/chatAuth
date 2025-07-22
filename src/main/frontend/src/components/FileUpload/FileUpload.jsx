import React, { useState } from "react";
import { Status } from "../../utils/const"
import { downloadWithAuth } from "../../services/api"

function FileUpload({ chatId, username }) {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => setFile(e.target.files[0]);

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

    const handleUpload = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        const message = {
            chatId: chatId,
            sender: username,
            content: "", // заменит сервер
            timestamp: new Date().toISOString(),
            status: Status.SENT
        };

        formData.append("message", JSON.stringify(message));

        const token = getAuthToken();

        try {
            const response = await fetch("/files/upload", {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`
                    // НЕ указываем Content-Type вручную!
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error("Ошибка загрузки файла");
            }

            console.log(response.url)
         
        
            // Если WebSocket отправка нужна — отправляем
            // stompClient через props принимаем
            // if (stompClient && stompClient.connected) {
            //     stompClient.send("/app/chat.send", {}, JSON.stringify(url));
            // }

        } catch (err) {
            console.error("Ошибка при загрузке:", err);
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>📎 Отправить файл</button>
        </div>
    );
}

export default FileUpload;
