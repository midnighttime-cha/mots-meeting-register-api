import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemParams } from './entities/system-param.entity';
import { SystemParamController } from './system-param/system-param.controller';
import { SystemParamService } from './system-param/system-param.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SystemParams
    ])
  ],
  controllers: [SystemParamController],
  providers: [SystemParamService]
})
export class SettingModule { }
