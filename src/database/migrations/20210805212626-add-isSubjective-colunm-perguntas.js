'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'perguntas',
      'is_subjective',
      {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn('perguntas', 'is_subjective')
  }
};
