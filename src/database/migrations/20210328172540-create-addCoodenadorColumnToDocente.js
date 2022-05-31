'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn(
      'docentes',
      'coordenador',
      {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      });
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn('docentes', 'coordenador');
  }
};
