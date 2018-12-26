'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    isActive: {
      type: DataTypes.BOOLEAN(),
      defaultValue: false
    },
    lastLogin: {
      type: DataTypes.DATE()
    }
  }, {});
  user.associate = function(models) {
    // associations can be defined here
    user.hasOne(models.account);
  };
  return user;
};