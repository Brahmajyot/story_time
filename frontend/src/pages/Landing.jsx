import React from 'react';
import { Link } from 'react-router-dom';
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { motion } from 'framer-motion';

function Landing() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
            {/* Navigation */}
            <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b-4 border-primary/30 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4 sm:py-6">
                        <div className="flex items-center gap-3">
                            <span className="text-5xl sticker">📚</span>
                            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-gradient-fun">
                                StoryMagic
                            </h2>
                        </div>

                        <div className="flex gap-3 items-center">
                            <SignedOut>
                                <SignInButton mode="modal">
                                    <button className="hidden sm:block px-6 py-3 bg-white hover:bg-gray-50 border-3 border-primary rounded-full font-bold text-primary transition-all duration-300 hover:scale-105">
                                        Sign In
                                    </button>
                                </SignInButton>
                                <SignUpButton mode="modal">
                                    <button className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary to-accent text-white rounded-full font-bold text-base sm:text-lg shadow-xl hover:scale-105 transition-all duration-300 hover:shadow-2xl">
                                        Start Free! 🎉
                                    </button>
                                </SignUpButton>
                            </SignedOut>

                            <SignedIn>
                                <Link to="/dashboard" className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-secondary to-ocean text-white rounded-full font-bold text-base sm:text-lg shadow-xl hover:scale-105 transition-all duration-300">
                                   Magic✨
                                </Link>
                                <UserButton afterSignOutUrl="/" />
                            </SignedIn>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden px-4 py-12 sm:py-20">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        className="text-center relative z-10"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="flex justify-center gap-4 mb-6 text-6xl sm:text-7xl">
                            <motion.span animate={{ y: [0, -20, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0 }}>🦄</motion.span>
                            <motion.span animate={{ y: [0, -20, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}>🌟</motion.span>
                            <motion.span animate={{ y: [0, -20, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}>🎨</motion.span>
                        </div>

                        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-black leading-tight mb-6 text-gradient-fun">
                            Magical Stories
                            <br />
                            for Amazing Kids!
                        </h1>

                        <p className="text-xl sm:text-2xl md:text-3xl text-gray-700 mb-4 font-semibold max-w-4xl mx-auto px-4">
                            Create personalized bedtime stories with AI magic ✨
                        </p>

                        <div className="inline-block bg-sunshine px-8 py-4 rounded-full mb-8 border-4 border-yellow-400 shadow-xl transform hover:scale-105 transition-all">
                            <p className="text-2xl sm:text-3xl font-black text-gray-800">
                                🎁 Get 3 FREE Stories!
                            </p>
                        </div>

                        <motion.div
                            className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-10"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                        >
                            <SignedOut>
                                <SignUpButton mode="modal">
                                    <button className="px-10 sm:px-16 py-5 sm:py-6 text-2xl sm:text-3xl bg-gradient-to-r from-primary to-accent text-white rounded-full font-black shadow-2xl hover:scale-110 transition-all duration-300 hover:shadow-primary/60 border-4 border-white">
                                        🚀 Create My Story!
                                    </button>
                                </SignUpButton>
                            </SignedOut>

                            <SignedIn>
                                <Link to="/dashboard" className="px-10 sm:px-16 py-5 sm:py-6 text-2xl sm:text-3xl bg-gradient-to-r from-primary to-accent text-white rounded-full font-black shadow-2xl hover:scale-110 transition-all duration-300 border-4 border-white">
                                    🚀 Create My Story!
                                </Link>
                            </SignedIn>
                        </motion.div>

                        <div className="flex flex-wrap gap-6 justify-center mt-12 text-base sm:text-lg text-gray-700 font-semibold">
                            <span className="flex items-center gap-2">⭐ Loved by 10,000+ families</span>
                            <span className="flex items-center gap-2">📚 100,000+ stories created</span>
                            <span className="flex items-center gap-2">🌈 100% kid-safe</span>
                        </div>
                    </motion.div>
                </div>

                {/* Floating Decorations */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <motion.div className="absolute top-20 left-10 text-6xl" animate={{ y: [0, -30, 0], rotate: [0, 10, 0] }} transition={{ duration: 4, repeat: Infinity }}>🎈</motion.div>
                    <motion.div className="absolute top-40 right-20 text-6xl" animate={{ y: [0, -25, 0], rotate: [0, -10, 0] }} transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}>⭐</motion.div>
                    <motion.div className="absolute bottom-32 left-20 text-6xl" animate={{ y: [0, -20, 0], rotate: [0, 15, 0] }} transition={{ duration: 3, repeat: Infinity, delay: 1 }}>🌈</motion.div>
                    <motion.div className="absolute bottom-20 right-32 text-6xl" animate={{ y: [0, -35, 0], rotate: [0, -15, 0] }} transition={{ duration: 4.5, repeat: Infinity, delay: 1.5 }}>✨</motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 sm:py-24 px-4 bg-white/50">
                <div className="max-w-7xl mx-auto">
                    <motion.h2
                        className="text-4xl sm:text-5xl md:text-6xl font-display font-black text-center mb-4 text-gradient-fun"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        Why Kids Love StoryMagic! 🎉
                    </motion.h2>

                    <p className="text-center text-xl sm:text-2xl text-gray-600 mb-16 font-semibold">
                        Creating magical memories, one story at a time
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
                        <motion.div
                            className="card-fun text-center"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                        >
                            <div className="text-7xl sm:text-8xl mb-6">🎨</div>
                            <h3 className="text-2xl sm:text-3xl font-display font-bold mb-4 text-grape">Your Child is the Hero!</h3>
                            <p className="text-gray-600 text-lg leading-relaxed">Every story features your child's name, favorite animal, and teaches important life lessons they'll remember forever!</p>
                        </motion.div>

                        <motion.div
                            className="card-fun text-center"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="text-7xl sm:text-8xl mb-6">⚡</div>
                            <h3 className="text-2xl sm:text-3xl font-display font-bold mb-4 text-grape">Ready in Seconds!</h3>
                            <p className="text-gray-600 text-lg leading-relaxed">AI magic creates unique stories instantly with beautiful pictures. No waiting, just pure storytelling fun!</p>
                        </motion.div>

                        <motion.div
                            className="card-fun text-center"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="text-7xl sm:text-8xl mb-6">😴</div>
                            <h3 className="text-2xl sm:text-3xl font-display font-bold mb-4 text-grape">Perfect Bedtime Length</h3>
                            <p className="text-gray-600 text-lg leading-relaxed">Every story is just 5 minutes – perfect for cozy bedtime reading with your little ones!</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="py-16 sm:py-24 px-4">
                <div className="max-w-7xl mx-auto">
                    <motion.h2
                        className="text-4xl sm:text-5xl md:text-6xl font-display font-black text-center mb-16 text-gradient-fun"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        Choose Your Magic Plan! 🌟
                    </motion.h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Free Plan */}
                        <motion.div
                            className="bg-white rounded-3xl p-8 border-4 border-bubble shadow-xl hover:scale-105 transition-all duration-300"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                        >
                            <div className="text-6xl mb-4">🎁</div>
                            <h3 className="text-3xl font-display font-bold mb-4 text-gray-800">Free Trial</h3>
                            <div className="text-5xl font-black text-gradient-fun mb-6">$0</div>
                            <ul className="space-y-4 mb-8 text-gray-700 text-lg">
                                <li className="flex items-start gap-3"><span className="text-2xl">✓</span><span>3 magical stories</span></li>
                                <li className="flex items-start gap-3"><span className="text-2xl">✓</span><span>Full personalization</span></li>
                                <li className="flex items-start gap-3"><span className="text-2xl">✓</span><span>Beautiful AI pictures</span></li>
                                <li className="flex items-start gap-3"><span className="text-2xl">✓</span><span>No credit card needed!</span></li>
                            </ul>
                            <SignedOut>
                                <SignUpButton mode="modal">
                                    <button className="w-full px-6 py-4 bg-gradient-to-r from-bubble to-ocean text-white rounded-full font-bold text-xl shadow-lg hover:scale-105 transition-all">
                                        Start Free! 🎉
                                    </button>
                                </SignUpButton>
                            </SignedOut>
                            <SignedIn>
                                <Link to="/dashboard" className="block w-full px-6 py-4 bg-gradient-to-r from-bubble to-ocean text-white rounded-full font-bold text-xl shadow-lg hover:scale-105 transition-all text-center">
                                    Create Story! 🎉
                                </Link>
                            </SignedIn>
                        </motion.div>

                        {/* Unlimited Plan */}
                        <motion.div
                            className="bg-gradient-to-br from-primary to-accent rounded-3xl p-8 border-4 border-yellow-400 shadow-2xl transform md:scale-110 relative"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-sunshine px-6 py-2 rounded-full border-4 border-yellow-400 shadow-xl">
                                <span className="font-black text-xl text-gray-800">⭐ MOST POPULAR ⭐</span>
                            </div>
                            <div className="text-6xl mb-4">🚀</div>
                            <h3 className="text-3xl font-display font-bold mb-4 text-white">Unlimited Fun!</h3>
                            <div className="text-5xl font-black text-white mb-2">$4.99<span className="text-xl">/month</span></div>
                            <ul className="space-y-4 mb-8 text-white text-lg font-semibold">
                                <li className="flex items-start gap-3"><span className="text-2xl">✓</span><span>Unlimited stories!</span></li>
                                <li className="flex items-start gap-3"><span className="text-2xl">✓</span><span>All personalization</span></li>
                                <li className="flex items-start gap-3"><span className="text-2xl">✓</span><span>Beautiful pictures</span></li>
                                <li className="flex items-start gap-3"><span className="text-2xl">✓</span><span>Priority support</span></li>
                                <li className="flex items-start gap-3"><span className="text-2xl">✓</span><span>Cancel anytime</span></li>
                            </ul>
                            <SignedOut>
                                <SignUpButton mode="modal">
                                    <button className="w-full px-6 py-4 bg-white text-primary rounded-full font-black text-xl shadow-xl hover:scale-105 transition-all border-4 border-white/50">
                                        Get Unlimited! 🎊
                                    </button>
                                </SignUpButton>
                            </SignedOut>
                            <SignedIn>
                                <Link to="/dashboard" className="block w-full px-6 py-4 bg-white text-primary rounded-full font-black text-xl shadow-xl hover:scale-105 transition-all border-4 border-white/50 text-center">
                                    Upgrade Now! 🎊
                                </Link>
                            </SignedIn>
                        </motion.div>

                        {/* Pay-As-You-Go Plan */}
                        <motion.div
                            className="bg-white rounded-3xl p-8 border-4 border-peach shadow-xl hover:scale-105 transition-all duration-300"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="text-6xl mb-4">🎯</div>
                            <h3 className="text-3xl font-display font-bold mb-4 text-gray-800">Just One Story</h3>
                            <div className="text-5xl font-black text-gradient-fun mb-2">$0.99<span className="text-xl">/story</span></div>
                            <ul className="space-y-4 mb-8 text-gray-700 text-lg">
                                <li className="flex items-start gap-3"><span className="text-2xl">✓</span><span>Buy stories one at a time</span></li>
                                <li className="flex items-start gap-3"><span className="text-2xl">✓</span><span>Full personalization</span></li>
                                <li className="flex items-start gap-3"><span className="text-2xl">✓</span><span>Beautiful pictures</span></li>
                                <li className="flex items-start gap-3"><span className="text-2xl">✓</span><span>No subscription!</span></li>
                            </ul>
                            <SignedOut>
                                <SignUpButton mode="modal">
                                    <button className="w-full px-6 py-4 bg-gradient-to-r from-peach to-cherry text-white rounded-full font-bold text-xl shadow-lg hover:scale-105 transition-all">
                                        Buy a Story! 💫
                                    </button>
                                </SignUpButton>
                            </SignedOut>
                            <SignedIn>
                                <Link to="/dashboard" className="block w-full px-6 py-4 bg-gradient-to-r from-peach to-cherry text-white rounded-full font-bold text-xl shadow-lg hover:scale-105 transition-all text-center">
                                    Buy a Story! 💫
                                </Link>
                            </SignedIn>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white/80 border-t-4 border-primary/20 py-12 px-4 mt-16">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="flex justify-center gap-4 text-5xl mb-6">
                        <span className="sticker">🌟</span>
                        <span className="sticker">💖</span>
                        <span className="sticker">🎨</span>
                    </div>
                    <p className="text-xl text-gray-600 font-semibold">
                        © 2026 StoryMagic - Creating magical memories for families everywhere!
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default Landing;
