"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("users", "gender");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("users", "gender");
  },
};
