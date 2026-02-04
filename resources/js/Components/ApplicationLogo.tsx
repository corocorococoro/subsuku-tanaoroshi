import { SVGAttributes } from 'react';

export default function ApplicationLogo(props: SVGAttributes<SVGElement>) {
    return (
        <svg
            {...props}
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Modern subscription/wallet icon */}
            <rect
                x="4"
                y="8"
                width="32"
                height="24"
                rx="4"
                className="fill-primary-500"
            />
            <rect
                x="4"
                y="8"
                width="32"
                height="8"
                rx="4"
                className="fill-primary-600"
            />
            <circle cx="28" cy="24" r="4" className="fill-primary-300" />
            <rect
                x="8"
                y="22"
                width="12"
                height="2"
                rx="1"
                className="fill-primary-200"
            />
            <rect
                x="8"
                y="26"
                width="8"
                height="2"
                rx="1"
                className="fill-primary-200"
            />
        </svg>
    );
}
