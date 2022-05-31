const Sequelize = require('sequelize');
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');
const { v4: uuid } = require('uuid');

class Admin extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        status: Sequelize.STRING,
        password: Sequelize.STRING,
      },
      {
        defaultScope: {
          attributes: {
            exclude: ['password'],
          },
        },
        scopes: {
          withPassword: {},
        },
        sequelize,
      }
    );
    super.beforeCreate((user, _) => {
      return (user.id = uuid());
    });
  }
  checkPassword(password) {
    return bcrypt.compare(password, this.password);
  }
}

module.exports = Admin;
