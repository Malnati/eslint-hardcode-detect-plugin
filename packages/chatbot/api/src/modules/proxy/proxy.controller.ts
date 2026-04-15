// sspa/mfe-chatbot/src/modules/proxy/proxy.controller.ts
import { Controller, Post, Get, Body, Headers, Req, Res } from '@nestjs/common';
import { ProxyService } from './proxy.service';
import { SYSTEM_PROMPT } from './agrovivo-system-prompt';
import { Request, Response } from 'express';

@Controller()
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  @Post('v1/chat/completions')
  async chatCompletion(
    @Body() body: any,
    @Headers() headers: Record<string, string>,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const messages = body.messages || [];
    const hasSystemPrompt = messages.some(
      (msg: { role: string; content: string }) =>
        msg.role === 'system' &&
        msg.content.trim().startsWith('Você é o assistente virtual da Chatbot'),
    );

    let finalMessages = [...messages];
    if (!hasSystemPrompt) {
      finalMessages = [{ role: 'system', content: SYSTEM_PROMPT }, ...messages];
    }

    const proxiedBody = { ...body, messages: finalMessages };

    try {
      const result = await this.proxyService.forwardRequest(
        'v1/chat/completions',
        'POST',
        proxiedBody,
        headers,
      );
      return res.status(200).json(result);
    } catch (error) {
      throw error;
    }
  }

  @Get('build-number.json')
  getBuildNumber(): Record<string, unknown> {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('../../../build-number.json');
  }

  @Get('v1/models')
  async listModels(
    @Headers() headers: Record<string, string>,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const result = await this.proxyService.forwardRequest(
        'v1/models',
        'GET',
        null,
        headers,
      );
      return res.status(200).json(result);
    } catch (error) {
      throw error;
    }
  }

  @Get('health')
  async healthCheck(@Res() res: Response) {
    return res.status(200).json({
      status: 'ok',
      service: 'mfe-chatbot',
      timestamp: new Date().toISOString(),
    });
  }
}
