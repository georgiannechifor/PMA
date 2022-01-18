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
  res.status(200).json({
    data       : users,
    status     : 'SUCCESS',
    statusCode : 201
  });
};

export default usersHandler;
