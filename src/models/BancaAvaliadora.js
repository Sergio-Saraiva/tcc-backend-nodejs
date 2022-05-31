const Sequelize = require('sequelize');
const { Model } = require('sequelize');
const { v4: uuid } = require('uuid');

class BancaAvaliadora extends Model {
  static init(sequelize) {
    super.init(
      {
        docente_id: Sequelize.UUID,
        orientacao_id: Sequelize.UUID,
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
    this.hasOne(models.Orientacoes, {
      foreignKey: 'id',
      sourceKey: 'orientacao_id',
      as: 'bancaHasOrientacao',
    });
    this.hasOne(models.Docentes, {
      foreignKey: 'id',
      sourceKey: 'docente_id',
      as: 'bancaHasDocentes',
    });
  }
}

module.exports = BancaAvaliadora;
