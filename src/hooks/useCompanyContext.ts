import { useAuthStore } from "@/features/auth/stores/auth.store";

export const useCompanyContext = () => {
    const { companyId, companies, switchCompany } = useAuthStore();

    const currentCompany = companies.find(c => c.id === companyId);

    return {
        companyId,
        currentCompany,
        companies,
        switchCompany,
        isLoading: false // Could be connected to a loading state if needed
    };
};
