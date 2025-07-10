import React, { useState } from 'react';
import SockJsClient from 'react-stomp';
import './App.css';
import Input from './components/Input/Input';
import LoginForm from './components/LoginForm';
import Messages from './components/Messages/Messages';
import chatAPI from './services/chatapi';
import { randomColor } from './utils/common';
import { SOCKET_URL, TOPIC } from "./utils/const";

const Root = () => {
    const [messages, setMessages] = useState([])
    const [user, setUser] = useState(null)
const token ="1eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjpbIlJPTEVfVVNFUiJdLCJpZCI6MTAwMDAxLCJlbWFpbCI6InVzZXJAdXNlci5jb20iLCJzdWIiOiJ1c2VyIiwiaWF0IjoxNzUyMTQ0MzI5LCJleHAiOjE3NTIyODgzMjl9.f1WLCPgRDKP2z7HjqPZygTaxVGMd7qOVSfZBv0Dt7WQ"

    let onConnected = () => {
        console.log("Connected on SockJsClient !!! ")
    }
    let onDisconnect = () => {
        console.log("Disconnected  !!! ")
    }
    let onMessageReceived = (msg) => {
        console.log('New Message Received!!', msg);
        setMessages(messages.concat(msg));

    }

    let onSendMessage = (msgText) => {
        chatAPI.sendMessage(user.username, msgText).then(res => {
            console.log('Sent', res);
        }).catch(err => {
            console.log('Error Occurred while sending message to api');
        })
    }

    let handleLoginSubmit = (username) => {
        console.log(username, " Logged in..");

        setUser({
            username: username,
            color: randomColor()
        })

    }

    return (
        <div className="App">
            {!!user ?
                (
                    <>
                        <h1>{user.username}</h1>
                        <SockJsClient
                            url={SOCKET_URL}
                            topics={["/user/" + user.username + "/queue/message"]}
                            // topics={[TOPIC]}
                            onConnect={onConnected}
                            onDisconnect={onDisconnect}
                            onMessage={msg => onMessageReceived(msg)}
                            debug={false}
                            headers={{
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            }}
                        />
                        <Messages
                            messages={messages}
                            currentUser={user}
                        />

                        <Input onSendMessage={onSendMessage} />

                    </>
                ) :

                <LoginForm onSubmit={handleLoginSubmit} />
            }

        </div>
    )
}

export default Root;
