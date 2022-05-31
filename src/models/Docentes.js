const Sequelize = require('sequelize');
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');
const { v4: uuid } = require('uuid');

class Docentes extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        status: Sequelize.STRING,
        areaConcetracao: Sequelize.STRING,
        linhaPesquisa: Sequelize.STRING,
        ppg: Sequelize.STRING,
        password: Sequelize.STRING,
        coordenador: Sequelize.BOOLEAN,
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
      foreignKey: 'docente_id',
      through: 'docentes_has_diciplinas',
      as: 'docenteHasDisciplinas',
    });
    this.belongsToMany(models.Orientacoes, {
      foreignKey: 'docente_id',
      through: 'banca_avaliadora',
      as: 'docenteHasBancas',
    });
    this.belongsToMany(models.ComissaoAutoavaliadora, {
      foreignKey: 'comissaoAutoavaliadora_id',
      through: 'docentes_has_comissao_autoavaliadoras',
      as: 'docenteHasComissao',
    });
  }
}

module.exports = Docentes;
