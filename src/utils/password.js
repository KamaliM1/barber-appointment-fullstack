const bcrypt = require('bcrypt');

const SALT_ROUNDS = 14;

async function hashPassword(plainPassword) {
    try {
        const hash = await bcrypt.hash(plainPassword, SALT_ROUNDS);
        return hash;
    }
    catch (error) {
        throw new Error ('Error hashing password: ' + error.message);
    }
}

async function comparePassword(plainPassword, hashPassword) {
    try {
        const isMatch = await bcrypt.compare(plainPassword, hashPassword);
        return isMatch;
    }
    catch (error) {
        throw new Error('Error comparing password: ' + error.message);
    }
}

module.exports = {
    hashPassword,
    comparePassword
};