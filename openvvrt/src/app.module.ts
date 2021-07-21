import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvModule } from './env/env.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { ServicesModule } from './services/services.module';
import { SystemModule } from './system/system.module';

@Module({
  imports: [
    EnvModule,
    SystemModule,
    ServicesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*')
  }
}
