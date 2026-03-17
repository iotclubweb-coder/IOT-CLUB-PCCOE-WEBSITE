import { Globe, Rocket, Cpu, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Sphere } from '@react-three/drei'
import * as THREE from 'three'
import LazyCanvas from './LazyCanvas'

const stats = [
    { icon: Globe, label: "GLOBAL_COMMUNITY", value: "500+", suffix: "members", color: "text-blue-500", bg: "bg-blue-50" },
    { icon: Rocket, label: "DEPLOYED_NODES", value: "20+", suffix: "live projects", color: "text-orange-500", bg: "bg-orange-50" },
    { icon: Cpu, label: "RESOURCES", value: "IoT Lab", suffix: "advanced access", color: "text-purple-500", bg: "bg-purple-50" }
]

function NetworkGlobe() {
    const meshRef = useRef<THREE.Group>(null)
    const outerRef = useRef<THREE.Mesh>(null)
    const innerRef = useRef<THREE.Mesh>(null)
    const { viewport } = useThree()
    
    // Position globe based on viewport width
    const isMobile = viewport.width < 10
    const position: [number, number, number] = isMobile ? [0, -2, 0] : [viewport.width / 3, 0, 0]
    const scale = isMobile ? 3 : 4.5

    useFrame((state) => {
        if (!meshRef.current || !outerRef.current || !innerRef.current) return
        const time = state.clock.elapsedTime

        // Steady Globe Rotation
        meshRef.current.rotation.y = time * 0.1
        outerRef.current.rotation.y = time * 0.05
    })

    return (
        <group ref={meshRef} position={position}>
            {/* Outer Globe - Clean Wireframe */}
            <Float floatIntensity={2} rotationIntensity={0}>
                <Sphere ref={outerRef} args={[1, 32, 32]} scale={scale}>
                    <meshBasicMaterial
                        color="#cbd5e1" // Slate-300
                        wireframe
                        transparent
                        opacity={0.3}
                    />
                </Sphere>
            </Float>

            {/* Inner Core - Solid representation */}
            <Float floatIntensity={1} rotationIntensity={0}>
                <Sphere ref={innerRef} args={[1, 32, 32]} scale={scale * 0.77}>
                    <meshBasicMaterial
                        color="#ff4500" // Primary Orange
                        transparent
                        opacity={0.05}
                        wireframe={true}
                    />
                </Sphere>
            </Float>
        </group>
    )
}

function ProtocolCanvas() {
    return (
        <LazyCanvas className="absolute inset-0 z-0 pointer-events-none opacity-50">
            <Canvas 
                camera={{ position: [0, 0, 8], fov: 45 }} 
                gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
                dpr={1}
            >
                <ambientLight intensity={1} />
                <pointLight position={[10, 10, 10]} intensity={5} />
                <NetworkGlobe />
            </Canvas>
        </LazyCanvas>
    )
}

export default function About() {
    return (
        <section className="relative py-20 md:py-40 w-full overflow-hidden">
            {/* 3D Background - Now Full Width */}
            <ProtocolCanvas />

            {/* Background Decoration (Subtle Blob behind 3D) */}
            <div className="absolute top-0 right-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-primary/5 rounded-full blur-[60px] md:blur-[100px] -translate-y-1/2 translate-x-1/2 -z-20" />

            {/* Content Container */}
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 md:gap-24 items-start">
                    {/* ... Left Column ... */}
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="mb-8 md:mb-16"
                        >
                            <h2 className="text-6xl md:text-8xl lg:text-[8rem] leading-[0.85] font-black tracking-tighter mb-6 md:mb-8">
                                our <br />
                                <span
                                    className="text-transparent"
                                    style={{ WebkitTextStroke: '2px black' }}
                                >
                                    protocol.
                                </span>
                            </h2>
                            <div className="h-1.5 md:h-2 w-16 md:w-24 bg-primary rounded-full" />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        >
                            <p className="text-2xl md:text-3xl lg:text-4xl text-black font-medium leading-tight mb-8 md:mb-12">
                                A symphony of <span className="text-primary border-b-4 border-primary/20">intelligence</span> and connectivity.
                            </p>
                            <p className="text-lg md:text-xl text-slate-500 leading-relaxed mb-8 md:mb-12 max-w-lg">
                                We empower students to dive deep into the world of Internet of Things, providing the tools, community, and mentorship to build the hardware of tomorrow.
                            </p>

                            <button className="w-full sm:w-auto group relative px-8 py-4 bg-black text-white rounded-full overflow-hidden flex items-center justify-center sm:justify-start gap-4 hover:pr-10 transition-all duration-300">
                                <span className="relative z-10 font-bold uppercase tracking-widest text-sm">Read Manifesto</span>
                                <span className="relative z-10 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                                    <ArrowRight className="w-4 h-4" />
                                </span>
                                <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                            </button>
                        </motion.div>
                    </div>

                    {/* Right Column: Stats */}
                    <div className="flex flex-col gap-4 md:gap-6 pt-10">
                        {stats.map((stat, index) => (
                            <StatCard key={stat.label} stat={stat} index={index} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

function StatCard({ stat, index }: { stat: any, index: number }) {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 + (index * 0.1) }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group relative p-0.5 md:p-1 mt-4 md:mt-6 first:mt-0"
        >
            {/* Hover Gradient Border */}
            <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent rounded-[1.5rem] md:rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${isHovered ? 'animate-gradient-x' : ''}`} />

            <div className="relative bg-white border border-black/5 p-6 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] flex items-center gap-4 md:gap-8 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-2">
                <div className={`w-14 h-14 md:w-20 md:h-20 rounded-xl md:rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shrink-0`}>
                    <stat.icon className="w-6 h-6 md:w-10 md:h-10" />
                </div>
                <div>
                    <div className="text-[10px] md:text-xxs font-black text-slate-400 uppercase tracking-[0.2em] mb-1 md:mb-2">{stat.label}</div>
                    <div className="text-2xl md:text-4xl font-black lowercase tracking-tighter text-black flex items-baseline gap-1 md:gap-2">
                        {stat.value}
                        <span className="text-sm md:text-lg text-slate-500 font-bold tracking-normal">{stat.suffix}</span>
                    </div>
                </div>

                {/* Arrow indicator on hover */}
                <div className="ml-auto opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300 text-primary hidden sm:block">
                    <ArrowRight className="w-6 h-6" />
                </div>
            </div>
        </motion.div>
    )
}
