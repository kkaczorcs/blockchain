import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { BlockchainService } from '../service/blockchain.service';
import { BlockchainDTO } from '../dto/blockchain.dto';
import { BlockchainType } from '../type/blockchain.type';
import { ValidationPipe } from '../../common/validation/validation.pipe';
import { initializeBlockchainSchema } from '../validation/initialize-blockchain.schema';

@ApiTags('blockchain')
@Controller('blockchain')
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}

  @ApiOperation({ summary: 'initializes new blockchain operations' })
  @ApiResponse({ status: 201 })
  @Post('')
  async init(
    @Body(new ValidationPipe(initializeBlockchainSchema)) data: BlockchainDTO,
  ): Promise<BlockchainType> {
    this.blockchainService.initAccountBalances(data.initialAccountBalances);

    const groupedTransactions = this.blockchainService.groupTransactions(
      data.pendingTransactions,
      data.blockSize,
    );

    for (const transactions of groupedTransactions) {
      if (
        this.blockchainService.processTransactions(transactions) === undefined
      ) {
        throw new BadRequestException('blockchain validity error');
      }
    }

    return { blockchain: this.blockchainService.getBlockchain() };
  }

  @ApiOperation({ summary: 'returns blockchain accounts balance' })
  @ApiResponse({ status: 200 })
  @Get(':index')
  async getAccountBalance(@Param('index') index: number): Promise<number> {
    return this.blockchainService.getAccountBalance(index);
  }
}
