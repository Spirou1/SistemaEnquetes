const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Option = require('./Option'); // Importando o modelo de Opção

const Poll = sequelize.define('Poll', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false
  }
});

// Associação de Poll com Option
Poll.hasMany(Option, { as: 'options', foreignKey: 'PollId', onDelete: 'CASCADE' });
Option.belongsTo(Poll, { foreignKey: 'PollId' });

module.exports = Poll;
