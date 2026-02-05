import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

// カテゴリカラー
const CATEGORY_COLORS = [
    '#c2410c', '#0f766e', '#1e3a5f', '#a16207', '#9333ea',
    '#0369a1', '#4d7c0f', '#be185d', '#15803d', '#f97316',
];

function HeroSection({ auth }: { auth: PageProps['auth'] }) {
    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-stone-50 to-white pb-20 pt-32 sm:pt-40">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-stone-100/80 blur-3xl" />
                <div className="absolute -left-40 top-1/2 h-80 w-80 rounded-full bg-stone-100/80 blur-3xl" />
            </div>

            <div className="relative mx-auto max-w-6xl px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center"
                >
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mb-8 inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm text-stone-600 shadow-sm"
                    >
                        <svg className="h-4 w-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        シンプルなサブスク管理
                    </motion.div>

                    {/* Title */}
                    <h1 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-6xl lg:text-7xl">
                        <span className="block">サブスク</span>
                        <span className="block text-stone-700">
                            棚卸し
                        </span>
                    </h1>

                    <p className="mx-auto mt-6 max-w-2xl text-lg text-stone-600 sm:text-xl">
                        契約中のサブスクリプションを一覧管理。
                        <br className="hidden sm:block" />
                        月額・年額を自動計算して、支出を可視化します。
                    </p>

                    {/* CTA */}
                    <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="group relative inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-8 py-4 text-base font-semibold text-white transition-all hover:bg-stone-800"
                            >
                                ダッシュボードへ
                                <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('register')}
                                    className="group relative inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-8 py-4 text-base font-semibold text-white transition-all hover:bg-stone-800"
                                >
                                    無料で始める
                                    <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </Link>
                                <Link
                                    href={route('login')}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white px-8 py-4 text-base font-semibold text-stone-700 transition-all hover:border-stone-400 hover:bg-stone-50"
                                >
                                    ログイン
                                </Link>
                            </>
                        )}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

function FeaturesSection() {
    const features = [
        {
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
            title: '支出の可視化',
            description: '月額・年額を自動計算。カテゴリ別のグラフで支出の内訳を確認できます。',
        },
        {
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
            ),
            title: 'スマホ対応',
            description: 'モバイルファーストで設計。いつでもどこでも確認できます。',
        },
        {
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
            ),
            title: 'カテゴリ分類',
            description: '動画、音楽、仕事など14種類のカテゴリでサブスクを整理。',
        },
        {
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            ),
            title: '請求日管理',
            description: '次回の請求日を記録。支払いスケジュールを把握できます。',
        },
        {
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            title: '解約管理',
            description: '解約済みのサブスクも記録して、契約履歴を残せます。',
        },
        {
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            title: '完全無料',
            description: '課金機能はありません。すべての機能を無料で利用できます。',
        },
    ];

    return (
        <section className="bg-white py-24">
            <div className="mx-auto max-w-6xl px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <h2 className="text-3xl font-bold text-stone-900 sm:text-4xl">
                        機能
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-lg text-stone-600">
                        サブスク管理に必要な機能をシンプルに。
                    </p>
                </motion.div>

                <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, i) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="rounded-2xl border border-stone-200 bg-stone-50/50 p-6 transition-all hover:border-stone-300 hover:bg-white hover:shadow-lg"
                        >
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-stone-600 shadow-sm">
                                {feature.icon}
                            </div>
                            <h3 className="text-lg font-semibold text-stone-900">
                                {feature.title}
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-stone-600">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function DemoSection() {
    const demoSubscriptions = [
        { name: 'Netflix', amount: 1490, category: '動画', color: CATEGORY_COLORS[0], roast: '最後にログインしたの、いつだっけ？' },
        { name: 'Spotify', amount: 980, category: '音楽', color: CATEGORY_COLORS[1], roast: null },
        { name: 'Adobe CC', amount: 6480, category: '仕事', color: CATEGORY_COLORS[2], roast: '仕事で使ってるなら…まあ、許す。' },
        { name: 'YouTube Premium', amount: 1280, category: '動画', color: CATEGORY_COLORS[0], roast: null },
        { name: 'iCloud+', amount: 400, category: 'クラウド/IT', color: CATEGORY_COLORS[5], roast: null },
    ];

    const total = demoSubscriptions.reduce((sum, s) => sum + s.amount, 0);

    return (
        <section className="bg-stone-50 py-24">
            <div className="mx-auto max-w-6xl px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <h2 className="text-3xl font-bold text-stone-900 sm:text-4xl">
                        画面イメージ
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-lg text-stone-600">
                        登録したサブスクを一覧で管理。合計金額は自動計算されます。
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="mx-auto mt-12 max-w-xl"
                >
                    {/* Mock Dashboard Card */}
                    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xl">
                        {/* Header */}
                        <div className="border-b border-stone-100 bg-stone-50 px-6 py-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium uppercase tracking-widest text-stone-400">
                                    毎月の支出
                                </span>
                                <span className="rounded-full bg-stone-200 px-2 py-0.5 text-xs font-medium text-stone-600">
                                    サンプル
                                </span>
                            </div>
                            <p className="mt-2 text-4xl font-bold tabular-nums text-stone-900">
                                ¥{total.toLocaleString()}
                            </p>
                            <p className="mt-1 text-sm text-stone-500">
                                年間 <span className="font-semibold text-stone-700">¥{(total * 12).toLocaleString()}</span>
                            </p>
                        </div>

                        {/* List */}
                        <div className="divide-y divide-stone-100">
                            {demoSubscriptions.map((sub) => (
                                <div key={sub.name} className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="h-2 w-2 shrink-0 rounded-full"
                                            style={{ backgroundColor: sub.color }}
                                        />
                                        <div className="min-w-0 flex-1">
                                            <p className="font-medium text-stone-800">{sub.name}</p>
                                            <p className="text-xs text-stone-400">{sub.category}</p>
                                        </div>
                                        <p className="font-semibold tabular-nums text-stone-800">
                                            ¥{sub.amount.toLocaleString()}
                                        </p>
                                    </div>
                                    {sub.roast && (
                                        <p className="ml-6 mt-2 text-xs text-amber-700">
                                            {sub.roast}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Global roast */}
                        <div className="border-t border-stone-100 bg-amber-50/50 px-6 py-4">
                            <p className="text-sm leading-relaxed text-amber-800">
                                年間{(total * 12).toLocaleString()}円…？ちょっと関西まで旅行行けちゃうね。本当にそのサブスク、全部使ってる？
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

function CTASection({ auth }: { auth: PageProps['auth'] }) {
    return (
        <section className="bg-stone-900 py-24">
            <div className="mx-auto max-w-4xl px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl font-bold text-white sm:text-4xl">
                        サブスクを整理しませんか？
                    </h2>
                    <p className="mx-auto mt-4 max-w-xl text-lg text-stone-400">
                        登録は無料。メールアドレスだけで始められます。
                    </p>

                    <div className="mt-10">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-semibold text-stone-900 transition-all hover:bg-stone-100"
                            >
                                ダッシュボードへ
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Link>
                        ) : (
                            <Link
                                href={route('register')}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-semibold text-stone-900 transition-all hover:bg-stone-100"
                            >
                                無料で始める
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Link>
                        )}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

function Footer() {
    return (
        <footer className="border-t border-stone-200 bg-white py-12">
            <div className="mx-auto max-w-6xl px-6">
                <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-900">
                            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <span className="text-lg font-bold text-stone-900">サブスク棚卸し</span>
                    </div>
                    <p className="text-sm text-stone-500">
                        サブスクリプション管理アプリ
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default function Welcome({ auth }: PageProps) {
    return (
        <>
            <Head title="サブスク棚卸し - サブスクリプション管理アプリ" />

            {/* Navigation */}
            <nav className="fixed left-0 right-0 top-0 z-50 border-b border-stone-200/50 bg-white/80 backdrop-blur-lg">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-900">
                            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <span className="hidden text-lg font-bold text-stone-900 sm:block">
                            サブスク棚卸し
                        </span>
                    </Link>

                    <div className="flex items-center gap-4">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-stone-800"
                            >
                                ダッシュボード
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="text-sm font-medium text-stone-600 transition-colors hover:text-stone-900"
                                >
                                    ログイン
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-stone-800"
                                >
                                    無料登録
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            <main>
                <HeroSection auth={auth} />
                <FeaturesSection />
                <DemoSection />
                <CTASection auth={auth} />
            </main>

            <Footer />
        </>
    );
}
