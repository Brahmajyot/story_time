import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserButton, useAuth } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { storyAPI, setAuthToken } from '../lib/api';
import PaymentWall from '../components/PaymentWall';

const ANIMALS = [
    '🐶 Puppy', '🐱 Kitten', '🐰 Bunny', '🐻 Teddy Bear', '🦁 Lion',
    '🐼 Panda', '🦊 Fox', '🐘 Elephant', '🦉 Owl', '🦄 Unicorn',
    '🐉 Dragon', '🦋 Butterfly', '🐢 Turtle', '🐬 Dolphin', '🦓 Zebra'
];

const MORAL_LESSONS = [
    '🤝 Sharing is Caring', '💪 Being Brave', '🌟 Being Kind', '🧠 Telling the Truth',
    '👯 Making Friends', '⚡ Never Giving Up', '❤️ Helping Others', '🎯 Being Responsible',
    '🙏 Saying Thank You', '🌈 Accepting Differences', '✨ Believing in Yourself', '🤗 Understanding Others'
];

function Dashboard() {
    const { getToken } = useAuth();
    const navigate = useNavigate();

    const [childName, setChildName] = useState('');
    const [favoriteAnimal, setFavoriteAnimal] = useState('');
    const [moralLesson, setMoralLesson] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [userStats, setUserStats] = useState(null);
    const [showPaymentWall, setShowPaymentWall] = useState(false);

    useEffect(() => {
        loadUserStats();
    }, []);

    const loadUserStats = async () => {
        try {
            const token = await getToken();
            setAuthToken(token);
            const data = await storyAPI.getCount();
            setUserStats(data);
        } catch (err) {
            console.error('Failed to load user stats:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!childName || !favoriteAnimal || !moralLesson) {
            setError('Please fill in all the magic ingredients! ✨');
            return;
        }

        if (userStats && !userStats.canGenerateStory) {
            setShowPaymentWall(true);
            return;
        }

        setIsLoading(true);

        try {
            const token = await getToken();
            setAuthToken(token);

            const result = await storyAPI.generate({
                childName: childName.trim(),
                favoriteAnimal: favoriteAnimal.replace(/[^\w\s]/gi, '').trim(),
                moralLesson: moralLesson.replace(/[^\w\s]/gi, '').trim()
            });

            if (result.success) {
                navigate(`/story/${result.story.id}`);
            }
        } catch (err) {
            console.error('Failed to generate story:', err);

            if (err.response?.data?.needsPayment) {
                setShowPaymentWall(true);
            } else {
                setError(err.response?.data?.error || 'Oops! Something went wrong. Try again! 🎪');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const getStoriesRemainingText = () => {
        if (!userStats) return 'Loading...';

        if (userStats.subscriptionType === 'unlimited') {
            return '∞ Unlimited Stories! 🚀';
        }

        if (userStats.creditsRemaining > 0) {
            return `${userStats.creditsRemaining} credit${userStats.creditsRemaining === 1 ? '' : 's'} left! ⭐`;
        }

        const remaining = 5 - userStats.storiesGenerated;
        if (remaining > 0) {
            return `${remaining} free stor${remaining === 1 ? 'y' : 'ies'} left! 🎁`;
        }

        return 'Time to upgrade! 🌟';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100">
            {/* Navigation */}
            <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b-4 border-primary/30 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4 sm:py-6">
                        <Link to="/" className="flex items-center gap-3">
                            <span className="text-4xl sticker">📚</span>
                            <span className="text-2xl sm:text-3xl font-display font-extrabold text-gradient-fun">
                                StoryMagic
                            </span>
                        </Link>

                        <div className="flex gap-3 items-center">
                            <Link to="/stories" className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-bubble to-ocean text-white rounded-full font-bold text-sm sm:text-base hover:scale-105 transition-all shadow-lg">
                                📚 My Stories
                            </Link>
                            <UserButton afterSignOutUrl="/" />
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="py-8 sm:py-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        className="text-center mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="flex justify-center gap-3 text-6xl mb-4">
                            <motion.span animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>✨</motion.span>
                            <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}>🎨</motion.span>
                            <motion.span animate={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}>🌟</motion.span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-black mb-4 text-gradient-fun">
                            Let's Create Magic! ✨
                        </h1>
                        <p className="text-xl sm:text-2xl text-gray-700 font-semibold mb-6">
                            Tell us about your amazing child and we'll create a special story just for them!
                        </p>

                        <div className="inline-block bg-gradient-to-r from-sunshine to-peach px-6 sm:px-10 py-4 rounded-full border-4 border-yellow-400 shadow-xl">
                            <span className="text-xl sm:text-2xl font-black text-gray-800">{getStoriesRemainingText()}</span>
                        </div>
                    </motion.div>

                    <motion.div
                        className="bg-white rounded-3xl shadow-2xl border-4 border-primary/30 p-6 sm:p-10 md:p-12"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                    >
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div>
                                <label htmlFor="childName" className="block text-2xl sm:text-3xl font-display font-bold mb-4 text-gray-800 flex items-center gap-3">
                                    <span className="text-4xl">👶</span> What's your child's name?
                                </label>
                                <input
                                    id="childName"
                                    type="text"
                                    className="w-full px-6 py-5 bg-pink-50 border-4 border-pink-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all text-xl sm:text-2xl font-semibold"
                                    placeholder="Enter a magical name..."
                                    value={childName}
                                    onChange={(e) => setChildName(e.target.value)}
                                    disabled={isLoading}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="favoriteAnimal" className="block text-2xl sm:text-3xl font-display font-bold mb-4 text-gray-800 flex items-center gap-3">
                                    <span className="text-4xl">🦄</span> Pick a favorite animal friend!
                                </label>
                                <select
                                    id="favoriteAnimal"
                                    className="w-full px-6 py-5 bg-blue-50 border-4 border-blue-200 rounded-2xl text-gray-800 focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/20 transition-all text-xl sm:text-2xl font-semibold cursor-pointer"
                                    value={favoriteAnimal}
                                    onChange={(e) => setFavoriteAnimal(e.target.value)}
                                    disabled={isLoading}
                                    required
                                >
                                    <option value="" className="bg-white">Choose an animal friend...</option>
                                    {ANIMALS.map((animal) => (
                                        <option key={animal} value={animal} className="bg-white text-xl">
                                            {animal}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="moralLesson" className="block text-2xl sm:text-3xl font-display font-bold mb-4 text-gray-800 flex items-center gap-3">
                                    <span className="text-4xl">💖</span> What lesson should they learn?
                                </label>
                                <select
                                    id="moralLesson"
                                    className="w-full px-6 py-5 bg-purple-50 border-4 border-purple-200 rounded-2xl text-gray-800 focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/20 transition-all text-xl sm:text-2xl font-semibold cursor-pointer"
                                    value={moralLesson}
                                    onChange={(e) => setMoralLesson(e.target.value)}
                                    disabled={isLoading}
                                    required
                                >
                                    <option value="" className="bg-white">Pick an important lesson...</option>
                                    {MORAL_LESSONS.map((lesson) => (
                                        <option key={lesson} value={lesson} className="bg-white text-xl">
                                            {lesson}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {error && (
                                <motion.div
                                    className="p-5 bg-red-100 border-4 border-red-300 rounded-2xl text-red-700 text-center text-xl font-bold"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                >
                                    {error}
                                </motion.div>
                            )}

                            <button
                                type="submit"
                                className="w-full px-8 py-6 sm:py-7 bg-gradient-to-r from-primary via-accent to-secondary text-white rounded-full font-black text-2xl sm:text-3xl shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-4 border-4 border-white disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Creating Magic...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>🪄</span>
                                        <span>Create My Story!</span>
                                        <span>✨</span>
                                    </>
                                )}
                            </button>
                        </form>

                        {isLoading && (
                            <div className="mt-10 text-center space-y-4">
                                <motion.p
                                    className="text-2xl font-bold text-primary"
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                >
                                    🎨 Our AI is painting your story...
                                </motion.p>
                                <motion.p
                                    className="text-xl text-gray-600 font-semibold"
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                                >
                                    🖼️ Creating beautiful pictures...
                                </motion.p>
                                <motion.p
                                    className="text-xl text-gray-600 font-semibold"
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
                                >
                                    ✨ Sprinkling fairy dust...
                                </motion.p>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* Payment Wall Modal */}
            {showPaymentWall && (
                <PaymentWall onClose={() => setShowPaymentWall(false)} />
            )}
        </div>
    );
}

export default Dashboard;
