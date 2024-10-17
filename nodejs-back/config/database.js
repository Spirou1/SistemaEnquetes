const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('sistema_votacao', 'root', '2469', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = sequelize;
