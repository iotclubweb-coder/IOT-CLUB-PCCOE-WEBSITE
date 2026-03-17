import { Github, Linkedin, Twitter } from 'lucide-react'

import { useData } from '../../context/DataContext'

export default function Team() {
    const { data } = useData()
    const members = data.team

    return (
        <section id="team" className="py-20 md:py-40 px-6 max-w-7xl mx-auto bg-white">
            <div className="reveal-up mb-12 md:mb-24">
                <h2 className="massive-heading">
                    the <span className="text-primary italic">core</span> <br className="hidden sm:block" />
                    builders.
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {members.map((member) => (
                    <div key={member.id} className="reveal-up group">
                        <div className="relative mb-8 rounded-[3rem] overflow-hidden bg-secondary aspect-square flex items-center justify-center transition-transform hover:scale-[1.02] duration-500">
                            <img
                                src={member.image?.startsWith('http') ? member.image : `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_auto/v1/${member.image}`}
                                alt={member.name}
                                className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>

                        <h3 className="text-4xl font-black lowercase tracking-tighter mb-2">{member.name}</h3>
                        <div className="text-primary font-bold lowercase tracking-widest text-sm mb-6">{member.role}</div>

                        <div className="flex items-center gap-6">
                            <Github className="w-5 h-5 text-slate-400 hover:text-black transition-colors" />
                            <Linkedin className="w-5 h-5 text-slate-400 hover:text-black transition-colors" />
                            <Twitter className="w-5 h-5 text-slate-400 hover:text-black transition-colors" />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
