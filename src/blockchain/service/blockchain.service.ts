import { BadRequestException, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { BlockType } from '../type/block.type';

@Injectable()
export class BlockchainService {
  private accountBalances: number[] = [];
  private blocks: BlockType[] = [];

  initAccountBalances(balances: number[]): void {
    this.accountBalances = balances;
  }

  getBlockchain(): BlockType[] {
    return this.blocks;
  }

  getAccountBalance(index: number): number {
    return this.accountBalances[index];
  }

  processTransactions(transactions: number[][]): BlockType {
    const accountBalances = this.accountBalances;
    const validTransactions: number[][] = [];

    for (const transaction of transactions) {
      const incorrectValue = transaction[2] < 1;
      const transferBalanceError =
        transaction[2] > accountBalances[transaction[0]] ||
        accountBalances[transaction[1]] === undefined;

      if (incorrectValue || transferBalanceError) {
        continue;
      }

      accountBalances[transaction[0]] -= transaction[2];
      accountBalances[transaction[1]] += transaction[2];

      validTransactions.push(transaction);
    }

    const blockHash = this.generateBlockHash(validTransactions);

    if (!this.checkValidity(blockHash)) {
      throw new BadRequestException('Check validity error');
    }

    this.blocks.push(blockHash);
    this.accountBalances = accountBalances;

    return blockHash;
  }

  groupTransactions(
    pendingTransactions: number[][],
    blockSize: number,
  ): number[][][] {
    let transactionOffset = 0;
    const groupedTransactions: number[][][] = [];

    while (transactionOffset < pendingTransactions.length) {
      const transaction: number[][] = [];

      for (let i = 0; i < blockSize; i++) {
        transactionOffset < pendingTransactions.length
          ? transaction.push(pendingTransactions[transactionOffset++])
          : undefined;
      }

      groupedTransactions.push(transaction);
    }

    return groupedTransactions;
  }

  private generateBlockHash(validTransactions: number[][]): BlockType {
    const previousHash =
      this.blocks.slice(-1)[0]?.hash ??
      '0000000000000000000000000000000000000000';
    const transactionsString = JSON.stringify(validTransactions);
    let nonce = 1;
    let hash = '';

    do {
      const stringToHash = `${previousHash}, ${nonce}, ${transactionsString}`;

      hash = crypto
        .createHmac('sha1', 'secret')
        .update(stringToHash)
        .digest('hex');

      nonce++;
    } while (hash.slice(0, 4) !== '1234');

    return { hash, previousHash, nonce };
  }

  private checkValidity(block: BlockType): boolean {
    const previousHash = this.blocks.slice(-1)[0]?.hash;

    if (
      previousHash === undefined &&
      block.previousHash === '0000000000000000000000000000000000000000'
    ) {
      return true;
    }

    return block.previousHash === previousHash;
  }
}
