import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface BankLine {
    id: string;
    date: string;
    description: string;
    amount: number;
    reference?: string;
    status: 'PENDING' | 'MATCHED';
    matchedEntryId?: string;
}

interface TreasuryState {
    bankLines: BankLine[];

    // Actions
    addBankLines: (lines: Omit<BankLine, 'id' | 'status'>[]) => void;
    matchLine: (lineId: string, entryId: string) => void;
    unmatchLine: (lineId: string) => void;
}

export const useTreasuryStore = create<TreasuryState>()(
    persist(
        (set) => ({
            bankLines: [],

            addBankLines: (lines) => {
                const newLines = lines.map(line => ({
                    ...line,
                    id: Math.random().toString(36).substring(7),
                    status: 'PENDING' as const
                }));
                set(state => ({ bankLines: [...state.bankLines, ...newLines] }));
            },

            matchLine: (lineId, entryId) => {
                set(state => ({
                    bankLines: state.bankLines.map(line =>
                        line.id === lineId
                            ? { ...line, status: 'MATCHED', matchedEntryId: entryId }
                            : line
                    )
                }));
            },

            unmatchLine: (lineId) => {
                set(state => ({
                    bankLines: state.bankLines.map(line =>
                        line.id === lineId
                            ? { ...line, status: 'PENDING', matchedEntryId: undefined }
                            : line
                    )
                }));
            }
        }),
        {
            name: 'treasury-storage',
        }
    )
);
