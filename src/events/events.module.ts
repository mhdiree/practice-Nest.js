import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { UserRepository } from 'src/auth/repository/user.repository';

@Module({
  providers: [EventsGateway, UserRepository],

})
export class EventsModule {}
