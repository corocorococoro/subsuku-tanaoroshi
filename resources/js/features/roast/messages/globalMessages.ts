import type { GlobalMessage } from '../types';
import messagesData from '../data/globalMessages.json';

/**
 * 全体煽りメッセージ（ダッシュボード上部用）
 * 150〜400文字程度のエッセイ形式。ストーリー性・共感性のある長文。
 *
 * メッセージは data/globalMessages.json から読み込み。
 * 新しいメッセージを追加する場合はJSONファイルを編集してください。
 *
 * 変数:
 * - {monthlyTotal} = 月額合計
 * - {yearlyTotal} = 年額合計
 * - {totalPaid} = 累計支払額
 */
export const globalMessages: GlobalMessage[] = messagesData as GlobalMessage[];
