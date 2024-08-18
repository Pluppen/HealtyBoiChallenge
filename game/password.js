// @ts-check

const crypto = require("crypto");
const ALGORITHM = "sha512";

/**
 * @param {string} password
 * @param {string} salt
 * @returns {string}
 */
function hash(password, salt) {
    return crypto.hash(ALGORITHM, password + salt, "hex");
}

/**
 * @param {number} length
 * @returns {string}
 */
function salt(length = 16) {
    return crypto.randomBytes(length).toString("hex");
}

/**
 * @param {string} password
 * @param {string} salt
 * @param {string} hashedPassword
 * @returns {boolean}
 */
function verify(password, salt, hashedPassword) {
    return hash(password, salt) === hashedPassword;
}

module.exports = {
    hash,
    salt,
    verify,
};
