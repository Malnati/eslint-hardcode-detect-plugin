// sspa/mfe-chatbot/src/modules/proxy/config.controller.ts
import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { KeyReaderService } from './key-reader.service';

const INITIAL_GREETING = `Olá! Sou o assistente virtual do Chatbot. Como posso ajudar você hoje?

[1] Análise de solo
[2] Pragas e doenças
[3] Produção baixa / solo "cansado"
[4] Compactação do solo
[5] Outro assunto
[6] Falar com um Técnico

Digite o número ou escreva sua dúvida`;

const QUICK_OPTIONS = [
  { label: '1 - Análise de solo', value: '1' },
  { label: '2 - Pragas e doenças', value: '2' },
  { label: '3 - Solo cansado', value: '3' },
  { label: '4 - Compactação', value: '4' },
  { label: '5 - Outro assunto', value: '5' },
  { label: '6 - Falar com Técnico', value: '6' },
];

@Controller('api')
export class ConfigController {
  constructor(private readonly keyReaderService: KeyReaderService) {}

  @Get('config')
  getConfig(@Res() res: Response) {
    return res.status(200).json({
      greeting: INITIAL_GREETING,
      quickOptions: QUICK_OPTIONS,
      authenticated: this.keyReaderService.hasToken(),
    });
  }
}
