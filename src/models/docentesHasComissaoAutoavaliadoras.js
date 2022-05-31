const Sequelize = require('sequelize');
const { Model } = require('sequelize');
const { v4: uuid } = require('uuid');

class docentesHasComissaoAutoavaliadoras extends Model {
  static init(sequelize) {
    super.init(
      {
        docente_id: Sequelize.UUID,
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
    this.belongsTo(models.Docentes, {
      foreignKey: 'docente_id',
      as: 'docente',
    });
    this.belongsTo(models.ComissaoAutoavaliadora, {
      foreignKey: 'comissaoAutoavaliadora_id',
      as: 'comissao',
    });
  }
}

module.exports = docentesHasComissaoAutoavaliadoras;
