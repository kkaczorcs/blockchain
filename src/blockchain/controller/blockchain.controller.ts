import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { BlockchainDTO } from '../dto/blockchain.dto';
import { BlockchainService } from '../service/blockchain.service';

@ApiTags('blockchain')
@Controller('blockchain')
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}

  @ApiOperation({ summary: 'initializes new blockchain operations' })
  @ApiResponse({ status: 201 })
  @Post('')
  async init(@Body() data: BlockchainDTO): Promise<object> {
    this.blockchainService.initAccountBalances(data.initialAccountBalances);

    return { success: true };
  }

  @ApiOperation({ summary: 'returns blockchain accounts balance' })
  @ApiResponse({ status: 200 })
  @Get(':index')
  async getAccountBalance(@Param('index') index: number): Promise<number> {
    return this.blockchainService.getAccountBalance(index);
  }
}
