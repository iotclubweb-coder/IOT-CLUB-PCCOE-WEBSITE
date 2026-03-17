import { useRef, useState, useEffect } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { useProgress, Float, MeshDistortMaterial, Sphere, PerspectiveCamera } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { motion } from 'framer-motion'
import * as THREE from 'three'

interface LoadingScreenProps {
    onComplete: () => void
}

const LOADING_TEXTS = [
    "INITIALIZING...",
    "ESTABLISHING UPLINK",
    "SYNCING PROTOCOLS",
    "HANDSHAKE ACCEPTED",
    "SYSTEM ONLINE"
]

function LoadingOrb({ progress }: { progress: number }) {
    const meshRef = useRef<THREE.Mesh>(null)
    const scale = 1.2 + (progress / 100) * 1.3 // Max scale 2.5 instead of 3.0

    useFrame((state) => {
        if (!meshRef.current) return
        meshRef.current.rotation.x = state.clock.elapsedTime * 0.5
        meshRef.current.rotation.y = state.clock.elapsedTime * 0.8
    })

    return (
        <Float speed={5} rotationIntensity={2} floatIntensity={2}>
            <Sphere ref={meshRef} args={[1, 64, 64]} scale={scale}>
                <MeshDistortMaterial
                    color="#ff4500"
                    speed={3}
                    distort={0.4}
                    radius={1}
                    wireframe
                    transparent
                    opacity={0.3 + (progress / 100) * 0.3}
                />
            </Sphere>
        </Float>
    )
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const textRef = useRef<HTMLDivElement>(null)
    const videoRef = useRef<HTMLVideoElement>(null)
    const { progress, active } = useProgress()
    const [currentText, setCurrentText] = useState(LOADING_TEXTS[0])
    const [isFinished, setIsFinished] = useState(false)

    // Update text based on progress
    useEffect(() => {
        const textIndex = Math.min(
            Math.floor((progress / 100) * LOADING_TEXTS.length),
            LOADING_TEXTS.length - 1
        )
        setCurrentText(LOADING_TEXTS[textIndex])

        if (progress === 100 && !active) {
            setIsFinished(true)
        }
    }, [progress, active])

    // Fallback timer: force finish after 3 seconds anyway
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsFinished(true)
        }, 3000)
        return () => clearTimeout(timer)
    }, [])

    useGSAP(() => {
        if (!isFinished) return

        gsap.to(containerRef.current, {
            yPercent: -100,
            duration: 0.8,
            ease: "power4.inOut",
            onComplete: onComplete
        })
    }, { dependencies: [isFinished], scope: containerRef })

    useGSAP(() => {
        // Ensure video plays (even if it 404s, we don't block on it)
        if (videoRef.current) {
            videoRef.current.play().catch(e => console.log("Autoplay blocked/Video missing", e))
        }
    }, { scope: containerRef })

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden"
        >
            {/* 3D Background */}
            <div className="absolute inset-0 w-full h-full opacity-80">
                <Canvas>
                    <PerspectiveCamera makeDefault position={[0, 0, 10]} />
                    <ambientLight intensity={1} />
                    <pointLight position={[10, 10, 10]} intensity={2} color="#ff4500" />
                    <LoadingOrb progress={progress} />
                </Canvas>
            </div>

            <div className="text-center relative z-10 w-full px-6">
                <div className="mb-4 text-xs font-mono text-primary/50 tracking-[0.3em] uppercase">
                    Core Systems: {Math.round(progress)}%
                </div>

                <div
                    ref={textRef}
                    className="text-4xl md:text-6xl font-black text-white tracking-tighter"
                >
                    {currentText}
                </div>

                {/* Progress Bar Container */}
                <div className="mt-8 max-w-xs mx-auto h-1 bg-white/10 rounded-full overflow-hidden relative">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ ease: "linear" }}
                        className="h-full bg-primary absolute inset-0"
                        style={{ position: 'absolute' }}
                    />
                </div>

                <div className="mt-8 flex justify-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                </div>
            </div>
        </div>
    )
}
