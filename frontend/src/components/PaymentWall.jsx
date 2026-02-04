import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { motion } from 'framer-motion';

function PaymentWall({ onClose }) {
    const { user } = useUser();

    const handleUpgradeClick = (type) => {
        alert(`🎉 Upgrading to ${type}!\n\n✨ Stripe payment integration coming soon!\nYou'll be redirected to a secure checkout page.`);
    };

    return (
        <div
            className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[9999] p-4"
            onClick={onClose}
        >
            <motion.div
                className="bg-gradient-to-br from-white via-pink-50 to-purple-50 max-w-6xl w-full max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl border-4 border-primary p-6 sm:p-10 md:p-12 relative"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 sm:top-6 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-red-100 hover:bg-red-200 transition-all duration-300 text-4xl font-bold text-red-600 hover:scale-110 hover:rotate-90 border-3 border-red-300"
                >
                    ×
                </button>

                <div className="text-center mb-10">
                    <div className="flex justify-center gap-3 text-6xl mb-4">
                        <motion.span animate={{ rotate: [0, 15, 0] }} transition={{ duration: 1, repeat: Infinity }}>🎉</motion.span>
                        <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}>✨</motion.span>
                        <motion.span animate={{ rotate: [0, -15, 0] }} transition={{ duration: 1, repeat: Infinity, delay: 0.6 }}>🌟</motion.span>
                    </div>

                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-black mb-4 text-gradient-fun">
                        Keep the Magic Going! 🚀
                    </h2>

                    <p className="text-xl sm:text-2xl text-gray-700 font-semibold max-w-3xl mx-auto">
                        You've used all your free stories! Choose a plan to create more magical adventures.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                    {/* Unlimited Plan */}
                    <div className="bg-gradient-to-br from-primary to-accent rounded-3xl p-8 sm:p-10 border-4 border-yellow-400 shadow-2xl hover:scale-105 transition-all duration-300 relative">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-sunshine px-6 py-2 rounded-full border-4 border-yellow-400 shadow-xl">
                            <span className="font-black text-lg sm:text-xl text-gray-800">⭐ BEST VALUE ⭐</span>
                        </div>

                        <div className="text-7xl mb-4 text-center">🚀</div>

                        <h3 className="text-3xl sm:text-4xl font-display font-black mb-4 text-white text-center">
                            Unlimited Stories!
                        </h3>

                        <div className="text-center mb-6">
                            <span className="text-5xl sm:text-6xl font-black text-white">
                                $4.99
                            </span>
                            <span className="text-2xl text-white/90">/month</span>
                        </div>

                        <ul className="space-y-4 mb-8 text-white text-lg sm:text-xl font-semibold">
                            <li className="flex items-center gap-3">
                                <span className="text-3xl">✓</span>
                                <span>Create unlimited stories!</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="text-3xl">✓</span>
                                <span>All personalization options</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="text-3xl">✓</span>
                                <span>Beautiful AI pictures</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="text-3xl">✓</span>
                                <span>Priority support</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="text-3xl">✓</span>
                                <span>Cancel anytime!</span>
                            </li>
                        </ul>

                        <button
                            onClick={() => handleUpgradeClick('Unlimited')}
                            className="w-full px-8 py-5 bg-white text-primary rounded-full font-black text-2xl shadow-xl hover:scale-105 transition-all border-4 border-white/50"
                        >
                            Get Unlimited! 🎊
                        </button>
                    </div>

                    {/* Pay-Per-Story Plan */}
                    <div className="bg-white rounded-3xl p-8 sm:p-10 border-4 border-bubble shadow-xl hover:scale-105 transition-all duration-300">
                        <div className="text-7xl mb-4 text-center">🎯</div>

                        <h3 className="text-3xl sm:text-4xl font-display font-black mb-4 text-gray-800 text-center">
                            Just One Story
                        </h3>

                        <div className="text-center mb-6">
                            <span className="text-5xl sm:text-6xl font-black text-gradient-fun">
                                $0.99
                            </span>
                            <span className="text-2xl text-gray-600">/story</span>
                        </div>

                        <ul className="space-y-4 mb-8 text-gray-700 text-lg sm:text-xl font-semibold">
                            <li className="flex items-center gap-3">
                                <span className="text-3xl">✓</span>
                                <span>Buy stories one at a time</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="text-3xl">✓</span>
                                <span>Full personalization</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="text-3xl">✓</span>
                                <span>Beautiful pictures</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="text-3xl">✓</span>
                                <span>No subscription needed!</span>
                            </li>
                        </ul>

                        <button
                            onClick={() => handleUpgradeClick('Pay-Per-Story')}
                            className="w-full px-8 py-5 bg-gradient-to-r from-bubble to-ocean text-white rounded-full font-black text-2xl shadow-xl hover:scale-105 transition-all"
                        >
                            Buy a Story! 💫
                        </button>
                    </div>
                </div>

                <p className="text-center text-lg sm:text-xl text-gray-600 font-semibold mt-10">
                    🔒 Secure payment powered by Stripe • Cancel anytime, no questions asked!
                </p>
            </motion.div>
        </div>
    );
}

export default PaymentWall;
