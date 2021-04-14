const express = require('express');
const cors = require('cors')
const dotenv = require('dotenv')
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;

mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);


dotenv.config()

const uri = process.env.MONGO_DB_URI || 'mongodb://localhost:27017/bigbrain'
const port = process.env.PORT || 8080;


const app = express();

app.use(cors())

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.get('/', (req, res) => {
    res.json({"message": "Welcome to the Big Brain Server"});
});
app.listen(port, () => {
    console.log("Server is listening on port "+ port);
});

const scoreRoutes = require('./app/routes/score.routes.js')(app);

const connectionParams={
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true 
}
mongoose.connect(uri,connectionParams)
    .then( () => {
        console.log('Connected to database ')
    })
    .catch( (err) => {
        console.error(`Error connecting to the database. \n${err}`);
    })
