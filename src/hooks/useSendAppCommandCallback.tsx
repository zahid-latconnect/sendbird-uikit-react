import { useCallback } from 'react';

export default function useSendAppCommandCallback(userId, accessToken) {
    return useCallback((url, input, message, channelUrl) => {
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ input, message, channelUrl, userId, accessToken })
        });
    }, []);
}