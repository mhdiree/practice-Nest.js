import { Body, Controller, Post, Req, UseGuards, ValidationPipe } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserDTO } from "./dto/user.dto";
import { AuthGuard } from "@nestjs/passport";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("/signup")
  signUp(@Body(ValidationPipe) userDTO: UserDTO): Promise<void> {
    return this.authService.signUp(userDTO);
  }

  @Post("/signin")
  signIn(@Body(ValidationPipe) userDTO: UserDTO){
	return this.authService.signIn(userDTO)
  }

  @Post("/test")
  @UseGuards(AuthGuard())
  test(@Req() req){
    const reqData = {
      user: req.user
    };
    // 필요한 정보만 JSON으로 변환
    return JSON.stringify(reqData, null, 4);
  }
}