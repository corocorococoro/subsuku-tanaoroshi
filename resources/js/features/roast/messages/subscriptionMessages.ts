import type { SubscriptionMessage } from '../types';
import messagesData from '../data/subscriptionMessages.json';

/**
 * 個別サブスク煽りメッセージ
 * 各サブスクカードに表示する短めの煽り
 *
 * メッセージは data/subscriptionMessages.json から読み込み。
 * 新しいメッセージを追加する場合はJSONファイルを編集してください。
 *
 * 変数:
 * - {name} = サブスク名
 * - {amount} = 月額換算金額
 * - {yearlyAmount} = 年額換算金額
 * - {dailyAmount} = 日額換算金額
 */
export const subscriptionMessages: SubscriptionMessage[] =
    messagesData as SubscriptionMessage[];
