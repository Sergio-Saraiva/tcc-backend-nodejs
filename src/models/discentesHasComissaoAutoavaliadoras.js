const Sequelize = require('sequelize');
const { Model } = require('sequelize');
const { v4: uuid } = require('uuid');

class discentesHasComissaoAutoavaliadoras extends Model {
  static init(sequelize) {
    super.init(
      {
        discente_id: Sequelize.UUID,
        comissaoAutoavaliadora_id: Sequelize.UUID,
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
    this.belongsTo(models.Discentes, {
      foreignKey: 'discente_id',
      as: 'discente',
    });
    this.belongsTo(models.ComissaoAutoavaliadora, {
      foreignKey: 'comissaoAutoavaliadora_id',
      as: 'comissao',
    });
  }
}

module.exports = discentesHasComissaoAutoavaliadoras;
