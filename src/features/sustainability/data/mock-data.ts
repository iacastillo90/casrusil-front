/**
 * Mock Data for Sustainability Dashboard
 * Used for demo/video recording when backend is unavailable
 */

import { CarbonEmission, EcoTip, SustainabilityDashboard } from '../types/sustainability.types';

export const MOCK_EMISSIONS: CarbonEmission[] = [
    { month: 'Ene', co2: 400 },
    { month: 'Feb', co2: 300 }, // Bajando (Narrativa de mejora)
    { month: 'Mar', co2: 150 }, // IA entra en acción
];

export const MOCK_ECO_TIPS: EcoTip[] = [
    {
        id: '1',
        message: 'Detectamos 5 facturas de papel. Cámbiate a digital y ahorra 0.5kg CO2',
        severity: 'warning',
        icon: '⚠️',
    },
    {
        id: '2',
        message: 'Tu proveedor "Transportes X" tiene alta huella. Considera alternativas',
        severity: 'warning',
        icon: '⚠️',
    },
    {
        id: '3',
        message: 'Has reducido tu huella en un 62.5% en los últimos 3 meses. ¡Excelente!',
        severity: 'success',
        icon: '✅',
    },
    {
        id: '4',
        message: 'Optimiza tus rutas de entrega para reducir emisiones de transporte',
        severity: 'info',
        icon: '💡',
    },
];

export const MOCK_CARBON_SCORE = 75;

export const MOCK_SUSTAINABILITY_DASHBOARD: SustainabilityDashboard = {
    carbonScore: MOCK_CARBON_SCORE,
    scoreLevel: 'Pyme Carbono Consciente',
    monthlyEmissions: MOCK_EMISSIONS,
    ecoTips: MOCK_ECO_TIPS,
    lastUpdated: new Date().toISOString(),
};
