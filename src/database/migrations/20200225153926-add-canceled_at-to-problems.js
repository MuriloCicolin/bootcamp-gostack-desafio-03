module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('delivery_problems', 'canceled_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('delivery_problems', 'canceled_at');
  },
};
