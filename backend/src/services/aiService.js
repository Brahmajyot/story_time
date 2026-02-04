const Groq = require('groq-sdk');

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || 'gsk_demo' // Groq provides free tier
});

async function generateStory(childName, favoriteAnimal, moralLesson) {
    try {
        const prompt = `You are a creative children's story writer. Create a magical, engaging, and heartwarming story for a child.

Story Requirements:
- The main character is a child named "${childName}"
- Their favorite animal is a "${favoriteAnimal}" who becomes their friend/companion in the story
- The story should teach the moral lesson of "${moralLesson}"
- Target reading time: 5 minutes (approximately 600-800 words)
- Age-appropriate for children ages 5-10
- Include adventure, wonder, and positive emotions
- End with a happy, uplifting conclusion that reinforces the moral lesson

Make the story imaginative, fun, and memorable. Use vivid descriptions and dialogue to bring the characters to life.

Write the complete story now:`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ],
            model: 'llama3-8b-8192', // Fast and free Llama 3 model
            temperature: 0.8,
            max_tokens: 2048
        });

        const storyText = chatCompletion.choices[0]?.message?.content || '';
        console.log('✅ Story generated successfully with Groq (Llama 3)');

        return storyText;
    } catch (error) {
        console.error('Error generating story with Groq:', error.message);
        console.log('⚠️  Using demo mode - returning sample story');

        // Demo mode fallback - return a sample story
        return `Once upon a time, in a magical forest filled with twinkling fireflies and singing birds, there lived a brave young child named ${childName}.

One sunny morning, ${childName} discovered something extraordinary - a friendly ${favoriteAnimal} who needed help! The ${favoriteAnimal} had lost its way home and was feeling very sad.

"Don't worry," said ${childName} kindly, "I'll help you find your way back!"

Together, they embarked on an amazing adventure through the enchanted forest. Along the way, ${childName} showed great ${moralLesson}, helping other forest creatures they met. A baby bird needed help reaching its nest, and ${childName} carefully lifted it back to safety. A squirrel had dropped all its acorns, and ${childName} patiently helped gather them.

The ${favoriteAnimal} watched in wonder as ${childName} helped everyone they met. "You are so ${moralLesson}!" said the ${favoriteAnimal}. "You've taught me something very important today."

Finally, they reached the ${favoriteAnimal}'s home - a beautiful, cozy den surrounded by colorful flowers. The ${favoriteAnimal}'s family was overjoyed to see them!

"Thank you, ${childName}!" they all cheered. "You've shown us the true meaning of ${moralLesson}!"

From that day on, ${childName} and the ${favoriteAnimal} became the best of friends. They learned that when you show ${moralLesson} to others, you make the whole world a brighter, happier place.

And ${childName} never forgot this special adventure, always remembering to be ${moralLesson} to everyone, every single day.

The End.`;
    }
}

module.exports = {
    generateStory
};
