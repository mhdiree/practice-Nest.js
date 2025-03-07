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
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";

@ApiTags("Auth") // Swagger에서 'Auth' 그룹으로 묶음
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
  @ApiOperation({ summary: "로그인된 사용자 정보 조회" })
  @ApiResponse({ status: 200, description: "로그인된 사용자 정보 반환" })
  @ApiResponse({ status: 401, description: "인증되지 않은 사용자" })
  getProfile(@Req() req, @Res() res) {
    if (!req.user) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: "인증되지 않은 사용자"
      });
    }

    return res.status(HttpStatus.OK).json({
      success: true,
      user: {
        id: req.user.id,
        username: req.user.username
      }
    });
  }
}
