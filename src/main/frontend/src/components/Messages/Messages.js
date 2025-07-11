import React, { useRef, useEffect } from 'react';

const Messages = ({ messages, currentUser }) => {
    const messagesEndRef = useRef(null);

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    return (
        <ul className="messages-list">
            {messages.map((message, index) => {
                const { sender, content, timestamp, color } = message;
                const messageFromMe = currentUser.username === message.sender;
                const className = messageFromMe ? "Messages-message currentUser" : "Messages-message";

                return (
                    <li
                        key={message.id || index}
                        ref={index === messages.length - 1 ? messagesEndRef : null}
                        className={className}
                    >
                        <span
                            className="avatar"
                            style={{ backgroundColor: color }}
                        />
                        <div className="Message-content">
                            <div className="username">
                                {sender}
                                <span>{` in ${formatTime(timestamp)}`}</span>
                            </div>
                            <div className="text">{content}</div>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
};

export default Messages;