const express = require("express");
const cors = require("cors");
const fs = require("fs");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();
require("./connection");
const mongoose = require("mongoose");
const { type } = require("os");

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

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", userSchema);

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

app.post("/signin", async (req, res) => {
  const { username, gender } = req.body;
  if (!username || !gender) {
    return res.status(400).json({ message: "Fill all the details" });
  }
  try {
    const newUser = new User({ username, gender });
    await newUser.save();
    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error saving user", error: error.message });
  }
});

app.get("/doctors", (req,res)=> {
  res.send("Here is the List of all the Doctors in the City")
});

const patients = []
const categories = []
app.post("/addpatient",(req,res)=> {
  const { patientName, category }  = req.body;
  patients.push(patientName)
  categories.push(category)
  res.send( 
    `List of All Patients - ${patients} & category ${categories}`
  )
})


const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
