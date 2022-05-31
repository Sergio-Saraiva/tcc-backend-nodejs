'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'respostas',
      'is_subjective',
      {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn('respostas', 'is_subjective')
  }
};
