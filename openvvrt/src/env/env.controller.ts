import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { EnvCreation } from './env.input';
import { EnvService } from './env.service';

@Controller('/env')
export class EnvController {
  constructor(private service: EnvService) {}
  @Get('/')
  getEnvVars() {
    return this.service.getAll();
  }

  @Get('/:name')
  getEnvVar(@Param('name') name: string) {
    return this.service.get(name);
  }

  @Post('/')
  createEnvVar(@Body() content: EnvCreation) {
    return this.service.create(content);
  }

  @Patch('/')
  updateEnvVar(@Body() content: EnvCreation) {
    return this.service.update(content);
  }

  @Delete('/:name')
  removeEnvVar(@Param('name') name: string) {
    return this.service.delete(name);
  }
}
