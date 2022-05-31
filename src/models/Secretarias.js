const Sequelize = require('sequelize');
const { Model } = require('sequelize');
const { v4: uuid } = require('uuid');

class Secretarias extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        tae_id: Sequelize.UUID,
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
    this.hasMany(models.Taes, {
      foreignKey: 'id',
      sourceKey: 'tae_id',
      as: 'secretariaHasTaes',
    });
  }
}

module.exports = Secretarias;
