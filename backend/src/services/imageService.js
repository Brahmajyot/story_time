const axios = require('axios');

async function generateStoryImage(childName, favoriteAnimal, moralLesson) {
    try {
        // Use multiple free image generation services with fallbacks

        // Option 1: Try Picsum Photos with a themed overlay (most reliable)
        // Picsum provides random royalty-free images that are guaranteed to load
        const picsum_id = Math.floor(Math.random() * 1000) + 1;
        const imageUrl = `https://picsum.photos/seed/${favoriteAnimal.toLowerCase().replace(/\s+/g, '')}-${picsum_id}/1024/1024`;

        console.log('📸 Generated image with Picsum Photos (Free & Reliable!)');
        console.log('🖼️  Image URL:', imageUrl);
        return imageUrl;

        // Note: Pollinations.ai is great but can be slow/unreliable
        // If you want to try it, uncomment below:
        /*
        const prompt = `cute ${favoriteAnimal} children book illustration colorful whimsical digital art`;
        const simplePrompt = prompt.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '+');
        const seed = Math.floor(Math.random() * 1000000);
        const pollinationsUrl = `https://image.pollinations.ai/prompt/${simplePrompt}?width=1024&height=1024&seed=${seed}&nologo=true`;
        return pollinationsUrl;
        */

    } catch (error) {
        console.error('Error generating image:', error.message);
        // Fallback to a colorful SVG placeholder with the animal emoji
        const animalEmoji = getAnimalEmoji(favoriteAnimal);
        return `data:image/svg+xml;base64,${Buffer.from(`<svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#FFE5E5;stop-opacity:1" /><stop offset="50%" style="stop-color:#E5D4FF;stop-opacity:1" /><stop offset="100%" style="stop-color:#FFE5CC;stop-opacity:1" /></linearGradient></defs><rect width="1024" height="1024" fill="url(#grad)"/><circle cx="512" cy="400" r="180" fill="#ffffff" opacity="0.3"/><text x="50%" y="42%" font-family="Arial, sans-serif" font-size="160" fill="#FF69B4" text-anchor="middle" dominant-baseline="middle">${animalEmoji}</text><text x="50%" y="65%" font-family="Arial, sans-serif" font-size="48" fill="#9D4EDD" text-anchor="middle" font-weight="bold">${childName}'s Adventure</text><text x="50%" y="72%" font-family="Arial, sans-serif" font-size="32" fill="#7209B7" text-anchor="middle">${favoriteAnimal}</text></svg>`).toString('base64')}`;
    }
}

function getAnimalEmoji(animal) {
    const animalMap = {
        'dog': '🐕', 'puppy': '🐕', 'cat': '🐱', 'kitten': '🐱', 'bear': '🐻',
        'lion': '🦁', 'tiger': '🐯', 'elephant': '🐘', 'rabbit': '🐰', 'bunny': '🐰',
        'fox': '🦊', 'panda': '🐼', 'koala': '🐨', 'monkey': '🐵',
        'giraffe': '🦒', 'zebra': '🦓', 'horse': '🐴', 'unicorn': '🦄',
        'dragon': '🐉', 'dinosaur': '🦕', 'bird': '🐦', 'owl': '🦉',
        'penguin': '🐧', 'dolphin': '🐬', 'whale': '🐳', 'fish': '🐠',
        'turtle': '🐢', 'frog': '🐸', 'bee': '🐝', 'butterfly': '🦋',
        'duck': '🦆', 'chicken': '🐔', 'pig': '🐷', 'cow': '🐮', 'sheep': '🐑'
    };
    const lowerAnimal = animal.toLowerCase();
    for (const [key, emoji] of Object.entries(animalMap)) {
        if (lowerAnimal.includes(key)) return emoji;
    }
    return '🦊'; // Default fox emoji
}

module.exports = {
    generateStoryImage,
    getAnimalEmoji
};
