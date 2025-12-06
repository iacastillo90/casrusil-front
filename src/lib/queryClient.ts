import { QueryClient, DefaultOptions } from '@tanstack/react-query';

const queryConfig: DefaultOptions = {
    queries: {
        staleTime: 60 * 1000, // 1 minute
        gcTime: 5 * 60 * 1000, // 5 minutes (antes cacheTime)
        retry: 1,
        refetchOnWindowFocus: false,
    },
    mutations: {
        retry: 0,
    },
};

export const queryClient = new QueryClient({
    defaultOptions: queryConfig,
});
