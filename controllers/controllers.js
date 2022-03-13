const db = require('../database/db');

async function createUser(req, res, next) {
    const username = req.body.username;

    try {
        const user = await db.addUser(username);
        res.json(user);
    }
    catch (error) {
        next(error);
    }
}

async function getUsers(req, res, next) {
    try {
        const users = await db.getUsers();
        res.json(users);
    }
    catch (error) {
        next(error);
    }
}

async function createExercise(req, res, next) {
    const id = req.params.userId;
    const { description, duration, date } = req.body;
    const user = await db.getUser(id);
    try {
        const exercise = await db.addExercise(
            id, description, duration, date
        )
        user.exercise = exercise;
        res.json(user);
    }
    catch (error) {
        next(error);
    }
}

async function getExercisesByIndividualUser(req, res, next) {
    const { userId } = req.params;
    const { from, to, limit } = req.query;

    const user = await db.getUser(userId);
    const count = await db.getCount(userId, from, to);
    const log = await db.getExercises(userId, from, to, limit);


    const userObj = {
        ...user,
        count,
        log
    };


    res.json(userObj);

}

module.exports = { createUser, getUsers, createExercise, getExercisesByIndividualUser };