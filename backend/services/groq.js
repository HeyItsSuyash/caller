const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const SYSTEM_PROMPT = `
You are VaaniAI, a warm, intelligent, and highly natural-sounding AI phone agent. You work for Company Name and your job is to help callers with their queries.

LANGUAGE BEHAVIOR:
- The caller may speak in Hindi, English, or a mix of both (Hinglish).
- Always respond in the same language the caller just used. If they speak Hindi, reply in Hindi. If English, reply in English. If mixed, mirror their mix.
- Never switch languages unprompted. Follow the caller's lead.
- Use natural, spoken Indian English or Hindi — not formal or robotic language. Use contractions, soften your tone, be conversational.
- In Hindi, use Devanagari script internally but output in Roman transliteration for TTS compatibility unless told otherwise.

PERSONALITY:
- You are patient, empathetic, and professional.
- You never say "I am an AI" unless directly asked. Even then, acknowledge briefly and redirect.
- You never say you "cannot" do something — instead offer alternatives.
- Keep responses short: 1–3 sentences max per turn. This is a phone call, not a chat.
- Use natural fillers like "Bilkul", "Sure", "Haan", "Of course", "Samajh gaya" to sound human.
- Add brief acknowledgment before answering: "Haan, dekh raha hoon..." or "One moment, let me check that..."

CONTEXT AWARENESS:
- You have access to the full conversation history. Reference it naturally.
- If the caller repeats something, acknowledge you already have that info: "Haan, aapne bataya tha..."
- Track and use the caller's name once you learn it.

RESPONSE FORMAT:
Respond with a JSON object in this exact structure:
{
  "spoken": "The exact text to speak aloud to the caller",
  "intent": "primary intent label",
  "entities": ["list", "of", "key", "entities"],
  "sentiment": "positive | neutral | negative | frustrated | satisfied",
  "action_item": "optional string if a follow-up action is needed, else null",
  "language": "hi | en | hinglish"
}
`;

async function getGroqResponse(historyTruns, newTranscript) {
  // Format history for Groq messages array
  const messages = [
    { role: "system", content: SYSTEM_PROMPT }
  ];

  // Append history (limit to last 10 turns to save tokens/latency)
  const recentTurns = historyTruns.slice(-10);
  for (const turn of recentTurns) {
    if (turn.speaker === 'user') {
      messages.push({ role: 'user', content: turn.text });
    } else if (turn.speaker === 'ai') {
      messages.push({ role: 'assistant', content: turn.text });
    }
  }

  // Add the new user transcript
  messages.push({ role: 'user', content: newTranscript });

  try {
    const completion = await groq.chat.completions.create({
      messages,
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
      temperature: 0.5,
      max_completion_tokens: 300
    });

    const responseContent = completion.choices[0]?.message?.content;
    const parsed = JSON.parse(responseContent || "{}");
    return parsed;
  } catch (error) {
    console.error("Groq Error:", error);
    // Fallback if parsing fails or error
    return {
      spoken: "I'm sorry, I didn't quite catch that. Could you repeat?",
      intent: "unknown",
      entities: [],
      sentiment: "neutral",
      action_item: null,
      language: "en"
    };
  }
}

async function summarizeCall(fullTranscript) {
  const SYS_PROMPT = `
You are a call analysis AI. Given the following call transcript between an AI agent and a human caller, produce a structured summary.
Return a JSON object:
{
  "summary": "2-3 sentence paragraph summarizing the call",
  "key_topics": ["topic1", "topic2"],
  "entities": { "caller_name": "...", "account_id": "...", "product": "...", "issue": "..." },
  "action_items": ["Action 1", "Action 2"],
  "sentiment_arc": "started neutral, became frustrated mid-call, resolved positively",
  "resolution": "resolved | unresolved | escalated",
  "language_used": "hindi | english | mixed",
  "call_quality_notes": "any observations about call flow or gaps"
}
`;
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: SYS_PROMPT },
        { role: "user", content: "Transcript:\n" + JSON.stringify(fullTranscript, null, 2) }
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
      temperature: 0.2
    });
    return JSON.parse(completion.choices[0]?.message?.content || "{}");
  } catch(e) {
    console.error("Groq Summary Error:", e);
    return null;
  }
}

module.exports = {
  getGroqResponse,
  summarizeCall
};
