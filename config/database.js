var mongoose      = require('mongoose');
var url           = 'mongodb://localhost:27017/ITC_Task_Manager';



mongoose.Promise = global.Promise;
mongoose.connect(url)
  .then(() =>  console.log('connection succesful'))
  .catch((err) => console.error(err));
