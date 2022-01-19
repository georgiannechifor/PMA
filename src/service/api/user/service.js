const User =  require('./model');

exports.getAllUsers = async function () {
  try {
    const allUsers = await User.find({}).select('-__v').toArray();
    return allUsers
  } catch(error) {
    throw new Error(error).message
  }
}
