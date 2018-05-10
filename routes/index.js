var express               = require('express');
var router                = express.Router();
var User                  =	require('../models/user.js');
var passport		          = require('passport');
var Rule                    =	require('../models/rules.js');
//All methods for control users
var methodsController     = require("../controllers/methods");

/* GET home page. */
router.get('/', function(req, res, next) {

  if(req.user && methodsController.isLoggedIn){
    User.findOne({email: req.user.email}, function(err, user) {
      if (err) {
         throw err;
      }
      res.render('home/index', { title: 'IT Task Manager', user: user});
    });
  } else {
    res.render('home/index', { title: 'ITC Task Manager' });
  }

});

//get about page and feedback page
router.get('/about', function(req, res, next) {
  res.render('home/about', { title: 'IT Task Manager' });
});

module.exports = router;
