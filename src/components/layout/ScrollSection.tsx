import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface ScrollSectionProps {
    children: ReactNode
    className?: string
    id?: string
}

export default function ScrollSection({ children, className = '', id }: ScrollSectionProps) {
    return (
        <motion.section
            id={id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`relative w-full ${className}`}
            data-scroll-section
        >
            {children}
        </motion.section>
    )
}
