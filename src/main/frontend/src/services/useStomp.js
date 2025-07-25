import { useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export const useStomp = ({
    url,
    token,
    chatId,
    onConnect,
    onDisconnect,
    onMessage,
                        }) => {
                            
    useEffect(() => {
        if (!token || !chatId) return;

        const client = new Client({
            webSocketFactory: () => new SockJS(url),
            connectHeaders: { Authorization: `Bearer ${token}` },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            debug: str => console.log('STOMP:', str),
            onConnect: () => {
                onConnect?.(client);
                const subscription = client.subscribe(
                    `/user/${chatId}/queue/message`,
                    msg => onMessage?.(JSON.parse(msg.body))
                );
                client.subscription = subscription;
            },
            onDisconnect: () => onDisconnect?.(),
        });

        client.activate();

        return () => {
            client.subscription?.unsubscribe();
            client.deactivate();
        };
    }, [url, token, chatId, onConnect, onDisconnect, onMessage]);
};