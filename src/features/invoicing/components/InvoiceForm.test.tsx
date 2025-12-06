import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { InvoiceForm } from './InvoiceForm';

// Mock dependencies
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
    }),
}));

vi.mock('@/features/invoicing/hooks/useInvoices', () => ({
    useCreateInvoice: () => ({
        mutate: vi.fn(),
        isPending: false
    }),
}));

vi.mock('@/components/ui/use-toast', () => ({
    useToast: () => ({
        toast: vi.fn(),
    }),
}));

vi.mock('./ClientSearch', () => ({
    ClientSearch: () => <div data-testid="client-search">Client Search Mock</div>,
}));

describe('InvoiceForm', () => {
    it('renders the form correctly', () => {
        render(<InvoiceForm />);
        expect(screen.getByText('Encabezado del Documento')).toBeDefined();
        expect(screen.getByText('Cliente (Receptor)')).toBeDefined();
        expect(screen.getByText('Detalle')).toBeDefined();
    });
});
