var mongoose = require('mongoose')
var Schema = mongoose.Schema
var bcrypt = require('bcrypt-nodejs')
const crypto = require('crypto')

var userSchema = new Schema({
  fname: { type: String, required: true },
  lname: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  birthday: { type: String, required: true },
  gender: { type: String, required: true },
  picture: { type: String },
  imagePath: { type: String },
  rule_id: { type: String, required: true }
})

userSchema.methods.encryptPassword = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null)
}

userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password)
}
userSchema.methods.gravatar = function (size) {
  if (!this.size) size = 200
  if (!this.email) {
    return 'https://gravatar.com/avatar/?s' + size + '&d=retro'
  } else {
    var md5 = crypto
      .createHash('md5')
      .update(this.email)
      .digest('hex')
    return 'https://gravatar.com/avatar/' + md5 + '?s' + size + '&d=retro'
  }
}

module.exports = mongoose.model('User', userSchema)
