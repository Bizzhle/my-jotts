const config = {
  type: 'postgres',
  host: 'db',
  port: 5432,
  username: 'your_username',
  password: 'your_password',
  database: 'your_database',
  synchronize: true,
  logging: true,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  cli: {
    migrationsDir: 'src/migrations',
  },
};

export default config;
