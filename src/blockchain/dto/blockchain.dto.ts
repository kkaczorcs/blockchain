import { ApiProperty } from '@nestjs/swagger';

export class BlockchainDTO {
  @ApiProperty({ default: [100, 100, 500], type: [Number] })
  initialAccountBalances: number[];

  @ApiProperty({
    default: [
      [0, 1, 50],
      [1, 2, 80],
      [2, 0, 450],
    ],
    isArray: true,
  })
  pendingTransactions: number[][];

  @ApiProperty({ default: 2, type: Number })
  blockSize: number;
}
