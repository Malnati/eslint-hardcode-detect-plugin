import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HardcodedSeedModule } from './fixture-hardcodes/hardcoded-seed.module';

@Module({
  imports: [HardcodedSeedModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
