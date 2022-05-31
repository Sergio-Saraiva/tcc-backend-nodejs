'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'docentes_has_diciplinas',
      'id',
      {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn('docentes_has_diciplinas', 'id')
  }
};
