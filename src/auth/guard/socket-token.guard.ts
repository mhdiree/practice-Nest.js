import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class socketGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const client = context.switchToWs().getClient();
    const user = client.data.user;

    if (!user) {
      throw new UnauthorizedException('사용자 인증이 필요합니다.');
    }

    console.log('가드 통과, 인증된 사용자:', user.username);
    return true;
  }
}
