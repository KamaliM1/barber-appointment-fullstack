const {hashPassword} = require('./src/utils/password');

async function generateHash(){
    const password = process.argv[2];

    if(!password) {
        console.error('Usage: node generate-hash.js <password>');
        console.error('Example: node generate-hash.js myPassword123');
        process.exit(1);
    }
    try{
        const hash = await hashPassword(password);
        console.log('\n Hash generated successfully!\n');
        console.log('Password:', password);
        console.log('Hash:',hash);
        console.log('\nUse this in seed.sql for testing\n');
    }
    catch (error) {
        console.error ('Error generating hash:' + error.message);
        process.exit(1);
    }
}

generateHash();