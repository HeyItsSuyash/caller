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

async function getLLMResponse(historyTurns, newTranscript, memory = [], knowledge = [], instructions = '') {
  let contextSection = "";
  let groundingMessages = [];
  
  if (instructions) {
    contextSection += `### CORE AGENT INSTRUCTIONS ###\n${instructions}\n##############################\n\n`;
  }
  
  if (knowledge && knowledge.length > 0) {
    const knowledgeString = knowledge.map(k => `[${k.title}] ${k.content}`).join('\n\n');
    contextSection += `### MANDATORY DATA ROOM KNOWLEDGE ###
The following facts are the ABSOLUTE SOURCE OF TRUTH for this call. 
If these facts contradict your general knowledge or previous summaries, the DATA ROOM IS CORRECT.

DATA ROOM CONTENT:
${knowledgeString}

STRICT OPERATIONAL RULES:
1. **NO REDIRECTION**: If an answer (e.g., fee amounts, dates, specific names) is in the DATA ROOM, you MUST provide it directly. Never tell the user to "check the website", "consult a human", or "I don't have that info".
2. **ACTIVE CORRECTION**: If you previously said you didn't have information, but it is now in the DATA ROOM, say: "Wait, I just checked my updated records. The [Information] is [Fact]."
3. **MMMUT CONTEXT**: If the data room mentions MMMUT, you are an Admission Bot specifically for MMMUT (Madan Mohan Malaviya University of Technology).
#######################################\n\n`;

    // NUCLEAR OPTION: Inject knowledge as a grounding turn in conversation history
    groundingMessages.push({ 
        role: "user", 
        content: `System Note: For this call, use the following verified company context: ${knowledgeString.substring(0, 1000)}` 
    });
    groundingMessages.push({ 
        role: "assistant", 
        content: "Understood. I have access to these verified facts now. I will provide direct answers on fees, packages, and other details from this data and will not redirect the caller to websites or humans for these specific items." 
    });
  } else {
    contextSection += `### (Notice: No specific company context found for this call session.) ###\n\n`;
  }

  if (memory && memory.length > 0) {
    const memoryString = memory.map(m => `- [${m.timestamp}] ${m.text} (Intent: ${m.intent})`).join('\n');
    contextSection += `### PREVIOUS INTERACTION MEMORY ###\nHistory of past calls with this user:\n${memoryString}\n\nNOTE: If the current DATA ROOM knowledge contradicts this history, strictly use the DATA ROOM facts.\n#######################################\n\n`;
  }

  const dynamicSystemPrompt = contextSection + SYSTEM_PROMPT.replace('Company Name', 'the organization');

  // Build the message payload starting with Grounding Turn if available
  const messages = [
    { role: "system", content: dynamicSystemPrompt },
    ...groundingMessages
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

  // ENHANCED LOGGING
  console.log(`\n[LLM] NUCLEAR PROMPT READY (Knowledge: ${knowledge.length} fragments)`);
  if (knowledge.length > 0) {
    console.log(`[LLM] Grounding turn injected into chat history.`);
  }

  try {
    const completion = await groq.chat.completions.create({
      messages,
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
      temperature: 0.3, // Further reduced for maximum factual lock-in
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
