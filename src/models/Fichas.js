const Sequelize = require('sequelize');
const { Model } = require('sequelize');
const { v4: uuid } = require('uuid');

class Fichas extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        tema_id: Sequelize.UUID,
      },
      {
        sequelize,
      }
    );
    super.beforeCreate((user, _) => {
      return (user.id = uuid());
    });
  }
  static associate(models) {
    this.hasMany(models.Temas, {
      foreignKey: 'id',
      sourceKey: 'tema_id',
      as: 'fichasHasTemas',
    });
  }
}

module.exports = Fichas;
