import { InputHTMLAttributes } from 'react';

export default function Checkbox({
    className = '',
    ...props
}: InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-slate-300 text-primary-600 transition-colors focus:ring-primary-500 focus:ring-offset-0 ' +
                className
            }
        />
    );
}
