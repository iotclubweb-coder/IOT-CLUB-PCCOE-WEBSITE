import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '../../lib/utils'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
    const location = useLocation()
    const activePath = location.pathname
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const navItems = [
        { path: '/', label: 'home' },
        { path: '/projects', label: 'projects' },
        { path: '/events', label: 'events' },
        { path: '/team', label: 'team' },
        { path: '/gallery', label: 'gallery' },
        { path: '/blogs', label: 'blogs' },
    ]

    return (
        <>
            {/* Desktop & Mobile Pill Nav */}
            <div className="pill-nav px-2 justify-between">
                <div className="flex items-center gap-4 pl-2">
                    <Link to="/" onClick={() => setIsMenuOpen(false)}>
                        <img src="/logo.png" alt="IOT Club PCCoE" className="h-10 w-auto rounded-sm" />
                    </Link>
                </div>

                <div className="hidden md:flex items-center gap-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                "pill-nav-item",
                                activePath === item.path && "active"
                            )}
                        >
                            {item.label}
                        </Link>
                    ))}
                    <div className="w-px h-6 bg-white/20 mx-1" />
                </div>

                <div className="md:hidden flex items-center pr-2">
                    <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="p-2 text-white/60 hover:text-white transition-colors"
                    >
                        {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                <button className="bg-primary text-white px-6 py-2 rounded-full text-sm font-bold hover:brightness-110 transition-all">
                    join
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={cn(
                "fixed inset-0 z-40 bg-black/95 backdrop-blur-xl transition-all duration-500 md:hidden flex flex-col items-center justify-center gap-8",
                isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            )}>
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMenuOpen(false)}
                        className={cn(
                            "text-4xl font-black lowercase tracking-tighter transition-all",
                            activePath === item.path ? "text-primary" : "text-white/40 hover:text-white"
                        )}
                    >
                        {item.label}
                    </Link>
                ))}
            </div>
        </>
    )
}
