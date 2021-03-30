const express = require('express');
const cors = require('cors')

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);

const dbConfig = require('./config/db.config.js');
const envConfig = require('./config/env.config.js');

const app = express();
app.use(cors())

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.get('/', (req, res) => {
    res.json({"message": "Welcome to the Big Brain Server"});
});
app.listen(envConfig.port, () => {
    console.log("Server is listening on port "+ envConfig.port);
});

const scoreRoutes = require('./app/routes/score.routes.js')(app);


mongoose.connect(dbConfig.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

