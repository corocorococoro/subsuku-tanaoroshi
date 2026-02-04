import Dropdown from '@/Components/Dropdown';
import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, useState } from 'react';

export default function Authenticated({ children }: PropsWithChildren) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="min-h-screen bg-stone-50">
            {/* ナビゲーション */}
            <nav className="sticky top-0 z-50 border-b border-stone-200/80 bg-white/90 backdrop-blur-lg">
                <div className="mx-auto max-w-4xl px-4 sm:px-6">
                    <div className="flex h-14 items-center justify-between">
                        {/* ロゴ */}
                        <Link
                            href={route('dashboard')}
                            className="flex items-center gap-2.5"
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-900">
                                <svg
                                    className="h-4 w-4 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                                    />
                                </svg>
                            </div>
                            <span className="hidden text-[15px] font-semibold tracking-tight text-stone-900 sm:block">
                                Subsuku
                            </span>
                        </Link>

                        {/* デスクトップメニュー */}
                        <div className="hidden sm:flex sm:items-center">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button
                                        type="button"
                                        className="flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-sm text-stone-700 shadow-sm transition-all hover:border-stone-300 hover:shadow focus:outline-none focus:ring-2 focus:ring-stone-900/10"
                                    >
                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-stone-100 text-xs font-medium text-stone-600">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="max-w-[100px] truncate font-medium">
                                            {user.name}
                                        </span>
                                        <svg
                                            className="h-4 w-4 text-stone-400"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 9l-7 7-7-7"
                                            />
                                        </svg>
                                    </button>
                                </Dropdown.Trigger>

                                <Dropdown.Content align="right">
                                    <div className="border-b border-stone-100 px-4 py-2">
                                        <p className="text-xs text-stone-500">
                                            {user.email}
                                        </p>
                                    </div>
                                    <Dropdown.Link href={route('profile.edit')}>
                                        アカウント設定
                                    </Dropdown.Link>
                                    <Dropdown.Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                    >
                                        ログアウト
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>

                        {/* モバイルメニューボタン */}
                        <button
                            onClick={() =>
                                setShowingNavigationDropdown(
                                    !showingNavigationDropdown,
                                )
                            }
                            className="inline-flex items-center justify-center rounded-lg p-2 text-stone-500 transition hover:bg-stone-100 hover:text-stone-700 focus:outline-none sm:hidden"
                        >
                            <svg
                                className="h-5 w-5"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    className={
                                        !showingNavigationDropdown
                                            ? 'block'
                                            : 'hidden'
                                    }
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                                <path
                                    className={
                                        showingNavigationDropdown
                                            ? 'block'
                                            : 'hidden'
                                    }
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* モバイルメニュー */}
                <div
                    className={`${
                        showingNavigationDropdown ? 'block' : 'hidden'
                    } border-t border-stone-200/80 sm:hidden`}
                >
                    <div className="px-4 py-4">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 text-sm font-medium text-stone-600">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-stone-900">
                                    {user.name}
                                </p>
                                <p className="text-xs text-stone-500">
                                    {user.email}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <Link
                                href={route('profile.edit')}
                                className="block rounded-lg px-3 py-2 text-sm font-medium text-stone-600 transition hover:bg-stone-100"
                            >
                                アカウント設定
                            </Link>
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-stone-600 transition hover:bg-stone-100"
                            >
                                ログアウト
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* メインコンテンツ */}
            <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
                {children}
            </main>
        </div>
    );
}
