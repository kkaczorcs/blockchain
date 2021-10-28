import { Test } from '@nestjs/testing';
import { BlockchainService } from './blockchain.service';
import exp from 'constants';

describe('BlockchainService', () => {
  let service: BlockchainService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [BlockchainService],
    }).compile();

    service = module.get<BlockchainService>(BlockchainService);
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAccountBalance', () => {
    it('should return account balance', () => {
      const accountBalances = [100, 100, 500];

      service.initAccountBalances(accountBalances);

      const index = 1;

      const result = service.getAccountBalance(index);

      expect(result).toEqual(accountBalances[index]);
    });
  });

  describe('groupTransactions', () => {
    it('should return grouped transactions', () => {
      const pendingTransactions = [
        [0, 1, 50],
        [1, 2, 80],
        [2, 0, 450],
      ];
      const blockSize = 2;

      const result = service.groupTransactions(pendingTransactions, blockSize);

      expect(result).toEqual([
        [
          [0, 1, 50],
          [1, 2, 80],
        ],
        [[2, 0, 450]],
      ]);
    });
  });

  describe('processTransactions', () => {
    it('should return null if transactions cannot be processed', () => {
      const result = service.processTransactions([
        [0, 1, 50],
        [1, 2, 80],
      ]);

      expect(result).toEqual(null);
    });

    it('should process given transactions', () => {
      service.initAccountBalances([100, 100, 500]);

      const result = service.processTransactions([
        [0, 1, 50],
        [1, 2, 80],
      ]);

      expect(result).toHaveProperty('hash');
      expect(result).toHaveProperty('nonce');
      expect(result?.previousHash).toEqual(
        '0000000000000000000000000000000000000000',
      );
    });
  });
});
