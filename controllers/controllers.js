const db = require('../database/db');

async function createUser(req, res, next) {
    const username = req.body.username;
    console.log(username);

    try {
        const user = await db.addOrGetUser(username);
        res.json(user);
    }
    catch (error) {
        next(error);
    }

}

module.exports = { createUser };