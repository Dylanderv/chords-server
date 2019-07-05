import * as passport from 'koa-passport';
import UserController from '../controllers/userController';
import { Repository, getManager } from 'typeorm';
import { User } from '../models/user';
import * as bcrypt from 'bcrypt'

let LocalStrategy = require('passport-local')

const options = {
  usernameField: 'username',
  passwordField: 'password'
}

passport.serializeUser((user, done) => { done(null, user.id); });

passport.deserializeUser((id, done) => {
  const userRepository: Repository<User> = getManager().getRepository(User);
  return userRepository.findOneOrFail(id)
    .then((user) => { done(null, user); })
    .catch((err) => { done(err, null, { message: 'User does not exist'});  });
})

passport.use(new LocalStrategy(options, async (username, password, done) => {
  const userRepository: Repository<User> = getManager().getRepository(User);
  try {
    let user = (await userRepository.find({ where: {username: username} })).pop();
    if (!user) {
      return done(null, false, { message: 'Incorrect username.' });
    }
    if (!comparePass(password, user.hashedPassword)) {
      return done(null, false, { message: 'Incorrect password.' });
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}))

function comparePass(userPassword: string, databasePassword: string) {
  return bcrypt.compareSync(userPassword, databasePassword);
}
