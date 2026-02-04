/**
 * 煽りメッセージ機能の型定義
 */

/** メッセージの優先度（高額帯ほど辛辣なメッセージが出やすい） */
export type MessagePriority = 'low' | 'medium' | 'high' | 'critical';

/** 全体煽りメッセージの定義 */
export interface GlobalMessage {
    id: string;
    /** テンプレート文字列。変数: {monthlyTotal}, {yearlyTotal}, {latteCount}, {ramenCount}, {lunchCount}, {mangaCount}, {tenYearTotal} */
    template: string;
    /** この金額以上で表示（円/月） */
    minMonthly?: number;
    /** この金額以下で表示（円/月） */
    maxMonthly?: number;
    /** 優先度（高いほど選ばれやすい） */
    priority: MessagePriority;
}

/** サブスクのカテゴリ */
export type SubscriptionCategory =
    | '動画'
    | '音楽'
    | '仕事'
    | '学習'
    | 'ゲーム'
    | 'クラウド/IT'
    | '生活'
    | 'その他';

/** 個別サブスク煽りメッセージの定義 */
export interface SubscriptionMessage {
    id: string;
    /** テンプレート文字列。変数: {name}, {amount}, {yearlyAmount}, {months}, {totalPaid}, {dailyAmount} */
    template: string;
    /** 対象カテゴリ（指定しない場合は全カテゴリ対象） */
    categories?: SubscriptionCategory[];
    /** この金額以上で表示（円/月換算） */
    minMonthly?: number;
    /** この金額以下で表示（円/月換算） */
    maxMonthly?: number;
    /** 優先度 */
    priority: MessagePriority;
}

/** 金額換算の比較対象 */
export interface ComparisonItem {
    name: string;
    price: number;
    unit: string;
}

/** メッセージ変数の置換用データ */
export interface MessageVariables {
    monthlyTotal?: number;
    yearlyTotal?: number;
    name?: string;
    amount?: number;
    yearlyAmount?: number;
    months?: number;
    totalPaid?: number;
    dailyAmount?: number;
    // 換算値（自動計算）
    latteCount?: number;
    ramenCount?: number;
    lunchCount?: number;
    mangaCount?: number;
    tenYearTotal?: number;
}
