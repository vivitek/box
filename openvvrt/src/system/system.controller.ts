import { Controller, Get } from '@nestjs/common';
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

  @Get('/reboot')
  reboot() {
    this.service.reboot();
  }

  @Get('/poweroff')
  poweroff() {
    this.service.poweroff();
  }
}
