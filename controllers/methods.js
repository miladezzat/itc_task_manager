var mongoose    = require("mongoose");
var passport    = require("passport");
var User        = require("../models/user");

//object for methods
var methodsControl = {};

//The user is LoggedIn or not
methodsControl.isLoggedIn = function (req, res, next){
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

////The user is notLoggedIn or not
methodsControl.notLoggedIn = function (req, res, next){
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

//The user is admin or not
methodsControl.isOwnerCompany = function (req, res, next){
  User.findOne({email: req.user.email}, function(err, results) {
    if (err) {
      return res.write('Error!');
    }
    if (results.rule_id === '0' ) {
      return next();
    }
    res.redirect('/account/profile');
  });
}

module.exports = methodsControl;
