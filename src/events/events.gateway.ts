import { UseGuards, UnauthorizedException } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import { socketGuard } from 'src/auth/guard/socket-token.guard';
import { AuthService } from 'src/auth/auth.service';

@WebSocketGateway({
  namespace: '/socket',
  cors: {
    origin: 'http://127.0.0.1:5500', // 클라이언트 주소
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private usersInRooms: { [key: string]: string[] } = {};

  constructor(private readonly authService: AuthService) {}

  // 클라이언트와 연결 후 실행 됨.
  async handleConnection(client: Socket) {
    console.log('🔌 New WebSocket connection established');

    // 클라이언트가 인증을 시도할 때
    client.on('authenticate', async ({ token }) => {
      try {
        const decoded = jwt.verify(token, 'SECRET') as jwt.JwtPayload;
        if (!decoded) {
          throw new UnauthorizedException('유효한 사용자 정보가 없습니다.');
        }

        // 사용자 정보 확인 후 룸에 참여
        const user = await this.authService.validateUser(decoded.username);
        const roomName = `user-${user.username}`;

        // 클라이언트 데이터에 인증된 사용자 정보 저장
        client.data.user = decoded;

        // 해당 룸에 클라이언트 연결
        client.join(roomName);

        // 룸에 클라이언트 ID 추가
        if (!this.usersInRooms[roomName]) {
          this.usersInRooms[roomName] = [];
        }
        this.usersInRooms[roomName].push(client.id);

        console.log(`✅ ${user.username} authenticated and joined ${roomName}`);
        client.emit('authenticated', roomName); // 클라이언트에게 authenticated 이벤트
      } catch (error) {
        console.error('Authentication failed:', error);
        client.emit('authentication_failed', 'Invalid token');
      }
    });
  }

  // WebSocket 연결 종료 시
  async handleDisconnect(client: Socket) {
    const decoded = client.data.user;
    if (decoded) {
      const roomName = `user-${decoded.username}`;
      this.usersInRooms[roomName] = this.usersInRooms[roomName].filter(
        (id) => id !== client.id,
      );

      console.log(`❌ ${decoded.username} disconnected from ${roomName}`);
    }
  }

  // 메시지 처리
  @UseGuards(socketGuard)
  @SubscribeMessage('message')
  handleMessage(client: Socket, { message }: { message: string }) {
    const decoded = client.data.user;
    const roomName = `user-${decoded.username}`;

    console.log(`📩 Received message: ${message} from ${decoded.username}`);

    // 해당 룸으로 메시지 전송
    this.server
      .to(roomName)
      .emit('message', { user: decoded.username, message: 'hello' });
  }
}
