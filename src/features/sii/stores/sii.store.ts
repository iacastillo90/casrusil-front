import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CAF {
    id: string;
    filename: string;
    uploadDate: string;
    type: number; // 33, 34, 61, etc.
    rangeStart: number;
    rangeEnd: number;
    currentFolio: number;
    status: 'ACTIVE' | 'EXHAUSTED' | 'EXPIRED';
}

interface SIIState {
    lastSync: string | null; // ISO Date
    syncStatus: 'IDLE' | 'SYNCING' | 'SUCCESS' | 'ERROR';
    syncError: string | null;
    cafs: CAF[];

    // Actions
    startSync: () => Promise<void>;
    addCAF: (caf: Omit<CAF, 'id' | 'uploadDate' | 'currentFolio' | 'status'>) => void;
    incrementFolio: (type: number) => void;
}

export const useSIIStore = create<SIIState>()(
    persist(
        (set, get) => ({
            lastSync: null,
            syncStatus: 'IDLE',
            syncError: null,
            cafs: [
                {
                    id: '1',
                    filename: 'F33T33.xml',
                    uploadDate: new Date().toISOString(),
                    type: 33,
                    rangeStart: 1,
                    rangeEnd: 1000,
                    currentFolio: 15,
                    status: 'ACTIVE'
                }
            ],

            startSync: async () => {
                set({ syncStatus: 'SYNCING', syncError: null });
                try {
                    // Mock API call
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    set({
                        syncStatus: 'SUCCESS',
                        lastSync: new Date().toISOString()
                    });
                } catch (error) {
                    set({
                        syncStatus: 'ERROR',
                        syncError: 'Error de conexión con SII'
                    });
                }
            },

            addCAF: (cafData) => {
                const newCAF: CAF = {
                    ...cafData,
                    id: Math.random().toString(36).substring(7),
                    uploadDate: new Date().toISOString(),
                    currentFolio: cafData.rangeStart,
                    status: 'ACTIVE'
                };
                set(state => ({ cafs: [...state.cafs, newCAF] }));
            },

            incrementFolio: (type) => {
                set(state => ({
                    cafs: state.cafs.map(caf => {
                        if (caf.type === type && caf.status === 'ACTIVE') {
                            const next = caf.currentFolio + 1;
                            return {
                                ...caf,
                                currentFolio: next,
                                status: next > caf.rangeEnd ? 'EXHAUSTED' : 'ACTIVE'
                            };
                        }
                        return caf;
                    })
                }));
            }
        }),
        {
            name: 'sii-storage',
        }
    )
);
