const express = require("express");
const api = require('./routes/api');
const route = require('./routes/route');
const myDB = require('./routes/connection');
const bodyParser = require("body-parser");

var app = express();
app.use('/public', express.static(process.cwd() + '/public'));
app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



api(app)
route(app)




const listener = app.listen(8000, function (){
    console.log('Your app is listening on port ' + listener.address().port)
});