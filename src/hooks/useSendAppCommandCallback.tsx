import { useCallback } from 'react';

export default function useSendAppCommandCallback(userId, accessToken) {
    return useCallback((url, params, trigger, message, channelUrl, messageId) => {
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ params, trigger, message, channelUrl, messageId, userId, accessToken })
        });
    }, []);
}