export interface Message {
    id: string;
    role: 'user' | 'assistant' | 'model';
    content: string;
    timestamp: Date;
    toolData?: ToolData;
}

export type ToolData =
    | { type: 'INVOICE_PREVIEW'; data: InvoicePreviewData }
    | { type: 'CHART_PREVIEW'; data: ChartPreviewData }
    | { type: 'ACTION_BUTTONS'; data: ActionButtonsData };

export interface InvoicePreviewData {
    id: string;
    folio: number;
    clientName: string;
    amount: number;
    status: 'DRAFT' | 'SENT' | 'PAID';
}

export interface ChartPreviewData {
    title: string;
    data: { name: string; value: number }[];
    type: 'bar' | 'line' | 'pie';
}

export interface ActionButtonsData {
    actions: {
        label: string;
        action: string; // URL or internal action ID
        variant?: 'default' | 'secondary' | 'outline' | 'destructive';
    }[];
}

export interface ChatState {
    isOpen: boolean;
    messages: Message[];
    isLoading: boolean;
    conversationId: string | null;
    toggleOpen: () => void;
    addMessage: (message: Message) => void;
    updateLastMessage: (content: string) => void;
    setLoading: (loading: boolean) => void;
    setConversationId: (id: string) => void;
}
