const Sequelize = require('sequelize');
const { Model } = require('sequelize');
const { v4: uuid } = require('uuid');

class ComissaoAutoavaliadora extends Model {
  static init(sequelize) {
    super.init(
      {
        tae_id: Sequelize.UUID,
        name: Sequelize.STRING,
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
      as: 'comissaoHasTaes',
    });
    this.belongsToMany(models.Docentes, {
      foreignKey: 'comissaoAutoavaliadora_id',
      through: 'docentesHasComissaoAutoavaliadoras',
      as: 'comissaoHasDocentes',
    });

    this.belongsToMany(models.Discentes, {
      foreignKey: 'comissaoAutoavaliadora_id',
      through: 'discentesHasComissaoAutoavaliadoras',
      as: 'comissaoHasDiscentes',
    });
  }
}

module.exports = ComissaoAutoavaliadora;
