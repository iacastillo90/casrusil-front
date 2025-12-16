export type HealthStatus = 'HEALTHY' | 'WARNING' | 'CRITICAL';

export interface GreenScore {
    score: number;          // 0-100
    level: string;          // "PYME_SOSTENIBLE"
    benefits: string[];     // ["Tasa Preferencial 0.6%"]
    eligibleForGreenRate: boolean;
}

export interface FinancialOffer {
    title: string;
    description: string;
    amount: number;
    terms: string;
    savings?: number;
    ctaAction: string;
    type: 'GREEN_CREDIT' | 'FACTORING' | 'INVESTMENT';
}

export interface RiskFactor {
    description: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface CashFlowHealth {
    status: HealthStatus;
    projectedBalance30Days: number;
    runwayEnd: string | null; // ISO Date
    greenScore: GreenScore;
    offers: FinancialOffer[];
    riskFactors: RiskFactor[];
}
