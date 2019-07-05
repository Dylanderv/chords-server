import { postgresDB } from 'databases/postgres-db';
import { qaRouter } from 'routes/qa-routes';
import { authRouter } from 'routes/auth-routes';
import * as bodyParser from 'koa-bodyparser'
import { ApolloServer } from 'apollo-server-koa';
import { typeDefs, resolvers } from 'graphQL/index';
import * as passport from 'koa-passport';
import * as session from 'koa-session'

const app = require('./app');

async function bootstrap() {

  await postgresDB();

  // Sessions
  /*
  Key for prodution example :
  $ python3
  >> import os
  >> os.urandom(24)
  b'3\xa5\xfa\xc6\xfb\x0e\x1dA\x19-U\x15Y\x9e2]\x92/\x97\x8d\xecsJ\xb7'
  */
  app.keys = ['super-secret-key'];
  app.use(session({}, app));

  // Body Parser
  app.use(bodyParser());

  //Authentification
  require('./auth/auth');
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(authRouter.routes(), authRouter.allowedMethods());
  app.use(qaRouter.routes(), qaRouter.allowedMethods());

  const server = new ApolloServer({ typeDefs, resolvers})
  server.applyMiddleware({ app })

  app.listen({ port: 3000 }, () =>
    console.log(`🚀 Server ready at http://localhost:3000${server.graphqlPath}`),
  );
}

bootstrap();