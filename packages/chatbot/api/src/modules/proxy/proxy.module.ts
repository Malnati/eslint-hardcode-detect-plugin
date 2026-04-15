// sspa/mfe-chatbot/src/modules/proxy/proxy.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ProxyController } from './proxy.controller';
import { ConfigController } from './config.controller';
import { ProxyService } from './proxy.service';
import { KeyReaderService } from './key-reader.service';

@Module({
  imports: [HttpModule],
  controllers: [ProxyController, ConfigController],
  providers: [ProxyService, KeyReaderService],
})
export class ProxyModule {}
