import React, { useRef, useEffect } from 'react';


const Messages = ({ messages, currentUser }) => {

    let renderMessage = (message) => {
        const { sender, content, timestamp, color } = message;
        const messageFromMe = currentUser.username === message.sender;
        const className = messageFromMe ? "Messages-message currentUser" : "Messages-message";
        let date = new Date(timestamp);
        return (
            <li className={className}>
                <span
                    className="avatar"
                    style={{ backgroundColor: color }}
                />
                <div className="Message-content">
                    <div className="username">
                        {sender}
                        <span>{" in " + date.getHours() + " : " + date.getMinutes() + " : " + date.getSeconds()}</span>
                    </div>
                    <div className="text">{content}</div>
                </div>
            </li>
        );
    };

    const messagesEndRef = useRef(null);
    // Прокрутка вниз после добавления сообщения
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    return (
        <ul className="messages-list">
            {messages.map(msg => renderMessage(msg))}
            {/* "Якорь" для скролла */}
            <div ref={messagesEndRef} />
        </ul>
    )
}


export default Messages