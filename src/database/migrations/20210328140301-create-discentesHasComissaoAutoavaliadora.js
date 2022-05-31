'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('discentes_has_comissao_autoavaliadoras', {
      discente_id: {
        type: Sequelize.UUID,
        references: { model: 'discentes', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        allowNull: false,
      },
      comissaoAutoavaliadora_id: {
        type: Sequelize.UUID,
        references: { model: 'comissao_autoavaliadoras', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('discentes_has_comissao_autoavaliadoras');
  }
};
