const Sequelize = require('sequelize');
const { Model } = require('sequelize');
const { v4: uuid } = require('uuid');

class Respostas extends Model {
  static init(sequelize) {
    super.init(
      {
        docente_id: Sequelize.UUID,
        discente_id: Sequelize.UUID,
        tae_id: Sequelize.UUID,
        fichas_id: Sequelize.UUID,
        perguntas_id: Sequelize.UUID,
        opcao_id: Sequelize.UUID,
        is_subjective: Sequelize.BOOLEAN,
        subjective_answer: Sequelize.STRING,
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
    this.hasMany(models.Docentes, {
      foreignKey: 'id',
      sourceKey: 'docente_id',
      as: 'respostasHasDocente',
    });
    this.hasMany(models.Discentes, {
      foreignKey: 'id',
      sourceKey: 'discente_id',
      as: 'respostasHasDiscente',
    });
    this.hasMany(models.Taes, {
      foreignKey: 'id',
      sourceKey: 'tae_id',
      as: 'respostasHasTaes',
    });
    this.hasMany(models.Fichas, {
      foreignKey: 'id',
      sourceKey: 'fichas_id',
      as: 'respostasHasFichas',
    });
    this.hasMany(models.Perguntas, {
      foreignKey: 'id',
      sourceKey: 'perguntas_id',
      as: 'respostasHasPerguntas',
    });
    this.hasMany(models.Opcoes, {
      foreignKey: 'id',
      sourceKey: 'opcao_id',
      as: 'respostasHasOpcoes',
    });
  }
}

module.exports = Respostas;
