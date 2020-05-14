const knex = require('knex');
const configuration = require('../../knexfile');

const connection = knex(configuration.electron);

module.exports = connection;
