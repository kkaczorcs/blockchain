import { BlockchainController } from './blockchain.controller';
import { Test } from '@nestjs/testing';
import { BlockchainService } from '../service/blockchain.service';
import { blockchainServiceMock } from '../../../test/mocks/blockchain-service.mock';

describe('BlockchainController', () => {
  let controller: BlockchainController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [BlockchainController],
      providers: [
        { provide: BlockchainService, useValue: blockchainServiceMock },
      ],
    }).compile();

    controller = module.get<BlockchainController>(BlockchainController);
  });

  it('controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('init', () => {
    const request = {
      initialAccountBalances: [100, 100, 500],
      pendingTransactions: [
        [0, 1, 50],
        [1, 2, 80],
        [2, 0, 450],
      ],
      blockSize: 2,
    };

    it('should return array of blockchain strings', async () => {
      const expectedResult = ['hash1', 'hash2'];

      jest
        .spyOn(blockchainServiceMock, 'groupTransactions')
        .mockReturnValue([
          [request.pendingTransactions[0], request.pendingTransactions[1]],
          [request.pendingTransactions[2]],
        ]);

      jest
        .spyOn(blockchainServiceMock, 'getBlockchain')
        .mockReturnValue(expectedResult);

      const result = await controller.init(request);

      expect(blockchainServiceMock.initAccountBalances).toBeCalledWith(
        request.initialAccountBalances,
      );
      expect(blockchainServiceMock.groupTransactions).toBeCalledWith(
        request.pendingTransactions,
        request.blockSize,
      );
      expect(blockchainServiceMock.processTransactions).toHaveBeenNthCalledWith(
        1,
        [request.pendingTransactions[0], request.pendingTransactions[1]],
      );
      expect(blockchainServiceMock.processTransactions).toHaveBeenNthCalledWith(
        2,
        [request.pendingTransactions[2]],
      );
      expect(blockchainServiceMock.getBlockchain).toBeCalled();
      expect(result).toEqual({ blockchain: expectedResult });
    });

    it('should throw bad request exception if blockchain is not valid', async () => {
      jest
        .spyOn(blockchainServiceMock, 'groupTransactions')
        .mockReturnValue([
          [request.pendingTransactions[0], request.pendingTransactions[1]],
          [request.pendingTransactions[2]],
        ]);

      jest
        .spyOn(blockchainServiceMock, 'processTransactions')
        .mockReturnValue(undefined);

      await expect(controller.init(request)).rejects.toThrow(
        'blockchain validity error',
      );
    });
  });

  describe('getAccountBalance', () => {
    it('should return account balance with given index', async () => {
      const expectedResult = 100;
      const index = 2;

      jest
        .spyOn(blockchainServiceMock, 'getAccountBalance')
        .mockReturnValue(expectedResult);

      const result = await controller.getAccountBalance(index);

      expect(blockchainServiceMock.getAccountBalance).toBeCalledWith(index);
      expect(result).toEqual(expectedResult);
    });
  });
});
