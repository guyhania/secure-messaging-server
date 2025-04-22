'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Message extends Model {

    static associate(models) {
      Message.belongsTo(models.User, { foreignKey: 'senderId', as: 'Sender' });
      Message.belongsTo(models.User, { foreignKey: 'recipientId', as: 'Recipient' });

    }
  }
  Message.init({
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    recipientId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
    {
      sequelize,
      modelName: 'Message',
      tableName: 'Messages',
      timestamps: false
    });

  return Message;
};