import { NecordModule } from 'necord';
import { Module } from '@nestjs/common';
import { IntentsBitField } from 'discord.js';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppCommands } from './app.commands';
import { AppUpdate } from './app.update';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    NecordModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        token: configService.getOrThrow('TOKEN'),
        intents: [IntentsBitField.Flags.Guilds],
        development: [configService.getOrThrow('DEV_GUILD')],
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService, AppCommands, AppUpdate],
})
export class AppModule {}
