import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Github, ExternalLink, Cpu, Database, Globe } from 'lucide-react'
import ScrollSection from '../components/layout/ScrollSection'
import { useData } from '../context/DataContext'
import { getCloudinaryUrl } from '../lib/cloudinary'

// --- Types ---
type Category = 'All' | 'Hardware' | 'AI/ML' | 'Web' | string

function ProjectCard({ project }: { project: any }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="group relative h-full"
        >
            {/* Hover Glow Effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-purple-600/50 rounded-[2rem] opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500" />

            <div className="relative h-full bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] hover:bg-black/80 hover:border-primary/30 transition-all duration-500 flex flex-col group-hover:-translate-y-2">
                
                {/* Project Image */}
                <div className="w-full h-48 mb-6 rounded-2xl overflow-hidden bg-black/40 border border-white/5 group-hover:border-primary/20 transition-colors relative">
                    <img 
                        src={project.image?.startsWith('http') ? project.image : getCloudinaryUrl(project.image || '', { width: 600, crop: 'fill' })} 
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                        alt={project.title}
                    />
                </div>

                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                        {project.category === 'Hardware' && <Cpu size={24} />}
                        {project.category === 'AI/ML' && <Database size={24} />}
                        {project.category === 'Web' && <Globe size={24} />}
                        {(!['Hardware', 'AI/ML', 'Web'].includes(project.category)) && <Rocket size={24} />}
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-x-2 group-hover:translate-x-0">
                        {project.links?.github && (
                            <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 rounded-full hover:bg-white hover:text-black transition-colors">
                                <Github size={18} />
                            </a>
                        )}
                        {project.links?.demo && (
                            <a href={project.links.demo} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 rounded-full hover:bg-primary hover:text-white transition-colors">
                                <ExternalLink size={18} />
                            </a>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="mb-8">
                    <h3 className="text-2xl font-black mb-3 group-hover:text-white transition-colors">{project.title}</h3>
                    <p className="text-slate-500 group-hover:text-slate-300 leading-relaxed font-medium line-clamp-3">
                        {project.description}
                    </p>
                </div>

                {/* Footer: Tags */}
                <div className="mt-auto flex flex-wrap gap-2">
                    {project.tags?.map((tag: string) => (
                        <span key={tag} className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-black/20 rounded-full text-slate-400 group-hover:bg-white/10 group-hover:text-white transition-colors">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    )
}

import { Rocket } from 'lucide-react'

export default function Projects() {
    const { data } = useData()
    const projectsData = data.projects || []
    const [filter, setFilter] = useState<Category>('All')

    const filteredProjects = filter === 'All'
        ? projectsData
        : projectsData.filter(p => p.category === filter)

    const categories: Category[] = ['All', 'Hardware', 'AI/ML', 'Web']
    const featuredProject = projectsData.find(p => p.featured) || projectsData[0]

    return (
        <div className="pt-24 md:pt-32 px-6 min-h-screen relative overflow-hidden">
            {/* Background Decoration */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10">
                <div className="absolute top-[10%] right-[5%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-primary/5 rounded-full blur-[80px] md:blur-[120px]" />
                <div className="absolute bottom-[10%] left-[5%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-blue-500/5 rounded-full blur-[100px] md:blur-[120px]" />
            </div>

            <ScrollSection>
                <div className="max-w-7xl mx-auto">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-20 gap-8">
                        <div>
                            <h1 className="massive-heading overflow-hidden">
                                <motion.div
                                    initial={{ y: "100%" }}
                                    animate={{ y: 0 }}
                                    transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
                                >
                                    our
                                </motion.div>
                                <motion.span
                                    className="text-primary italic block"
                                    initial={{ y: "100%" }}
                                    animate={{ y: 0 }}
                                    transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1], delay: 0.1 }}
                                >
                                    projects.
                                </motion.span>
                            </h1>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.8 }}
                                className="text-lg md:text-2xl text-slate-500 mt-6 md:mt-8 max-w-xl font-medium"
                            >
                                We don't just write code; we engineer systems. Explore our archive of active and deployed initiatives.
                            </motion.p>
                        </div>

                        {/* Filter Tabs - Scrollable on mobile */}
                        <div className="flex gap-2 p-1.5 bg-secondary/50 backdrop-blur-md rounded-full border border-white/5 overflow-x-auto no-scrollbar max-w-full">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setFilter(cat)}
                                    className={`px-4 md:px-6 py-2 md:py-3 rounded-full text-xs md:text-sm font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap ${filter === cat
                                        ? 'bg-black text-white shadow-lg'
                                        : 'text-slate-400 hover:text-black hover:bg-white/50'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Featured Project */}
                    {filter === 'All' && featuredProject && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-12 md:mb-16 group relative"
                        >
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-[2rem] md:rounded-[3rem] opacity-20 blur-2xl group-hover:opacity-40 transition-opacity duration-500" />
                            <div className="relative bg-black rounded-[2rem] md:rounded-[3rem] p-8 md:p-16 text-white overflow-hidden">
                                <div className="absolute top-0 right-0 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-white/5 rounded-full blur-[80px] md:blur-[100px] translate-x-1/3 -translate-y-1/3 pointer-events-none" />

                                <div className="relative z-10 flex flex-col lg:flex-row justify-between gap-8 lg:items-center">
                                    <div className="flex-1">
                                        <div className="inline-block px-3 py-1.5 rounded-full bg-primary/20 text-primary font-bold uppercase tracking-widest text-[10px] md:text-xs mb-4 md:mb-6 border border-primary/20">
                                            Featured Project
                                        </div>
                                        <h2 className="text-3xl md:text-5xl lg:text-7xl font-black mb-4 md:mb-6">{featuredProject.title}</h2>
                                        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-6 md:mb-8 font-medium">
                                            {featuredProject.description}
                                        </p>
                                        <div className="flex flex-wrap gap-4">
                                            {featuredProject.links?.demo && (
                                                <a href={featuredProject.links.demo} target="_blank" rel="noopener noreferrer" className="bg-white text-black px-8 py-4 rounded-full text-base font-bold uppercase tracking-wider hover:bg-primary hover:text-white transition-all text-center">
                                                    Launch Demo
                                                </a>
                                            )}
                                            {featuredProject.links?.github && (
                                                <a href={featuredProject.links.github} target="_blank" rel="noopener noreferrer" className="bg-white/10 text-white px-8 py-4 rounded-full text-base font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-all text-center">
                                                    Github
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    {/* Tech Stack Visual */}
                                    <div className="flex flex-row lg:flex-col gap-3 md:gap-4 overflow-x-auto no-scrollbar">
                                        {featuredProject.tags?.slice(0, 3).map((tech: string) => (
                                            <div key={tech} className="px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 font-mono text-center text-sm md:text-base min-w-[100px] lg:w-32">
                                                {tech}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Projects Grid */}
                    <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence mode="popLayout">
                            {filteredProjects.filter(p => filter === 'All' ? !p.featured : true).map((project) => (
                                <ProjectCard key={project.id} project={project} />
                            ))}
                        </AnimatePresence>
                    </motion.div>

                </div>
            </ScrollSection>
        </div>
    )
}
