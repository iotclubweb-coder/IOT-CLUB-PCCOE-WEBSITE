import { useState, useEffect } from 'react'

interface TypewriterProps {
    text: string
    speed?: number
    delay?: number
    className?: string
}

export default function Typewriter({ text, speed = 50, delay = 0, className = "" }: TypewriterProps) {
    const [displayedText, setDisplayedText] = useState("")
    const [started, setStarted] = useState(false)

    useEffect(() => {
        const timeout = setTimeout(() => {
            setStarted(true)
        }, delay)
        return () => clearTimeout(timeout)
    }, [delay])

    useEffect(() => {
        if (!started) return

        let i = 0
        const interval = setInterval(() => {
            setDisplayedText(text.slice(0, i + 1))
            i++
            if (i >= text.length) clearInterval(interval)
        }, speed)

        return () => clearInterval(interval)
    }, [started, text, speed])

    return (
        <span className={`${className} font-mono`}>
            {displayedText}
            <span className="animate-pulse border-r-2 border-primary ml-1">&nbsp;</span>
        </span>
    )
}
