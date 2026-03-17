import { useRef } from 'react'
import { motion } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Octahedron } from '@react-three/drei'
import * as THREE from 'three'
import ScrollSection from '../components/layout/ScrollSection'
import LazyCanvas from '../components/layout/LazyCanvas'
import { getCloudinaryUrl } from '../lib/cloudinary'

import { useData } from '../context/DataContext'

function VisualPrism() {
    const meshRef = useRef<THREE.Mesh>(null)

    useFrame((state) => {
        if (!meshRef.current) return
        meshRef.current.rotation.y = state.clock.elapsedTime * 0.2
        meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.2
    })

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
            <Octahedron ref={meshRef} args={[1, 0]} scale={3}>
                <MeshDistortMaterial
                    color="#ff4500"
                    speed={2}
                    distort={0.4}
                    radius={1}
                    wireframe
                    transparent
                    opacity={0.1}
                />
            </Octahedron>
        </Float>
    )
}

function GalleryBackground() {
    return (
        <LazyCanvas className="fixed inset-0 z-0 pointer-events-none opacity-50">
            <Canvas camera={{ position: [0, 0, 10], fov: 45 }} gl={{ alpha: true }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <VisualPrism />
            </Canvas>
        </LazyCanvas>
    )
}

export default function Gallery() {
    const { data } = useData()
    
    return (
        <div className="pt-24 md:pt-32 px-6 min-h-screen relative overflow-hidden">
            <GalleryBackground />
            
            <ScrollSection>
                <div className="max-w-7xl mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-12 md:mb-20"
                    >
                        <h1 className="massive-heading mb-8 md:mb-12">
                            visual <br className="hidden sm:block" />
                            <span className="text-primary italic">logs.</span>
                        </h1>
                        <div className="h-2 w-24 bg-primary rounded-full" />
                    </motion.div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-32">
                        {data.gallery.map((item, index) => (
                            <motion.div 
                                key={item.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: (index % 4) * 0.1 }}
                                className="aspect-[4/5] rounded-[2rem] md:rounded-[3rem] overflow-hidden bg-white/5 border border-white/10 transition-all hover:scale-[1.02] duration-500 group relative backdrop-blur-sm shadow-xl hover:shadow-primary/5 hover:border-primary/20"
                            >
                                <img 
                                    src={getCloudinaryUrl(item.image, { width: 500, height: 625, crop: 'fill', quality: 'auto', format: 'auto' })} 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    alt={item.caption}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                                    <span className="text-[10px] font-black tracking-widest text-primary uppercase mb-2">{item.category}</span>
                                    <p className="text-white text-sm font-bold leading-tight translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                        {item.caption}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </ScrollSection>
        </div>
    )
}
