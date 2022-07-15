import { useCallback } from 'react';

export default function useSendAppCommandCallback(userId, accessToken) {
    return useCallback((url, params, command, message, channelUrl) => {
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ params, command, message, channelUrl, userId, accessToken })
        });
    }, []);
}