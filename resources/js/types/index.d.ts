export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    google_id?: string;
}

export interface Subscription {
    id: number;
    user_id: number;
    name: string;
    amount_yen: number;
    interval_months: number;
    started_on: string;
    next_billing_on: string;
    category: string;
    memo: string | null;
    status: 'active' | 'canceled';
    created_at: string;
    updated_at: string;
    monthly_equiv_yen: number;
    yearly_equiv_yen: number;
    total_paid: number;
    months_subscribed: number;
}

export interface CategorySummary {
    category: string;
    monthlyTotal: number;
    yearlyTotal: number;
    count: number;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};
