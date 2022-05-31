const Sequelize = require('sequelize');
const { Model } = require('sequelize');
const { v4: uuid } = require('uuid');

class Perguntas extends Model {
  static init(sequelize) {
    super.init(
      {
        pergunta: Sequelize.STRING,
        ficha_id: Sequelize.UUID,
        is_subjective: Sequelize.BOOLEAN,
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
    this.hasMany(models.Fichas, {
      foreignKey: 'id',
      sourceKey: 'ficha_id',
      as: 'perguntasHasFichas',
    });
  }
}

module.exports = Perguntas;
