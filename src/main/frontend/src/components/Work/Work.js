import React, { useContext, useState, useCallback } from 'react';
import { AuthContext } from '../../providers/AuthProvider';
import { useStomp } from '../../services/useStomp';
import { useChatQueue } from '../../services/useChatQueue';
import { SOCKET_URL } from '../../utils/const';
import { sendChatApi, getHistory } from '../../services/api';
import { TABS, CONNECTION_STATUS } from '../../utils/const';

import Messages from '../Messages/Messages';
import Input from '../Input/Input';
import LocationButton from '../Location/LocationButton';
import FileUpload from '../FileUpload/FileUpload';
import ProjectSelect from '../ProjectSelect/ProjectSelect';
import WorkJournals from '../WorkJournals/WorkJournals';

import './Work.css';

const Work = () => {
    const { state } = useContext(AuthContext);
    const [connectionStatus, setConnectionStatus] = useState(CONNECTION_STATUS.LAUNCH);
    const [activeTab, setActiveTab] = useState(TABS.JOURNAL);
    const [messages, setMessages] = useState([]);
    const [chatId, setChatId] = useState('');
    const { queue, add: addToQueue, flush } = useChatQueue();
    const [stompClient, setStompClient] = useState(null);

    /* ---------- WebSocket ---------- */
    useStomp({
        url: SOCKET_URL,
        token: state.token,
        chatId,
        onConnect: client => {
            setConnectionStatus(CONNECTION_STATUS.CONNECTED);
            setStompClient(client);
            // загрузка истории
            getHistory(chatId)
                .then(setMessages)
                .catch(console.error);
            // отправка очереди
            flush().forEach(text =>
                sendChatApi
                    .sendMessage(chatId, state.email, text)
                    .catch(err => addToQueue(text))
            );
        },
        onDisconnect: () => setConnectionStatus(CONNECTION_STATUS.DISCONNECTED),
        onMessage: msg => setMessages(prev => [...prev, msg]),
    });

    /* ---------- Handlers ---------- */
    const handleProjectSelect = projectId => setChatId(projectId);

    const sendMessage = useCallback(
        text => {
            if (!state.isLoggedIn || connectionStatus !== CONNECTION_STATUS.CONNECTED || !chatId) {
                addToQueue(text);
                return;
            }
            sendChatApi
                .sendMessage(chatId, state.email, text)
                .catch(() => addToQueue(text));
        },
        [chatId, state.email, state.isLoggedIn, connectionStatus, addToQueue]
    );

    /* ---------- Render ---------- */
    if (!state.isLoggedIn) return <div>Пожалуйста, войдите для доступа к чату</div>;

    const tabContent = {
        [TABS.JOURNAL]: <WorkJournals chatId={chatId} />,
        [TABS.CHAT]: (
            <div className="chat">
                <Messages messages={messages} currentUser={state.email} />
                <Input onSendMessage={sendMessage} isConnected={connectionStatus === CONNECTION_STATUS.CONNECTED} />
                <FileUpload chatId={chatId} username={state.email} stompClient={stompClient} />
                {queue.length > 0 && (
                    <div className="message-queue-notice">{queue.length} сообщений в очереди</div>
                )}
            </div>
        ),
    };

    return (
        <div className="work-container">
            <div className="user-info">
                <div className="user-avatar">Фото</div>
                <span>{state.email} (Инспектор)</span>
            </div>

            <ProjectSelect onSelect={handleProjectSelect} />

            {chatId && (
                <>
                    <div className="chat-header">
                        <div className={`connection-status ${connectionStatus.toLowerCase()}`}>
                            <span className="status-text">Статус: {connectionStatus}</span>
                            <LocationButton project={chatId} />
                        </div>
                    </div>

                    <div className="tabs-container">
                        <div className="tabs">
                            {Object.values(TABS).map(tab => (
                                <div
                                    key={tab}
                                    className={`tab ${activeTab === tab ? 'active' : ''}`}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab}
                                </div>
                            ))}
                        </div>
                        <div className="tab-content">{tabContent[activeTab]}</div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Work;