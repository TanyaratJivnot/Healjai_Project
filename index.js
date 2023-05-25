const express = require('express');
const dotenv = require('dotenv');
const app = express();
app.use(express.json());
const fs = require('fs');
const morgan = require('morgan')
const path = require('path');
const session = require('express-session')
const cookieParser = require('cookie-parser');

/* import router */
const router = require('./modules/router');
const { default: mongoose } = require('mongoose');

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

/* session */
app.use(session({
    secret:"mysesion",
    resave:false,
    saveUninitialized:false
}))
/* file static */
app.use(express.static('public'));

app.use(router);

app.listen(3000,()=>{
    console.log(`start server in port 3000`);
});