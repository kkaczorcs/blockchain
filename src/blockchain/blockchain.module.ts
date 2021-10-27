import { Module } from '@nestjs/common';
import { BlockchainService } from './service/blockchain.service';
import { BlockchainController } from './controller/blockchain.controller';

@Module({
  imports: [],
  providers: [BlockchainService],
  exports: [],
  controllers: [BlockchainController],
})
export class BlockchainModule {}
