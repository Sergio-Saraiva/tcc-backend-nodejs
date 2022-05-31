const Sequelize = require('sequelize');
const { Model } = require('sequelize');
const { v4: uuid } = require('uuid');

class Temas extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        type_access: Sequelize.ENUM({
          values: ['do', 'di', 't', 'all', 'dodi', 'dot', 'dit']
        }),
      },
      {
        sequelize,
      }
    );
    super.beforeCreate((user, _) => {
      return (user.id = uuid());
    });
  }
}

module.exports = Temas;
