import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { UserButton, useAuth } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { storyAPI, setAuthToken } from '../lib/api';
import TextToSpeech from '../components/TextToSpeech';

function StoryView() {
    const { id } = useParams();
    const { getToken } = useAuth();

    const [story, setStory] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadStory();
    }, [id]);

    const loadStory = async () => {
        try {
            const token = await getToken();
            setAuthToken(token);
            const data = await storyAPI.getById(id);
            setStory(data.story);
        } catch (err) {
            console.error('Failed to load story:', err);
            setError('Failed to load story');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100">
                <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b-4 border-primary/30 shadow-lg">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-4 sm:py-6">
                            <Link to="/" className="flex items-center gap-3">
                                <span className="text-4xl sticker">📚</span>
                                <span className="text-2xl sm:text-3xl font-display font-extrabold text-gradient-fun">
                                    StoryMagic
                                </span>
                            </Link>
                            <UserButton afterSignOutUrl="/" />
                        </div>
                    </div>
                </nav>

                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
                    <div className="w-16 h-16 border-8 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                    <p className="text-gray-700 text-2xl font-bold">Loading your magical story...</p>
                </div>
            </div>
        );
    }

    if (error || !story) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100">
                <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b-4 border-primary/30 shadow-lg">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-4 sm:py-6">
                            <Link to="/" className="flex items-center gap-3">
                                <span className="text-4xl sticker">📚</span>
                                <span className="text-2xl sm:text-3xl font-display font-extrabold text-gradient-fun">
                                    StoryMagic
                                </span>
                            </Link>
                            <UserButton afterSignOutUrl="/" />
                        </div>
                    </div>
                </nav>

                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8 px-4 text-center">
                    <div className="text-8xl">😢</div>
                    <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-800">Story Not Found!</h2>
                    <p className="text-gray-600 text-xl">{error || 'This story could not be found.'}</p>
                    <Link to="/dashboard" className="px-10 py-5 bg-gradient-to-r from-primary to-accent text-white rounded-full font-black text-2xl shadow-2xl hover:scale-110 transition-all border-4 border-white">
                        🪄 Create New Story
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100">
            {/* Navigation */}
            <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b-4 border-primary/30 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row justify-between items-center py-4 sm:py-6 gap-3">
                        <Link to="/" className="flex items-center gap-3">
                            <span className="text-4xl sticker">📚</span>
                            <span className="text-2xl sm:text-3xl font-display font-extrabold text-gradient-fun">
                                StoryMagic
                            </span>
                        </Link>

                        <div className="flex gap-3 items-center flex-wrap justify-center">
                            <Link to="/dashboard" className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-secondary to-ocean text-white rounded-full font-bold text-sm sm:text-base hover:scale-105 transition-all shadow-lg">
                                ✨ New Story
                            </Link>
                            <Link to="/stories" className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-bubble to-ocean text-white rounded-full font-bold text-sm sm:text-base hover:scale-105 transition-all shadow-lg">
                                📚 All Stories
                            </Link>
                            <UserButton afterSignOutUrl="/" />
                        </div>
                    </div>
                </div>
            </nav>

            {/* Story Content */}
            <div className="py-8 sm:py-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        className="text-center mb-8 sm:mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="flex justify-center gap-2 text-5xl mb-6">
                            <motion.span animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>⭐</motion.span>
                            <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}>✨</motion.span>
                            <motion.span animate={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}>🌟</motion.span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black mb-6 text-gradient-fun">
                            {story.childName}'s Amazing Adventure! 🎉
                        </h1>

                        <div className="flex flex-wrap gap-3 sm:gap-4 justify-center text-base sm:text-lg">
                            <span className="px-5 py-3 bg-pink-100 border-3 border-pink-200 rounded-full text-gray-700 font-bold">
                                📖 {story.readingTimeMinutes} min
                            </span>
                            <span className="px-5 py-3 bg-purple-100 border-3 border-purple-200 rounded-full text-gray-700 font-bold">
                                🎯 {story.moralLesson}
                            </span>
                            <span className="px-5 py-3 bg-blue-100 border-3 border-blue-200 rounded-full text-gray-700 font-bold">
                                📅 {new Date(story.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </motion.div>

                    <motion.div
                        className="rounded-3xl overflow-hidden shadow-2xl mb-8 sm:mb-12 border-4 border-white"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                    >
                        <img
                            src={story.imageUrl}
                            alt={`${story.childName} and the ${story.favoriteAnimal}`}
                            className="w-full h-auto"
                            onError={(e) => {
                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAyNCIgaGVpZ2h0PSIxMDI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDI0IiBoZWlnaHQ9IjEwMjQiIGZpbGw9IiNGRkU1RTUiLz48dGV4dCB4PSI1MCUiIHk9IjQ1JSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjQ4IiBmaWxsPSIjRkY2OUI0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn4+sPC90ZXh0Pjx0ZXh0IHg9IjUwJSIgeT0iNTUlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMzIiIGZpbGw9IiNGRjY5QjQiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlN0b3J5IEltYWdlPC90ZXh0Pjwvc3ZnPg==';
                            }}
                        />
                    </motion.div>

                    {/* Text-to-Speech Component */}
                    <TextToSpeech text={story.storyText} />

                    <motion.div
                        className="bg-white rounded-3xl shadow-2xl border-4 border-primary/30 p-8 sm:p-10 md:p-12 mb-12"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                    >
                        <div className="space-y-6 text-lg sm:text-xl leading-relaxed text-gray-700">
                            {story.storyText.split('\n').map((paragraph, index) => (
                                paragraph.trim() && (
                                    <p key={index} className="first-letter:text-5xl first-letter:font-bold first-letter:text-primary first-letter:mr-2 first-letter:float-left">
                                        {paragraph.trim()}
                                    </p>
                                )
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                    >
                        <Link to="/dashboard" className="px-10 py-5 bg-gradient-to-r from-primary to-accent text-white rounded-full font-black text-xl sm:text-2xl shadow-2xl hover:scale-110 transition-all text-center border-4 border-white">
                            🪄 Create Another Story!
                        </Link>
                        <Link to="/stories" className="px-10 py-5 bg-gradient-to-r from-bubble to-ocean text-white rounded-full font-black text-xl sm:text-2xl shadow-xl hover:scale-105 transition-all text-center">
                            📚 View All Stories
                        </Link>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

export default StoryView;
