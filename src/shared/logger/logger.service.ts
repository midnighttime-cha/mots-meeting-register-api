import { LoggerService, Logger } from '@nestjs/common';
import { DatetimeService } from '../helpers/datetime.service';
const fs = require('fs');
const logDir = 'logs';

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

export class MyLogger implements LoggerService {
  private datetime = new DatetimeService;

  log(message: string, trace: string, request = null) {
    if (!fs.existsSync(`${logDir}/log`)) {
      fs.mkdirSync(`${logDir}/log`);
    }

    fs.appendFile(`${logDir}/log/${this.datetime.format("YYYY-MM-DD")}.log`, `[${this.datetime.format("DD/MM/YYYY H:i:s")}] [${trace}: ${message}]\n`, function (err) {
      if (err) throw err;
    });
  }
  /* response(message, trace, request) {
    if (!fs.existsSync(`${logDir}/response`)) {
      fs.mkdirSync(`${logDir}/response`);
    }
    console.log(message, trace, request);

    fs.appendFile(`${logDir}/response/${this.datetime.format("YYYY-MM-DD")}.log`, `[${this.datetime.format("DD/MM/YYYY H:i:s")}] [${request.ip}] [${request.method} ${request.path}] [${trace}: ${message}]\n`, function (err) {
      if (err) throw err;
    });
  } */
  error(error) {
    if (!fs.existsSync(`${logDir}/error`)) {
      fs.mkdirSync(`${logDir}/error`);
    }
    fs.appendFile(`${logDir}/error/${this.datetime.format("YYYY-MM-DD")}.log`, `[${this.datetime.format("DD/MM/YYYY H:i:s")}] [${error.method} - ${error.path} ${error.status}] [Message: ${error.message}]\n`, function (err) {
      if (err) throw err;
    });
  }
  warn(message: string, trace: string) {
    if (!fs.existsSync(`${logDir}/warn`)) {
      fs.mkdirSync(`${logDir}/warn`);
    }
    fs.appendFile(`${logDir}/warn/${this.datetime.format("YYYY-MM-DD")}.log`, `[${this.datetime.format("DD/MM/YYYY H:i:s")}] [${trace}] Message: ${message}\n`, function (err) {
      if (err) throw err;
    });
  }
  debug(message: string, trace: string) { }
  verbose(message: string, trace: string) { }
}