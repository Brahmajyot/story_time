import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function TextToSpeech({ text, onHighlight }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [voices, setVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState(null);
    const [rate, setRate] = useState(1);
    const [showControls, setShowControls] = useState(false);
    const [progress, setProgress] = useState(0);

    const utteranceRef = useRef(null);
    const isPlayingRef = useRef(false); // Track playing state with ref to avoid stale closures
    const synth = window.speechSynthesis;

    // Keep ref in sync with state for UI consistency, but rely on ref for logic
    useEffect(() => {
        isPlayingRef.current = isPlaying;
    }, [isPlaying]);

    // Load available voices
    useEffect(() => {
        const loadVoices = () => {
            const availableVoices = synth.getVoices();

            // Filter for English voices, prioritize natural/child-friendly ones
            const englishVoices = availableVoices.filter(voice =>
                voice.lang.startsWith('en')
            );

            // Sort voices: prioritize Google/Microsoft natural voices
            const sortedVoices = englishVoices.sort((a, b) => {
                const aScore = (a.name.includes('Google') || a.name.includes('Natural')) ? 2 :
                    (a.name.includes('Microsoft') || a.name.includes('Female')) ? 1 : 0;
                const bScore = (b.name.includes('Google') || b.name.includes('Natural')) ? 2 :
                    (b.name.includes('Microsoft') || b.name.includes('Female')) ? 1 : 0;
                return bScore - aScore;
            });

            setVoices(sortedVoices);

            // Auto-select best voice
            if (sortedVoices.length > 0 && !selectedVoice) {
                // Try to find a female/child-friendly voice
                const preferredVoice = sortedVoices.find(v =>
                    v.name.includes('Female') || v.name.includes('Samantha') ||
                    v.name.includes('Google US English')
                ) || sortedVoices[0];

                setSelectedVoice(preferredVoice);
            }
        };

        loadVoices();
        synth.addEventListener('voiceschanged', loadVoices);

        return () => {
            synth.removeEventListener('voiceschanged', loadVoices);
            isPlayingRef.current = false; // Ensure we stop text processing on unmount
            if (synth.speaking) {
                synth.cancel();
            }
        };
    }, []);

    const speakText = () => {
        if (!text || !selectedVoice) return;

        // Cancel any ongoing speech
        synth.cancel();
        isPlayingRef.current = true; // Explicitly set ref to true when starting

        // Clean and normalize the text - handle line breaks and extra whitespace
        // Improved regex to handle various sentence endings including quotes
        const cleanedText = text
            .replace(/\r\n/g, ' ')
            .replace(/\n/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

        // Split text into sentences but keep punctuation
        // This regex splits after . ! ? or " or ' followed by space
        const sentences = cleanedText.match(/[^.!?]+[.!?]+["']?|[^.!?]+$/g) || [cleanedText];

        console.log(`📖 Total sentences to read: ${sentences.length}`);

        let currentIndex = 0;

        const speakSentence = (index) => {
            // Check ref instead of state to avoid stale closure
            if (!isPlayingRef.current) {
                console.log('⏹️ Stopped reading (ref is false)');
                return;
            }

            if (index >= sentences.length) {
                console.log('✅ Finished reading ALL sentences!');
                setIsPlaying(false);
                isPlayingRef.current = false;
                setIsPaused(false);
                setProgress(100);
                return;
            }

            const sentence = sentences[index].trim();
            if (!sentence) {
                speakSentence(index + 1); // Skip empty sentences
                return;
            }

            console.log(`🗣️ Reading sentence ${index + 1}/${sentences.length}`);

            const utterance = new SpeechSynthesisUtterance(sentence);
            utterance.voice = selectedVoice;
            utterance.rate = rate;
            utterance.pitch = 1.1;

            utterance.onstart = () => {
                const progressPercent = ((index + 1) / sentences.length) * 100;
                setProgress(progressPercent);
            };

            utterance.onend = () => {
                currentIndex++;
                // Check ref for continuation
                if (currentIndex < sentences.length && isPlayingRef.current) {
                    speakSentence(currentIndex);
                } else if (currentIndex >= sentences.length) {
                    console.log('🎉 Story narration complete!');
                    setIsPlaying(false);
                    isPlayingRef.current = false;
                    setProgress(100);
                }
            };

            utterance.onerror = (error) => {
                console.error('❌ Speech error:', error);
                setIsPlaying(false);
                isPlayingRef.current = false;
            };

            utteranceRef.current = utterance;
            synth.speak(utterance);
        };

        speakSentence(0);
    };

    const handlePlay = () => {
        if (isPaused) {
            synth.resume();
            setIsPaused(false);
            isPlayingRef.current = true;
        } else {
            setIsPlaying(true);
            // speakText handles setting isPlayingRef.current = true
            speakText();
        }
    };

    const handlePause = () => {
        synth.pause();
        setIsPaused(true);
        // Don't set isPlayingRef to false here, as we want to resume, not stop the loop
        // The loop is paused by synth.pause() and won't fire onend until resumed
    };

    const handleStop = () => {
        synth.cancel();
        setIsPlaying(false);
        isPlayingRef.current = false; // Stop the loop
        setIsPaused(false);
        setProgress(0);
    };

    return (
        <motion.div
            className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border-3 border-purple-200 shadow-lg mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <motion.div
                        animate={isPlaying ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="text-3xl"
                    >
                        🔊
                    </motion.div>
                    <div>
                        <h3 className="text-xl font-display font-bold text-gray-800">Listen to Story</h3>
                        <p className="text-sm text-gray-600">AI voice narration</p>
                    </div>
                </div>

                <button
                    onClick={() => setShowControls(!showControls)}
                    className="text-sm px-4 py-2 bg-purple-100 hover:bg-purple-200 rounded-full font-semibold transition-colors"
                >
                    ⚙️ {showControls ? 'Hide' : 'Settings'}
                </button>
            </div>

            {/* Progress Bar */}
            {isPlaying && (
                <div className="mb-4">
                    <div className="w-full bg-purple-100 rounded-full h-3 overflow-hidden">
                        <motion.div
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                    <p className="text-xs text-gray-600 mt-1 text-center">
                        {Math.round(progress)}% complete
                    </p>
                </div>
            )}

            {/* Advanced Controls */}
            <AnimatePresence>
                {showControls && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mb-4 space-y-3 overflow-hidden"
                    >
                        {/* Voice Selection */}
                        <div>
                            <label className="text-sm font-semibold text-gray-700 block mb-1">
                                🎭 Voice:
                            </label>
                            <select
                                value={selectedVoice?.name || ''}
                                onChange={(e) => {
                                    const voice = voices.find(v => v.name === e.target.value);
                                    setSelectedVoice(voice);
                                }}
                                className="w-full px-3 py-2 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                            >
                                {voices.map((voice) => (
                                    <option key={voice.name} value={voice.name}>
                                        {voice.name} ({voice.lang})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Speed Control */}
                        <div>
                            <label className="text-sm font-semibold text-gray-700 block mb-1">
                                ⚡ Speed: {rate}x
                            </label>
                            <input
                                type="range"
                                min="0.5"
                                max="2"
                                step="0.25"
                                value={rate}
                                onChange={(e) => setRate(parseFloat(e.target.value))}
                                className="w-full accent-purple-500"
                            />
                            <div className="flex justify-between text-xs text-gray-600">
                                <span>Slow</span>
                                <span>Normal</span>
                                <span>Fast</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Playback Controls */}
            <div className="flex gap-3 justify-center">
                {!isPlaying ? (
                    <motion.button
                        onClick={handlePlay}
                        disabled={!selectedVoice}
                        className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-bold text-lg shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        ▶️ {isPaused ? 'Resume' : 'Play Story'}
                    </motion.button>
                ) : (
                    <>
                        <motion.button
                            onClick={handlePause}
                            className="px-6 py-4 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-full font-bold text-lg shadow-xl hover:scale-105 transition-all flex items-center gap-2"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            ⏸️ Pause
                        </motion.button>
                        <motion.button
                            onClick={handleStop}
                            className="px-6 py-4 bg-gradient-to-r from-red-400 to-red-500 text-white rounded-full font-bold text-lg shadow-xl hover:scale-105 transition-all flex items-center gap-2"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            ⏹️ Stop
                        </motion.button>
                    </>
                )}
            </div>

            {/* Waveform Animation when playing */}
            {isPlaying && (
                <div className="flex justify-center gap-1 mt-4">
                    {[...Array(5)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="w-1 bg-purple-500 rounded-full"
                            animate={{
                                height: ['10px', '30px', '10px'],
                            }}
                            transition={{
                                duration: 0.8,
                                repeat: Infinity,
                                delay: i * 0.1,
                            }}
                        />
                    ))}
                </div>
            )}
        </motion.div>
    );
}

export default TextToSpeech;
