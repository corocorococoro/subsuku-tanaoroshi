import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Subscription } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface Props {
    subscription: Subscription;
    categories: string[];
    intervalMonths: number[];
}

const intervalLabels: Record<number, string> = {
    1: '毎月',
    2: '2ヶ月ごと',
    3: '3ヶ月ごと',
    4: '4ヶ月ごと',
    6: '半年ごと',
    12: '毎年',
};

export default function Edit({
    subscription,
    categories,
    intervalMonths,
}: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: subscription.name,
        amount_yen: String(subscription.amount_yen),
        interval_months: String(subscription.interval_months),
        started_on: subscription.started_on.split('T')[0],
        next_billing_on: subscription.next_billing_on.split('T')[0],
        category: subscription.category,
        memo: subscription.memo || '',
        status: subscription.status,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('subscriptions.update', subscription.id));
    };

    return (
        <AuthenticatedLayout>
            <Head title="サブスク編集" />

            <div className="space-y-6">
                {/* Page Header */}
                <div>
                    <Link
                        href={route('subscriptions.index')}
                        className="inline-flex items-center gap-1 text-sm text-slate-500 transition-colors hover:text-slate-700"
                    >
                        <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                        一覧に戻る
                    </Link>
                    <h1 className="mt-2 text-2xl font-bold text-slate-900">
                        サブスク編集
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        {subscription.name} の情報を編集します
                    </p>
                </div>

                {/* Form */}
                <div className="rounded-2xl bg-white p-6 shadow-card sm:p-8">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-6 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <InputLabel htmlFor="name" value="サービス名" />
                                <TextInput
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    className="mt-1.5"
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    required
                                    maxLength={100}
                                />
                                <InputError
                                    message={errors.name}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor="amount_yen"
                                    value="金額（円）"
                                />
                                <TextInput
                                    id="amount_yen"
                                    type="number"
                                    value={data.amount_yen}
                                    className="mt-1.5"
                                    onChange={(e) =>
                                        setData('amount_yen', e.target.value)
                                    }
                                    required
                                    min={0}
                                    max={10000000}
                                />
                                <InputError
                                    message={errors.amount_yen}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor="interval_months"
                                    value="支払い周期"
                                />
                                <select
                                    id="interval_months"
                                    value={data.interval_months}
                                    onChange={(e) =>
                                        setData('interval_months', e.target.value)
                                    }
                                    className="mt-1.5 w-full rounded-lg border-slate-300 bg-white text-slate-900 transition-colors duration-200 focus:border-primary-500 focus:ring-primary-500"
                                    required
                                >
                                    {intervalMonths.map((months) => (
                                        <option key={months} value={months}>
                                            {intervalLabels[months]}
                                        </option>
                                    ))}
                                </select>
                                <InputError
                                    message={errors.interval_months}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputLabel htmlFor="category" value="カテゴリ" />
                                <select
                                    id="category"
                                    value={data.category}
                                    onChange={(e) =>
                                        setData('category', e.target.value)
                                    }
                                    className="mt-1.5 w-full rounded-lg border-slate-300 bg-white text-slate-900 transition-colors duration-200 focus:border-primary-500 focus:ring-primary-500"
                                    required
                                >
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                                <InputError
                                    message={errors.category}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputLabel htmlFor="status" value="ステータス" />
                                <select
                                    id="status"
                                    value={data.status}
                                    onChange={(e) =>
                                        setData(
                                            'status',
                                            e.target.value as 'active' | 'canceled',
                                        )
                                    }
                                    className={`mt-1.5 w-full rounded-lg border-slate-300 bg-white transition-colors duration-200 focus:border-primary-500 focus:ring-primary-500 ${
                                        data.status === 'canceled'
                                            ? 'text-slate-500'
                                            : 'text-slate-900'
                                    }`}
                                    required
                                >
                                    <option value="active">契約中</option>
                                    <option value="canceled">解約済み</option>
                                </select>
                                <InputError
                                    message={errors.status}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputLabel htmlFor="started_on" value="開始日" />
                                <TextInput
                                    id="started_on"
                                    type="date"
                                    value={data.started_on}
                                    className="mt-1.5"
                                    onChange={(e) =>
                                        setData('started_on', e.target.value)
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.started_on}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor="next_billing_on"
                                    value="次回請求日"
                                />
                                <TextInput
                                    id="next_billing_on"
                                    type="date"
                                    value={data.next_billing_on}
                                    className="mt-1.5"
                                    onChange={(e) =>
                                        setData('next_billing_on', e.target.value)
                                    }
                                />
                                <InputError
                                    message={errors.next_billing_on}
                                    className="mt-2"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <InputLabel htmlFor="memo" value="メモ（任意）" />
                                <textarea
                                    id="memo"
                                    value={data.memo}
                                    onChange={(e) =>
                                        setData('memo', e.target.value)
                                    }
                                    className="mt-1.5 w-full rounded-lg border-slate-300 bg-white text-slate-900 placeholder-slate-400 transition-colors duration-200 focus:border-primary-500 focus:ring-primary-500"
                                    rows={3}
                                />
                                <InputError
                                    message={errors.memo}
                                    className="mt-2"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-6">
                            <Link
                                href={route('subscriptions.index')}
                                className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
                            >
                                キャンセル
                            </Link>
                            <PrimaryButton disabled={processing}>
                                保存する
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
