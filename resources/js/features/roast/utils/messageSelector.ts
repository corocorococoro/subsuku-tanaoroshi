import type {
    GlobalMessage,
    MessagePriority,
    MessageVariables,
    SubscriptionCategory,
    SubscriptionMessage,
} from '../types';
import { calculateAllComparisons } from '../messages/comparisons';
import { globalMessages } from '../messages/globalMessages';
import { subscriptionMessages } from '../messages/subscriptionMessages';

const STORAGE_KEY_PREFIX = 'roast_used_';

/**
 * セッション内で使用済みのメッセージIDを取得
 */
export function getUsedMessageIds(
    category: 'global' | 'subscription'
): string[] {
    if (typeof window === 'undefined') return [];
    const stored = sessionStorage.getItem(`${STORAGE_KEY_PREFIX}${category}`);
    return stored ? JSON.parse(stored) : [];
}

/**
 * メッセージを使用済みとしてマーク
 */
export function markMessageAsUsed(
    category: 'global' | 'subscription',
    id: string
): void {
    if (typeof window === 'undefined') return;
    const used = getUsedMessageIds(category);
    if (!used.includes(id)) {
        used.push(id);
        sessionStorage.setItem(
            `${STORAGE_KEY_PREFIX}${category}`,
            JSON.stringify(used)
        );
    }
}

/**
 * 使用済みメッセージをリセット
 */
export function resetUsedMessages(category: 'global' | 'subscription'): void {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(`${STORAGE_KEY_PREFIX}${category}`);
}

/**
 * 優先度による重み付け
 */
const PRIORITY_WEIGHTS: Record<MessagePriority, number> = {
    low: 1,
    medium: 2,
    high: 3,
    critical: 4,
};

/**
 * 優先度による重み付けランダム選択
 */
export function weightedRandomSelect<T extends { priority: MessagePriority }>(
    items: T[]
): T | null {
    if (items.length === 0) return null;

    const totalWeight = items.reduce(
        (sum, item) => sum + (PRIORITY_WEIGHTS[item.priority] || 1),
        0
    );
    let random = Math.random() * totalWeight;

    for (const item of items) {
        random -= PRIORITY_WEIGHTS[item.priority] || 1;
        if (random <= 0) return item;
    }

    return items[0];
}

/**
 * テンプレート文字列の変数を置換
 */
export function interpolateMessage(
    template: string,
    variables: MessageVariables
): string {
    return template.replace(/\{(\w+)\}/g, (_, key) => {
        const value = variables[key as keyof MessageVariables];
        if (value === undefined) return `{${key}}`;
        if (typeof value === 'number') {
            return value.toLocaleString('ja-JP');
        }
        return String(value);
    });
}

/**
 * 全体煽りメッセージを選択
 */
export function selectGlobalMessage(
    monthlyTotal: number,
    yearlyTotal: number,
    totalPaid: number
): { message: GlobalMessage; formatted: string } | null {
    // 金額帯でフィルタ
    const eligible = globalMessages.filter((m) => {
        // 0円（サブスク未登録/全解約）の場合、0円専用メッセージ(maxMonthly: 0)のみを表示
        if (monthlyTotal === 0) {
            return m.maxMonthly === 0;
        }

        // 通常時は0円専用メッセージを表示しない
        if (m.maxMonthly === 0) {
            return false;
        }

        if (m.minMonthly !== undefined && monthlyTotal < m.minMonthly)
            return false;
        if (m.maxMonthly !== undefined && monthlyTotal > m.maxMonthly)
            return false;
        return true;
    });

    if (eligible.length === 0) return null;

    // セッション内で使用済みを除外
    const usedIds = getUsedMessageIds('global');
    let candidates = eligible.filter((m) => !usedIds.includes(m.id));

    // 全て使用済みならリセット
    if (candidates.length === 0) {
        resetUsedMessages('global');
        candidates = eligible;
    }

    // 重み付けランダム選択
    const selected = weightedRandomSelect(candidates);
    if (!selected) return null;

    // 使用済みとしてマーク
    markMessageAsUsed('global', selected.id);

    // 変数を計算して置換
    const comparisons = calculateAllComparisons(monthlyTotal, yearlyTotal);
    const variables: MessageVariables = {
        monthlyTotal,
        yearlyTotal,
        totalPaid,
        ...comparisons,
    };

    return {
        message: selected,
        formatted: interpolateMessage(selected.template, variables),
    };
}

/**
 * 個別サブスク煽りメッセージを選択
 */
export function selectSubscriptionMessage(
    name: string,
    monthlyAmount: number,
    yearlyAmount: number,
    category: SubscriptionCategory
): { message: SubscriptionMessage; formatted: string } | null {
    // カテゴリと金額帯でフィルタ
    const eligible = subscriptionMessages.filter((m) => {
        // カテゴリ制限がある場合はチェック
        if (m.categories && !m.categories.includes(category)) return false;
        // 金額制限
        if (m.minMonthly !== undefined && monthlyAmount < m.minMonthly)
            return false;
        if (m.maxMonthly !== undefined && monthlyAmount > m.maxMonthly)
            return false;
        return true;
    });

    if (eligible.length === 0) return null;

    // セッション内で使用済みを除外
    const usedIds = getUsedMessageIds('subscription');
    let candidates = eligible.filter((m) => !usedIds.includes(m.id));

    // 全て使用済みならリセット
    if (candidates.length === 0) {
        resetUsedMessages('subscription');
        candidates = eligible;
    }

    // 重み付けランダム選択
    const selected = weightedRandomSelect(candidates);
    if (!selected) return null;

    // 使用済みとしてマーク
    markMessageAsUsed('subscription', selected.id);

    // 変数を計算して置換
    const dailyAmount = Math.round(monthlyAmount / 30);
    const variables: MessageVariables = {
        name,
        amount: monthlyAmount,
        yearlyAmount,
        dailyAmount,
    };

    return {
        message: selected,
        formatted: interpolateMessage(selected.template, variables),
    };
}
