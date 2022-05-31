const Sequelize = require('sequelize');
const { Model } = require('sequelize');
const { v4: uuid } = require('uuid');

class Disciplinas extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        ano: Sequelize.STRING,
        semestre: Sequelize.STRING,
        status: Sequelize.STRING,
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
    this.belongsToMany(models.Docentes, {
      foreignKey: 'disciplina_id',
      through: 'docentes_has_diciplinas',
      as: 'disciplinaHasDocentes',
    });
    this.belongsToMany(models.Discentes, {
      foreignKey: 'disciplina_id',
      through: 'discentes_has_diciplinas',
      as: 'disciplinaHasDiscentes',
    });
  }
}

module.exports = Disciplinas;
