import { AnimatePresence, motion } from 'framer-motion';
import type { SubscriptionCategory } from '../types';
import { useSubscriptionRoast } from '../hooks/useRoastMessage';

interface SubscriptionRoastProps {
    name: string;
    monthlyAmount: number;
    yearlyAmount: number;
    category: SubscriptionCategory;
}

/**
 * 各サブスクカード内に表示する個別煽りメッセージ
 */
export function SubscriptionRoast({
    name,
    monthlyAmount,
    yearlyAmount,
    category,
}: SubscriptionRoastProps) {
    const { message } = useSubscriptionRoast({
        name,
        monthlyAmount,
        yearlyAmount,
        category,
    });

    if (!message) return null;

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={message}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-2 flex items-start gap-2"
            >
                {/* 小さいマスコットアイコン */}
                <img
                    src="/images/mascot.svg"
                    alt=""
                    className="h-6 w-6 shrink-0"
                />
                {/* メッセージ */}
                <p className="text-xs leading-relaxed text-pink-600/80">
                    {message}
                </p>
            </motion.div>
        </AnimatePresence>
    );
}
