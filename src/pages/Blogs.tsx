import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Sphere } from '@react-three/drei'
import * as THREE from 'three'
import { X, Clock, User, Calendar, Tag, ArrowRight, Share2 } from 'lucide-react'
import toast from 'react-hot-toast'
import ScrollSection from '../components/layout/ScrollSection'
import LazyCanvas from '../components/layout/LazyCanvas'

import { useData } from '../context/DataContext'
import type { BlogPost } from '../lib/siteData'

function PulseCore() {
    const meshRef = useRef<THREE.Group>(null)
    const { viewport } = useThree()
    const isMobile = viewport.width < 10
    const position: [number, number, number] = isMobile ? [0, -2, 0] : [viewport.width / 3.5, 1, 0]
    const scale = isMobile ? 2.5 : 4

    useFrame((state) => {
        if (!meshRef.current) return
        meshRef.current.rotation.y = state.clock.elapsedTime * 0.15
        meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    })

    return (
        <group ref={meshRef} position={position}>
            <Float speed={2} rotationIntensity={1} floatIntensity={2}>
                <Sphere args={[1, 32, 32]} scale={scale}>
                    <meshBasicMaterial color="#ff4500" wireframe transparent opacity={0.15} />
                </Sphere>
            </Float>
            <Float speed={4} rotationIntensity={2} floatIntensity={1}>
                <Sphere args={[0.6, 24, 24]} scale={scale}>
                    <meshBasicMaterial color="#ff4500" wireframe transparent opacity={0.1} />
                </Sphere>
            </Float>
        </group>
    )
}

function BlogBackground() {
    return (
        <LazyCanvas className="fixed inset-0 z-0 pointer-events-none opacity-40">
            <Canvas camera={{ position: [0, 0, 10], fov: 45 }} gl={{ alpha: true }}>
                <ambientLight intensity={0.5} />
                <PulseCore />
            </Canvas>
        </LazyCanvas>
    )
}

export default function Blogs() {
    const { data } = useData()
    const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)
    
    const handleShare = async (post: BlogPost) => {
        const shareData = {
            title: post.title,
            text: `Check out this insight: ${post.title} by ${post.author}`,
            url: window.location.href,
        }

        try {
            if (navigator.share) {
                await navigator.share(shareData)
            } else {
                await navigator.clipboard.writeText(window.location.href)
                toast.success('Link copied to clipboard!')
            }
        } catch (err) {
            console.error('Error sharing:', err)
        }
    }
    
    return (
        <div className="pt-24 md:pt-32 min-h-screen relative overflow-hidden">
            <BlogBackground />
            
            <ScrollSection>
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-12 md:mb-24"
                    >
                        <h1 className="massive-heading mb-8 md:mb-12">
                            insight <br className="hidden sm:block" />
                            <span className="text-primary italic">stream.</span>
                        </h1>
                        <div className="h-2 w-24 bg-primary rounded-full mb-8" />
                    </motion.div>

                    <div className="flex flex-col gap-8 md:gap-12 pb-32">
                        {data.blogs.map((post, index) => (
                            <motion.div 
                                key={post.id}
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => setSelectedPost(post)}
                                className="group relative p-8 md:p-16 rounded-[2.5rem] md:rounded-[4rem] bg-white/5 border border-white/10 hover:border-primary/30 transition-all cursor-pointer overflow-hidden backdrop-blur-sm"
                            >
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors" />
                                
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-6 md:mb-8">
                                        <span className="px-4 py-1.5 text-[10px] font-black tracking-[0.2em] border border-primary/20 text-primary rounded-full bg-primary/5 uppercase">
                                            {post.category}
                                        </span>
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{post.date}</span>
                                    </div>

                                    <h3 className="text-3xl md:text-6xl font-black mb-8 md:mb-12 leading-[0.9] tracking-tighter transition-colors group-hover:text-primary max-w-4xl">
                                        {post.title}
                                    </h3>

                                    <div className="flex flex-wrap items-center gap-6 md:gap-12">
                                        <div className="flex items-center gap-2 text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                                            <User size={14} className="text-primary" />
                                            <span>{post.author}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                                            <Clock size={14} className="text-primary" />
                                            <span>{post.readTime} Read</span>
                                        </div>
                                        <div className="ml-auto flex items-center gap-4 text-primary font-black uppercase text-xs tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                            <span>Analyze Deep</span>
                                            <div className="w-10 h-10 rounded-full border border-primary/30 flex items-center justify-center">
                                                <ArrowRight size={16} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </ScrollSection>

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedPost && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedPost(null)}
                            className="absolute inset-0 bg-black/95 backdrop-blur-xl"
                        />
                        
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-5xl bg-white rounded-[3rem] p-8 md:p-20 overflow-y-auto max-h-[90vh] shadow-2xl"
                        >
                            <button 
                                onClick={() => setSelectedPost(null)}
                                className="absolute top-8 right-8 p-4 rounded-full bg-slate-100 hover:bg-primary hover:text-white transition-all group"
                            >
                                <X size={24} />
                            </button>

                            <div className="mb-12">
                                <span className="inline-block px-4 py-1.5 text-[10px] font-black tracking-widest bg-primary/10 text-primary rounded-full mb-6 uppercase">
                                    {selectedPost.category}
                                </span>
                                <h2 className="text-4xl md:text-7xl font-black leading-[0.95] tracking-tighter mb-8 lowercase">
                                    {selectedPost.title}
                                </h2>
                                <div className="flex items-center gap-8 text-slate-400 font-bold uppercase text-xs tracking-widest border-b border-slate-100 pb-8">
                                    <div className="flex items-center gap-2">
                                        <User size={16} className="text-primary" />
                                        <span>{selectedPost.author}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock size={16} className="text-primary" />
                                        <span>{selectedPost.readTime}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar size={16} className="text-primary" />
                                        <span>{selectedPost.date}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="prose prose-2xl max-w-none">
                                <p className="text-xl md:text-3xl leading-relaxed text-slate-600 font-medium whitespace-pre-wrap">
                                    {selectedPost.content || "Deciphering data packets for full broadcast..."}
                                </p>
                            </div>

                            <div className="mt-16 pt-12 border-t border-slate-100 flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                     <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <Tag size={20} />
                                     </div>
                                     <span className="font-bold text-slate-400 uppercase tracking-widest text-xs">Category: {selectedPost.category}</span>
                                </div>
                                <button 
                                    onClick={() => handleShare(selectedPost)}
                                    className="flex items-center gap-3 px-10 py-5 bg-black text-white rounded-full font-black uppercase tracking-widest text-xs hover:bg-primary transition-colors group"
                                >
                                    <Share2 size={16} className="group-hover:scale-110 transition-transform" />
                                    <span>Share Insight</span>
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
