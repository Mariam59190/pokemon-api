const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/pokemon-api')
  .then(() => console.log("MongoDB connecté"))
  .catch(err => console.log(err));