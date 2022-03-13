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
        id: `_${new Date().getTime().toString()}`,
        username
    };
    return user;
}

async function getUsers() {
    const result = await SQL3.all(
        `
        SELECT
        *
        FROM
        users
        `
    );

    if (!result) {
        return null;
    }

    return result;
}

async function getUser(id) {
    let result = await SQL3.get(
        `
    SELECT
      id, username
    FROM
      users
    WHERE
      id = ?
	`,
        id
    );
    if (!result) {
        return null;
    }
    return {
        id: result.id,
        username: result.username,
    };
};

async function addExercise(user_id, description, duration, date) {
    const exerciseDate = date ? date : new Date().toDateString();
    const result = await SQL3.run(
        `
            INSERT INTO 
             exercises(user_id,description,duration,date)
            VALUES
            (?,?,?,?)
        `,
        [user_id, description, duration, exerciseDate]);

    if (!result) {
        return null;
    }

    const exercise = {
        user_id,
        description,
        duration,
        date: exerciseDate
    };

    return exercise;
}

async function getCount(id, from, to) {
    const params = [id];

    let query = `
        SELECT
        COUNT(1)
        FROM
        exercises
        WHERE
        user_id=?
        `

    if (from) {
        result += `AND date>?`;
        params.push(from);
    }

    if (to) {
        result += `AND date<?`;
        params.push(to);
    }

    const result = await SQL3.get(query, params);

    return result["COUNT(1)"];

}

async function getExercises(id, from, to, limit) {
    const params = [id];

    let query = `
        SELECT
        description,duration,date
        FROM
        exercises
        WHERE
        user_id=?
    `;

    if (from) {
        query += `AND date>?`;
        params.push(from);
    }

    if (to) {
        query += `AND date<?`;
        params.push(to);
    }
    query += `ORDER BY date`

    if (limit) {
        query += `LIMIT ?`;
        params.push(limit);
    }

    const exercises = await SQL3.all(query, params);

    if (!exercises) {
        return [];
    }

    return exercises;

}


module.exports = { startDB, addUser, getUsers, getUser, addExercise, getCount, getExercises };