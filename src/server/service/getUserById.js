import User from 'models/user';

export const getUserById = async (id) => {
  const user = await User.findById(id).select(['-__v', '-password']);

  return user;
}
