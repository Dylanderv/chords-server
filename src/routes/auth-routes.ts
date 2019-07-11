import * as Router from 'koa-router';
import * as passport from 'koa-passport';
import { createReadStream } from 'fs'
import { buildQueryFromSelectionSet } from 'apollo-utilities';
import UserController from '../controllers/userController';
import { User } from '../models/user';
import { UserInput } from '../models/userInput';

export const authRouter = new Router();

authRouter.get('/auth/register', async (ctx) => {
  ctx.type = 'html';
  ctx.body = `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Register</title>
  </head>
  <body>
    <h1>Register</h1>
    <form action="/auth/register" method="post">
      <p><label>Username: <input type="text" name="username"/></label></p>
      <p><label>Password: <input type="password" name="password"/></label></p>
      <p><button type="submit">Register</button></p>
    </form>
  </body>
  </html>
  `;
});

authRouter.post('/auth/register', async (ctx) => {
  let userInput: UserInput = { username: ctx.request.body.username, password: ctx.request.body.password, email: null }
  let user: User;
  try {
    user = await UserController.createUser( userInput );
  } catch (err) {
    console.log(err)
  }
  console.log(user);
  await passport.authenticate('local', { successRedirect: '/auth/status', failureRedirect: '/auth/register', failuseFlash: true })(ctx)
});

authRouter.get('/auth/status', async (ctx) => {
  if (ctx.isAuthenticated()) {
    ctx.body = ctx.state.user;
  } else {
    ctx.redirect('/auth/login');
  }
});

authRouter.get('/auth/login', async (ctx) => {
  ctx.type = 'html';
  ctx.body = `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Register</title>
  </head>
  <body>
    <h1>Register</h1>
    <form action="/auth/login" method="post">
      <p><label>Username: <input type="text" name="username"/></label></p>
      <p><label>Password: <input type="password" name="password"/></label></p>
      <p><button type="submit">Register</button></p>
    </form>
  </body>
  </html>
  `;
});

authRouter.post('/auth/login', async (ctx) => {
  await passport.authenticate('local', { successRedirect: '/auth/status', failureRedirect: '/auth/login', failuseFlash: true })(ctx)
});

authRouter.get('/auth/logout', async (ctx) => {
  console.log('test');
  if (ctx.isAuthenticated()) {
    ctx.logout();
    ctx.redirect('/auth/login');
  } else {
    console.log('bfdbfd');
    ctx.body = { success: false };
    ctx.throw(401);
  }
});

