import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Cpu, Globe, Zap } from 'lucide-react'

import { getVideoUrl } from '../../lib/cloudinary'

export default function Hero() {
    const containerRef = useRef(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    })

    const y1 = useTransform(scrollYProgress, [0, 1], [0, -200])
    const y2 = useTransform(scrollYProgress, [0, 1], [0, 150])
    const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 45])
    const rotate2 = useTransform(scrollYProgress, [0, 1], [0, -20])
    const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])

    return (
        <section id="home" ref={containerRef} className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-40 px-6 overflow-hidden">
            {/* Background Video Layer */}
            <motion.video
                style={{ y: backgroundY }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ duration: 2, ease: "easeOut" }}
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover -z-20"
            >
                <source src={getVideoUrl('iot-club/videos/abstract')} type="video/mp4" />
            </motion.video>

            {/* Decorative Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/30 to-white/80 -z-10" />

            {/* Decorative Gradients */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -z-10" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] -z-10" />

            {/* Floating 3D Elements - Hidden or repositioned on mobile */}
            <motion.div style={{ y: y1, rotate: rotate1 }} className="absolute top-[15%] right-[5%] md:right-[10%] p-4 md:p-6 rounded-2xl md:rounded-3xl bg-secondary soft-3d-shadow -z-10 text-primary scale-75 md:scale-100">
                <Cpu className="w-10 h-10 md:w-16 md:h-16" />
            </motion.div>
            <motion.div style={{ y: y2, rotate: rotate2 }} className="absolute bottom-[15%] left-[5%] md:left-[10%] p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-white soft-3d-shadow -z-10 text-blue-500 scale-75 md:scale-100">
                <Globe className="w-12 h-12 md:w-20 md:h-20" />
            </motion.div>
            <motion.div style={{ y: y1, x: 50 }} className="absolute top-[35%] left-[5%] md:left-[15%] p-3 md:p-4 rounded-xl md:rounded-2xl bg-secondary soft-3d-shadow -z-10 text-orange-400 scale-75 md:scale-100">
                <Zap className="w-8 h-8 md:w-12 md:h-12" />
            </motion.div>

            <div className="max-w-6xl w-full text-center z-10 px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="mb-8 md:mb-12 flex flex-col items-center justify-center gap-8"
                >
                    <div className="relative">
                        <motion.div 
                            animate={{ rotate: 360 }} 
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute -inset-4 border border-primary/20 rounded-full border-dashed"
                        />
                        <img src="/logo.png" alt="IOT Club Logo" className="w-40 md:w-56 h-auto relative z-10 drop-shadow-[0_0_30px_rgba(247,59,32,0.3)]" />
                    </div>

                    <div className="text-center space-y-2">
                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-primary font-black uppercase tracking-[0.3em] text-sm md:text-base mb-2"
                        >
                            innovate • automate • connect
                        </motion.h2>
                        <h1 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-none flex flex-col items-center">
                            <span className="text-black transition-all hover:tracking-normal cursor-default font-display">IOT Club</span>
                            <span className="text-primary italic font-display -mt-2 md:-mt-4">PCCoE</span>
                        </h1>
                    </div>
                </motion.div>

                <p className="text-lg md:text-2xl text-slate-500 max-w-2xl mx-auto mb-10 font-medium leading-snug">
                    Join the premier IOT club exploring embedded systems, smart automation, and the future of connected intelligence.
                </p>
            </div>
        </section>
    )
}
