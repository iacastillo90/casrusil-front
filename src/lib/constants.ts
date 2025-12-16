export const API_ROUTES = {
    // Auth
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',

    // Users
    USERS: '/users',
    USER_BY_ID: (id: string) => `/users/${id}`,

    // Invoices
    INVOICES: '/invoices',
    INVOICE_BY_ID: (id: string) => `/invoices/${id}`,
    INVOICE_SEND: (id: string) => `/invoices/${id}/send`,

    // SII
    SII_FETCH_RCV: '/sii/ops/fetch-rcv',
    SII_UPLOAD_CAF: '/sii/caf',
    SII_SEND_DTE: '/sii/dte/send',

    // Accounting
    ACCOUNTING_ENTRIES: '/accounting/entries',
    ACCOUNTING_ACCOUNTS: '/accounting/accounts',
    ACCOUNTING_F29: '/accounting/f29',
    ACCOUNTING_BALANCE: '/accounting/balance-sheet',
    ACCOUNTING_AUDIT: '/accounting/audit',
    ACCOUNTING_CLOSE_PERIOD: '/accounting/periods/close',
    ACCOUNTING_CORRECT_ENTRY: '/accounting/entries/correct',

    // Banking
    BANK_UPLOAD: '/bank/upload',
    BANK_RECONCILIATION: '/bank/reconciliation',
    BANK_RECONCILE: '/bank/reconcile',

    // AI
    AI_CHAT: '/ai/chat',
} as const;

export const APP_ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    DASHBOARD: '/dashboard',

    // Invoices
    INVOICES: '/invoices',
    INVOICES_NEW: '/invoices/new',
    INVOICE_DETAIL: (id: string) => `/invoices/${id}`,

    // Accounting
    ACCOUNTING_LEDGER: '/accounting/ledger',
    ACCOUNTING_F29: '/accounting/f29',
    ACCOUNTING_BALANCE: '/accounting/balance',
    ACCOUNTING_INCOME: '/accounting/income',
    ACCOUNTING_AUDIT: '/accounting/audit',

    // SII
    SII_SYNC: '/sii', // Mapped to main SII page
    SII_CAF: '/sii/caf',  // Mapped to CAF page

    // Banking
    BANKING_RECONCILIATION: '/treasury', // Mapped to Treasury page

    // Settings
    SETTINGS_COMPANY: '/settings',
    SETTINGS_USERS: '/settings',
} as const;

export const QUERY_KEYS = {
    // Auth
    CURRENT_USER: ['auth', 'current-user'],
    COMPANIES: ['auth', 'companies'],

    // Invoices
    INVOICES: ['invoices'],
    INVOICES_FILTERED: (filters: any) => ['invoices', 'filtered', filters],
    INVOICE_DETAIL: (id: string) => ['invoices', id],

    // Accounting
    ACCOUNTING_ENTRIES: ['accounting', 'entries'],
    ACCOUNTING_ACCOUNTS: ['accounting', 'accounts'],
    ACCOUNTING_F29: (period: string) => ['accounting', 'f29', period],
    ACCOUNTING_BALANCE: (date: string) => ['accounting', 'balance', date],
    ACCOUNTING_AUDIT: ['accounting', 'audit'],

    // Banking
    BANK_RECONCILIATION: (period: string) => ['bank', 'reconciliation', period],

    // SII
    SII_STATUS: ['sii', 'status'],

    // AI
    AI_CONVERSATION: (id: string) => ['ai', 'conversation', id],
} as const;

export const ROLES = {
    ADMIN: 'ADMIN',
    ACCOUNTANT: 'ACCOUNTANT',
    USER: 'USER',
} as const;

export const INVOICE_TYPES = {
    FACTURA_ELECTRONICA: 33,
    FACTURA_EXENTA: 34,
    BOLETA_ELECTRONICA: 39,
    NOTA_CREDITO: 61,
    NOTA_DEBITO: 56,
} as const;

export const DTE_STATUS = {
    DRAFT: 'DRAFT',
    SIGNED: 'SIGNED',
    SENT: 'SENT',
    ACCEPTED: 'ACCEPTED',
    REJECTED: 'REJECTED',
} as const;

export const IVA_RATE = 0.19; // 19%
