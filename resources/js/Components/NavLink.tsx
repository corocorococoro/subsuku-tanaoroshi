import { InertiaLinkProps, Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}: InertiaLinkProps & { active: boolean }) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ' +
                (active
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900') +
                ' ' +
                className
            }
        >
            {children}
        </Link>
    );
}
