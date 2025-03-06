const express = require("express");
const cors = require("cors");
const fs = require("fs");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();
require("./connection");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const aiResponseSchema = new mongoose.Schema({
  question: String,
  response: String,
  timestamp: { type: Date, default: Date.now },
});

const AIResponse = mongoose.model("AIResponse", aiResponseSchema);

app.get("/", (req, res) => {
  return res.send("Hello World");
});

app.post("/generate", async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    const result = await model.generateContent(question);
    const content = result.response.candidates[0].content.parts[0].text;

    const newResponse = new AIResponse({ question, response: content });
    await newResponse.save();

    res.json({ question, response: content });
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ error: "Failed to generate response" });
  }
});

app.get("/responses", async (req, res) => {
  try {
    const responses = await AIResponse.find().sort({ timestamp: -1 });
    res.json(responses);
  } catch (error) {
    console.error("Error fetching responses:", error);
    res.status(500).json({ error: "Failed to retrieve responses" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
