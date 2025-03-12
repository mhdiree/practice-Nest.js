/* eslint-disable */
import { 
  Body, 
  Controller, 
  Get, 
  HttpStatus, 
  Post, 
  Req, 
  Res, 
  UseGuards 
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserDTO } from "./dto/user.dto";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("/signup")
  @ApiOperation({ summary: "회원가입" })
  @ApiResponse({ status: 201, description: "회원가입 성공" })
  @ApiResponse({ status: 400, description: "회원가입 실패" })
  async signUp(@Res() res, @Body() userDTO: UserDTO) {
    try {
      await this.authService.signUp(userDTO);
      return res.status(HttpStatus.CREATED).json({
        success: true,
        message: "회원가입 성공"
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: "회원가입 실패",
        error: error.message
      });
    }
  }

  @Post("/signin")
  @ApiOperation({ summary: "로그인" })
  @ApiResponse({ status: 200, description: "로그인 성공" })
  @ApiResponse({ status: 401, description: "로그인 실패" })
  async signIn(@Res() res, @Body() userDTO: UserDTO) {
    try {
      const token = await this.authService.signIn(userDTO);
      return res.status(HttpStatus.OK).json({
        success: true,
        message: "로그인 성공",
        accessToken: token
      });
    } catch (error) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: "로그인 실패",
        error: error.message
      });
    }
  }

  @Get("/me")
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOperation({ summary: "로그인된 사용자 정보 조회" })
  @ApiResponse({ status: 200, description: "로그인된 사용자 정보 반환" })
  @ApiResponse({ status: 401, description: "인증되지 않은 사용자" })
  async getProfile(@Req() req, @Res() res) {
    if (!req.user) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: "인증되지 않은 사용자",
      });
    }
  
    try {
      //user 정보와 account 정보 가져오기
      const userWithAccount = await this.authService.findOneByIdWithAccount(req.user.id);
  
      if (!userWithAccount) {
        return res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: "사용자를 찾을 수 없습니다.",
        });
      }
  
      return res.status(HttpStatus.OK).json({
        success: true,
        user: {
          id: userWithAccount.id,
          username: userWithAccount.username,
          accountId: userWithAccount.account?.accountId, // accountId 추가
        },
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "사용자 정보를 조회하는데 실패했습니다.",
        error: error.message,
      });
    }
  }
}
