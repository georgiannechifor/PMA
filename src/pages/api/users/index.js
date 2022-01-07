const users = [{id   : 1,
  name : 'Joe'}, {id   : 2,
  name : 'Mama'}];

const usersHandler = (req, res) => {
  res.status(200).json(users);
};

export default usersHandler;
