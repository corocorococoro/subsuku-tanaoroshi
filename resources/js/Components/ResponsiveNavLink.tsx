import { InertiaLinkProps, Link } from '@inertiajs/react';

export default function ResponsiveNavLink({
    active = false,
    className = '',
    children,
    ...props
}: InertiaLinkProps & { active?: boolean }) {
    return (
        <Link
            {...props}
            className={`flex w-full items-center rounded-lg px-3 py-2.5 ${
                active
                    ? 'bg-primary-50 text-primary-700 font-medium'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            } text-sm transition-colors duration-200 ${className}`}
        >
            {children}
        </Link>
    );
}
