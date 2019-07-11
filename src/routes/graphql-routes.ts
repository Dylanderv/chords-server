import * as Router from 'koa-router';
import * as passport from 'koa-passport';

export const graphQlRouter = new Router();

// graphQlRouter.post('/graphql', async (ctx, next) => {
//   console.log('là')
//   await passport.authenticate('local', { successRedirect: '/auth/status', failureRedirect: '/auth/register', failuseFlash: true }, async (err, response, info, status) => {
//     return await next();
//   })(ctx)
// });
