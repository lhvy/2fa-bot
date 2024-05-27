import { Injectable } from '@nestjs/common';
import { Context, Options, SlashCommand, SlashCommandContext } from 'necord';
import { authenticator } from 'otplib';
import { KeyDto, NameDto, RoleDto, UserDto } from './mfa.dto';
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
      owner: interaction.user.id,
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

    if (!guildId || !interaction.guild) {
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

    const userId = interaction.user.id;
    const member = await interaction.guild.members.fetch(userId);
    const roleIds = member.roles.cache.map((role) => role.id);
    if (
      code.owner !== userId &&
      !code.roles.some((role) => role.roleId in roleIds)
    ) {
      return interaction.reply({
        content: 'You do not have permission to access this code!',
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

  @SlashCommand({
    name: '2fa-role-add',
    description: 'Add a role to a 2FA Code',
    dmPermission: false,
  })
  public async on2faRoleAdd(
    @Context() [interaction]: SlashCommandContext,
    @Options() { name, role }: RoleDto,
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

    if (code.owner !== interaction.user.id) {
      return interaction.reply({
        content: 'You do not have permission to add roles to this code!',
        ephemeral: true,
      });
    }

    if (code.roles.some((r) => r.roleId === role.id)) {
      return interaction.reply({
        content: `Role ${role.name} already added to 2FA Code ${name}!`,
        ephemeral: true,
      });
    }

    this.codeService.addRoleToCode({
      where: {
        guildId_name: {
          guildId,
          name,
        },
      },
      roleId: role.id,
    });

    return interaction.reply({
      content: `Role ${role.name} added to 2FA Code ${name} successfully!`,
      ephemeral: true,
    });
  }

  @SlashCommand({
    name: '2fa-role-remove',
    description: 'Remove a role from a 2FA Code',
    dmPermission: false,
  })
  public async on2faRoleRemove(
    @Context() [interaction]: SlashCommandContext,
    @Options() { name, role }: RoleDto,
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

    if (code.owner !== interaction.user.id) {
      return interaction.reply({
        content: 'You do not have permission to remove roles from this code!',
        ephemeral: true,
      });
    }

    if (!code.roles.some((r) => r.roleId === role.id)) {
      return interaction.reply({
        content: `Role ${role.name} not added to 2FA Code ${name}!`,
        ephemeral: true,
      });
    }

    this.codeService.removeRoleFromCode({
      where: {
        guildId_name: {
          guildId,
          name,
        },
      },
      roleId: role.id,
    });

    return interaction.reply({
      content: `Role ${role.name} removed from 2FA Code ${name} successfully!`,
      ephemeral: true,
    });
  }

  @SlashCommand({
    name: '2fa-list-access',
    description: 'List roles for a 2FA Code',
    dmPermission: false,
  })
  public async on2faRoleList(
    @Context() [interaction]: SlashCommandContext,
    @Options() { name }: NameDto,
  ) {
    const guildId = interaction.guildId;

    if (!guildId || !interaction.guild) {
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

    // Display the owner of the code and the roles that have access to it
    const owner = await interaction.guild.members.fetch(code.owner);
    const roles = await interaction.guild.roles.fetch();
    const roleNames = code.roles
      .map((role) => roles.get(role.roleId)?.name)
      .filter((name): name is string => !!name);

    return interaction.reply({
      content: `Owner: ${owner}, Roles: ${roleNames.join(', ')}`,
      ephemeral: true,
    });
  }

  @SlashCommand({
    name: '2fa-transfer',
    description: 'Transfer ownership of a 2FA Code',
    dmPermission: false,
  })
  public async on2faTransfer(
    @Context() [interaction]: SlashCommandContext,
    @Options() { name, user }: UserDto,
  ) {
    const guildId = interaction.guildId;

    if (!guildId || !interaction.guild) {
      return interaction.reply({
        content: 'This command can only be used in a guild.',
        ephemeral: true,
      });
    }

    if (user.bot || user.system) {
      return interaction.reply({
        content: 'You cannot transfer ownership to a bot!',
        ephemeral: true,
      });
    }

    if (!interaction.guild.members.cache.has(user.id)) {
      return interaction.reply({
        content: 'User is not in the guild!',
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

    if (code.owner !== interaction.user.id) {
      return interaction.reply({
        content:
          'You do not have permission to transfer ownership of this code!',
        ephemeral: true,
      });
    }

    this.codeService.updateCode({
      where: {
        guildId_name: {
          guildId,
          name,
        },
      },
      data: {
        owner: user.id,
      },
    });

    return interaction.reply({
      content: `Ownership of 2FA Code ${name} transferred to ${user.username}#${user.discriminator} successfully!`,
      ephemeral: true,
    });
  }
}
