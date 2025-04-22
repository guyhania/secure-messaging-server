'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // A user can have many messages
      User.hasMany(models.Message, { foreignKey: 'senderId' });
    }
  }

  User.init(
    {
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      publicKey: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      encryptedPrivateKey: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      salt: {
        type: DataTypes.STRING,
        allowNull: false
      },
      iv: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'Users',
      timestamps: false
    }
  );

  return User;
};
