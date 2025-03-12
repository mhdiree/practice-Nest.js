import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDTO } from './dto/user.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Response } from 'express';
import { GetAuth } from './decorator/user.decorator';
import { User } from './entity/user.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  @ApiOperation({ summary: '회원가입' })
  @ApiResponse({ status: 201, description: '회원가입 성공' })
  @ApiResponse({ status: 400, description: '회원가입 실패' })
  async signUp(@Res() res: Response, @Body() userDTO: UserDTO) {
    const result = await this.authService.signUp(userDTO);
    return res.status(HttpStatus.CREATED).json(result);
  }

  @Post('/signin')
  @ApiOperation({ summary: '로그인' })
  @ApiResponse({ status: 200, description: '로그인 성공' })
  @ApiResponse({ status: 401, description: '로그인 실패' })
  async signIn(@Res() res: Response, @Body() userDTO: UserDTO) {
    const result = await this.authService.signIn(userDTO);
    return res.status(HttpStatus.OK).json(result);
  }

  @Get('/me')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOperation({ summary: '로그인된 사용자 정보 조회' })
  @ApiResponse({ status: 200, description: '로그인된 사용자 정보 반환' })
  @ApiResponse({ status: 401, description: '인증되지 않은 사용자' })
  async getProfile(@GetAuth() user:User, @Res() res: Response) {
    const result = await this.authService.getProfile(user);
    return res
      .status(result.success ? HttpStatus.OK : HttpStatus.NOT_FOUND)
      .json(result);
  }
}
