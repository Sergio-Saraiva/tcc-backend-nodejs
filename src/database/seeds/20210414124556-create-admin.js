'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('admins', [
      {
        id: '4c1e68cd-51a4-496d-b47d-c458cbb41bbf',
        name: 'Gabriel',
        password:
          '$2a$10$OiqWB9bMNvffzxvBxg2UFuNGPk2CT620XeAmQPaI6JGP1GzmMcLra', // 123546
        email: 'gabrielsouza.n.s@hotmail.com',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('admins', null, {});
  },
};
