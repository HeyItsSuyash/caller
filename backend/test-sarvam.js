require('dotenv').config({ path: '/home/suyash/Desktop/caller/backend/.env' });
const fs = require('fs');
const { getSarvamSTT } = require('./services/sarvam');

async function test() {
  const buf = fs.readFileSync('/tmp/test.wav');
  console.log("Sending WAV to Sarvam...");
  const res = await getSarvamSTT(buf);
  console.log("Result:", JSON.stringify(res, null, 2));
}

test().catch(console.error);
