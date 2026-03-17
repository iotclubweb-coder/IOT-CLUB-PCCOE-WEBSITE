import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { useData } from '../context/DataContext'
import ScrollSection from '../components/layout/ScrollSection'
import EventsBackground from '../components/layout/EventsBackground'
import { getCloudinaryUrl } from '../lib/cloudinary'
import { Calendar, MapPin, ArrowRight, Clock } from 'lucide-react'
import type { Event } from '../lib/siteData'







export default function EventsPage() {
    const { data } = useData()
    const containerRef = useRef<HTMLDivElement>(null)
    const headerRef = useRef<HTMLDivElement>(null)
    const upcomingRef = useRef<HTMLSpanElement>(null)
    const paramsRef = useRef<HTMLSpanElement>(null)

    useGSAP(() => {
        const tl = gsap.timeline()
        const paramsText = "parameters"
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"

        // Initial state
        if (upcomingRef.current) upcomingRef.current.innerText = ""
        if (paramsRef.current) paramsRef.current.innerText = ""

        // Hero Animation sequence
        tl.to(headerRef.current, {
            opacity: 1,
            duration: 0.1
        })

            // Typewriter for "upcoming"
            .to(upcomingRef.current, {
                duration: 0.8,
                text: {
                    value: "upcoming",
                    delimiter: ""
                },
                ease: "none",
                onUpdate: function () {
                    // Manual fallback since TextPlugin might rely on specific registration
                    if (!upcomingRef.current) return
                    const progress = this.progress()
                    const len = Math.ceil(progress * "upcoming".length)
                    upcomingRef.current.innerText = "upcoming".substring(0, len)
                }
            })

            // Scramble effect for "parameters"
            .to(paramsRef.current, {
                duration: 1.5,
                ease: "power2.out",
                onUpdate: function () {
                    if (!paramsRef.current) return
                    const progress = this.progress()
                    const len = paramsText.length
                    let result = ""

                    for (let i = 0; i < len; i++) {
                        if (i < progress * len) {
                            result += paramsText[i]
                        } else {
                            result += chars[Math.floor(Math.random() * chars.length)]
                        }
                    }
                    paramsRef.current.innerText = result
                }
            }, "-=0.2")

            .from(".event-card", {
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power2.out",
                clearProps: "all"
            }, "-=0.5")

    }, { scope: containerRef })

    return (
        <div ref={containerRef} className="pt-24 md:pt-32 min-h-screen bg-dot-pattern relative overflow-hidden">
            <EventsBackground />
            <ScrollSection>
                <div className="max-w-7xl mx-auto px-6">
                    {/* Hero Section */}
                    <div ref={headerRef} className="mb-12 md:mb-24 opacity-0">
                        <h2 className="text-sm font-mono text-primary tracking-widest mb-4">
                            // SYSTEM_EVENTS__LOG
                        </h2>
                        <h1 className="massive-heading">
                            <span ref={upcomingRef} className="inline-block min-h-[1em]"></span> <br />
                            <span ref={paramsRef} className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-primary bg-[length:200%_auto] animate-gradient inline-block min-h-[1em]"></span>
                        </h1>
                    </div>

                    {/* Events Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                        {data.events.map((event) => (
                            <EventCard key={event.id} event={event as any} />
                        ))}
                    </div>
                </div>
            </ScrollSection>
        </div>
    )
}

const getCategoryStyle = (category: string) => {
    if (!category) return 'border-white/10 bg-black/20 text-white/70'
    
    switch (category.toUpperCase()) {
        case 'COMPETITION':
            return 'border-primary/20 bg-primary/10 text-primary'
        case 'SOCIAL':
            return 'border-blue-500/20 bg-blue-500/10 text-blue-400'
        case 'WORKSHOP':
            return 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
        case 'WEBINAR':
            return 'border-purple-500/20 bg-purple-500/10 text-purple-400'
        default:
            return 'border-white/10 bg-black/20 text-white/70'
    }
}

function EventCard({ event }: { event: Event }) {
    const categoryStyle = getCategoryStyle(event.category)
    const cardRef = useRef<HTMLDivElement>(null)
    const scanLineRef = useRef<HTMLDivElement>(null)
    const titleRef = useRef<HTMLHeadingElement>(null)
    const arrowRef = useRef<HTMLDivElement>(null)

    useGSAP(() => {
        // Scanning Animation
        gsap.to(scanLineRef.current, {
            top: "200%",
            duration: 3,
            repeat: -1,
            ease: "linear",
            repeatDelay: 1
        })
    }, { scope: cardRef })

    const handleMouseEnter = () => {
        gsap.to(cardRef.current, {
            scale: 1.02,
            borderColor: "rgba(247, 59, 32, 0.3)",
            boxShadow: "0 10px 30px -10px rgba(247, 59, 32, 0.1)",
            duration: 0.3
        })
        gsap.to(titleRef.current, {
            x: 5,
            color: "var(--color-primary)",
            duration: 0.2
        })
        gsap.to(arrowRef.current, {
            scale: 1.1,
            rotate: -45,
            backgroundColor: "var(--color-primary)",
            borderColor: "var(--color-primary)",
            color: "#ffffff",
            duration: 0.3
        })
    }

    const handleMouseLeave = () => {
        gsap.to(cardRef.current, {
            scale: 1,
            borderColor: "rgba(255, 255, 255, 0.05)",
            boxShadow: "none",
            duration: 0.3
        })
        gsap.to(titleRef.current, {
            x: 0,
            color: "white",
            duration: 0.2
        })
        gsap.to(arrowRef.current, {
            scale: 1,
            rotate: 0,
            backgroundColor: "transparent",
            borderColor: "rgba(255, 255, 255, 0.1)",
            color: "inherit",
            duration: 0.3
        })
    }

    return (
        <div
            ref={cardRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="event-card group relative p-6 rounded-3xl border border-white/5 bg-white/5 backdrop-blur-sm overflow-hidden transition-colors duration-500 shadow-lg cursor-pointer"
        >
            {/* Hover Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10 flex flex-col h-full">
                {/* Image Placeholder with Scan Animation */}
                <div className="w-full h-48 mb-6 rounded-2xl bg-black/40 border border-white/5 overflow-hidden group-hover:border-primary/20 transition-colors relative">
                    <img 
                        src={event.image?.startsWith('http') ? event.image : getCloudinaryUrl(event.image || 'iot-club/assets/hero', { width: 800, crop: 'fill' })} 
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                        alt={event.title}
                    />
                    {/* Scanning Line */}
                    <div
                        ref={scanLineRef}
                        className="absolute -top-full left-0 right-0 h-12 bg-gradient-to-b from-primary/0 via-primary/20 to-primary/0 z-20"
                    />
                </div>

                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-mono border ${categoryStyle}`}>
                        {event.category}
                    </span>
                    {event.status === 'registering' && (
                        <span className="flex h-3 w-3 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                        </span>
                    )}
                </div>

                {/* Content */}
                <div className="mb-auto">
                    <h3
                        ref={titleRef}
                        className="text-2xl font-bold mb-3 transition-colors duration-300"
                    >
                        {event.title}
                    </h3>
                    <p className="text-slate-400 mb-6 text-sm line-clamp-2">
                        {event.desc || (event as any).description}
                    </p>
                </div>

                {/* Details */}
                <div className="space-y-3 font-mono text-xs text-slate-300">
                    <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-primary" />
                        <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span>{event.location}</span>
                    </div>
                </div>

                {/* Action */}
                <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center group-hover:border-white/10 transition-colors">
                    {event.regUrl ? (
                        <a 
                            href={event.regUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center justify-between w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <span className="text-xs font-medium text-white/50 group-hover:text-primary transition-colors">
                                {event.status === 'registering' ? 'Register Now' : 'View Details'}
                            </span>
                            <div
                                ref={arrowRef}
                                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center transition-colors duration-300"
                            >
                                <ArrowRight className="w-4 h-4" />
                            </div>
                        </a>
                    ) : (
                        <>
                            <span className="text-xs font-medium text-white/50 group-hover:text-white transition-colors">
                                View Details
                            </span>
                            <div
                                ref={arrowRef}
                                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center transition-colors duration-300"
                            >
                                <ArrowRight className="w-4 h-4" />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
