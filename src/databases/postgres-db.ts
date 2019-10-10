import { createConnection } from 'typeorm';
import { postgresTables } from './postgres-tables';

export async function postgresDB() {
  return await createConnection({
    type: 'postgres',
    host: 'DATABASE',
    port: 5432,
    username: 'user',
    password: 'password',
    database: 'user',
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
