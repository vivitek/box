import { Controller, Get, Post, Param, Query, Sse, MessageEvent } from '@nestjs/common';
import { interval, Observable } from 'rxjs';
import { ServicesService } from './services.service';
import fs from 'fs';
import * as TailingReadableStream from 'tailing-stream';
import { fromReadStream } from "@nitedani/rxjs-stream";
import { map, delay, tap } from "rxjs/operators";

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
        out: fs.readFileSync('/root/.pm2/logs/graphql-out.log'),
        err: fs.readFileSync('/root/.pm2/logs/graphql-err.log'),
      },
      pcap: {
        out: fs.readFileSync('/root/.pm2/logs/pcap-out.log'),
        err: fs.readFileSync('/root/.pm2/logs/pcap-err.log'),
      },
      dhcp: {
        out: fs.readFileSync('/root/.pm2/logs/dhcp-out.log'),
        err: fs.readFileSync('/root/.pm2/logs/dhcp-err.log'),
      },
      openvvrt: {
        out: fs.readFileSync('/root/.pm2/logs/openvvrt-out.log'),
        err: fs.readFileSync('/root/.pm2/logs/openvvrt-err.log'),
      },
    }

  }

}
