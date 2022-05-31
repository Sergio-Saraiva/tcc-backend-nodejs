const Sequelize = require('sequelize');
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');
const { v4: uuid } = require('uuid');

class discentesHasDiciplinas extends Model {
  static init(sequelize) {
    super.init(
      {
        discente_id: Sequelize.UUID,
        disciplina_id: Sequelize.UUID,
        horario: Sequelize.STRING,
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
    this.belongsTo(models.Disciplinas, {
      foreignKey: 'disciplina_id',
      as: 'disciplina',
    });
  }
}

module.exports = discentesHasDiciplinas;
