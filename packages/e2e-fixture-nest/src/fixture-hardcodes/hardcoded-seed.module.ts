import { Module } from '@nestjs/common';
import { HardcodedSeedController } from './hardcoded-seed.controller';
import { HardcodedSeedService } from './hardcoded-seed.service';

@Module({
  controllers: [HardcodedSeedController],
  providers: [HardcodedSeedService],
  exports: [HardcodedSeedService],
})
export class HardcodedSeedModule {}
