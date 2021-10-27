import { ApiProperty } from '@nestjs/swagger';

export class BlockchainDTO {
  @ApiProperty()
  initialAccountBalances: number[];

  @ApiProperty()
  pendingTransactions: number[][];

  @ApiProperty()
  blockSize: number;
}
