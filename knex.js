module.exports = {
    development: {
        client: 'mssql',
        connection: {
            server: '127.0.0.1',
            user: 'ari_kadriu',
            password: '123456',
            database: 'SocialMedia',
        },
        migrations: {
            tableName: 'knex_migrations',
            directory: './migrations',
        },
    },
};