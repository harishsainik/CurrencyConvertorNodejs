const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const app = express();


app.use(express.urlencoded ({ extended: false}));
app.use('/', require('./routes/home'));

var publicDir = path.join(__dirname, 'public')
app.use(express.static(publicDir));

app.use((req,res,next) => {
    res.status(404);
    res.send('<h1>Opps page not found!!</h1>');
});
//set port and start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log('Magic happens at port 8080');
});