var mongoose        = require("mongoose");
var passport        = require("passport");
var User            = require("../models/user");
var Rules            = require("../models/rules");
var methodsControl  = require("./methods.js");
var userController  = {};

// Restrict access to profile page
userController.profille = function(req, res, next) {
  User.findOne({email: req.user.email}, function(err, user) {
    if (err) {
       throw err;
    }
      Rules.findOne({ruleid: user.rule_id}, function(error, rule){
        var job = rule.rulename;
        var userRule = false;
        if(user.rule_id === '0'){
          userRule = true;
        } 
        res.render('profile/profile', { title: 'IT Task Manager', user: user, job: job, userRule:userRule}); 
      });
  });
};


//Logout User
userController.userLogout = function(req, res, next) {
  req.logout();
  res.redirect('/');
};

// Restrict access to Register page
userController.addemployee = function(req, res, next) {
  var messages = req.flash('error');

  if(req.user && methodsControl.isLoggedIn){
		User.findOne({email: req.user.email}, function(err, user) {
		  if (err) {
			 throw err;
      }
      Rules.find({}, function(err, rules){
        if(err) {throw err;}
        var usersRules = [];
        res.render('profile/addemployee', { title: 'IT Task Manager', messages: messages, hasError: messages.length >0,rules:rules,user:user });
      });   
		});
    }
};

// Restrict access to login page
userController.login = function(req, res, next) {
  var messages = req.flash('error');
  res.render('home/login', { title: 'IT Task Manager', messages: messages, hasError: messages.length >0 });
};



// Restrict access to Update page
userController.updateEmployee = function(req, res, next) {

  var userId = req.params.id;
  
  User.findOne({_id: userId}, function(err, results) {
    if (err) {
       throw err;
    }
    res.render('admin/update', { title: 'Ensa7ny',user: results});
  });
};

//Post Update user data
userController.updateUserPost = function(req, res, next) {
  var userId    = req.params.id;
  var fullname  = req.body.fullname;
  var email     = req.body.email;
  var phone     = req.body.tel;
  var age       = req.body.age;

  methodsControl.update(userId, fullname,email,phone,age, res);

};

module.exports = userController;
