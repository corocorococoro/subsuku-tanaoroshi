/**
 * 日付文字列をYYYY-MM-DD形式に変換するヘルパー関数
 * ISO 8601形式、YYYY-MM-DD形式、Dateオブジェクト、null/undefinedに対応
 * <input type="date"> の値として使用するために設計されています
 */
export function formatDateForInput(dateValue: string | Date | null | undefined): string {
    if (!dateValue) {
        return '';
    }

    // すでにYYYY-MM-DD形式の場合はそのまま返す
    if (typeof dateValue === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
        return dateValue;
    }

    // ISO 8601形式や他の日付文字列をパース
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) {
        return '';
    }

    // YYYY-MM-DD形式で返す（ローカルタイムゾーンで）
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
