import { Injectable } from '@nestjs/common';

@Injectable()
export class BlockchainService {
  private accountBalances: number[] = [];

  initAccountBalances(balances: number[]): void {
    this.accountBalances = balances;
  }

  getAccountBalance(index: number): number {
    return this.accountBalances[index];
  }
}
