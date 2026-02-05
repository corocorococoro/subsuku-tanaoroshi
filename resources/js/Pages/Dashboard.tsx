import Modal from '@/Components/Modal';
import { GlobalRoast } from '@/features/roast/components/GlobalRoast';
import { SubscriptionRoast } from '@/features/roast/components/SubscriptionRoast';
import type { SubscriptionCategory } from '@/features/roast/types';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { CategorySummary, Subscription } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { FormEventHandler, useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

interface Props {
    monthlyTotal: number;
    yearlyTotal: number;
    totalPaid: number;
    subscriptionsByCategory: CategorySummary[];
    subscriptions: Subscription[];
    categories: string[];
    intervalMonths: number[];
}

// 落ち着いた和モダンカラーパレット
const CATEGORY_COLORS: Record<string, string> = {
    動画: '#c2410c', // 赤茶
    音楽: '#0f766e', // 緑青
    仕事: '#1e3a5f', // 紺
    学習: '#a16207', // 山吹
    ゲーム: '#9333ea', // 紫
    'クラウド/IT': '#0369a1', // 青
    生活: '#4d7c0f', // 草
    '恋愛/マッチング': '#be185d', // ピンク
    'フィットネス/健康': '#15803d', // 緑
    'ニュース/情報': '#334155', // グレー
    '推し活/ファンクラブ': '#f472b6', // ライトピンク
    '飲食/グルメ': '#f97316', // オレンジ
    ショッピング: '#eab308', // 黄色
    その他: '#64748b', // 鼠
};

const INTERVAL_LABELS: Record<number, string> = {
    1: '月額',
    2: '2ヶ月',
    3: '3ヶ月',
    4: '4ヶ月',
    6: '半年',
    12: '年額',
};

function formatYen(amount: number | undefined | null): string {
    if (amount == null) return '¥0';
    return `¥${amount.toLocaleString('ja-JP')}`;
}

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}/${day}`;
}

// サブスクリスト行
function SubscriptionRow({
    subscription,
    onEdit,
    onDelete,
}: {
    subscription: Subscription;
    onEdit: () => void;
    onDelete: () => void;
}) {
    const isCanceled = subscription.status === 'canceled';
    const color = CATEGORY_COLORS[subscription.category] || '#64748b';

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className={`group border-b border-stone-100 py-4 last:border-b-0 ${isCanceled ? 'opacity-50' : ''
                }`}
        >
            <div className="flex items-center gap-4">
                {/* カテゴリドット */}
                <div
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: color }}
                />

                {/* メイン情報 */}
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <span
                            className={`truncate text-[15px] font-medium ${isCanceled
                                    ? 'text-stone-400 line-through'
                                    : 'text-stone-800'
                                }`}
                        >
                            {subscription.name}
                        </span>
                        {isCanceled && (
                            <span className="shrink-0 text-[10px] font-medium uppercase tracking-wider text-stone-400">
                                解約
                            </span>
                        )}
                    </div>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-stone-400">
                        <span>{subscription.category}</span>
                        <span>·</span>
                        <span>{INTERVAL_LABELS[subscription.interval_months]}</span>
                        <span>·</span>
                        <span>次回 {formatDate(subscription.next_billing_on)}</span>
                    </div>
                </div>

                {/* 金額 */}
                <div className="text-right">
                    <span
                        className={`text-[15px] font-semibold tabular-nums ${isCanceled ? 'text-stone-400' : 'text-stone-800'
                            }`}
                    >
                        {formatYen(subscription.amount_yen)}
                    </span>
                    <div className="mt-0.5 text-[10px] text-stone-400">
                        累計 <span className="font-medium text-rose-500">{formatYen(subscription.total_paid)}</span>
                    </div>
                </div>

                {/* アクション */}
                <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                        onClick={onEdit}
                        className="rounded-md p-1.5 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-600"
                        title="編集"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                    </button>
                    <button
                        onClick={onDelete}
                        className="rounded-md p-1.5 text-stone-400 transition-colors hover:bg-red-50 hover:text-red-500"
                        title="削除"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* 個別煽りメッセージ（契約中のみ） */}
            {!isCanceled && (
                <div className="ml-6">
                    <SubscriptionRoast
                        name={subscription.name}
                        monthlyAmount={subscription.monthly_equiv_yen}
                        yearlyAmount={subscription.yearly_equiv_yen}
                        category={subscription.category as SubscriptionCategory}
                    />
                </div>
            )}
        </motion.div>
    );
}

// フォーム
function SubscriptionForm({
    mode,
    subscription,
    categories,
    intervalMonths,
    onClose,
}: {
    mode: 'create' | 'edit';
    subscription?: Subscription;
    categories: string[];
    intervalMonths: number[];
    onClose: () => void;
}) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: subscription?.name || '',
        amount_yen: subscription?.amount_yen?.toString() || '',
        interval_months: subscription?.interval_months?.toString() || '1',
        started_on: subscription?.started_on || '',
        next_billing_on: subscription?.next_billing_on || '',
        category: subscription?.category || categories[0],
        memo: subscription?.memo || '',
        status: subscription?.status || 'active',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (mode === 'create') {
            post(route('subscriptions.store'), {
                onSuccess: () => { reset(); onClose(); },
            });
        } else if (subscription) {
            put(route('subscriptions.update', subscription.id), {
                onSuccess: onClose,
            });
        }
    };

    const inputClass = "w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-800 placeholder:text-stone-400 focus:border-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-400";

    return (
        <form onSubmit={submit}>
            <div className="border-b border-stone-100 px-5 py-4">
                <h2 className="text-base font-semibold text-stone-900">
                    {mode === 'create' ? '新しいサブスク' : 'サブスクを編集'}
                </h2>
            </div>

            <div className="space-y-4 p-5">
                <div>
                    <label className="mb-1 block text-xs font-medium text-stone-600">
                        サービス名
                    </label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className={inputClass}
                        placeholder="Netflix"
                        required
                    />
                    {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="mb-1 block text-xs font-medium text-stone-600">
                            金額
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-stone-400">¥</span>
                            <input
                                type="number"
                                value={data.amount_yen}
                                onChange={(e) => setData('amount_yen', e.target.value)}
                                className={`${inputClass} pl-7`}
                                placeholder="980"
                                min="0"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-medium text-stone-600">
                            周期
                        </label>
                        <select
                            value={data.interval_months}
                            onChange={(e) => setData('interval_months', e.target.value)}
                            className={inputClass}
                        >
                            {intervalMonths.map((m) => (
                                <option key={m} value={m}>{INTERVAL_LABELS[m]}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="mb-1.5 block text-xs font-medium text-stone-600">
                        カテゴリ
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                        {categories.map((cat) => {
                            const isSelected = data.category === cat;
                            const color = CATEGORY_COLORS[cat] || '#64748b';
                            return (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setData('category', cat)}
                                    className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all ${isSelected
                                            ? 'text-white'
                                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                                        }`}
                                    style={isSelected ? { backgroundColor: color } : {}}
                                >
                                    {cat}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="mb-1 block text-xs font-medium text-stone-600">
                            開始日
                        </label>
                        <input
                            type="date"
                            value={data.started_on}
                            onChange={(e) => setData('started_on', e.target.value)}
                            className={inputClass}
                            required
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-medium text-stone-600">
                            次回請求日 <span className="text-stone-400">(任意)</span>
                        </label>
                        <input
                            type="date"
                            value={data.next_billing_on}
                            onChange={(e) => setData('next_billing_on', e.target.value)}
                            className={inputClass}
                        />
                    </div>
                </div>

                {mode === 'edit' && (
                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-stone-600">
                            ステータス
                        </label>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setData('status', 'active')}
                                className={`flex-1 rounded-lg border py-2 text-xs font-medium transition-all ${data.status === 'active'
                                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                        : 'border-stone-200 text-stone-500 hover:border-stone-300'
                                    }`}
                            >
                                契約中
                            </button>
                            <button
                                type="button"
                                onClick={() => setData('status', 'canceled')}
                                className={`flex-1 rounded-lg border py-2 text-xs font-medium transition-all ${data.status === 'canceled'
                                        ? 'border-stone-500 bg-stone-100 text-stone-700'
                                        : 'border-stone-200 text-stone-500 hover:border-stone-300'
                                    }`}
                            >
                                解約済
                            </button>
                        </div>
                    </div>
                )}

                <div>
                    <label className="mb-1 block text-xs font-medium text-stone-600">
                        メモ <span className="text-stone-400">(任意)</span>
                    </label>
                    <textarea
                        value={data.memo}
                        onChange={(e) => setData('memo', e.target.value)}
                        className={`${inputClass} resize-none`}
                        rows={2}
                        placeholder="プランの詳細など"
                    />
                </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-stone-100 bg-stone-50 px-5 py-3">
                <button
                    type="button"
                    onClick={onClose}
                    className="rounded-lg px-4 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-200"
                >
                    キャンセル
                </button>
                <button
                    type="submit"
                    disabled={processing}
                    className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-stone-800 disabled:opacity-50"
                >
                    {processing ? '保存中...' : mode === 'create' ? '追加' : '保存'}
                </button>
            </div>
        </form>
    );
}

// 削除確認
function DeleteConfirm({
    subscription,
    onClose,
}: {
    subscription: Subscription;
    onClose: () => void;
}) {
    const [processing, setProcessing] = useState(false);

    const handleDelete = () => {
        setProcessing(true);
        router.delete(route('subscriptions.destroy', subscription.id), {
            onSuccess: onClose,
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <div className="p-6">
            <h3 className="text-base font-semibold text-stone-900">削除の確認</h3>
            <p className="mt-2 text-sm text-stone-600">
                「<span className="font-medium">{subscription.name}</span>」を削除しますか？
            </p>
            <div className="mt-5 flex justify-end gap-2">
                <button
                    onClick={onClose}
                    className="rounded-lg px-4 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100"
                >
                    キャンセル
                </button>
                <button
                    onClick={handleDelete}
                    disabled={processing}
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                >
                    {processing ? '削除中...' : '削除'}
                </button>
            </div>
        </div>
    );
}

export default function Dashboard({
    monthlyTotal,
    yearlyTotal,
    totalPaid,
    subscriptionsByCategory,
    subscriptions,
    categories,
    intervalMonths,
}: Props) {
    const [filter, setFilter] = useState<'active' | 'canceled'>('active');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
    const [deletingSubscription, setDeletingSubscription] = useState<Subscription | null>(null);

    const filteredSubscriptions = subscriptions.filter((s) => s.status === filter);
    const activeCount = subscriptions.filter((s) => s.status === 'active').length;
    const canceledCount = subscriptions.filter((s) => s.status === 'canceled').length;

    const chartData = subscriptionsByCategory.map((cat) => ({
        ...cat,
        fill: CATEGORY_COLORS[cat.category] || '#64748b',
    }));

    return (
        <AuthenticatedLayout>
            <Head title="ダッシュボード" />

            <div className="space-y-8">
                {/* 金額サマリー */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <p className="text-xs font-medium uppercase tracking-widest text-stone-400">
                        毎月の支出
                    </p>
                    <p className="mt-2 text-5xl font-bold tabular-nums tracking-tight text-stone-900 sm:text-6xl">
                        {formatYen(monthlyTotal)}
                    </p>
                    <div className="mt-4 flex items-center justify-center gap-6 text-sm">
                        <div>
                            <span className="text-stone-400">年間</span>{' '}
                            <span className="font-semibold text-stone-700">{formatYen(yearlyTotal)}</span>
                        </div>
                        <div className="h-4 w-px bg-stone-200" />
                        <div>
                            <span className="text-stone-400">累計</span>{' '}
                            <span className="font-semibold text-rose-600">{formatYen(totalPaid)}</span>
                        </div>
                    </div>
                </motion.div>

                {/* 全体煽りメッセージ */}
                <GlobalRoast monthlyTotal={monthlyTotal} yearlyTotal={yearlyTotal} totalPaid={totalPaid} />

                {/* カテゴリ別グラフ */}
                {chartData.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="rounded-xl border border-stone-200 bg-white p-5"
                    >
                        <h2 className="mb-4 text-xs font-medium uppercase tracking-widest text-stone-400">
                            カテゴリ別
                        </h2>
                        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                            {/* 円グラフ */}
                            <div className="h-48 w-48">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={chartData}
                                            dataKey="monthlyTotal"
                                            nameKey="category"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={45}
                                            outerRadius={75}
                                            paddingAngle={2}
                                        >
                                            {chartData.map((entry, i) => (
                                                <Cell key={i} fill={entry.fill} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(v) => formatYen(Number(v))}
                                            contentStyle={{
                                                backgroundColor: '#1c1917',
                                                border: 'none',
                                                borderRadius: '8px',
                                                fontSize: '12px',
                                            }}
                                            itemStyle={{ color: '#fff' }}
                                            labelStyle={{ color: '#fff', fontWeight: 600 }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            {/* 凡例 */}
                            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 sm:flex-col sm:gap-y-1.5">
                                {chartData.map((entry) => (
                                    <div key={entry.category} className="flex items-center gap-2">
                                        <div
                                            className="h-2.5 w-2.5 shrink-0 rounded-full"
                                            style={{ backgroundColor: entry.fill }}
                                        />
                                        <span className="text-xs text-stone-600">
                                            {entry.category}
                                        </span>
                                        <span className="text-xs font-medium tabular-nums text-stone-800">
                                            {formatYen(entry.monthlyTotal)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* サブスク一覧 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                >
                    {/* ヘッダー */}
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-1 rounded-lg bg-stone-100 p-0.5">
                            <button
                                onClick={() => setFilter('active')}
                                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${filter === 'active'
                                        ? 'bg-white text-stone-900 shadow-sm'
                                        : 'text-stone-500 hover:text-stone-700'
                                    }`}
                            >
                                契約中 {activeCount > 0 && `(${activeCount})`}
                            </button>
                            <button
                                onClick={() => setFilter('canceled')}
                                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${filter === 'canceled'
                                        ? 'bg-white text-stone-900 shadow-sm'
                                        : 'text-stone-500 hover:text-stone-700'
                                    }`}
                            >
                                解約済 {canceledCount > 0 && `(${canceledCount})`}
                            </button>
                        </div>

                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="flex items-center gap-1.5 rounded-lg bg-stone-900 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-stone-800"
                        >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                            追加
                        </button>
                    </div>

                    {/* リスト */}
                    <div className="rounded-xl border border-stone-200 bg-white">
                        <AnimatePresence mode="popLayout">
                            {filteredSubscriptions.length > 0 ? (
                                <div className="divide-y divide-stone-100 px-4">
                                    {filteredSubscriptions.map((sub) => (
                                        <SubscriptionRow
                                            key={sub.id}
                                            subscription={sub}
                                            onEdit={() => setEditingSubscription(sub)}
                                            onDelete={() => setDeletingSubscription(sub)}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="py-12 text-center"
                                >
                                    <p className="text-sm text-stone-400">
                                        {filter === 'active'
                                            ? 'サブスクがありません'
                                            : '解約済みはありません'}
                                    </p>
                                    {filter === 'active' && (
                                        <button
                                            onClick={() => setShowCreateModal(true)}
                                            className="mt-3 text-sm font-medium text-stone-600 hover:text-stone-900"
                                        >
                                            + 最初のサブスクを追加
                                        </button>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>

            {/* モーダル */}
            <Modal show={showCreateModal} onClose={() => setShowCreateModal(false)} maxWidth="md">
                <SubscriptionForm
                    mode="create"
                    categories={categories}
                    intervalMonths={intervalMonths}
                    onClose={() => setShowCreateModal(false)}
                />
            </Modal>

            <Modal show={editingSubscription !== null} onClose={() => setEditingSubscription(null)} maxWidth="md">
                {editingSubscription && (
                    <SubscriptionForm
                        mode="edit"
                        subscription={editingSubscription}
                        categories={categories}
                        intervalMonths={intervalMonths}
                        onClose={() => setEditingSubscription(null)}
                    />
                )}
            </Modal>

            <Modal show={deletingSubscription !== null} onClose={() => setDeletingSubscription(null)} maxWidth="sm">
                {deletingSubscription && (
                    <DeleteConfirm
                        subscription={deletingSubscription}
                        onClose={() => setDeletingSubscription(null)}
                    />
                )}
            </Modal>
        </AuthenticatedLayout>
    );
}
