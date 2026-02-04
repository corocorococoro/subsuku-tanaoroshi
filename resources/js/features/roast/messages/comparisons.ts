import type { ComparisonItem } from '../types';

/**
 * 金額換算のための比較対象データ
 * 煽りメッセージで「ラテ○杯分」などの表現に使用
 */
export const comparisons: Record<string, ComparisonItem> = {
    latte: { name: 'ラテ', price: 500, unit: '杯' },
    ramen: { name: 'ラーメン', price: 900, unit: '杯' },
    lunch: { name: 'ランチ', price: 1000, unit: '食' },
    netflix: { name: 'Netflix', price: 790, unit: 'ヶ月分' },
    manga: { name: '漫画', price: 500, unit: '冊' },
    onigiri: { name: 'おにぎり', price: 130, unit: '個' },
    beer: { name: 'ビール', price: 250, unit: '本' },
    coffee: { name: 'コンビニコーヒー', price: 120, unit: '杯' },
};

/**
 * 金額を指定した比較対象で換算
 * @param amount 金額（円）
 * @param key 比較対象のキー
 * @returns 換算した数量（切り捨て）
 */
export function calculateComparison(
    amount: number,
    key: keyof typeof comparisons
): number {
    const item = comparisons[key];
    if (!item) return 0;
    return Math.floor(amount / item.price);
}

/**
 * 全ての換算値を計算してオブジェクトで返す
 * @param monthlyAmount 月額金額（円）
 * @param yearlyAmount 年額金額（円）
 */
export function calculateAllComparisons(
    monthlyAmount: number,
    yearlyAmount: number
): {
    latteCount: number;
    ramenCount: number;
    lunchCount: number;
    mangaCount: number;
    tenYearTotal: number;
} {
    return {
        latteCount: calculateComparison(monthlyAmount, 'latte'),
        ramenCount: calculateComparison(monthlyAmount, 'ramen'),
        lunchCount: calculateComparison(monthlyAmount, 'lunch'),
        mangaCount: calculateComparison(monthlyAmount, 'manga'),
        tenYearTotal: yearlyAmount * 10,
    };
}
