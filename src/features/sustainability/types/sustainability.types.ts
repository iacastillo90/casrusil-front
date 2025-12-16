/**
 * Sustainability Feature Types
 * Data structures for carbon footprint tracking and eco-insights
 */

export interface CarbonEmission {
    month: string;
    co2: number; // in kgCO2
}

export type EcoTipSeverity = 'info' | 'warning' | 'success';

export interface EcoTip {
    id: string;
    message: string;
    severity: EcoTipSeverity;
    icon?: string;
}

export type EcoScoreLevel =
    | 'Pyme Carbono Neutral'
    | 'Pyme Carbono Consciente'
    | 'Pyme en Transición'
    | 'Alto Impacto';

export interface SustainabilityDashboard {
    carbonScore: number; // 0-100
    scoreLevel: EcoScoreLevel;
    monthlyEmissions: CarbonEmission[];
    ecoTips: EcoTip[];
    lastUpdated?: string;
}

export interface SustainabilityState {
    carbonScore: number;
    scoreLevel: EcoScoreLevel;
    monthlyEmissions: CarbonEmission[];
    ecoTips: EcoTip[];
    isLoading: boolean;
    error: string | null;
    lastUpdated: string | null;
}
