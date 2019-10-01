import * as Router from 'koa-router';
import * as passport from 'koa-passport';
import UserController from '../controllers/userController';
import { User } from '../models/user';
import { UserInput } from '../models/userInput';

export const authRouter = new Router();

authRouter.post('/auth/register', async (ctx) => {
  let userInput: UserInput = { username: ctx.request.body.username, password: ctx.request.body.password, email: null }
  let user: User;
  try {
    user = await UserController.createUser( userInput );
    await passport.authenticate('local', { successRedirect: '/auth/status', failuseFlash: true })(ctx)
  } catch (err) {
    console.log(err)
    ctx.throw(401)
  }
});

authRouter.get('/auth/status', async (ctx) => {
  if (ctx.isAuthenticated()) {
    ctx.body = {
      ok: true,
      user: ctx.state.user
    }
  } else {
    ctx.throw(403)
  }
});

authRouter.post('/auth/login', async (ctx) => {
  await passport.authenticate('local', { successRedirect: '/auth/status', failuseFlash: true })(ctx)
});

authRouter.get('/auth/logout', async (ctx) => {
  if (ctx.isAuthenticated()) {
    ctx.logout();
    ctx.body = true;
  } else {
    ctx.throw(401);
  }
});

authRouter.get('/auth/isauth', async (ctx) => {
  ctx.body = ctx.isAuthenticated()
})
