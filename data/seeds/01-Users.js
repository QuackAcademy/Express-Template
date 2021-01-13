const bcrypt = require('bcryptjs');

exports.seed = function(knex) {
  return knex('users').insert([
    {
      email: 'firstuser@fake.com',
      username: 'testuser1',
      password: bcrypt.hashSync('pass', 12),
      fullName: 'First User'
    },
    {
      email: 'seconduser@fake.com',
      username: 'testuser2',
      password: bcrypt.hashSync('pass', 12),
      fullName: 'Second User'
    },
    {
      email: 'thirduser@fake.com',
      username: 'testuser3',
      password: bcrypt.hashSync('pass', 12),
      fullName: 'Third User'
    },
  ], 'id');
};
