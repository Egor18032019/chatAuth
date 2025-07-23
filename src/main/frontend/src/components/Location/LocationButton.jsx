import React, { useState, useEffect } from 'react';
import { sendToServer } from '../../services/api';
const LocationButton = (props) => {
    const [position, setPosition] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const STORAGE_KEY = 'pending_location_data';

    // Получаем и сохраняем геопозицию с меткой времени
    const handleClick = () => {
        console.log(props.project)
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const data = {
                        latitude: pos.coords.latitude,
                        longitude: pos.coords.longitude,
                        timestamp: new Date().toISOString(),
                        project: props.project
                    };
                    setPosition(data);
                    setErrorMessage('');
                    handleDataSend(data);
                },
                (error) => {
                    setErrorMessage(error.message || 'Ошибка определения местоположения');
                }
            );
        } else {
            setErrorMessage('Ваш браузер не поддерживает определение местоположения.');
        }
    };

    // Отправка данных или постановка в очередь
    const handleDataSend = (data) => {
        if (navigator.onLine) {
            sendToServer(data);
        } else {
            queueData(data);
        }
    };

    // Добавить данные в localStorage очередь
    const queueData = (data) => {
        const queue = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        queue.push(data);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
        console.log('Данные сохранены в очередь:', data);
    };

    // Попытка отправить все данные из очереди
    const flushQueue = async () => {
        if (!navigator.onLine) return;

        const queue = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        if (queue.length === 0) return;

        for (const data of queue) {
            try {
                const response = await sendToServer(data);
                console.log('Отправлено на сервер:', response);
            } catch (error) {
                console.error('Ошибка отправки, сохраняем в очередь:', error);
                queueData(data); // повторно сохранить
            }
        }

        localStorage.removeItem(STORAGE_KEY);
        console.log('Очередь отправлена');
    };


    // Следим за восстановлением сети
    useEffect(() => {
        window.addEventListener('online', flushQueue);
        flushQueue(); // на случай если уже онлайн при старте

        return () => {
            window.removeEventListener('online', flushQueue);
        };
    }, []);

    return (
        <div className="location-button-container">
            <button className="location-button"
                onClick={handleClick}> Отправить мое местоположение</button>
            {position && (
                <p>
                    Координаты: широта — {position.latitude}, долгота — {position.longitude}<br />
                    Время: {new Date(position.timestamp).toLocaleString()}
                </p>
            )}
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </div>
    );
};

export default LocationButton;
