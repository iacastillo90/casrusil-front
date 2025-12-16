import axios from "@/lib/axios";

export interface EconomicIndicators {
    uf: number;
    usd: number;
    utm: number;
    source: string;
}

export const indicatorsService = {
    getTodayIndicators: async (): Promise<EconomicIndicators> => {
        try {
            const response = await axios.get<EconomicIndicators>("/integration/indicators/today");
            return response.data;
        } catch (error) {
            console.error("Error fetching economic indicators:", error);
            throw error;
        }
    }
};
