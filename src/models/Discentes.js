const Sequelize = require('sequelize');
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');
const { v4: uuid } = require('uuid');

class Discentes extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        areaConcetracao: Sequelize.STRING,
        status: Sequelize.STRING,
        linhaPesquisa: Sequelize.STRING,
        edital: Sequelize.STRING,
        defesa: Sequelize.DATE,
        password: Sequelize.STRING,
      },
      {
        defaultScope: {
          attributes: {
            exclude: ['password'],
          },
        },
        scopes: {
          withPassword: {},
        },
        sequelize,
      }
    );
    super.beforeCreate((user, _) => {
      return (user.id = uuid());
    });
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password);
  }
  static associate(models) {
    this.belongsToMany(models.Disciplinas, {
      foreignKey: 'discente_id',
      through: 'discentes_has_diciplinas',
      as: 'discenteHasDisciplinas',
    });
    this.belongsToMany(models.ComissaoAutoavaliadora, {
      foreignKey: 'comissaoAutoavaliadora_id',
      through: 'discentes_has_comissao_autoavaliadoras',
      as: 'discenteHasComissao',
    });

  }
}

module.exports = Discentes;
