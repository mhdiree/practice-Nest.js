import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { transferDto } from './dto/transfer.dto';
import { depositDto } from './dto/deposit.dto';
import { Response } from 'express';

@ApiTags('Account')
@ApiBearerAuth()
@Controller('account')
@UseGuards(AuthGuard()) // 로그인한 사용자만
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get('/balance')
  @ApiOperation({ summary: '잔액 조회' })
  @ApiResponse({ status: 200, description: '잔액 반환' })
  @ApiResponse({ status: 401, description: '인증되지 않은 사용자' })
  async getBalance(@Req() req: Request, @Res() res: Response) {
    const result = await this.accountService.getBalance(req.user);
    return res.status(HttpStatus.OK).json(result);
  }

  @Post('/deposit')
  @ApiOperation({ summary: '입금' })
  @ApiResponse({ status: 200, description: '입금 성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  @ApiResponse({ status: 401, description: '인증되지 않은 사용자' })
  async deposit(
    @Req() req: Request,
    @Body() depositDTO: depositDto,
    @Res() res: Response,
  ) {
    const result = await this.accountService.deposit(req.user, depositDTO);
    return res.status(HttpStatus.OK).json(result);
  }

  @Post('/transfer')
  @ApiOperation({ summary: '송금' })
  @ApiResponse({ status: 200, description: '송금 성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  @ApiResponse({ status: 401, description: '인증되지 않은 사용자' })
  async transfer(
    @Req() req: Request,
    @Body() transferDTO: transferDto,
    @Res() res: Response,
  ) {
    const result = await this.accountService.transfer(req.user, transferDTO);
    return res.status(HttpStatus.OK).json(result);
  }
}
