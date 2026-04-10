const calls = new Map();

function createCallSession(callSid, phoneNumber = 'unknown') {
  const session = {
    callSid,
    phoneNumber,
    startTime: new Date().toISOString(),
    language_distribution: { hindi: 0, english: 0, hinglish: 0 },
    turns: [],
    extracted_entities: {},
    action_items: [],
    resolution_status: 'pending',
    summary: null
  };
  calls.set(callSid, session);
  if (global.broadcastEvent) {
    global.broadcastEvent('call_updated', { callSid, updates: session });
  }
  return session;
}

function getCallSession(callSid) {
  return calls.get(callSid);
}

function updateCallSession(callSid, updates) {
  const session = calls.get(callSid);
  if (session) {
    Object.assign(session, updates);
    if (global.broadcastEvent) {
      global.broadcastEvent('call_updated', { callSid, updates });
    }
  }
}

function addTurn(callSid, turn) {
  const session = calls.get(callSid);
  if (session) {
    session.turns.push(turn);
    if (turn.language) {
      const lang = turn.language.toLowerCase();
      if (session.language_distribution[lang] !== undefined) {
        session.language_distribution[lang]++;
      } else {
        session.language_distribution[lang] = 1;
      }
    }
    if (global.broadcastEvent) {
      global.broadcastEvent('turn_added', { callSid, turn });
    }
  }
}

function getAllCalls() {
  return Array.from(calls.values());
}

module.exports = {
  createCallSession,
  getCallSession,
  updateCallSession,
  addTurn,
  getAllCalls
};
