import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from './config/config.module';
import { TournamentsModule } from './tournaments/tournaments.module';

@Module({
  imports: [ConfigModule, UserModule, TournamentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
