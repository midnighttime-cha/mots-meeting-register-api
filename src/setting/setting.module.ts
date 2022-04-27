import { Module } from '@nestjs/common';
import { SystemParamController } from './system-param/system-param.controller';
import { SystemParamService } from './system-param/system-param.service';

@Module({
  imports: [],
  controllers: [SystemParamController],
  providers: [SystemParamService]
})
export class SettingModule { }
