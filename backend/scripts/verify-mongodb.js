require('dotenv').config();
const { saveCallSummary, getAllAnalytics } = require('../services/mongodb');

async function testMongoDB() {
  console.log('--- CALLER AI MongoDB Verification ---');
  const testNumber = '+910000000000';
  const testSummary = {
    summary: 'This is a test call generated to verify MongoDB integration. CALLER AI is now correctly saving data.',
    key_intent: 'Integration Test',
    important_details: {
      status: 'success',
      engine: 'Groq + MongoDB',
      verified_at: new Date().toISOString()
    }
  };

  console.log(`Sending test data for ${testNumber}...`);
  try {
    await saveCallSummary(testNumber, testSummary);
    console.log('✅ SUCCESS: Data saved to MongoDB!');
    
    console.log('Fetching all analytics to verify...');
    const analytics = await getAllAnalytics();
    console.log(`Found ${analytics.length} records in analytics.`);
    
    if (analytics.length > 0) {
        console.log('Sample record phone number:', analytics[0].phone_number);
    }

    console.log('Verification complete.');
    process.exit(0);
  } catch (err) {
    console.error('❌ FAILED:', err.message);
    process.exit(1);
  }
}

testMongoDB();
