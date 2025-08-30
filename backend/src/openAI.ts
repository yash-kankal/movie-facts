import OpenAI from "openai";
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function getFunFactFor(movieTitle: string): Promise<string> {
  const prompt = `Give one concise, non-spoiler fun fact (1–2 sentences) about the movie "${movieTitle}". Avoid plot spoilers.`;
  const res = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 80,
    temperature: 0.8
  });
  return res.choices?.[0]?.message?.content?.trim() || `Here's a general fun fact about "${movieTitle}".`;
}
