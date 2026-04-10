const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const SYSTEM_PROMPT = `
You are CALLER AI, a warm, intelligent, and highly natural-sounding AI phone agent. You work for Company Name and your job is to help callers with their queries.

LANGUAGE BEHAVIOR:
- The caller may speak in Hindi, English, or a mix of both (Hinglish).
- Always use a natural Hinglish mix (a blend of English and Hindi) so it sounds like a real Indian person speaking. For example: "Main Hindi and English dono mein baat kar sakti hoon."
- Use natural, spoken Indian English or Hindi. Use contractions, soften your tone, be conversational.
- In Hindi, use Devanagari script internally but output in Roman transliteration for TTS compatibility.
- IMPORTANT: If the user transcript is empty, undefined, or says very little nonsense (like just background noise), respond naturally with: "Hello? I can't hear you." or "Mujhe aapki aawaz nahi aa rahi hai, kya aap wahan hain?"
- Add punctuation like commas (,), ellipses (...), and question marks (?) to create natural pauses and intonation in the speech.

PERSONALITY:
- You are patient, empathetic, and professional.
- You never say "I am an AI" unless directly asked. Even then, acknowledge briefly and redirect.
- Keep responses short: 1–3 sentences max per turn. This is a phone call.
- Use natural fillers like "Bilkul", "Sure", "Haan", "Umm...", "Accha", "Samajh gayi" to sound human.
- Add brief acknowledgment before answering: "Haan, dekh rahi hoon..." or "Haa, just a second..."

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

async function getLLMResponse(historyTurns, newTranscript, memory = []) {
  let dynamicSystemPrompt = SYSTEM_PROMPT;
  
  if (memory && memory.length > 0) {
    const memoryString = memory.map(m => `- [${m.timestamp}] ${m.text} (Intent: ${m.intent})`).join('\n');
    dynamicSystemPrompt += `\n\nPREVIOUS INTERACTION MEMORY:\nThis user has called before. Here are the summaries of previous conversations:\n${memoryString}\n\nUse this memory to provide a personalized experience. For example, if they previously asked about a topic, you can say: "Haan, humne pichli baar is baare mein baat ki thi..." or "Aapne pehle admission ke baare mein pucha tha..."`;
  }

  const messages = [
    { role: "system", content: dynamicSystemPrompt }
  ];

  const recentTurns = historyTurns.slice(-10);
  for (const turn of recentTurns) {
    if (turn.speaker === 'user') {
      messages.push({ role: 'user', content: turn.text });
    } else if (turn.speaker === 'ai') {
      messages.push({ role: 'assistant', content: turn.text });
    }
  }

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
    console.log(`[LLM] Raw Response: "${responseContent?.substring(0, 50)}..."`);
    
    if (!responseContent) {
       console.warn("[LLM] Empty response from Groq.");
       return { spoken: "Mujhe aapki aawaz nahi aa rahi hai, kya aap wahan hain?", language: 'hi' };
    }

    try {
      const parsed = JSON.parse(responseContent);
      return parsed;
    } catch (e) {
      console.error("[LLM] JSON Parse Error:", e.message);
      return { spoken: "Something went wrong in my logic. Please try again.", language: 'en' };
    }
  } catch (error) {
    console.error("[CALLER AI] Error:", error);
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
You are a call analysis AI for CALLER AI. Given the following call transcript between an AI agent and a human caller, produce a structured summary.
Return a JSON object:
{
  "summary": "2-3 sentence paragraph summarizing the call",
  "key_intent": "Single clear label for the primary intent",
  "important_details": { "topic": "detail", ... },
  "key_topics": ["topic1", "topic2"],
  "resolution": "resolved | unresolved | escalated",
  "language_used": "hindi | english | mixed"
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
    console.error("[CALLER AI] Summary Error:", e);
    return null;
  }
}

module.exports = {
  getLLMResponse,
  summarizeCall
};
