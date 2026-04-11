import { Controller, Get, Post, Body } from '@nestjs/common';
import { HardcodedSeedService } from './hardcoded-seed.service';
import { CreateItemDto } from './dto/create-item.dto';

@Controller('fixture-hardcodes')
export class HardcodedSeedController {
  constructor(private readonly seedService: HardcodedSeedService) {}

  @Get('health')
  health(): { status: string; probe: string } {
    return {
      status: 'ok',
      probe: 'readiness-check-seed',
    };
  }

  @Post('items')
  create(@Body() body: CreateItemDto): { ack: string } {
    void body;
    return { ack: 'item-accepted-for-fixture' };
  }
}
