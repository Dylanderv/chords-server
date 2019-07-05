import { postgresDB } from 'databases/postgres-db';
import { qaRouter } from 'routes/qa-routes';
import * as bodyParser from 'koa-bodyparser'
import { ApolloServer } from 'apollo-server-koa';
import { typeDefs, resolvers } from 'graphQL/index';

const app = require('./app');

async function bootstrap() {

  await postgresDB();

  app.use(bodyParser());

  app.use(qaRouter.routes(), qaRouter.allowedMethods());

  const server = new ApolloServer({ typeDefs, resolvers})
  server.applyMiddleware({ app })

  app.listen({ port: 3000 }, () =>
    console.log(`🚀 Server ready at http://localhost:3000${server.graphqlPath}`),
  );
}

bootstrap();