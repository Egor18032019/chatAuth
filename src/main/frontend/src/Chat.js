import React, { useState, useEffect, useRef, useCallback ,useContext} from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { AuthContext } from './providers/AuthProvider';
import Messages from './components/Messages/Messages';
import Input from './components/Input/Input';
import './App.css';
import { SOCKET_URL } from "./utils/const";
import chatAPI from './services/chatapi';
const Chat = () => {
    const { state } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [connectionStatus, setConnectionStatus] = useState('DISCONNECTED');
    const clientRef = useRef(null);
    const messageQueue = useRef([]);

    const sendMessage = useCallback((messageText) => {
        if (!state.isLoggedIn || connectionStatus !== 'CONNECTED' || !clientRef.current) {
            messageQueue.current.push(messageText);
            console.warn('Message queued - not logged in or connection not ready');
            return;
        }

        try {

        chatAPI.sendMessage(state.email, messageText)
            .then(res => {
                console.log('Message sent', res);
            })
            .catch(err => {
                console.error('Error sending message:', err);
            });

            // clientRef.current.publish({
            //     destination: '/app/chat',
            //     body: JSON.stringify({
            //         text: messageText,
            //         sender: state.email,
            //         timestamp: new Date().toISOString()
            //     })
            // });
            
        } catch (error) {
            console.error('Failed to send message:', error);
            messageQueue.current.push(messageText);
        }
    }, [connectionStatus, state.isLoggedIn, state.email]);

    useEffect(() => {
        if (connectionStatus === 'CONNECTED' && messageQueue.current.length > 0) {
            const messagesToSend = [...messageQueue.current];
            messageQueue.current = [];

            messagesToSend.forEach(msg => sendMessage(msg));
        }
    }, [connectionStatus, sendMessage]);

    useEffect(() => {
        if (!state.isLoggedIn || !state.token) return;

        const TOPIC = `/user/${state.email}/queue/message`;

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

                const subscription = client.subscribe(TOPIC, (message) => {
                    try {
                        const newMessage = JSON.parse(message.body);
                        setMessages(prev => [...prev, newMessage]);
                    } catch (error) {
                        console.error('Error parsing message:', error);
                    }
                });

                clientRef.current.subscription = subscription;

                // Отправляем сообщения из очереди
                messageQueue.current.forEach(msg => sendMessage(msg));
                messageQueue.current = [];
            },
            onDisconnect: () => {
                setConnectionStatus('DISCONNECTED');
            }
        });

        client.activate();
        clientRef.current = client;

        return () => {
            if (clientRef.current && clientRef.current.subscription) {
                clientRef.current.subscription.unsubscribe();
                clientRef.current.subscription = null;
            }

            if (clientRef.current) {
                clientRef.current.deactivate();
                clientRef.current = null;
            }
        };
    }, [state.isLoggedIn, state.email, state.token]);

    if (!state.isLoggedIn) {
        return <div>Пожалуйста, войдите для доступа к чату</div>;
    }

    return (
        <div className="chat-container">
            <div className="chat-header">
                <h2>Чат</h2>
                <div className={`connection-status ${connectionStatus.toLowerCase()}`}>
                    Статус: {connectionStatus}
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

            {messageQueue.current.length > 0 && (
                <div className="message-queue-notice">
                    {messageQueue.current.length} сообщений в очереди
                </div>
            )}
        </div>
    );
};

export default Chat;