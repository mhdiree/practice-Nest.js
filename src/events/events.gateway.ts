import { UnauthorizedException } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/auth/repository/user.repository';
import { EntityNotFoundError } from 'typeorm';

@WebSocketGateway()
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  private usersInRooms: { [key:string]: string[]} = {};

  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository
  ) {}

   // WebSocket 연결 시 유저 인증하고 room에 추가
  async handleConnection(client: Socket) { 
    // 헤더로 토큰 받아오기
    const token = client.handshake.headers['authorization']?.split(' ')[1];
    //console.log("토큰: ", token);

    if (!token) {
      throw new UnauthorizedException('토큰 없음');
    }
    try{
      const decoded = jwt.verify(token, 'SECRET') as jwt.JwtPayload;;
      const user = await this.userRepository.findOneOrFail({ where: { username: decoded.username }})
      const roomName = `user-${user.username}`; // room 생성

      client.join(roomName); // room에 join


      if(!this.usersInRooms[roomName]){
        this.usersInRooms[roomName] = [];
      }
      this.usersInRooms[roomName].push(client.id);
      console.log(`${user.username} connected to ${roomName}`);
      
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new UnauthorizedException('사용자가 없음');
      } else {
        throw new UnauthorizedException('토큰이 유효하지 않음.');
      }
    }
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, message: string ) {
    console.log(`Received message: ${message} from ${client.id}`);

    // 클라이언트가 속한 룸을 찾기
    const token = client.handshake.headers['authorization']?.split(' ')[1];
    if (!token) {
      console.log('토큰 없음');
      return;
    }

    try {
      const decoded = jwt.verify(token, 'SECRET') as jwt.JwtPayload;
      const roomName = `user-${decoded.username}`;
      console.log(this.usersInRooms[roomName]);
      // 답장
      const replyMessage = `Hello, ${decoded.username}!`;
      this.server.to(roomName).emit('message', replyMessage);
    }catch (error) {
      console.log('토큰이 유효하지 않음.');
    }
  }
}
