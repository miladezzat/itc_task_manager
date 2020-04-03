const express = require('express')
const router = express.Router()
const User = require('../models/user.js')
//All methods for control users
const methodsController = require('../controllers/methods')

/* GET home page. */
router.get('/', function (req, res, next) {
  //uncomment the next line to setup addmin and after setup you need delet it
  // require('../init/setupAdmin').initAdmin()

  if (req.user && methodsController.isLoggedIn) {
    User.findOne({ email: req.user.email }, function (err, user) {
      if (err) {
        throw err
      }
      res.render('home/index', { title: 'IT Task Manager', user: user })
    })
  } else {
    res.render('home/index', { title: 'ITC Task Manager' })
  }
})

//get about page and feedback page
router.get('/about', function (req, res, next) {
  res.render('home/about', { title: 'IT Task Manager' })
})

module.exports = router
