// @ts-check

const fs = require("fs");

const Account = require("./account");
const Password = require("./password");
const db = require("./database");

class Game {
    /**
     * @param {string} [shaderDirectory="./public/shaders"]
     */
    constructor(shaderDirectory = "./public/shaders") {
        /**
         * @type {string}
         */
        this.defaultVertexShaderCode = fs.readFileSync(
            `${shaderDirectory}/default/shader.vert.glsl`,
            { encoding: "utf8" },
        );

        /**
         * @type {string}
         */
        this.defaultFragmentShaderCode = fs.readFileSync(
            `${shaderDirectory}/default/shader.frag.glsl`,
            { encoding: "utf8" },
        );

        /**
         * @type {Array<string>} base64 images
         */
        this.images = require("./images.json");

        /**
         * @type {Array<Account>}
         */
        this.accounts = [];

        this.load();
    }

    /**
     * @param {string} username
     * @returns {Account | undefined}
     */
    getAccountByUsername(username) {
        return this.accounts.find((account) => account.username === username);
    }

    /**
     * @param {number|string} id
     * @returns {Account | undefined}
     */
    getAccountById(id) {
        if (typeof id !== "number") {
            id = parseInt(id);
        }
        return this.accounts.find((account) => account.id === id);
    }

    /**
     * @param {string} username
     * @param {string} password
     * @returns {Account}
     */
    createAccount(username, password) {
        const salt = Password.salt(32);
        const hash = Password.hash(password, salt);
        const account = new Account(username, hash, salt);
        account.setId(this.accounts.length);
        account.setShader(
            this.defaultVertexShaderCode,
            this.defaultFragmentShaderCode,
        );
        this.accounts.push(account);
        return account;
    }

    async load() {
        const loaded = await db.loadAccounts();
        if (loaded && loaded.length) {
            this.accounts = loaded;
        }
    }

    async save() {
        await db.saveAccounts(this.accounts);
    }
}

module.exports = Game;
