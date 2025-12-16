import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export const usePushNotifications = () => {
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        let eventSource: EventSource | null = null;

        // Check if user has granted permission for browser notifications involved? 
        // For now, we simulate in-app toast notifications stream.

        const connect = () => {
            // Ideally should check auth state before connecting
            // const token = Cookies.get('token'); 
            // const url = new URL('http://localhost:8080/api/v1/notifications/stream');
            // url.searchParams.append('token', token);

            // Mocking the connection for now as backend might mock it too or it's behind auth
            console.log("Connecting to Notification Stream...");
            setIsConnected(true);

            // In a real implementation:
            /*
            eventSource = new EventSourceWithAuth('/notifications/stream');
            
            eventSource.onopen = () => {
                setIsConnected(true);
            };

            eventSource.onmessage = (event) => {
                const data = JSON.parse(event.data);
                toast(data.title, {
                    description: data.message,
                    // action: ...
                });
            };

            eventSource.onerror = () => {
                setIsConnected(false);
                eventSource?.close();
            };
            */
        };

        connect();

        return () => {
            if (eventSource) {
                eventSource.close();
            }
            setIsConnected(false);
        };
    }, []);

    return { isConnected };
};
