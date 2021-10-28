import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('BlockchainController (e2e)', () => {
  let app: INestApplication;
  const requestData = {
    initialAccountBalances: [100, 100, 500],
    pendingTransactions: [
      [0, 1, 50],
      [1, 2, 80],
      [2, 0, 450],
    ],
    blockSize: 2,
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/blockchain (POST)', async () => {
    const result = await request(app.getHttpServer())
      .post('/blockchain')
      .send(requestData);

    expect(result.status).toEqual(201);
    expect(result.body).toHaveProperty('blockchain');
    expect(result.body.blockchain?.length).toEqual(2);
    expect(result.body.blockchain[0]?.hash?.slice(0, 4)).toEqual('1234');
    expect(result.body.blockchain[1]?.hash?.slice(0, 4)).toEqual('1234');
  });

  it('/blockchain/1 (GET)', async () => {
    const index = 1;
    const expectedResult = '70';

    await request(app.getHttpServer()).post('/blockchain').send(requestData);

    const result = await request(app.getHttpServer()).get(
      `/blockchain/${index}`,
    );

    expect(result.status).toEqual(200);
    expect(result.text).toEqual(expectedResult);
  });
});
