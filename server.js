const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { GoogleGenAI } = require("@google/genai");

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("GEMINI_API_KEY is missing in .env");
    process.exit(1);
}

const ai = new GoogleGenAI({
    apiKey: apiKey
});

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "AI Cover Letter Generator backend is running"
    });
});

app.post("/api/generate-cover-letter", async (req, res) => {
    console.log("Cover letter request received");

    try {
        const {
            candidateName,
            jobRole,
            company,
            skills
        } = req.body;

        if (!candidateName || !jobRole || !company || !skills) {
            return res.status(400).json({
                success: false,
                error: "All fields are required."
            });
        }

        const prompt = `
You are a professional career assistant.

Write a professional personalized cover letter.

Candidate Name: ${candidateName}
Job Role: ${jobRole}
Company: ${company}
Skills: ${skills}

Requirements:
- Address the hiring manager professionally.
- Mention the job role.
- Mention the company.
- Highlight the skills.
- Show enthusiasm.
- Keep it professional and natural.
- Write 250 to 350 words.
- Do not use markdown headings.
- Return only the cover letter.
`;

        console.log("Sending request to Gemini...");

        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: prompt
        });

        const coverLetter = response.text;

        if (!coverLetter) {
            throw new Error("Gemini returned an empty response.");
        }

        console.log("Cover letter generated successfully.");

        res.json({
            success: true,
            coverLetter: coverLetter
        });

    } catch (error) {
        console.error("Gemini API ERROR:", error);

        res.status(500).json({
            success: false,
            error: error.message || "Failed to generate cover letter."
        });
    }
});

const server = app.listen(PORT, "0.0.0.0", () => {
    console.log("=================================");
    console.log(`Server running on http://localhost:${PORT}`);
    console.log("=================================");
});

server.on("error", (error) => {
    console.error("SERVER ERROR:", error);
});

server.on("close", () => {
    console.log("SERVER CLOSED");
});

process.on("uncaughtException", (error) => {
    console.error("UNCAUGHT EXCEPTION:", error);
});

process.on("unhandledRejection", (error) => {
    console.error("UNHANDLED REJECTION:", error);
});