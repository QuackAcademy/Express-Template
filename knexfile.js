module.exports = {
  development: {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: { filename: './data/dev.sqlite3' },
    pool: { afterCreate: (conn, done) => { conn.run('PRAGMA foreign_keys = ON', done); } },
    migrations: { directory: './data/migrations' },
    seeds: { directory: './data/seeds' }
  },
  
  testing: {
    client: 'sqlite3',
    connection: { filename: './data/test.db3' },
    useNullAsDefault: true,
    migrations: { directory: './data/migrations' },
    seeds: { directory: './data/seeds' },
    log: { 
      warn(message){
        if (!message.includes('.returning()')){
          this._log(message, this._warn, color.yellow);
        }
      }
    }
  },

  production: {
    client: 'pg',
    connection: {
      url: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    },
    migrations: { directory: './data/migrations' },
    seeds: { directory: './data/seeds' } 
  },
};
