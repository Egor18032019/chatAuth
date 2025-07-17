import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { AuthContext } from '../../providers/AuthProvider';
import Messages from '../Messages/Messages';
import Input from '../Input/Input';
import LocationButton from '../Location/LocationButton';
import FileUpload from '../FileUpload/FileUpload';
import './Chat.css';
import { SOCKET_URL } from "../../utils/const";
import { sendChatApi, giveMeAllPrevMessage } from '../../services/api';
const Chat = () => {
    const { state } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [connectionStatus, setConnectionStatus] = useState('DISCONNECTED');
    const clientRef = useRef(null);
    const messageQueue = useRef([]);
    const chatId = "firstRoom"
    const sendMessage = useCallback((messageText) => {

        if (!state.isLoggedIn || connectionStatus !== 'CONNECTED' || !clientRef.current) {
            messageQueue.current.push(messageText);
            console.warn('Message queued - not logged in or connection not ready');

        }

        try {

            sendChatApi.sendMessage(chatId, state.email, messageText)
                .then(res => {
                    console.log('Message sent', res);
                    setConnectionStatus("CONNECTED")
                })
                .catch(err => {
                    setConnectionStatus("DISCONNECTED")
                    messageQueue.current.push(messageText);
                    console.error('Error sending message:', err);
                });


        } catch (error) {
            console.error('Failed to send message:', error);
            messageQueue.current.push(messageText);
        }
    }, [connectionStatus, state.isLoggedIn, state.email]);

    useEffect(() => {
        if (connectionStatus === 'CONNECTED' && messageQueue.current.length > 0) {
            const messagesToSend = [...messageQueue.current];
            messageQueue.current = [];
            //todo обдумать
            messagesToSend.forEach(msg => (
                sendChatApi.sendMessage(chatId, state.email, msg)
                    .then(res => {
                        console.log('Message sent', res);
                    })
                    .catch(err => {
                        console.error('Error sending message:', err);
                    })
            ));
        }
    }, [connectionStatus, sendMessage]);

    useEffect(() => {
        if (!state.isLoggedIn || !state.token) return;

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
                const prevMessage = giveMeAllPrevMessage.getHistory(chatId)
                    .then(res => {
                        console.log('Получили историю в размере ', res.length);
                        setMessages(res);
                    })
                    .catch(err => {
                        console.error('Error history message:', err);
                    });


                const subscription = client.subscribe(TOPIC, (message) => {
                    try {
                        const newMessage = JSON.parse(message.body);
                        setMessages(prev => [...prev, newMessage]);
                    } catch (error) {
                        console.error('Error parsing message:', error);
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
              <h2>Чат</h2>
            <div className="chat-header">
              
                <div className={`connection-status ${connectionStatus.toLowerCase()}`}>
                    <span class="status-text">Статус:  {connectionStatus}</span>
                    <LocationButton />
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