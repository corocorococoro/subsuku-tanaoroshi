import { AnimatePresence, motion } from 'framer-motion';
import { useGlobalRoast } from '../hooks/useRoastMessage';
import { MascotWithMessage } from './MascotWithMessage';

interface GlobalRoastProps {
    monthlyTotal: number;
    yearlyTotal: number;
    totalPaid: number;
}

/**
 * ダッシュボード上部に表示する全体煽りメッセージ
 */
export function GlobalRoast({ monthlyTotal, yearlyTotal, totalPaid }: GlobalRoastProps) {
    const { message, refresh } = useGlobalRoast({ monthlyTotal, yearlyTotal, totalPaid });

    if (!message) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={message}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                >
                    <MascotWithMessage message={message} variant="large" />
                </motion.div>
            </AnimatePresence>

            {/* アクションボタン */}
            <div className="mt-3 flex items-center gap-2 pl-20">
                <button
                    onClick={refresh}
                    className="text-xs text-stone-400 transition-colors hover:text-stone-600"
                >
                    別のセリフを見る
                </button>
            </div>
        </motion.div>
    );
}
