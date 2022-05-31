'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('respostas', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },

      docente_id: {
        type: Sequelize.UUID,
        references: { model: 'docentes', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        allowNull: true,
      },
      discente_id: {
        type: Sequelize.UUID,
        references: { model: 'discentes', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        allowNull: true,
      },
      tae_id: {
        type: Sequelize.UUID,
        references: { model: 'taes', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        allowNull: true,
      },
      fichas_id: {
        type: Sequelize.UUID,
        references: { model: 'fichas', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        allowNull: false,
      },
      perguntas_id: {
        type: Sequelize.UUID,
        references: { model: 'perguntas', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        allowNull: false,
      },
      opcao_id: {
        type: Sequelize.UUID,
        references: { model: 'opcoes', key: 'id' },
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
    return queryInterface.dropTable('respostas');
  }
};
