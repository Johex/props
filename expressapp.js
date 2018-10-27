const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const port = 3000;








//view engine:
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


//set static path
app.use(express.static(path.join(__dirname, 'public')));


// router
const router = require('./routes/routes');

app.use(router);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));








