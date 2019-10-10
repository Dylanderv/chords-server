import Router from 'koa-router';
import createTestData = require('../qa/createTestData')

export const qaRouter = new Router();

qaRouter.post('/qa/users', createTestData.testData.createTestUsers);
