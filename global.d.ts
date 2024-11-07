import supertest from 'supertest';

declare global {
  var request: supertest.SuperTest<supertest.Test>;
}
