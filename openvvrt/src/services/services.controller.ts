import { Controller, Get, Post, Param, Query, Sse } from '@nestjs/common';
import { interval, Observable } from 'rxjs';
import { ServicesService } from './services.service';
import fs from "fs"

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
  logs(@Query('service') service: string, @Query('lines') lines = '32') {
    return this.service.logs(service, lines);
  }

  @Sse('/sse')
  sse(@Query('service') service: string): Observable<MessageEvent> {
    const path = `/root/.pm2/logs/${service}-out.log`

    return interval(5000).pipe(() => null);

  }
}

// {
  // graphql: {
    // out: "",
    // err: ""
  // }
  // pcap: {
    // out: "",
    // err: ""
  // }
  // dhcp: {
    // out: "",
    // err: ""
  // }
  // openvvrt: {
    // out: "",
    // err: ""
  // }
// }
