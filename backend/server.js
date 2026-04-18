const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors()); // Allows your frontend to talk to the backend
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: "You are a professional assistant. Rules: 1. NEVER use symbols like ###, ***, or backticks. 2. For headers, just write the text. 3. Wrap important facts in [[square brackets]] for highlighting. 4. List Sources: at the end."
        });

        const result = await model.generateContent(message);
        const response = await result.response;
        res.json({ text: response.text() });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch AI response" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
