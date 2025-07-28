// services/useStomp.js
import { useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export const useStomp = ({ url, token, chatId, onConnect, onDisconnect, onMessage }) => {
    const stompClientRef = useRef(null);
    const handlersRef = useRef({ onConnect, onDisconnect, onMessage });

    // Обновляем обработчики без пересоздания клиента
    useEffect(() => {
        handlersRef.current = { onConnect, onDisconnect, onMessage };
    }, [onConnect, onDisconnect, onMessage]);

    useEffect(() => {
        if (!token || !chatId) {
            // Если нет токена или chatId — отключаемся
            if (stompClientRef.current?.active) {
                stompClientRef.current.deactivate();
            }
            return;
        }

        // Создаём клиента только один раз
        if (!stompClientRef.current) {
            const client = new Client({
                webSocketFactory: () => new SockJS(url),
                connectHeaders: { Authorization: `Bearer ${token}` },
                reconnectDelay: 5000,
                heartbeatIncoming: 4000,
                heartbeatOutgoing: 4000,
                debug: (str) => console.log('STOMP:', str),
                onConnect: () => {
                    const { onConnect: connectHandler } = handlersRef.current;
                    if (connectHandler) {
                        connectHandler(client);
                    }

                    // Подписываемся на приватную очередь
                    const subscription = client.subscribe(
                        `/user/${chatId}/queue/message`,
                        (msg) => {
                            const { onMessage: messageHandler } = handlersRef.current;
                            if (messageHandler) {
                                try {
                                    messageHandler(JSON.parse(msg.body));
                                } catch (e) {
                                    console.error('Failed to parse message:', e);
                                }
                            }
                        }
                    );

                    // Сохраняем подписку, чтобы отписаться при смене chatId
                    client.subscription = subscription;
                },
                onDisconnect: () => {
                    const { onDisconnect: disconnectHandler } = handlersRef.current;
                    if (disconnectHandler) {
                        disconnectHandler();
                    }
                },
                onStompError: (error) => {
                    console.error('STOMP error:', error);
                },
                onWebSocketError: (error) => {
                    console.error('WebSocket error:', error);
                },
                onWebSocketClose: (event) => {
                    console.log('WebSocket closed:', event.code, event.reason);
                },
            });

            stompClientRef.current = client;
            client.activate();
        } else {
            // Клиент уже существует — обновляем токен и chatId (если нужно)
            const client = stompClientRef.current;

            // Если изменился chatId — переоформляем подписку
            if (client.subscription && client.active) {
                client.subscription.unsubscribe();
            }

            // Переподписываемся на новую очередь при смене chatId
            const subscription = client.subscribe(`/user/${chatId}/queue/message`, (msg) => {
                const { onMessage: messageHandler } = handlersRef.current;
                if (messageHandler) {
                    try {
                        messageHandler(JSON.parse(msg.body));
                    } catch (e) {
                        console.error('Failed to parse message:', e);
                    }
                }
            });
            client.subscription = subscription;
        }

        return () => {
            // При размонтировании — ничего не делаем (клиент остаётся)
            // Или можно оставить deactivate при выходе
        };
    }, [url, token, chatId]); // ⚠️ Важно: только эти зависимости другие не ставить!

    //  функция для ручного отключения 
    const disconnect = () => {
        if (stompClientRef.current?.active) {
            stompClientRef.current.deactivate();
            stompClientRef.current = null;
        }
    };

    return { client: stompClientRef.current, disconnect };
};