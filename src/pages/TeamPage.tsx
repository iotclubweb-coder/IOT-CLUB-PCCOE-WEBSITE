import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import ScrollSection from '../components/layout/ScrollSection'
import EventsBackground from '../components/layout/EventsBackground'
import { Github, Linkedin, Mail, Quote } from 'lucide-react'

import { useData } from '../context/DataContext'
import type { TeamMember } from '../lib/siteData'

const TeamCard = ({ member }: { member: TeamMember }) => {
    const cardRef = useRef<HTMLDivElement>(null)
    const imageRef = useRef<HTMLImageElement>(null)
    const overlayRef = useRef<HTMLDivElement>(null)
    const infoRef = useRef<HTMLDivElement>(null)

    useGSAP(() => {
        // Initial state
        gsap.set(overlayRef.current, { opacity: 0 })
        gsap.set(infoRef.current, { y: 20 })
    }, { scope: cardRef })

    const handleMouseEnter = () => {
        gsap.to(cardRef.current, {
            y: -10,
            duration: 0.4,
            ease: "power2.out",
            boxShadow: "0 20px 40px -10px rgba(247, 59, 32, 0.2)"
        })
        gsap.to(imageRef.current, {
            scale: 1.1,
            duration: 0.6,
            ease: "power2.out"
        })
        gsap.to(overlayRef.current, {
            opacity: 1,
            duration: 0.3
        })
        gsap.to(infoRef.current, {
            y: 0,
            duration: 0.3
        })
    }

    const handleMouseLeave = () => {
        gsap.to(cardRef.current, {
            y: 0,
            duration: 0.4,
            ease: "power2.out",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
        })
        gsap.to(imageRef.current, {
            scale: 1,
            duration: 0.6,
            ease: "power2.out"
        })
        gsap.to(overlayRef.current, {
            opacity: 0,
            duration: 0.3
        })
        gsap.to(infoRef.current, {
            y: 20,
            duration: 0.3
        })
    }

    return (
        <div
            ref={cardRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="group relative h-[400px] rounded-[2rem] overflow-hidden bg-white/5 border border-white/10 backdrop-blur-sm cursor-pointer"
        >
            {/* Image Container */}
            <div className="absolute inset-0 z-0">
                <img
                    ref={imageRef}
                    src={member.image?.startsWith('http') ? member.image : `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_auto/v1/${member.image}`}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            </div>

            {/* Hover Overlay */}
            <div
                ref={overlayRef}
                className="absolute inset-0 bg-primary/20 backdrop-blur-[2px] z-10"
            />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                <div className="mb-4">
                    <span className="inline-block px-3 py-1 mb-3 text-[10px] font-mono tracking-widest border border-primary/30 text-primary rounded-full bg-primary/10">
                        {member.category || 'CONTRIBUTOR'}
                    </span>
                    <h3 className="text-3xl font-bold text-white mb-1 uppercase tracking-tight">{member.name}</h3>
                    <p className="text-white/80 font-medium text-lg">{member.role}</p>
                    {member.subRole && (
                        <p className="text-white/50 text-sm mt-1">{member.subRole}</p>
                    )}
                </div>

                {/* Social Links revealed on hover */}
                <div ref={infoRef} className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {member.image && (
                        <>
                            <a href="#" className="p-2 rounded-full bg-white/10 hover:bg-primary hover:text-white transition-colors">
                                <Github size={18} />
                            </a>
                            <a href="#" className="p-2 rounded-full bg-white/10 hover:bg-primary hover:text-white transition-colors">
                                <Linkedin size={18} />
                            </a>
                            <a href="#" className="p-2 rounded-full bg-white/10 hover:bg-primary hover:text-white transition-colors">
                                <Mail size={18} />
                            </a>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default function TeamPage() {
    const { data } = useData()
    const containerRef = useRef<HTMLDivElement>(null)
    const titleRef = useRef<HTMLHeadingElement>(null)

    useGSAP(() => {
        const tl = gsap.timeline()

        tl.from(titleRef.current, {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        })
            .from(".team-card-wrapper", {
                y: 100,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power2.out"
            }, "-=0.5")

    }, { scope: containerRef })

    return (
        <div ref={containerRef} className="pt-24 md:pt-32 min-h-screen relative overflow-hidden bg-dot-pattern">
            <EventsBackground />

            <ScrollSection>
                <div className="max-w-7xl mx-auto px-6 pb-20">
                    {/* Faculty Section */}
                    <div className="mb-32">
                        <div className="mb-12 md:mb-20 text-center">
                            <h2 className="massive-heading mb-4 md:mb-6">
                                faculty <span className="text-primary italic">mentors.</span>
                            </h2>
                            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-medium italic">
                                “Guiding and inspiring the next generation of computing professionals.”
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            {data.faculty.map((mentor) => (
                                <div key={mentor.id} className="bg-white/5 border border-primary/30 backdrop-blur-md p-12 md:p-20 rounded-[4rem] flex flex-col items-center gap-12 group hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10">
                                    <div className="w-64 h-64 md:w-72 md:h-72 rounded-[3rem] overflow-hidden bg-white/10 shrink-0 shadow-2xl group-hover:scale-105 transition-transform duration-500 border-2 border-primary/20">
                                        <img 
                                            src={mentor.image?.startsWith('http') ? mentor.image : `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_auto/v1/${mentor.image}`} 
                                            alt={mentor.name} 
                                            className="w-full h-full object-cover" 
                                        />
                                    </div>
                                    <div className="text-center min-w-0 flex-1">
                                        <h3 className="text-3xl md:text-5xl font-black tracking-tighter text-primary mb-3 uppercase font-display transition-colors break-words leading-none">{mentor.name}</h3>
                                        <div className="text-primary/70 font-bold text-base tracking-widest uppercase mb-8">{mentor.role}</div>
                                        
                                        {/* Social Links */}
                                        <div className="flex gap-6 mb-10 justify-center">
                                            {mentor.linkedin && (
                                                <a href={mentor.linkedin} target="_blank" rel="noopener noreferrer" className="p-4 rounded-full bg-white/10 hover:bg-primary transition-all text-white hover:scale-110">
                                                    <Linkedin size={22} />
                                                </a>
                                            )}
                                            {mentor.email && (
                                                <a href={`mailto:${mentor.email}`} className="p-4 rounded-full bg-white/10 hover:bg-primary transition-all text-white hover:scale-110">
                                                    <Mail size={22} />
                                                </a>
                                            )}
                                        </div>

                                        <div className="relative">
                                            <Quote className="absolute -left-3 -top-3 w-8 h-8 text-primary/10 -z-10" />
                                            <p className="text-slate-300 font-medium italic leading-relaxed">
                                                {mentor.quote}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Team Section */}
                    <div className="mb-12 md:mb-20 text-center pt-20 border-t border-white/5">
                        <h2 ref={titleRef} className="massive-heading mb-4 md:mb-6">
                            meet our <span className="text-primary italic">team.</span>
                        </h2>
                        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-medium uppercase tracking-tight">
                            Dedicated students working together to advance computing excellence.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {data.team.map((member) => (
                            <div key={member.id} className="team-card-wrapper">
                                <TeamCard member={member} />
                            </div>
                        ))}
                    </div>
                </div>
            </ScrollSection>
        </div>
    )
}
