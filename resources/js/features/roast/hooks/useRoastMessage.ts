import { useCallback, useEffect, useState } from 'react';
import type { SubscriptionCategory } from '../types';
import {
    selectGlobalMessage,
    selectSubscriptionMessage,
} from '../utils/messageSelector';

interface UseGlobalRoastOptions {
    monthlyTotal: number;
    yearlyTotal: number;
    totalPaid: number;
}

interface UseGlobalRoastResult {
    message: string | null;
    refresh: () => void;
}

/**
 * 全体煽りメッセージを管理するHook
 */
export function useGlobalRoast({
    monthlyTotal,
    yearlyTotal,
    totalPaid,
}: UseGlobalRoastOptions): UseGlobalRoastResult {
    const [message, setMessage] = useState<string | null>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        const result = selectGlobalMessage(monthlyTotal, yearlyTotal, totalPaid);
        setMessage(result?.formatted ?? null);
    }, [monthlyTotal, yearlyTotal, totalPaid, refreshTrigger]);

    const refresh = useCallback(() => {
        setRefreshTrigger((n) => n + 1);
    }, []);

    return { message, refresh };
}

interface UseSubscriptionRoastOptions {
    name: string;
    monthlyAmount: number;
    yearlyAmount: number;
    category: SubscriptionCategory;
}

interface UseSubscriptionRoastResult {
    message: string | null;
    refresh: () => void;
}

/**
 * 個別サブスク煽りメッセージを管理するHook
 */
export function useSubscriptionRoast({
    name,
    monthlyAmount,
    yearlyAmount,
    category,
}: UseSubscriptionRoastOptions): UseSubscriptionRoastResult {
    const [message, setMessage] = useState<string | null>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        const result = selectSubscriptionMessage(
            name,
            monthlyAmount,
            yearlyAmount,
            category
        );
        setMessage(result?.formatted ?? null);
    }, [name, monthlyAmount, yearlyAmount, category, refreshTrigger]);

    const refresh = useCallback(() => {
        setRefreshTrigger((n) => n + 1);
    }, []);

    return { message, refresh };
}
