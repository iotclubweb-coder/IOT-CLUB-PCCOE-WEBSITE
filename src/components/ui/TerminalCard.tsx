import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

interface TerminalCardProps {
    children: ReactNode
    title?: string
    prompt?: string
    className?: string
}

export default function TerminalCard({ children, title = "terminal", prompt = "~", className }: TerminalCardProps) {
    return (
        <div className={cn("glass-card rounded-lg overflow-hidden flex flex-col", className)}>
            {/* Terminal Title Bar */}
            <div className="bg-white/5 px-4 py-2 flex items-center justify-between border-b border-white/10">
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
                <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                    {title}
                </div>
                <div className="w-10" /> {/* Spacer */}
            </div>

            {/* Terminal Content */}
            <div className="p-6 font-mono text-sm">
                <div className="flex items-center gap-2 text-primary/70 mb-4 select-none">
                    <span className="text-green-500/70">system@iot-club:</span>
                    <span className="text-blue-500/70">{prompt}</span>
                    <span>$</span>
                    <span className="w-2 h-4 bg-primary/40 animate-pulse" />
                </div>
                {children}
            </div>
        </div>
    )
}
