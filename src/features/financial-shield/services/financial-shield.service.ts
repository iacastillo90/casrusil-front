import { apiClient } from '@/lib/axios';
import { CashFlowHealth } from '../types/financial-shield.types';

export const financialShieldService = {
    getHealth: async (): Promise<CashFlowHealth> => {
        // En producción: llamada real a la API
        // const { data } = await apiClient.get<CashFlowHealth>('/financial-shield/health');
        // return data;

        // MOCK PARA VIDEO DEMO (Garantiza que funcione perfecto en la grabación)
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    status: 'CRITICAL', // Cambiar a 'HEALTHY' para mostrar el otro estado
                    projectedBalance30Days: -3500000,
                    runwayEnd: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 días
                    greenScore: {
                        score: 85,
                        level: "PYME_SOSTENIBLE",
                        benefits: ["Acceso a Crédito Verde CORFO", "Tasa Preferencial 0.6%"],
                        eligibleForGreenRate: true
                    },
                    riskFactors: [
                        { description: "Cliente principal 'Constructora X' entró en Dicom", severity: "HIGH" },
                        { description: "Baja liquidez proyectada para pago de IVA", severity: "CRITICAL" }
                    ],
                    offers: [
                        {
                            title: "🌱 Crédito Verde CORFO",
                            description: "Tu Pasaporte Verde desbloqueó tasa preferencial 0.65% vs 1.5% tradicional",
                            amount: 3500000,
                            terms: "Tasa 0.65% mensual",
                            savings: 150000,
                            ctaAction: "ACTION_APPLY_GREEN",
                            type: 'GREEN_CREDIT'
                        }
                    ]
                });
            }, 800);
        });
    }
};
