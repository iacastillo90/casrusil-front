import { useChatStore } from '../stores/chat.store';
import { aiService } from '../services/ai.service';
import { Message } from '../types/ai.types';

export const useChat = () => {
    const { messages, addMessage, isLoading, setLoading, isOpen, toggleOpen, conversationId, setConversationId } = useChatStore();

    const sendMessage = async (content: string) => {
        if (!content.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content,
            timestamp: new Date(),
        };

        try {
            addMessage(userMessage);
            setLoading(true);

            let activeId = conversationId;
            if (!activeId) {
                activeId = await aiService.startConversation();
                setConversationId(activeId);
            }

            const response = await aiService.sendMessage(content, activeId);
            addMessage(response);

        } catch (error) {
            console.error('Error sending message:', error);
            // toast.error('Error conectando con el asistente');
        } finally {
            setLoading(false);
        }
    };

    return {
        messages,
        sendMessage,
        isLoading,
        isOpen,
        toggleOpen
    };
};
