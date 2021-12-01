import { Controller, Get, Post, Param, Query, Sse, MessageEvent } from '@nestjs/common';
import { ServicesService } from './services.service';
import * as fs from 'fs';

@Controller('/services')
export class ServicesController {
  constructor(private service: ServicesService) { }
  @Get('/')
  getAll() {
    return this.service.getAll();
  }

  @Post(['/reboot', '/reboot/:service'])
  restart(@Param('service') service: string = null) {
    return this.service.restart(service);
  }

  @Post(['/update', '/update/:service'])
  update(@Param('service') service: string = null) {
    return this.service.update(service);
  }

  @Post(['/build', '/build/:service'])
  build(@Param('service') service: string = null) {
    return this.service.build(service);
  }

  @Post(['/start', '/start/:service'])
  start(@Param('service') service: string = null) {
    return this.service.start(service);
  }

  @Post(['/stop', '/stop/:service'])
  stop(@Param('service') service: string = null) {
    return this.service.stop(service);
  }

  @Get('/logs')
  logs() {
    return {
      graphql: {
        out: fs.readFileSync('/root/.pm2/logs/graphql-out.log', {encoding: "utf8"}).split('\n'),
        err: fs.readFileSync('/root/.pm2/logs/graphql-error.log', {encoding: "utf8"}).split('\n'),
      },
      pcap: {
        out: fs.readFileSync('/root/.pm2/logs/pcap-out.log', {encoding: "utf8"}).split('\n'),
        err: fs.readFileSync('/root/.pm2/logs/pcap-error.log', {encoding: "utf8"}).split('\n'),
      },
      dhcp: {
        out: fs.readFileSync('/root/.pm2/logs/dhcp-out.log', {encoding: "utf8"}).split('\n'),
        err: fs.readFileSync('/root/.pm2/logs/dhcp-error.log', {encoding: "utf8"}).split('\n'),
      },
      openvvrt: {
        out: fs.readFileSync('/root/.pm2/logs/openvvrt-out.log', {encoding: "utf8"}).split('\n'),
        err: fs.readFileSync('/root/.pm2/logs/openvvrt-error.log', {encoding: "utf8"}).split('\n'),
      },
    }

  }

}
