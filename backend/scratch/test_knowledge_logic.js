require('dotenv').config();
const { getKnowledge } = require('../services/mongodb');

async function test() {
    console.log('Testing knowledge fetch logic...');
    
    // 1. Test with a specific entity
    console.log('\n--- FETCHING FOR "Admission Bot" ---');
    const admission = await getKnowledge('Admission Bot');
    console.log(`Found ${admission.length} fragments.`);
    admission.forEach(k => console.log(` - [${k.entity || 'GLOBAL'}] ${k.title}`));

    // 2. Test with "unknown" (should fetch global)
    console.log('\n--- FETCHING FOR "unknown" (Global) ---');
    const globalDocs = await getKnowledge('unknown');
    console.log(`Found ${globalDocs.length} fragments.`);
    globalDocs.forEach(k => console.log(` - [${k.entity || 'GLOBAL'}] ${k.title}`));

    process.exit(0);
}

test();
