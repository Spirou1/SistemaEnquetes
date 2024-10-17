const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Option = sequelize.define('Option', {
  text: {
    type: DataTypes.STRING,
    allowNull: false
  },
  votes: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  PollId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Polls',
      key: 'id'
    },
    onDelete: 'CASCADE'
  }
});

module.exports = Option;
