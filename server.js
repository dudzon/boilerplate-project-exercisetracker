const express = require('express');
const app = express();
const cors = require('cors')
const db = require('./database/db');
const controller = require('./controllers/controllers');
require('dotenv').config();

app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

db.startDB();
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/users', controller.createUser);
app.get('/api/users', controller.getUsers);
app.post('/api/users/:userId/exercises', controller.createExercise);
app.get('/api/users/:userId/logs', controller.getExercisesByIndividualUser);





const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
