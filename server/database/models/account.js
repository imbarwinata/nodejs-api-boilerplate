'use strict';
module.exports = (sequelize, DataTypes) => {
  const account = sequelize.define('account', {
    firstName: DataTypes.STRING(20),
    lastName: DataTypes.STRING(20),
    userId: {
      type: DataTypes.INTEGER,
      onDelete: "CASCADE",
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {});
  account.associate = function(models) {
    // associations can be defined here
    account.belongsTo(models.user, {
      onDelete: "CASCADE",
      foreignKey: {
        allowNull: false
      }
    });
  };
  return account;
};