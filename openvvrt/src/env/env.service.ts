import { Injectable } from '@nestjs/common';
import { EnvCreation } from './env.input';

@Injectable()
export class EnvService {
  public getAll() {
    return process.env;
  }

  public get(name: string) {
    return process.env[name];
  }

  public create(content: EnvCreation) {}
  public update(content: EnvCreation) {}
  public delete(name: string) {}
}
