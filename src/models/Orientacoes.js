const Sequelize = require('sequelize');
const { Model } = require('sequelize');
const { v4: uuid } = require('uuid');

class Orientacoes extends Model {
  static init(sequelize) {
    super.init(
      {
        discente_id: Sequelize.UUID,
        orientador_id: Sequelize.UUID,
        coorientador_id: Sequelize.UUID,
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
    this.hasOne(models.Discentes, {
      foreignKey: 'id',
      sourceKey: 'discente_id',
      as: 'orientacaoHasDiscente',
    });
    this.hasOne(models.Docentes, {
      foreignKey: 'id',
      sourceKey: 'orientador_id',
      as: 'orientacaoHasOrientador',
    });
    this.hasOne(models.Docentes, {
      foreignKey: 'id',
      sourceKey: 'coorientador_id',
      as: 'orientacaoHasCoorientador',
    });
    this.belongsToMany(models.Docentes, {
      foreignKey: 'orientacao_id',
      through: 'banca_avaliadoras',
      as: 'orientacaoHasBancas',
    });
  }
}

module.exports = Orientacoes;
