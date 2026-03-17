
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { MapPin, ArrowRight } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import LazyCanvas from './LazyCanvas'

gsap.registerPlugin(ScrollTrigger)

function SignalParticles({ count = 1000 }) {
    const mesh = useRef<THREE.Points>(null)
    const { viewport } = useThree()

    // Generate positions once
    const positions = useMemo(() => {
        const positions = new Float32Array(count * 3)
        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 20 // x
            positions[i * 3 + 1] = (Math.random() - 0.5) * 20 // y
            positions[i * 3 + 2] = (Math.random() - 0.5) * 10 // z
        }
        return positions
    }, [count])

    useFrame((state) => {
        if (!mesh.current) return

        const time = state.clock.elapsedTime
        const positions = mesh.current.geometry.attributes.position.array as Float32Array

        for (let i = 0; i < count; i++) {
            let x = positions[i * 3]
            let y = positions[i * 3 + 1]

            // Wave motion
            y += Math.sin(time * 0.5 + x * 0.5) * 0.01
            x += Math.cos(time * 0.3 + y * 0.5) * 0.01

            // Mouse interaction (subtle push)
            const mx = (state.mouse.x * viewport.width) / 2
            const my = (state.mouse.y * viewport.height) / 2

            const dx = x - mx
            const dy = y - my
            const dist = Math.sqrt(dx * dx + dy * dy)

            if (dist < 3) {
                const force = (3 - dist) * 0.05
                x += dx * force
                y += dy * force
            }

            positions[i * 3] = x
            positions[i * 3 + 1] = y
        }

        mesh.current.geometry.attributes.position.needsUpdate = true

        // Slow rotation
        mesh.current.rotation.y = time * 0.05
        mesh.current.rotation.z = time * 0.02
    })

    return (
        <points ref={mesh}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.05}
                color="#ff4500" // Primary-ish color
                sizeAttenuation={true}
                depthWrite={false}
                transparent
                opacity={0.6}
            />
        </points>
    )
}

function SignalField() {
    return (
        <LazyCanvas className="absolute inset-0 z-0 pointer-events-none">
            <Canvas 
                camera={{ position: [0, 0, 10], fov: 45 }} 
                gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
                dpr={1}
            >
                <ambientLight intensity={0.5} />
                <SignalParticles count={1500} />
            </Canvas>
        </LazyCanvas>
    )
}

import { useData } from '../../context/DataContext'

gsap.registerPlugin(ScrollTrigger)

// SignalParticles and SignalField components remain the same...

export default function Events() {
    const sectionRef = useRef<HTMLElement>(null)
    const triggerRef = useRef<HTMLDivElement>(null)
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const { data } = useData()
    const events = data.events

    useGSAP(() => {
        if (!scrollContainerRef.current || !triggerRef.current) return
        
        const isMobile = window.innerWidth < 768

        if (isMobile) {
            // No horizontal scroll on mobile, just vertical stack
            gsap.set(scrollContainerRef.current, { x: 0 })
            return
        }

        const scrollWidth = scrollContainerRef.current.scrollWidth
        const viewportWidth = window.innerWidth
        const xMovement = -(scrollWidth - viewportWidth + 100)

        gsap.to(scrollContainerRef.current, {
            x: xMovement,
            ease: "none",
            scrollTrigger: {
                trigger: triggerRef.current,
                pin: true,
                scrub: 1,
                start: "top top",
                end: () => `+=${scrollWidth}`,
            }
        })
    }, { scope: sectionRef })

    return (
        <section ref={sectionRef} id="events" className="relative bg-secondary py-20 pb-40 md:py-0">
            {/* Wrapper for pinning/scrolling */}
            <div ref={triggerRef} className="md:h-screen w-full relative flex flex-col justify-center overflow-hidden">
                <SignalField />

                <div className="relative z-10 px-6 md:px-12 max-w-[1400px] mx-auto w-full">
                    <div className="mb-8 md:mb-12 flex items-end justify-between">
                        <h2 className="text-4xl md:text-5xl lg:text-8xl font-black text-black lowercase tracking-tighter leading-[1] md:leading-[0.9] mix-blend-difference">
                            upcoming <br className="md:hidden" />
                            <span className="text-primary italic">signals</span>.
                        </h2>
                        <div className="hidden md:flex items-center gap-4 text-slate-400 font-bold uppercase tracking-widest text-xs animate-pulse">
                            Scroll Down <ArrowRight className="w-4 h-4 rotate-90" />
                        </div>
                    </div>
                </div>

                <div ref={scrollContainerRef} className="flex flex-col md:flex-row gap-8 md:gap-12 px-6 md:px-24 w-full md:w-max items-center">
                    {events.map((event) => (
                        <div
                            key={event.title}
                            className="w-[85vw] md:w-[600px] shrink-0"
                        >
                            <div className="group relative p-1 h-full">
                                {/* Gradient Border on Hover - More subtle/premium */}
                                <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-500 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[3rem] blur-sm -z-10" />

                                {/* Card Body - Better Hover Visuals */}
                                <div className="p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] bg-white/5 backdrop-blur-md border border-white/20 shadow-2xl transition-all duration-500 overflow-hidden relative group-hover:-translate-y-2 group-hover:bg-black/40 group-hover:border-primary/30">

                                    {/* Glass reflection */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none" />

                                    <div>
                                        <div className="flex items-center gap-4 mb-8">
                                            <span className="bg-primary text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest leading-none shadow-lg shadow-primary/20">
                                                {event.type}
                                            </span>
                                            <span className="text-slate-500 group-hover:text-amber-400 text-xs font-bold font-mono tracking-wider transition-colors">{event.date}</span>
                                        </div>

                                        <h3 className="text-4xl md:text-5xl font-black lowercase tracking-tighter mb-8 leading-[0.9] text-transparent bg-clip-text bg-gradient-to-br from-black to-slate-600 group-hover:from-white group-hover:to-slate-300 transition-all duration-500">
                                            {event.title}
                                        </h3>

                                        <p className="text-slate-600 group-hover:text-slate-300 text-xl font-medium leading-relaxed max-w-sm transition-colors">
                                            {event.desc}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between border-t border-black/5 group-hover:border-white/10 pt-8 mt-12">
                                        <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-400 group-hover:text-primary transition-colors">
                                            <MapPin className="w-4 h-4" />
                                            {event.location}
                                        </div>
                                        <button className="w-16 h-16 rounded-full bg-black/10 text-black group-hover:bg-primary group-hover:text-white flex items-center justify-center transition-all duration-500 transform group-hover:rotate-[-45deg] group-hover:scale-110 shadow-lg">
                                            <ArrowRight className="w-6 h-6" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* View All Card */}
                    <div className="w-[85vw] md:w-[400px] shrink-0 flex items-center">
                        <div className="w-full flex items-center justify-center p-20 rounded-[3rem] border-4 border-dashed border-black/5 hover:border-primary/50 transition-colors group cursor-pointer bg-white/5 backdrop-blur-sm hover:bg-white/10">
                            <div className="text-center group-hover:scale-105 transition-transform">
                                <h3 className="text-4xl font-black lowercase text-slate-400 group-hover:text-primary transition-colors mb-2">view all</h3>
                                <p className="text-slate-500 font-bold lowercase tracking-tighter hover:underline decoration-primary">access archive</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
