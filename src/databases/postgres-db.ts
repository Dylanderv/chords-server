import { createConnection } from 'typeorm';
import { postgresTables } from './postgres-tables';

export async function postgresDB() {
  return await createConnection({
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: 5432,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DB,
    ssl: false,
    entities: postgresTables,
    logging: ['query', 'error'],
    synchronize: true,
  }).then(connection => {
    // console.log(connection);
    console.log('Connected')
  }).catch(error =>{
    console.log(error)
  });
}
