// Update with your config settings.

module.exports = {
  development: {
    client: "sqlite3",
    connection: {
      filename: "./db/sky_table.sqlite3"
    },
    seeds: {
      directory: "./db/seeds"
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "./db/migrations"
    },
    useNullAsDefault: true
  },

  // production: {
  //   client: "postgresql",
  //   connection: {
  //     database: "my_db",
  //     user: "username",
  //     password: "password"
  //   },
  //   pool: {
  //     min: 2,
  //     max: 10
  //   },
  //   migrations: {
  //     tableName: "knex_migrations"
  //   },
  //   useNullAsDefault: true
  // }
};
