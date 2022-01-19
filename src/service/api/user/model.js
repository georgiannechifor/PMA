const {Schema, model} = require('mongoose');

const User = new Schema({
  firstName : {
    type     : String,
    required : true
  },
  lastName : {
    type     : String,
    required : true
  },
  email : {
    type     : String,
    unique   : true,
    required : true
  },
  team : {
    type     : String,
    required : true
  },
  jobTitle       : String,
  profilePicture : {
    data        : Buffer,
    contentType : String
  }
});

module.exports = model('user', User);
