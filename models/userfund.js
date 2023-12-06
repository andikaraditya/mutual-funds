'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserFund extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserFund.belongsTo(models.Fund, {foreignKey: "FundId"})
    }
  }
  UserFund.init({
    UserId: DataTypes.INTEGER,
    FundId: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    totalValue: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UserFund',
  });
  return UserFund;
};