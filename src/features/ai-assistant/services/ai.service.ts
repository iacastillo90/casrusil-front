import { apiClient } from '@/lib/axios';
import { Message } from '../types/ai.types';

export const aiService = {
    startConversation: async (): Promise<string> => {
        const { data } = await apiClient.post<{ id: string }>('/ai/conversations');
        return data.id;
    },

    sendMessage: async (content: string, conversationId: string): Promise<Message> => {
        const { data } = await apiClient.post<Message>(
            `/ai/conversations/${conversationId}/messages`,
            { content }
        );
        return data;
    }
};
