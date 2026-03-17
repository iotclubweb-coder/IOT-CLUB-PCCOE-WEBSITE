import { useRef, useState, useEffect, type ReactNode } from 'react'

interface LazyCanvasProps {
    children: ReactNode
    className?: string
    /** Margin around the element before it triggers (e.g., "200px") */
    rootMargin?: string
}

/**
 * Wrapper that only mounts its children (a <Canvas>) when visible in the viewport.
 * This prevents multiple WebGL contexts from being active simultaneously,
 * avoiding the "Context Lost" error.
 */
export default function LazyCanvas({ children, className = '', rootMargin = '200px' }: LazyCanvasProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const el = containerRef.current
        if (!el) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                } else {
                    // Unmount the canvas when scrolled far away to free GPU resources
                    setIsVisible(false)
                }
            },
            { rootMargin }
        )

        observer.observe(el)
        return () => observer.disconnect()
    }, [rootMargin])

    return (
        <div ref={containerRef} className={className}>
            {isVisible ? children : null}
        </div>
    )
}
