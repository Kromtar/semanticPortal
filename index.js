require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.Promise = global.Promise;
const app = express();

//añadir modelos de mongodb
require('./models/User');

//Control de acceso
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, auth'
  );
  next();
});

//Formato de consultas
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//añadir rutas http
require('./routes/authRoutes')(app);

//Bypass para cliente
app.use(express.static('client/build'));
const path = require('path');
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

//Inicio de servicios
mongoose.connect(process.env.MONGODBURI, {}, (err) => {
  if (err) {
    throw err;
  } else {
    console.log('MongoDb conection OK');
    app.listen(process.env.SERVERPORT, () => {
      console.log('Server ON, port:', process.env.SERVERPORT);
      console.log('The environment is', process.env.NODE_ENV);
    });
  }
});
