import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useEffect, useRef } from 'react';

// Mock API response for notifications
const fetchNotifications = async () => {
    // In a real app, this would be an API call
    // Here we simulate random events
    const random = Math.random();
    if (random > 0.7) {
        return [
            {
                id: Date.now().toString(),
                title: 'Alerta de Auditoría',
                message: 'Se ha detectado una discrepancia en el Libro Diario.',
                type: 'error',
                timestamp: new Date(),
            }
        ];
    } else if (random > 0.9) {
        return [
            {
                id: Date.now().toString(),
                title: 'Sincronización SII',
                message: 'Nuevos DTEs recibidos correctamente.',
                type: 'success',
                timestamp: new Date(),
            }
        ];
    }
    return [];
};

export function useRealtimeNotifications() {
    const lastNotificationId = useRef<string | null>(null);

    const { data } = useQuery({
        queryKey: ['notifications', 'realtime'],
        queryFn: fetchNotifications,
        refetchInterval: 10000, // Poll every 10 seconds
        refetchIntervalInBackground: true,
    });

    useEffect(() => {
        if (data && data.length > 0) {
            const latest = data[0];
            if (latest.id !== lastNotificationId.current) {
                lastNotificationId.current = latest.id;

                if (latest.type === 'error') {
                    toast.error(latest.title, {
                        description: latest.message,
                        duration: 5000,
                    });
                } else {
                    toast.success(latest.title, {
                        description: latest.message,
                        duration: 5000,
                    });
                }
            }
        }
    }, [data]);
}
