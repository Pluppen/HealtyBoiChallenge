// @ts-check

const { Level } = require("level");
const Account = require("./account");

const db = new Level("./db", { valueEncoding: "json" });

module.exports = {
    /**
     * @async
     * @returns {Promise<Array<Account>>} accounts
     */
    loadAccounts: async function () {
        try {
            return JSON.parse(await db.get("accounts")).map(Account.from);
        } catch (ex) {
            if (ex.status !== 404) {
                console.error(ex);
            }
            return [];
        }
    },
    /**
     * @async
     * @param {Array<Account>} accounts
     * @returns {Promise<void>}
     */
    saveAccounts: async function (accounts) {
        await db.put("accounts", JSON.stringify(accounts, undefined, 0));
    },
};
