const Sequelize = require('sequelize');
const { Model } = require('sequelize');
const { v4: uuid } = require('uuid');

class Opcoes extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        pergunta_id: Sequelize.UUID,
      },
      {
        sequelize,
      }
    );
    super.beforeCreate((user, _) => {
      if (!user.name) {
        user.name = 'R.:'
      }
      return (user.id = uuid());
    });
  }
  static associate(models) {
    this.hasMany(models.Perguntas, {
      foreignKey: 'id',
      sourceKey: 'pergunta_id',
      as: 'opcoesHasPerguntas',
    });
  }
}

module.exports = Opcoes;
