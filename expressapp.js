const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const port = 3000;








//view engine:
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({limit: '5mb',extended: true}));

app.use(cookieParser());

//set static path
app.use(express.static(path.join(__dirname, 'public')));


// router
const router = require('./routes/routes');

app.use(router);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));








