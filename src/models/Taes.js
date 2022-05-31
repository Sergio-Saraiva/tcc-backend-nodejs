const Sequelize = require('sequelize');
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');
const { v4: uuid } = require('uuid');

class Taes extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
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
  static associate(models) {
    this.hasOne(models.Secretarias, {
      foreignKey: 'tae_id',
      as: 'taeHasSecretaria',
    });
    this.hasOne(models.ComissaoAutoavaliadora, {
      foreignKey: 'tae_id',
      as: 'taeHasComissao',
    });
  }
}

module.exports = Taes;
