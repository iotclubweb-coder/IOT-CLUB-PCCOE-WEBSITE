
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Center, ContactShadows, useGLTF, Float, OrbitControls } from '@react-three/drei'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import LazyCanvas from './LazyCanvas'

interface Project {
    tag: string
    title: string
    highlight: string
    suffix: string
    description: string
    modelScale: number
    modelType: 'drone' | 'vision-pro'
}

const projects: Project[] = [
    {
        tag: "Future Tech",
        title: "powering",
        highlight: "decarb",
        suffix: ".",
        description: "Leveraging IoT and AI to optimize energy consumption, reduce carbon footprints, and drive the transition to renewable power sources.",
        modelScale: 1.2,
        modelType: 'drone'
    },
    {
        tag: "Spatial Computing",
        title: "visualize",
        highlight: "reality",
        suffix: "",
        description: "Immersive interfaces for industrial digital twins, enabling remote collaboration and spatial data visualization.",
        modelScale: 6,
        modelType: 'vision-pro'
    },
    {
        tag: "Automation",
        title: "autonomous",
        highlight: "logistics",
        suffix: ".",
        description: "Next-generation drone fleets for contactless delivery and automated industrial inspection, powered by edge computing.",
        modelScale: 1.2,
        modelType: 'drone'
    }
]

function DroneModel({ scale, ...props }: any) {
    const { scene } = useGLTF('/models/dji_fpv/scene.gltf')
    const propellers = useRef<THREE.Object3D[]>([])

    useEffect(() => {
        scene.traverse((child) => {
            if (child.name.toLowerCase().includes('prop') ||
                child.name.toLowerCase().includes('blade') ||
                child.name.toLowerCase().includes('rotor')) {
                propellers.current.push(child)
            }
        })
    }, [scene])

    useFrame((_, delta) => {
        propellers.current.forEach((prop) => {
            prop.rotation.y += delta * 20
        })
    })

    return <primitive object={scene} scale={scale} {...props} />
}

function VisionProModel({ scale, ...props }: any) {
    const { scene } = useGLTF('/models/apple_vision_pro/scene.gltf')
    // Rotation adjusted to show the back/lenses view as per user preference
    return <primitive object={scene} scale={scale} rotation={[0, Math.PI, 0]} {...props} />
}

// Preload models
useGLTF.preload('/models/dji_fpv/scene.gltf')
useGLTF.preload('/models/apple_vision_pro/scene.gltf')

// Scene component removed as we use AnimatedModelSwitch now

function AnimatedModelSwitch({ project }: { project: Project }) {
    const groupRef = useRef<THREE.Group>(null)
    const [activeProject, setActiveProject] = useState(project)

    useGSAP(() => {
        if (!groupRef.current) return

        const timeline = gsap.timeline()

        // If project changed, animate out then in
        if (project.title !== activeProject.title) {
            timeline
                .to(groupRef.current.rotation, {
                    y: "+=2", // Spin fast
                    duration: 0.4,
                    ease: "power2.in"
                })
                .to(groupRef.current.scale, {
                    x: 0,
                    y: 0,
                    z: 0,
                    duration: 0.4,
                    ease: "back.in(1.7)"
                }, "<")
                .call(() => {
                    setActiveProject(project)
                })
                .to(groupRef.current.rotation, {
                    y: "+=0.5", // Spin slow
                    duration: 0.6,
                    ease: "power2.out"
                })
                .to(groupRef.current.scale, {
                    x: 1,
                    y: 1,
                    z: 1,
                    duration: 0.6,
                    ease: "back.out(1.7)"
                }, "<")
        }
    }, [project])

    // Idle animation using GSAP (optional, or stick to useFrame for loop)
    useFrame((_, delta) => {
        if (groupRef.current && !gsap.isTweening(groupRef.current.rotation)) {
            groupRef.current.rotation.y += delta * 0.2
        }
    })

    return (
        <Center>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
                <group ref={groupRef}>
                    {activeProject.modelType === 'drone' ? (
                        <DroneModel scale={activeProject.modelScale} rotation={[0, Math.PI / 4, 0]} />
                    ) : (
                        <VisionProModel scale={activeProject.modelScale} />
                    )}
                </group>
            </Float>
        </Center>
    )
}

export default function Sustainability() {
    const [current, setCurrent] = useState(0)

    const nextProject = () => {
        setCurrent((prev) => (prev + 1) % projects.length)
    }

    const prevProject = () => {
        setCurrent((prev) => (prev - 1 + projects.length) % projects.length)
    }

    const project = projects[current]

    return (
        <section className="py-20 md:py-32 pb-40 md:pb-32 bg-secondary relative overflow-hidden bg-dot-pattern">
            <div className="absolute top-0 right-0 w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-primary/5 rounded-full blur-[80px] md:blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-blue-500/5 rounded-full blur-[60px] md:blur-[100px] translate-y-1/2 -translate-x-1/3 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-8 md:gap-12 items-center relative z-10">
                {/* Content */}
                <div className="reveal-up relative z-20 order-2 lg:order-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 text-[10px] md:text-xs font-bold uppercase tracking-widest text-primary mb-6 md:mb-8 border border-black/5">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        {project.tag}
                    </div>

                    <div className="min-h-[180px] md:h-[240px] mb-6 md:mb-8 relative">
                        <AnimatePresence mode="wait">
                            <motion.h2
                                key={current}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="text-4xl md:text-6xl lg:text-8xl font-black text-black lowercase tracking-tighter leading-[1] md:leading-[0.9] lg:absolute top-0 left-0 w-full"
                            >
                                {project.title} <br className="md:hidden" />
                                <span
                                    className="text-transparent transition-all duration-500 hover:text-black cursor-default inline-block py-1"
                                    style={{ WebkitTextStroke: '1px black' }}
                                >
                                    {project.highlight}
                                </span>
                                <span className="text-slate-300">{project.suffix}</span>
                            </motion.h2>
                        </AnimatePresence>
                    </div>

                    <div className="min-h-[100px] md:h-[120px] mb-8 md:mb-12 relative">
                        <AnimatePresence mode="wait">
                            <motion.p
                                key={current}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3, delay: 0.1 }}
                                className="text-lg md:text-2xl text-slate-500 leading-relaxed max-w-lg font-medium lg:absolute top-0 left-0 w-full"
                            >
                                {project.description}
                            </motion.p>
                        </AnimatePresence>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-6 md:gap-8">
                        <button className="w-full sm:w-auto group relative px-8 py-4 bg-black text-white rounded-full overflow-hidden flex items-center justify-center sm:justify-start gap-4 hover:pr-10 transition-all duration-300">
                            <span className="relative z-10 font-bold uppercase tracking-widest text-sm text-center">Explore Initiatives</span>
                            <span className="relative z-10 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                                <ArrowRight className="w-4 h-4" />
                            </span>
                            <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                        </button>

                        <div className="flex gap-4">
                            <button onClick={prevProject} className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-all">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button onClick={nextProject} className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-all">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* 3D Canvas - Overlapping */}
                <LazyCanvas className="h-[400px] md:h-[600px] lg:h-[800px] w-full lg:w-[140%] lg:-ml-[20%] relative pointer-events-none lg:pointer-events-auto order-1 lg:order-2">
                    {/* Canvas kept stable to avoid WebGL context loss */}
                    <Canvas
                        id="techCanvas"
                        dpr={[1, 1.5]}
                        camera={{ position: [0, 0, 8], fov: 45 }}
                        className="bg-transparent"
                        style={{ pointerEvents: 'auto' }}
                        gl={{
                            antialias: true,
                            alpha: true,
                            powerPreference: "high-performance"
                        }}
                    >
                        <group position={[0, 0, 0]}>
                            {/* Model content switched via internal component */}
                            <AnimatedModelSwitch project={project} />

                            {/* Reduced ContactShadows resolution for performance */}
                            <ContactShadows opacity={0.4} scale={20} blur={2.5} far={10} resolution={128} color="#000000" />

                            <ambientLight intensity={2} />
                            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
                            <Environment preset="city" />
                            <OrbitControls enableZoom={false} autoRotate={false} />
                        </group>
                    </Canvas>
                </LazyCanvas>
            </div>
        </section>
    )
}
