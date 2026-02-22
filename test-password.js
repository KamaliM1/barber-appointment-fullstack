const {hashPassword, comparePassword} = require('./src/utils/password');

async function testPasswordHashing(){
    console.log('=== Password Hashing Test ===\n');

const testPasswords = [
    'password123',
    'barberPassword',
    'customer1password',
    'customer2password',
    'customer3password'
]

testPasswords[0]
testPasswords[1]
testPasswords[2]
testPasswords[3]
testPasswords[4]

for (const password of testPasswords) {
    console.log(`Original: ${password}`);

    const hash = await hashPassword(password);
    console.log(`Hashed: ${hash}`);

    const isCorrect = await comparePassword(password, hash);
    console.log(`Verify correct password: ${isCorrect ? 'PASS' : 'FAIL'}`);

    const isWrong = await comparePassword('wrongPassword', hash);
    console.log(`Verify incorrect password: ${isWrong ? 'FAIL' : 'PASS'} `);

    console.log('---\n');
    }
}

testPasswordHashing().catch(error => {
    console.error('Test failed: ', error);
    process.exit(1);
});