import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { messages, system } = req.body;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 500,
      messages: [
        { role: "system", content: system },
        ...messages
      ]
    });

    const texte = completion.choices[0]?.message?.content || "Je n'ai pas pu répondre.";

    res.status(200).json({ choices: [{ message: { content: texte } }] });

  } catch (err) {
    console.error("Erreur Groq:", err);
    res.status(500).json({ choices: [{ message: { content: "Erreur serveur. Veuillez réessayer." } }] });
  }
}