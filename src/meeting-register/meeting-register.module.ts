import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingMembers } from './entities/meeting-member.entity';
import { MeetingRegisterController } from './meeting-register.controller';
import { MeetingRegisterService } from './meeting-register.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MeetingMembers
    ])
  ],
  controllers: [MeetingRegisterController],
  providers: [MeetingRegisterService]
})
export class MeetingRegisterModule { }
