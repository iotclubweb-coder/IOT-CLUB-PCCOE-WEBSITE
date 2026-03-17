import { lazy, Suspense } from 'react'
import Hero from '../components/layout/Hero'
import ScrollSection from '../components/layout/ScrollSection'
import ScrollingMarquee from '../components/layout/ScrollingMarquee'
const Events = lazy(() => import('../components/layout/Events'))
const Sustainability = lazy(() => import('../components/layout/Sustainability'))
import About from '../components/layout/About'

export default function Home() {
    return (
        <>
            <ScrollSection>
                <Hero />
            </ScrollSection>

            <ScrollSection id="about">
                <About />
            </ScrollSection>

            <ScrollSection>
                <Suspense fallback={<div className="h-[800px] flex items-center justify-center bg-secondary">Loading Scene...</div>}>
                    <Sustainability />
                </Suspense>
            </ScrollSection>

            <ScrollingMarquee
                items={["INNOVATION", "INTERNET OF THINGS", "CONNECTIVITY", "AUTOMATION", "FUTURE TECH"]}
                speed={40}
            />

            <ScrollSection>
                <Suspense fallback={<div className="h-screen flex items-center justify-center bg-secondary">Loading Events...</div>}>
                    <Events />
                </Suspense>
            </ScrollSection>


            <ScrollSection id="contact" className="py-20 md:py-40 px-6 max-w-5xl mx-auto">
                <div className="reveal-up p-8 md:p-24 rounded-[2rem] md:rounded-[4rem] bg-black text-white text-center flex flex-col items-center shadow-2xl shadow-black/20">
                    <h2 className="massive-heading text-white mb-6 md:mb-8">
                        ready to <br className="hidden sm:block" />
                        <span className="text-primary italic">connect?</span>
                    </h2>
                    <p className="text-lg md:text-xl text-slate-400 mb-8 md:mb-12 max-w-xl font-medium">
                        Join the network today and start building the future of autonomous systems.
                    </p>
                    <div className="w-full max-w-md flex flex-col gap-4">
                        <input
                            type="email"
                            placeholder="user@domain.com"
                            className="w-full bg-white/10 border border-white/10 p-4 md:p-6 rounded-2xl md:rounded-3xl text-white font-bold text-base md:text-lg focus:border-primary outline-none transition-all placeholder:text-white/20"
                        />
                        <button className="bg-primary text-white p-4 md:p-6 rounded-2xl md:rounded-3xl text-lg md:text-xl font-black lowercase tracking-tighter hover:brightness-110 transition-all">
                            send signal
                        </button>
                    </div>
                </div>
            </ScrollSection>
        </>
    )
}
