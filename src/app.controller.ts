import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  redirectToStatic(@Res() res: Response) {
    res.redirect('/index.html');  // 정적 파일이 있는 경로로 리디렉션
  }
}
