require('dotenv').config();
const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const api = require('./routes');
const path = require('path');

//init express app
const app = express();
app.use(cors());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

//connect to mongoDB:
const { ATLAS_URI } = process.env;
mongoose
  .connect(ATLAS_URI, {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: false,
  })
  .then(() => console.log('Connection to DB established!'))
  .catch((err) => {
    console.error('Error in connecting to DB', err);
    process.exit(-1);
  });

app.use('/api', api);

//configure port and run server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log('Server running on port ' + port));
