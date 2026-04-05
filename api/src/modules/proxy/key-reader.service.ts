// sspa/mfe-chatbot/src/modules/proxy/key-reader.service.ts
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import fs from 'fs';
import path from 'path';

interface RotatedKeyPayload {
  token: string;
  tenantEid: string;
  accountEid: string;
  createdAt: string;
}

type RotationState = Record<string, RotatedKeyPayload>;

const SERVICE_NAME = 'mfe-chatbot';
const FALLBACK_SERVICE_NAME = 'api-proxy-openrouter';
const KEY_ROTATION_FILE = 'key-rotation.json';
const RELOAD_INTERVAL_MS = 30_000;

@Injectable()
export class KeyReaderService implements OnModuleInit {
  private readonly logger = new Logger(KeyReaderService.name);
  private readonly rotationDir: string;
  private currentToken: string | null = null;
  private reloadTimer: NodeJS.Timeout | null = null;

  constructor(private readonly configService: ConfigService) {
    this.rotationDir =
      this.configService.get<string>('ROTATION_DATA_DIR') || '/data/rotation';
  }

  onModuleInit() {
    this.loadToken();
    this.reloadTimer = setInterval(() => this.loadToken(), RELOAD_INTERVAL_MS);
  }

  getToken(): string | null {
    return this.currentToken;
  }

  hasToken(): boolean {
    return this.currentToken !== null && this.currentToken.length > 0;
  }

  private loadToken(): void {
    const filePath = path.join(this.rotationDir, KEY_ROTATION_FILE);
    try {
      if (!fs.existsSync(filePath)) {
        this.logger.warn(`Rotation file not found: ${filePath}`);
        return;
      }
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as RotationState;
      const entry = data[SERVICE_NAME] || data[FALLBACK_SERVICE_NAME];
      const usedName = data[SERVICE_NAME] ? SERVICE_NAME : FALLBACK_SERVICE_NAME;
      if (entry?.token) {
        if (this.currentToken !== entry.token) {
          this.logger.log(`API key loaded from ${usedName} (created: ${entry.createdAt})`);
        }
        this.currentToken = entry.token;
      } else {
        this.logger.warn(`No key found for ${SERVICE_NAME} or ${FALLBACK_SERVICE_NAME} in rotation file`);
      }
    } catch (error) {
      this.logger.error(`Failed to read rotation file: ${(error as Error).message}`);
    }
  }
}
