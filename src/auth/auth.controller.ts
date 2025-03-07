import { Body, Controller, Post, ValidationPipe } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserDTO } from "./dto/user.dto";

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
}