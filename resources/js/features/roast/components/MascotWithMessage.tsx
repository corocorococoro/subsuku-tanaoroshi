import { motion } from 'framer-motion';

interface MascotWithMessageProps {
    message: string;
    variant?: 'large' | 'small';
    className?: string;
}

/**
 * マスコットと吹き出しを表示するコンポーネント
 * large: 全体メッセージ用（150〜400文字の長文エッセイ）
 * small: 個別メッセージ用（短めの煽り）
 */
export function MascotWithMessage({
    message,
    variant = 'large',
    className = '',
}: MascotWithMessageProps) {
    const isLarge = variant === 'large';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-start gap-3 ${className}`}
        >
            {/* マスコット画像 */}
            <motion.img
                src="/images/mascot.svg"
                alt="マスコット"
                className={`shrink-0 ${isLarge ? 'h-16 w-16' : 'h-10 w-10'}`}
                initial={{ scale: 0.8, rotate: -5 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            />

            {/* 吹き出し */}
            <div className="relative flex-1 pt-1">
                {/* 吹き出しの三角 */}
                <div
                    className={`absolute top-4 -left-2 h-0 w-0 border-8 border-transparent border-r-pink-100 ${
                        isLarge ? 'border-r-pink-100' : 'border-r-pink-50'
                    }`}
                />
                <motion.div
                    className={`
                        relative rounded-2xl shadow-sm
                        ${
                            isLarge
                                ? 'bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-200/50 px-5 py-4'
                                : 'bg-pink-50/80 border border-pink-100/50 px-3 py-2'
                        }
                    `}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <p
                        className={`leading-relaxed whitespace-pre-wrap ${
                            isLarge
                                ? 'text-sm text-stone-700'
                                : 'text-xs text-stone-600 font-medium'
                        }`}
                    >
                        {message}
                    </p>
                </motion.div>
            </div>
        </motion.div>
    );
}
