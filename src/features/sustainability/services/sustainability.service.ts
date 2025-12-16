/**
 * Sustainability API Service
 * Handles communication with backend sustainability endpoints
 */

import { apiClient } from '@/lib/axios';
import { API_ENDPOINTS } from '@/config/routes';
import { SustainabilityDashboard, EcoTip } from '../types/sustainability.types';
import { MOCK_SUSTAINABILITY_DASHBOARD, MOCK_ECO_TIPS } from '../data/mock-data';

export const sustainabilityService = {
    /**
     * Fetch carbon footprint summary and dashboard data
     * Falls back to mock data if backend is unavailable
     */
    getCarbonFootprintSummary: async (): Promise<SustainabilityDashboard> => {
        // DEMO MODE: Return mock data immediately to avoid backend timeout
        // Remove this when real backend is ready
        return MOCK_SUSTAINABILITY_DASHBOARD;

        /* 
        try {
            const { data } = await apiClient.get<SustainabilityDashboard>(
                API_ENDPOINTS.SUSTAINABILITY.DASHBOARD
            );
            return data;
        } catch (error) {
            console.warn('Backend unavailable, using mock sustainability data:', error);
            // Fallback to mock data for demo purposes
            return MOCK_SUSTAINABILITY_DASHBOARD;
        }
        */
    },

    /**
     * Fetch AI-powered eco tips and recommendations
     * Falls back to mock data if backend is unavailable
     */
    getEcoTips: async (): Promise<EcoTip[]> => {
        // DEMO MODE: Return mock data immediately
        return MOCK_ECO_TIPS;

        /*
        try {
            const { data } = await apiClient.get<EcoTip[]>(
                API_ENDPOINTS.SUSTAINABILITY.ECO_TIPS
            );
            return data;
        } catch (error) {
            console.warn('Backend unavailable, using mock eco tips:', error);
            // Fallback to mock data for demo purposes
            return MOCK_ECO_TIPS;
        }
        */
    },
};
