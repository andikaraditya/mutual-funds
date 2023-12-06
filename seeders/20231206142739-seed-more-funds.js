'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Funds", [
      {
        name: "Entertainment Funds",
        value: 300000,
        quantity: 1500,
        totalValue: 300000 * 2000,
        createdAt: new Date(),
        updatedAt: new Date(),
        CompanyId: 2
      },
      {
        name: "Filmaking Funds",
        value: 150000,
        quantity: 2500,
        totalValue: 150000 * 2500,
        createdAt: new Date(),
        updatedAt: new Date(),
        CompanyId: 2
      }
    ])
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Funds", null, {cascade: true, restartIdentity: true, truncate: true})
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
