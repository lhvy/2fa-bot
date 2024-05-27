import { Injectable, Logger } from '@nestjs/common';
import { Context, On, Once, ContextOf } from 'necord';
import { Client } from 'discord.js';
import { GuildService } from './guild.service';
import { CodeService } from './code.service';

@Injectable()
export class AppUpdate {
  private readonly logger = new Logger(AppUpdate.name);

  public constructor(
    private readonly client: Client,
    private readonly guildService: GuildService,
    private readonly codeService: CodeService,
  ) {}

  @Once('ready')
  public async onReady(@Context() [client]: ContextOf<'ready'>) {
    this.logger.log(`Bot logged in as ${client.user.username}`);
  }

  @On('warn')
  public onWarn(@Context() [message]: ContextOf<'warn'>) {
    this.logger.warn(message);
  }

  @On('guildCreate')
  public onGuildCreate(@Context() [guild]: ContextOf<'guildCreate'>) {
    this.logger.log(`Joined guild ${guild.name}`);
    this.guildService.createGuild({ id: guild.id });
  }

  @On('guildDelete')
  public onGuildDelete(@Context() [guild]: ContextOf<'guildDelete'>) {
    this.logger.log(`Left guild ${guild.name}`);
    this.guildService.deleteGuild({ id: guild.id });
  }

  @On('roleDelete')
  public onRoleDelete(@Context() [role]: ContextOf<'roleDelete'>) {
    this.codeService.deleteRole({ roleId: role.id });
  }
}
