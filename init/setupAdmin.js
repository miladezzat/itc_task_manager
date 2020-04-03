const bcrypt = require('bcrypt-nodejs')
const User = require('../models/user')
module.exports.initAdmin = () => {
  const newUser = new User({
    fname: 'Milad',
    lname: 'Fahmy',
    username: 'admin',
    email: 'admin@gmail.com',
    phone: '01282190854',

    birthday: '1-1-1996',
    gender: 'Male',
    rule_id: '0'
  })
  newUser.password = bcrypt.hashSync('123456', bcrypt.genSaltSync(5), null)
  newUser.save()
}
