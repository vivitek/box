import { Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { SystemService } from './system.service';

@Controller('/system')
export class SystemController {
  constructor(private service: SystemService) {}

  @Get('/cpu')
  getCpuStat() {
    return this.service.cpu();
  }

  @Get('/ram')
  getRamStat() {
    return this.service.ram();
  }

  @Get('/storage')
  getStorageStat() {
    return this.service.storage();
  }

  @Get('/uptime')
  uptime() {
    return this.service.getUptime();
  }

  @Get('/logs')
  logs(
    @Query('service') service: string,
    @Query('lines') lines: string = "32"
  ) {
    return this.service.logs(service, lines)
  }

  @HttpCode(204)
  @Post('/reboot')
  reboot() {
    this.service.reboot();
  }

  @HttpCode(204)
  @Post('/poweroff')
  poweroff() {
    this.service.poweroff();
  }
}
