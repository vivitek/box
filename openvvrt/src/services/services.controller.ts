import { Controller, Get, Param, Post } from "@nestjs/common";
import { ServicesService } from "./services.service";

@Controller('/services')
export class ServicesController {
  constructor(private service: ServicesService) {}
  @Get('/')
  getAll() {
    return this.service.getAll()
  }

  @Post(['/reboot', '/reboot/:service'])
  restart(@Param("service") service: string = null) {
    return this.service.restart(service)
  }

  @Post(['/update', '/update/:service'])
  update(@Param("service") service: string = null) {
    return this.service.update(service)
  }

  @Post(['/build', '/build/:service'])
  build(@Param("service") service: string = null) {
    return this.service.build(service)
  }

  @Post(['/start', '/start/:service'])
  start(@Param("service") service: string = null) {
    return this.service.start(service)
  }

  @Post(['/stop', '/stop/:service'])
  stop(@Param("service") service: string = null) {
    return this.service.stop(service)
  }
}