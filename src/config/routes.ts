export const APP_ROUTES = {
    PUBLIC: {
        LOGIN: '/login',
        REGISTER: '/register',
    },
    PROTECTED: {
        DASHBOARD: '/dashboard',
        INVOICES: {
            LIST: '/invoices',
            NEW: '/invoices/new',
            DETAIL: (id: string) => `/invoices/${id}`,
        },
    },
} as const;

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
    },
    INVOICES: {
        BASE: '/invoices',
        IMPORT: '/invoices/import',
        SEND: (id: string) => `/invoices/${id}/send`,
    },
    FEES: {
        BASE: '/fees',
        IMPORT: '/fees/import',
    },
    COMPLIANCE: {
        DJ1879: (year: number) => `/compliance/dj1879/${year}`,
    },
    SUSTAINABILITY: {
        DASHBOARD: '/sustainability/dashboard',
        ECO_TIPS: '/sustainability/eco-tips',
    },
} as const;
