import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { AuthContext } from '../../providers/AuthProvider';
import Messages from '../Messages/Messages';
import Input from '../Input/Input';
import LocationButton from '../Location/LocationButton';
import FileUpload from '../FileUpload/FileUpload';
import ProjectSelect from '../ProjectSelect/ProjectSelect';
import './Chat.css';
import { SOCKET_URL } from "../../utils/const";
import { sendChatApi, getHistory } from '../../services/api';

const Chat = () => {
    const { state } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [connectionStatus, setConnectionStatus] = useState('LAUNCH');
    const [chatId, setChatId] = useState("");  
    const clientRef = useRef(null);
    const messageQueue = useRef([]);

    const handleProjectSelect = (projectId) => {
        console.log("Выбран проект ID:", projectId);
        setChatId(projectId);
    };

    const sendMessage = useCallback((messageText) => {
        if (!state.isLoggedIn || connectionStatus !== 'CONNECTED' || !clientRef.current || !chatId) {
            messageQueue.current.push(messageText);
            console.warn('Message queued - not ready');
            return;
        }

        try {
            sendChatApi.sendMessage(chatId, state.email, messageText)
                .then(res => {
                    console.log('Message sent', res);
                    setConnectionStatus("CONNECTED");
                })
                .catch(err => {
                    setConnectionStatus("DISCONNECTED");
                    messageQueue.current.push(messageText);
                    console.error('Error sending message:', err);
                });

        } catch (error) {
            console.error('Failed to send message:', error);
            messageQueue.current.push(messageText);
        }
    }, [connectionStatus, state.isLoggedIn, state.email, chatId]);

    useEffect(() => {
        if (connectionStatus === 'CONNECTED' && messageQueue.current.length > 0) {
            const messagesToSend = [...messageQueue.current];
            messageQueue.current = [];

            messagesToSend.forEach(msg => {
                sendChatApi.sendMessage(chatId, state.email, msg)
                    .then(res => console.log('Queued message sent', res))
                    .catch(err => console.error('Error sending queued message:', err));
            });
        }
    }, [connectionStatus, sendMessage, chatId, state.email]);

    useEffect(() => {
        if (!state.isLoggedIn || !state.token || !chatId) return;

        const TOPIC = `/user/${chatId}/queue/message`;

        const client = new Client({
            webSocketFactory: () => new SockJS(SOCKET_URL),
            connectHeaders: {
                Authorization: `Bearer ${state.token}`
            },
            debug: (str) => {
                console.log('STOMP: ', str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: () => {
                setConnectionStatus('CONNECTED');

                // Загружаем историю сообщений
                getHistory(chatId)
                    .then(res => {
                        console.log('История сообщений:', res.length);
                        setMessages(res);
                    })
                    .catch(err => {
                        console.error('Ошибка получения истории:', err);
                    });

                // Подписываемся на входящие сообщения
                const subscription = client.subscribe(TOPIC, (message) => {
                    try {
                        const newMessage = JSON.parse(message.body);
                        setMessages(prev => [...prev, newMessage]);
                    } catch (error) {
                        console.error('Ошибка парсинга сообщения:', error);
                    }
                });

                clientRef.current.subscription = subscription;
            },
            onDisconnect: () => {
                setConnectionStatus('DISCONNECTED');
            }
        });

        client.activate();
        clientRef.current = client;

        return () => {
            if (clientRef.current?.subscription) {
                clientRef.current.subscription.unsubscribe();
                clientRef.current.subscription = null;
            }
            if (clientRef.current) {
                clientRef.current.deactivate();
                clientRef.current = null;
            }
        };
    }, [state.isLoggedIn, state.token, chatId]);

    if (!state.isLoggedIn) {
        return <div>Пожалуйста, войдите для доступа к чату</div>;
    }

    return (
        <div className="chat-container">
            <h2>Чат</h2>

            <ProjectSelect onSelect={handleProjectSelect} />

            <div className="chat-header">
                <div className={`connection-status ${connectionStatus.toLowerCase()}`}>
                    <span className="status-text">Статус: {connectionStatus}</span>
                    <LocationButton project={chatId} />
                </div>
            </div>

            <Messages
                messages={messages}
                currentUser={state.email}
            />

            <Input
                onSendMessage={sendMessage}
                isConnected={connectionStatus === 'CONNECTED'}
            />

            <FileUpload
                chatId={chatId}
                username={state.email}
                stompClient={clientRef.current}
            />

            {messageQueue.current.length > 0 && (
                <div className="message-queue-notice">
                    {messageQueue.current.length} сообщений в очереди
                </div>
            )}
        </div>
    );
};

export default Chat;
