'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Funds", [
      {
        name: "Agro Funds",
        value: 200000,
        quantity: 2000,
        totalValue: 200000 * 2000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Creative Funds",
        value: 150000,
        quantity: 2500,
        totalValue: 150000 * 2500,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Tourism Funds",
        value: 200000,
        quantity: 1000,
        totalValue: 200000 * 1000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Manufacture Funds",
        value: 300000,
        quantity: 3000,
        totalValue: 300000 * 3000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Bonds",
        value: 100000,
        quantity: 10000,
        totalValue: 100000 * 10000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Oil Funds",
        value: 500000,
        quantity: 1000,
        totalValue: 500000 * 1000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
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
