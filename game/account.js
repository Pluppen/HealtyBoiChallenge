// @ts-check

const images = require("./images.json");

class Account {
    /**
     * @param {string} username
     * @param {string} passwordHash - The hash of the passwordHash for the account, with salt.
     * @param {string} passwordSalt - The salt for the password to the account.
     */
    constructor(username, passwordHash, passwordSalt) {
        /**
         * @type {string}
         */
        this.username = username;

        /**
         * The hash of the password to the account.
         * @type {string}
         */
        this.passwordHash = passwordHash;

        /**
         * The salt for the password to the account.
         * @type {string}
         */
        this.passwordSalt = passwordSalt;

        /**
         * @type {number}
         */
        this.id = -1;

        /**
         * @type {boolean}
         */
        this.useShaderForProfilePicture = false;

        /**
         * @type {number}
         */
        this.xp = 0;

        /**
         * @type {number}
         */
        this.level = 0;

        /**
         * @type {number}
         */
        this.maxXp = 100;

        /**
         * @type {string | undefined}
         */
        this.img = undefined;

        /**
         * @type {string}
         */
        this.vertexShaderCode = "";

        /**
         * @type {string}
         */
        this.fragmentShaderCode = "";
    }

    /**
     * Sets the ID for the account and updates the associated image.
     * @param {number} id
     */
    setId(id) {
        this.id = id;
        this.img = images[id % images.length];
    }

    /**
     * @param {string} vertex
     * @param {string} fragment
     */
    setShader(vertex, fragment) {
        this.vertexShaderCode = vertex;
        this.fragmentShaderCode = fragment;
    }

    /**
     * @param {number} amount
     * @returns {boolean} - True if leveled up
     */
    addXp(amount) {
        this.xp += amount;
        if (this.xp < this.maxXp) {
            return false;
        }
        this.xp -= this.maxXp;
        this.level += 1;
        this.maxXp = 100 + this.maxXp;
        return true;
    }

    /**
     * @param {Object} obj - The object to create an Account from.
     * @returns {Account} The newly created Account instance.
     */
    static from(obj) {
        return Object.assign(new Account(obj.username, obj.passwordHash), obj);
    }
}

module.exports = Account;
