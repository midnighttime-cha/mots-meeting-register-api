import { Controller, Get, HttpException, HttpStatus, Param, Query, Req, Res } from '@nestjs/common';
import { ResponseDataController } from 'src/shared/response/response-data.controller';
import { SystemParamService } from './system-param.service';

@Controller('systemParam')
export class SystemParamController {
  constructor(
    private resdata: ResponseDataController,
    private mainServices: SystemParamService
  ) { }


  // Method: GET
  @Get()
  async findData(@Res() res, @Req() req, @Query() query) {
    try {
      const data = await this.mainServices.getManyMeetingMember(query);
      return this.resdata.responseFindSuccess(req, res, data.items, data.total);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':name/byName')
  async findDataByIds(@Res() res, @Req() req, @Query() query, @Param('name') name: string) {
    try {
      const data = await this.mainServices.getOneMeetingMember(name);
      return this.resdata.responseFindOneSuccess(req, res, data.items, data.total);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
