import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  // onApplicationBootstrap() {
  //   console.log('부트스트랩 단계에 실행');
  // }

  // onModuleInit() {
  //   console.log(`모듈이 초기화될 때 실행`);
  // }

  getHello(): string {
    return 'Hello World!';
  }
}
