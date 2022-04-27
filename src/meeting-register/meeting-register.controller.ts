import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Query, Req, Res } from '@nestjs/common';
import { ResponseDataController } from 'src/shared/response/response-data.controller';
import { MeetingRegisterService } from './meeting-register.service';

@Controller('meetingRegister')
export class MeetingRegisterController {
  constructor(
    private resdata: ResponseDataController,
    private mainServices: MeetingRegisterService
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

  @Get(':id/byIds')
  async findDataByIds(@Res() res, @Req() req, @Query() query, @Param('id') id: number) {
    try {
      const data = await this.mainServices.getOneMeetingMember(id);
      return this.resdata.responseFindOneSuccess(req, res, data.items, data.total);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }




  // Method POST
  @Post()
  async createRoom(@Res() res, @Req() req, @Body() body) {
    const dataset = await this.mainServices.create(body);
    return await this.resdata.responseCreateSuccess(req, res, dataset);
  }
}
