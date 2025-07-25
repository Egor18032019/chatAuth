import { useRef, useCallback } from 'react';
//  очередь сообщений
export const useChatQueue = () => {
    const queueRef = useRef([]);

    const add = useCallback(msg => queueRef.current.push(msg), []);
    const flush = useCallback(() => {
        const items = [...queueRef.current];
        queueRef.current = [];
        return items;
    }, []);

    return { queue: queueRef.current, add, flush };
};