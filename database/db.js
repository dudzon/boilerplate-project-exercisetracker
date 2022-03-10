const path = require('path');
const fs = require('fs');
const util = require('util');
const sqlite3 = require('sqlite3');

const DB_PATH = path.join(__dirname, "my.db");
const DB_SQL_PATH = path.join(__dirname, "mydb.sql");


// define DB
const DB = new sqlite3.Database(DB_PATH);
const SQL3 = {
    run(...args) {
        return new Promise((resolve, reject) => {
            DB.run(...args, function onResult(error) {
                if (error) {
                    reject(error);
                } else {
                    resolve(this);
                }
            })
        })
    },
    get: util.promisify(DB.get.bind(DB)),
    all: util.promisify(DB.all.bind(DB)),
    exec: util.promisify(DB.exec.bind(DB))
};

async function startDB() {
    const initSQL = fs.readFileSync(DB_SQL_PATH, "utf-8");
    await SQL3.exec(initSQL);
}


async function addUser(username) {
    const result = await SQL3.run(
        `
            INSERT INTO
                users(username)
            VALUES
            (?)
        `,
        username
    );
    if (!result) {
        return null;
    }

    const user = {
        id: result.lastID,
        username
    };

    return user;
}

async function addOrGetUser(username) {


    return await addUser(username);
}

module.exports = { startDB, addOrGetUser };