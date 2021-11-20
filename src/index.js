const express = require('express');
// import { engine } from 'express-handlebars';
const path = require('path')

const app = express();


// app.engine('handlebars', engine());
// app.set('view engine', 'handlebars');

app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, '/resources/mail'))

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

require('./app/controllers/index')(app);



app.listen(8080);
