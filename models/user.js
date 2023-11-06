const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
// define the schema for the users
const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  }
});


// add the passport-local-mongoose plugin to the UserSchema
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);