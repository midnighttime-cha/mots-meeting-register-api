import { Module, Global } from '@nestjs/common';
import { ResponseDataController } from './response-data.controller';
import { MyLogger } from '../logger/logger.service';

@Global()
@Module({
  imports: [MyLogger],
  exports: [ResponseDataController],
  providers: [ResponseDataController, MyLogger]
})
export class ResponseModule { }
