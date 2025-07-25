import React, { useState } from 'react';
import './input.css';
const Input = ({ onSendMessage }) => {
    const [text, setText] = useState("");

    const onChange = (e) => {
        setText(e.target.value);
    };

    const onSubmit = () => {
        if (text.trim()) {
            onSendMessage(text);
            setText("");
        }
    };

    return (
        <div className="message-input-container">
            <div className="input-group">
                <input
                    type="text"
                    className="message-input"
                    placeholder="Type your message here..."
                    value={text}
                    onChange={onChange}
                    onKeyPress={(e) => e.key === 'Enter' && onSubmit()}
                />
                <button className="send-button" onClick={onSubmit}>
                    Send
                </button>
            </div>
        </div>
    );
};

export default Input;