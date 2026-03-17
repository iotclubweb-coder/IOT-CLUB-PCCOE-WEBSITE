import { motion } from 'framer-motion'

interface ScrollingMarqueeProps {
    items: string[]
    direction?: 'left' | 'right'
    speed?: number
    className?: string
}

export default function ScrollingMarquee({ items, direction = 'left', speed = 20, className = '' }: ScrollingMarqueeProps) {
    return (
        <div className={`relative flex overflow-hidden py-10 bg-primary ${className}`}>
            {/* Angled background strip effect if needed, or just solid color */}
            <div className="absolute inset-0 bg-primary z-0" />

            <div className="relative z-10 flex whitespace-nowrap">
                <motion.div
                    initial={{ x: direction === 'left' ? 0 : '-100%' }}
                    animate={{ x: direction === 'left' ? '-100%' : 0 }}
                    transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: speed,
                    }}
                    className="flex gap-10 pr-10"
                >
                    {items.map((item, i) => (
                        <MarqueeItem key={`a-${i}`} text={item} />
                    ))}
                    {items.map((item, i) => (
                        <MarqueeItem key={`b-${i}`} text={item} />
                    ))}
                    {items.map((item, i) => (
                        <MarqueeItem key={`c-${i}`} text={item} />
                    ))}
                </motion.div>

                {/* Duplicate for seamless loop (may need more sets depending on screen width) */}
                <motion.div
                    initial={{ x: direction === 'left' ? 0 : '-100%' }}
                    animate={{ x: direction === 'left' ? '-100%' : 0 }}
                    transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: speed,
                    }}
                    className="flex gap-10 pr-10"
                >
                    {items.map((item, i) => (
                        <MarqueeItem key={`d-${i}`} text={item} />
                    ))}
                    {items.map((item, i) => (
                        <MarqueeItem key={`e-${i}`} text={item} />
                    ))}
                    {items.map((item, i) => (
                        <MarqueeItem key={`f-${i}`} text={item} />
                    ))}
                </motion.div>
            </div>
        </div>
    )
}

function MarqueeItem({ text }: { text: string }) {
    return (
        <span
            className="text-6xl md:text-8xl lg:text-[10rem] font-black uppercase tracking-tighter leading-none text-transparent hover:text-white transition-all duration-300 cursor-default"
            style={{
                WebkitTextStroke: '2px white',
            }}
        >
            {text}
        </span>
    )
}
