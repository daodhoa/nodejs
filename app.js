const express = require('express');
const app = express();
const cors = require('cors')
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoute = require('./routes/auth');
const taskRoute = require('./routes/task');
dotenv.config();

mongoose.connect(
    process.env.DB_CONNECT,
    { useUnifiedTopology : true, useNewUrlParser : true },
    (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('connect successfully');
        }
    }
);
app.use(cors());
app.use(bodyParser.json());
app.use('/api/auth', authRoute);
app.use('/api/tasks', taskRoute);
app.get('/', (req, res) => res.send('Hello World!'));

const port = process.env.PORT;
app.listen(port, () => console.log(`Application is running on port ${port}`));