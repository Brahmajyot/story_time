import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserButton, useAuth } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { storyAPI, setAuthToken } from '../lib/api';

function Stories() {
    const { getToken } = useAuth();
    const [stories, setStories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadStories();
    }, []);

    const loadStories = async () => {
        try {
            const token = await getToken();
            setAuthToken(token);
            const data = await storyAPI.getAll();
            setStories(data.stories || []);
        } catch (err) {
            console.error('Failed to load stories:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
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
                            <Link to="/dashboard" className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary to-accent text-white rounded-full font-bold text-base sm:text-lg shadow-xl hover:scale-105 transition-all">
                                ✨ Create Story
                            </Link>
                            <UserButton afterSignOutUrl="/" />
                        </div>
                    </div>
                </div>
            </nav>

            {/* Content */}
            <div className="py-12 sm:py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        className="text-center mb-12 sm:mb-20"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="flex justify-center gap-3 text-6xl mb-4">
                            <motion.span className="sticker" animate={{ rotate: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}>📖</motion.span>
                            <motion.span className="sticker" animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}>🌟</motion.span>
                            <motion.span className="sticker" animate={{ rotate: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}>🎨</motion.span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-black mb-4 text-gradient-fun">
                            Your Story Collection! 📚
                        </h1>
                        <p className="text-xl sm:text-2xl text-gray-700 font-semibold">
                            All your magical adventures in one place!
                        </p>
                    </motion.div>

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-6">
                            <div className="w-16 h-16 border-8 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                            <p className="text-gray-600 text-2xl font-bold">Loading your magical stories...</p>
                        </div>
                    ) : stories.length === 0 ? (
                        <motion.div
                            className="card-fun max-w-2xl mx-auto p-12 text-center"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="text-8xl mb-6">📚</div>
                            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4 text-gray-800">No Stories Yet!</h2>
                            <p className="text-gray-600 mb-8 text-xl leading-relaxed">
                                Let's create your first magical adventure! It only takes a few seconds! ✨
                            </p>
                            <Link to="/dashboard" className="inline-block px-10 py-5 bg-gradient-to-r from-primary to-accent text-white rounded-full font-black text-2xl shadow-2xl hover:scale-110 transition-all border-4 border-white">
                                🪄 Create My First Story!
                            </Link>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                            {stories.map((story, index) => (
                                <motion.div
                                    key={story._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1, duration: 0.6 }}
                                >
                                    <Link
                                        to={`/story/${story._id}`}
                                        className="block bg-white rounded-3xl overflow-hidden border-4 border-bubble hover:border-primary shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-300"
                                    >
                                        <div className="h-56 overflow-hidden bg-gradient-to-br from-pink-100 to-purple-100">
                                            <img
                                                src={story.imageUrl}
                                                alt={`${story.childName} and ${story.favoriteAnimal}`}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/400x300/FFE5E5/FF69B4?text=Story';
                                                }}
                                            />
                                        </div>

                                        <div className="p-6">
                                            <h3 className="text-2xl font-display font-bold mb-3 text-gradient-fun line-clamp-2">
                                                {story.childName}'s Adventure! 🌟
                                            </h3>

                                            <div className="flex flex-wrap gap-2 mb-4">
                                                <span className="px-4 py-2 bg-pink-100 rounded-full text-gray-700 font-semibold text-sm border-2 border-pink-200">
                                                    {story.favoriteAnimal}
                                                </span>
                                                <span className="px-4 py-2 bg-purple-100 rounded-full text-gray-700 font-semibold text-sm border-2 border-purple-200">
                                                    {story.moralLesson}
                                                </span>
                                            </div>

                                            <div className="flex justify-between items-center pt-4 border-t-2 border-gray-100 text-sm text-gray-600 font-semibold">
                                                <span>📅 {new Date(story.createdAt).toLocaleDateString()}</span>
                                                <span>⏱️ {story.readingTimeMinutes} min</span>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Stories;
