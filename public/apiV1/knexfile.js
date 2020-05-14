const path = require('path');
const isDev = require('electron-is-dev');
let URL_BD= `${path.resolve(__dirname, '../../../../', 'db', 'db.sqlite3')}`;

module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: './src/database/db.sqlite3'
    },
    migrations: {
      directory: './src/database/migrations'
    },
    useNullAsDefault: true,
  },

  electron: {
    client: 'sqlite3',
    connection: {
      filename:isDev ? path.join(__dirname,'../../db/db.sqlite3') : URL_BD.replace(/\\/g,'/')                 
     },
    migrations: {
          directory:path.join(__dirname, '../../db/migrations')
    },
    useNullAsDefault:true,
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
