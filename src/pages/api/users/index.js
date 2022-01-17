const users = [
  {
    id   : 1,
    name : 'Joe'
  }, {
    id   : 2,
    name : 'Doe'
  }
];

const usersHandler = (req, res) => {
  res.status(200).json(users);
};

export default usersHandler;
