import { Controller, Get, Redirect, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { join } from 'path';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Redirect('/home')
  redirect() {}

  @Get('home')
  gethome(@Res() res: Response) {
    return res.sendFile(join(__dirname, '..', 'public', 'home.html'));
  }
}
