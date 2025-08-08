require('dotenv').config();
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateCaption = async (req, res) => {
  const { mood } = req.body;

  try {
    const prompt = `Suggest a social media post caption based on the mood: "${mood}"`;

    const response = await openai.chat.completions.create({ 
      model: "gpt-3.5-turbo", 
      messages: [{ role: "user", content: prompt }],
      max_tokens: 50,
    });

    const caption = response.choices[0].message.content.trim();
    res.json({ caption });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate caption' });
  }
};

module.exports = { generateCaption };