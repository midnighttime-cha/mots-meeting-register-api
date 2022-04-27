import { Module, Global } from '@nestjs/common';
import { DatetimeService } from './datetime.service';
import { ConvertService } from './convert.service';
import { HelperService } from './helper.service';

@Global()
@Module({
  providers: [DatetimeService, ConvertService, HelperService],
  exports: [DatetimeService, ConvertService, HelperService]
})
export class HelpersModule { }
