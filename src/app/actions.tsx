'use server';

import { createAI, getMutableAIState, streamUI } from 'ai/rsc';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { ReactNode } from 'react';
// import { SalesChart } from '@/features/dashboard/components/SalesChart';
// import { RecentInvoices } from '@/features/dashboard/components/RecentInvoices';
import { SkeletonLoader } from '../components/shared/SkeletonLoader';

export interface ServerMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export interface ClientMessage {
    id: string;
    role: 'user' | 'assistant';
    display: ReactNode;
}

export async function submitUserMessage(content: string): Promise<ClientMessage> {
    'use server';

    const aiState = getMutableAIState<typeof AI>();

    aiState.update([
        ...aiState.get(),
        {
            role: 'user',
            content,
        },
    ]);

    const ui = await streamUI({
        model: google(process.env.GOOGLE_GENERATIVE_AI_MODEL || 'models/gemini-1.5-flash'),
        initial: <SkeletonLoader variant="card" rows={1} />,
        system: 'Eres un asistente financiero experto (CFO AI). Puedes mostrar gráficos y datos en tiempo real.',
        messages: [
            {
                role: 'user',
                content,
            },
        ],
        text: ({ content, done }) => {
            if (done) {
                aiState.done([
                    ...aiState.get(),
                    {
                        role: 'assistant',
                        content,
                    },
                ]);
            }
            return <div>{content}</div>;
        },
        tools: {
            show_sales_chart: {
                description: 'Muestra el gráfico de ventas del último período',
                parameters: z.object({
                    period: z.string().describe('El período a mostrar (ej: "trimestre", "año")'),
                }),
                generate: async ({ period }) => {
                    return <div>Gráfico de ventas (Simulado)</div>;
                },
            },
            show_recent_invoices: {
                description: 'Muestra la lista de facturas recientes',
                parameters: z.object({
                    limit: z.number().optional().describe('Número de facturas a mostrar'),
                }),
                generate: async ({ limit }) => {
                    return <div>Lista de facturas (Simulada)</div>;
                },
            },
        },
    });

    return {
        id: uuidv4(),
        role: 'assistant',
        display: ui.value,
    };
}

export const AI = createAI<ServerMessage[], ClientMessage[]>({
    actions: {
        submitUserMessage,
    },
    initialUIState: [],
    initialAIState: [],
});
