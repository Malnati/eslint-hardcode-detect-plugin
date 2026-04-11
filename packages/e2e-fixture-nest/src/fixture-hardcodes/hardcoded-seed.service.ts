import { Injectable } from '@nestjs/common';
import { CATALOG_DOMAIN, HTTP_MESSAGES, MESSAGE_CODES } from './config/catalog';

@Injectable()
export class HardcodedSeedService {
  private readonly cachePrefix = 'seed-cache';

  getWelcome(): { title: string; code: string } {
    return {
      title: 'Bem-vindo ao fixture de hardcodes',
      code: 'HCS-WELCOME-001',
    };
  }

  describeDomain(): string {
    return `Domínio ativo: ${CATALOG_DOMAIN}`;
  }

  logFailure(): void {
    const detail = HTTP_MESSAGES.badRequest;
    console.error(detail, MESSAGE_CODES.ITEM_INVALID);
  }

  buildPath(segment: string): string {
    return `${this.cachePrefix}:/api/${CATALOG_DOMAIN}/items/${segment}`;
  }
}
