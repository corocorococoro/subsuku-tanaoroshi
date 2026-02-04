import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-8">
            <div className="w-full max-w-sm">
                <div className="mb-8 text-center">
                    <Link href="/" className="inline-flex items-center gap-2">
                        <ApplicationLogo className="h-10 w-10" />
                        <span className="text-xl font-semibold text-slate-900">
                            サブスク管理
                        </span>
                    </Link>
                    <p className="mt-2 text-sm text-slate-500">
                        毎月の支出を見える化
                    </p>
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-card sm:p-8">
                    {children}
                </div>

                <p className="mt-6 text-center text-xs text-slate-400">
                    節約サブスク可視化アプリ
                </p>
            </div>
        </div>
    );
}
