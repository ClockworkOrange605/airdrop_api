const express        = require('express');
const bodyParser     = require('body-parser');
const cors           = require('cors')
const app            = express();

const port = 8080;

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require('./app/routes')(app, {});

app.listen(port, () => {
    console.log('We are live on ' + port);
});