import { Injectable } from '@nestjs/common';
import { Context, Options, SlashCommand, SlashCommandContext } from 'necord';
import { authenticator } from 'otplib';
import { KeyDto, NameDto } from './mfa.dto';
import { CodeService } from './code.service';

@Injectable()
export class AppCommands {
  public constructor(private readonly codeService: CodeService) {}

  @SlashCommand({
    name: 'ping',
    description: 'Ping-Pong Command',
  })
  public async onPing(@Context() [interaction]: SlashCommandContext) {
    return interaction.reply({ content: 'Pong!' });
  }

  @SlashCommand({
    name: '2fa-add',
    description: 'Add a 2FA Code',
    dmPermission: false,
  })
  public async on2faAdd(
    @Context() [interaction]: SlashCommandContext,
    @Options() { name, key }: KeyDto,
  ) {
    const guildId = interaction.guildId;

    if (!guildId) {
      return interaction.reply({
        content: 'This command can only be used in a guild.',
        ephemeral: true,
      });
    }

    // Ensure the code doesn't already exist
    if (await this.codeService.code({ guildId_name: { guildId, name } })) {
      return interaction.reply({
        content: `2FA Code ${name} already exists!`,
        ephemeral: true,
      });
    }

    this.codeService.createCode({
      name,
      key,
      Guild: {
        connectOrCreate: {
          where: { id: guildId },
          create: { id: guildId },
        },
      },
    });

    return interaction.reply({
      content: `2FA Code ${name} added successfully!`,
      ephemeral: true,
    });
  }

  @SlashCommand({
    name: '2fa-remove',
    description: 'Remove a 2FA Code',
    dmPermission: false,
  })
  public async on2faRemove(
    @Context() [interaction]: SlashCommandContext,
    @Options() { name }: NameDto,
  ) {
    const guildId = interaction.guildId;

    if (!guildId) {
      return interaction.reply({
        content: 'This command can only be used in a guild.',
        ephemeral: true,
      });
    }

    const code = await this.codeService.code({
      guildId_name: {
        guildId,
        name,
      },
    });

    if (!code) {
      return interaction.reply({
        content: `2FA Code ${name} not found!`,
        ephemeral: true,
      });
    }

    this.codeService.deleteCode({ guildId_name: { guildId, name } });

    return interaction.reply({
      content: `2FA Code ${name} removed successfully!`,
      ephemeral: true,
    });
  }

  @SlashCommand({
    name: '2fa-list',
    description: 'List 2FA Codes',
    dmPermission: false,
  })
  public async on2faList(@Context() [interaction]: SlashCommandContext) {
    const guildId = interaction.guildId;

    if (!guildId) {
      return interaction.reply({
        content: 'This command can only be used in a guild.',
        ephemeral: true,
      });
    }

    const codes = await this.codeService.codes({
      where: { Guild: { id: guildId } },
    });

    if (!codes.length) {
      return interaction.reply({
        content: 'No 2FA Codes found!',
        ephemeral: true,
      });
    }

    return interaction.reply({
      content: `2FA Codes: ${codes.map((code) => code.name).join(', ')}`,
      ephemeral: true,
    });
  }

  @SlashCommand({
    name: '2fa',
    description: 'Get a 2FA Code',
    dmPermission: false,
  })
  public async on2FA(
    @Context() [interaction]: SlashCommandContext,
    @Options() { name }: NameDto,
  ) {
    const guildId = interaction.guildId;

    if (!guildId) {
      return interaction.reply({
        content: 'This command can only be used in a guild.',
        ephemeral: true,
      });
    }

    const code = await this.codeService.code({
      guildId_name: {
        guildId,
        name,
      },
    });

    if (!code) {
      return interaction.reply({
        content: `2FA Code ${name} not found!`,
        ephemeral: true,
      });
    }

    return interaction.reply({
      content: `Your 2FA Code is: ${authenticator.generate(
        code.key,
      )}, it will expire <t:${
        Math.floor(Date.now() / 1000) + authenticator.timeRemaining()
      }:R>`,
      ephemeral: true,
    });
  }
}
