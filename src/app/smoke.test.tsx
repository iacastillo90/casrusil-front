import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import DashboardPage from './(dashboard)/page';
import { AiDrawer } from '@/features/ai-assistant/components/AiDrawer';
import { Providers } from '@/components/providers';

// Mock Vercel AI SDK
vi.mock('ai/rsc', () => ({
    useUIState: () => [[], vi.fn()],
    useActions: () => ({ submitUserMessage: vi.fn() }),
    createAI: ({ children }: any) => <>{children}</>,
}));

// Mock Server Actions
vi.mock('./actions', () => ({
    AI: ({ children }: any) => <>{children}</>,
}));

// Mock Sonner
vi.mock('sonner', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
    Toaster: () => null,
}));

// Mock ResizeObserver (needed for some UI components)
global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));

// Mock Recharts (ResponsiveContainer needs width/height)
vi.mock('recharts', async () => {
    const Original = await vi.importActual('recharts');
    return {
        ...Original,
        ResponsiveContainer: ({ children }: any) => <div style={{ width: 500, height: 300 }}>{children}</div>,
    };
});

describe('Final Smoke Test', () => {
    it('renders the Dashboard Page without crashing', () => {
        render(
            <Providers>
                <DashboardPage />
            </Providers>
        );
        expect(screen.getByText('Dashboard')).toBeDefined();
        expect(screen.getByText('Resumen de tu situación financiera y contable')).toBeDefined();
    });

    it('renders the AI Drawer (Chat) without crashing', () => {
        render(
            <Providers>
                <AiDrawer />
            </Providers>
        );
        // The drawer is closed by default, but the component should mount
        // We can check if the "Preguntar sobre esta página" button exists in the DOM (even if hidden/inside sheet)
        // Or we can just verify it doesn't throw.
        // Shadcn Sheet might not render content until open.
        // Let's just verify it renders without error.
    });
});
