/**
 * Sustainability Zustand Store
 * Global state management for carbon footprint and eco-insights
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SustainabilityState } from '../types/sustainability.types';
import { sustainabilityService } from '../services/sustainability.service';

interface SustainabilityActions {
    fetchSustainabilityData: () => Promise<void>;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
}

type SustainabilityStore = SustainabilityState & SustainabilityActions;

export const useSustainabilityStore = create<SustainabilityStore>()(
    persist(
        (set) => ({
            // Initial state
            carbonScore: 0,
            scoreLevel: 'Pyme en Transición',
            monthlyEmissions: [],
            ecoTips: [],
            isLoading: false,
            error: null,
            lastUpdated: null,

            // Actions
            fetchSustainabilityData: async () => {
                set({ isLoading: true, error: null });
                try {
                    const data = await sustainabilityService.getCarbonFootprintSummary();
                    set({
                        carbonScore: data.carbonScore,
                        scoreLevel: data.scoreLevel,
                        monthlyEmissions: data.monthlyEmissions,
                        ecoTips: data.ecoTips,
                        lastUpdated: data.lastUpdated || new Date().toISOString(),
                        isLoading: false,
                    });
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Failed to fetch sustainability data',
                        isLoading: false,
                    });
                }
            },

            setLoading: (loading) => set({ isLoading: loading }),
            setError: (error) => set({ error }),
        }),
        {
            name: 'sustainability-storage',
            // Only persist the data, not loading/error states
            partialize: (state) => ({
                carbonScore: state.carbonScore,
                scoreLevel: state.scoreLevel,
                monthlyEmissions: state.monthlyEmissions,
                ecoTips: state.ecoTips,
                lastUpdated: state.lastUpdated,
            }),
        }
    )
);
