import { BaseContext } from 'koa';
import { getConnection } from 'typeorm';
import { User } from '../models/user';

export class testData {
  public static async createTestUsers(ctx: BaseContext) {
    try {
      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(User)
        .values([
          { username: 'Fredo', email: 'fredo@freddd.com', hashedPassword: 'leMotDePasse'},
          { username: 'Marcel', email: 'marcel@gmail.com', hashedPassword: 'password'},
          { username: 'MArjorie', email: 'marjo@laposte.net', hashedPassword: '1234*23873219084MOTDEMOAWDN'}
        ])
        .execute();
      ctx.body = "Test users created successfully";
    } catch (err) {
      ctx.status = err.statusCode || err.status || 500;
      ctx.body = {
        message: err.message
      };
    }
  }
}