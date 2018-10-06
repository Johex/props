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
app.use(bodyParser.urlencoded({extended: false}));


//set static path
app.use(express.static(path.join(__dirname, 'public')));

// index
app.get('/', function(req, res){
    res.render('index');
});

// to-do page
app.get('/todo', function(req, res){
    res.render('todo');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));









