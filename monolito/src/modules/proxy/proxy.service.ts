// sspa/mfe-chatbot/src/modules/proxy/proxy.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { KeyReaderService } from './key-reader.service';

@Injectable()
export class ProxyService {
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly keyReaderService: KeyReaderService,
  ) {
    this.baseUrl =
      this.configService.get<string>('PROXY_TARGET_URL') ||
      'http://api-proxy-openrouter:3005/api/v1';
  }

  async forwardRequest(
    path: string,
    method: string,
    data: any,
    headers: Record<string, string>,
  ) {
    const url = `${this.baseUrl}/${path.replace(/^\/+/, '')}`;

    const apiKey = this.keyReaderService.getToken() || headers['x-api-key'];

    const forwardHeaders: Record<string, string | undefined> = {
      'content-type': headers['content-type'] || 'application/json',
      'x-api-key': apiKey,
      host: undefined,
      origin: undefined,
      referer: undefined,
    };

    const config = {
      method,
      url,
      data: method !== 'GET' && data ? data : undefined,
      headers: forwardHeaders,
      timeout: 60000,
    };

    try {
      const response = await firstValueFrom(
        this.httpService.request(config).pipe(
          catchError((error: AxiosError) => {
            throw new HttpException(
              error.response?.data || error.message,
              error.response?.status || HttpStatus.BAD_GATEWAY,
            );
          }),
        ),
      );
      return response.data;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Proxy error', HttpStatus.BAD_GATEWAY);
    }
  }
}
