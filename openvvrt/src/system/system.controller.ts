import { Controller, Get, HttpCode, Post } from '@nestjs/common';
import { SystemService } from './system.service';

@Controller('/system')
export class SystemController {
  constructor(private service: SystemService) {}

@Get('/')
  async getStats() {
    return {
      cpu: await this.getCpuStat(),
      ram: this.getRamStat(),
      storage: await this.getStorageStat(),
      uptime: this.uptime()
    }
  }

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
