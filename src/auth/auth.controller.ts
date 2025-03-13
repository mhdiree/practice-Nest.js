import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
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
import { GetAuth } from './decorator/user.decorator';
import { User } from './entity/user.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  @ApiOperation({ summary: '회원가입' })
  @ApiResponse({
    status: 201,
    description: '회원가입 성공',
    schema: {
      example: {
        success: true,
        message: '회원가입 성공',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: '회원가입 실패',
    schema: {
      example: {
        statusCode: 400,
        message: '유효성 검사 실패',
        error: 'Bad Request',
      },
    },
  })
  async signUp(@Body() userDTO: UserDTO) {
    return await this.authService.signUp(userDTO);
  }

  @Post('/signin')
  @ApiOperation({ summary: '로그인' })
  @ApiResponse({
    status: 201,
    description: '로그인 성공',
    schema: {
      example: {
        success: true,
        message: '로그인 성공',
        accessToken: 'jwt_token_here',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '로그인 실패',
    schema: {
      example: {
        statusCode: 401,
        message: '존재하지 않는 사용자입니다.',
        error: 'Unauthorized',
      },
    },
  })
  async signIn(@Body() userDTO: UserDTO) {
    return await this.authService.signIn(userDTO);
  }

  @Get('/me')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOperation({ summary: '로그인된 사용자 정보 조회' })
  @ApiResponse({
    status: 200,
    description: '로그인된 사용자 정보 반환',
    schema: {
      example: {
        success: true,
        message: '사용자 정보 조회 성공',
        user: {
          id: 1,
          username: 'test',
          accountId: '12345678',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '인증되지 않은 사용자',
    schema: {
      example: {
        statusCode: 401,
        message: '인증되지 않은 사용자',
        error: 'Unauthorized',
      },
    },
  })
  async getProfile(@GetAuth() user: User) {
    return await this.authService.getProfile(user);
  }
}
