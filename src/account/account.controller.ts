/* eslint-disable */
import { Controller, Get, Post, Body, UseGuards, Req, HttpStatus, Res } from '@nestjs/common';
import { AccountService } from './account.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { transferDto } from './dto/transfer.dto';
import { depositDto } from './dto/deposit.dto';

@ApiTags('Account')
@Controller('account')
@UseGuards(AuthGuard()) // 로그인한 사용자만
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get('/balance')
  @ApiOperation({ summary: '잔액 조회' })
  @ApiResponse({ status: 200, description: '잔액 반환' })
  @ApiResponse({ status: 401, description: '인증되지 않은 사용자' })
  async getBalance(@Req() req) {
    try {
      const balance = await this.accountService.getBalance(req.user);
      return {
        success: true,
        message: '잔액 조회 성공',
        balance,
      };
    } catch (error) {
      return {
        success: false,
        message: '잔액 조회에 실패했습니다.',
        error: error.message,
      };
    }
  }

  @Post('/deposit')
  @ApiOperation({ summary: '입금' })
  @ApiResponse({ status: 200, description: '입금 성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  @ApiResponse({ status: 401, description: '인증되지 않은 사용자' })
  async deposit(@Req() req, @Body() depositDTO: depositDto, @Res() res) {
    try {
      await this.accountService.deposit(req.user, depositDTO);
      const balance = await this.accountService.getBalance(req.user);
  
      return res.status(HttpStatus.OK).json({
        success: true,
        message: '입금 성공',
        balance: balance,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: '입금 실패',
        error: error.message,
      });
    }
  }

  @Post('/transfer')
  @ApiOperation({ summary: '송금' })
  @ApiResponse({ status: 200, description: '송금 성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  @ApiResponse({ status: 401, description: '인증되지 않은 사용자' })
  async transfer(@Req() req, @Body() transferDTO: transferDto, @Res() res) {
    try {
      const result = await this.accountService.transfer(req.user, transferDTO);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: "송금 성공",
        balance: result.balance,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "송금 실패",
        error: error.message,
      });
    }
  }
}
