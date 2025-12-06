import { create } from 'zustand';
import { ChatState, Message } from '../types/ai.types';

export const useChatStore = create<ChatState>((set) => ({
    isOpen: false,
    messages: [],
    isLoading: false,
    toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
    addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
    updateLastMessage: (content) => set((state) => {
        const messages = [...state.messages];
        const lastMessage = messages[messages.length - 1];
        if (lastMessage) {
            lastMessage.content = content;
        }
        return { messages };
    }),
    setLoading: (loading) => set({ isLoading: loading }),
    conversationId: null,
    setConversationId: (id) => set({ conversationId: id }),
}));
