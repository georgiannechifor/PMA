const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const BCRYPT_SALT = 10;
const DEFAULT_EXPIRE_TIME = '7d';

const UserSchema = new mongoose.Schema({
  firstName : {
    type     : String,
    required : [true, 'Please add your first name']
  },
  lastName : {
    type     : String,
    required : [true, 'Please add your last name']
  },
  email : {
    type     : String,
    unique   : true,
    required : [true, 'Please add your email address']
  },
  password : {
    type     : String,
    required : [true, 'Please enter a password for your account']
  },
  team : {
    type : mongoose.Schema.Types.ObjectId,
    ref  : 'Team'
  },
  jobTitle : {
    type    : String,
    enum    : ['user', 'admin', 'superadmin'],
    default : 'user'
  },
  image : {
    data        : Buffer,
    contentType : String
  }
});

UserSchema.pre('save', async function save (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(BCRYPT_SALT);

    this.password = await bcrypt.hash(this.password, salt);

    return next();
  } catch (err) {
    return next(err);
  }
});

UserSchema.methods.validatePassword = async function validatePassword (data) {
  // eslint-disable-next-line no-return-await
  return await bcrypt.compare(data, this.password);
};

UserSchema.methods.getJwtToken = function getJwtToken () {
  return jwt.sign({
    // eslint-disable-next-line no-underscore-dangle
    id : this._id
  }, process.env.JWT_SECRET, {
    expiresIn : process.env.JWT_EXPIRES_TIME || DEFAULT_EXPIRE_TIME
  });
};

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
