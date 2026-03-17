import { Link } from 'react-router-dom'
import { Github, Twitter, Linkedin, Mail } from 'lucide-react'

export default function Footer() {
    const links = [
        { label: 'Home', path: '/' },
        { label: 'Projects', path: '/projects' },
        { label: 'Events', path: '/events' },
        { label: 'Team', path: '/team' },
        { label: 'Gallery', path: '/gallery' },
        { label: 'Blogs', path: '/blogs' },
    ]

    return (
        <footer className="bg-black border-t border-white/10 pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <Link to="/" className="flex items-center gap-3 mb-6">
                            <img src="/logo.png" alt="IOT Club PCCoE" className="h-10 w-auto" />
                            <span className="text-2xl font-black tracking-tighter text-white font-display uppercase">
                                IOT Club <span className="text-primary italic">PCCoE</span>
                            </span>
                        </Link>
                        <p className="text-slate-400 max-w-sm mb-8">
                            The premier hub for Internet of Things innovation at PCCoE. We build, connect, and automate the future.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-all transform hover:scale-110">
                                <Github size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-all transform hover:scale-110">
                                <Twitter size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-all transform hover:scale-110">
                                <Linkedin size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h4 className="text-white font-bold mb-6 text-lg">Navigation</h4>
                        <ul className="space-y-4">
                            {links.map((link) => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className="text-slate-400 hover:text-primary transition-colors inline-flex items-center gap-2 group"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-primary transition-colors" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-bold mb-6 text-lg">Contact</h4>
                        <ul className="space-y-4">
                            <li>
                                <a href="mailto:iotclub@example.com" className="text-slate-400 hover:text-primary transition-colors flex items-center gap-3">
                                    <Mail size={16} />
                                    iotclub@example.com
                                </a>
                            </li>
                            <li className="text-slate-400 flex items-start gap-3">
                                <span className="mt-1 block w-2 h-2 rounded-full bg-primary animate-pulse" />
                                <span>
                                    Pimpri Chinchwad College of Engineering<br />
                                    Sector 26, Pradhikaran, Nigdi, Pune
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-xs font-mono text-slate-500 uppercase tracking-widest">
                        // CORE_OPERATIONS // {new Date().getFullYear()} IOT_CLUB_PCCOE
                    </div>
                    <div className="text-slate-500 text-sm">
                        Designed & Built by <span className="text-white">Web Team</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}
