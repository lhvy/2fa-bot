import { Injectable } from '@nestjs/common';
import { Context, SlashCommand, SlashCommandContext } from 'necord';
import { authenticator } from 'otplib';

@Injectable()
export class AppCommands {
  @SlashCommand({
    name: 'ping',
    description: 'Ping-Pong Command',
  })
  public async onPing(@Context() [interaction]: SlashCommandContext) {
    return interaction.reply({ content: 'Pong!' });
  }

  @SlashCommand({
    name: '2fa',
    description: 'Get a 2FA Code',
  })
  public async on2FA(@Context() [interaction]: SlashCommandContext) {
    return interaction.reply({
      content: `Your 2FA Code is: ${authenticator.generate(
        '2FASTEST',
      )}, it will expire <t:${
        Math.floor(Date.now() / 1000) + authenticator.timeRemaining()
      }:R>`,
      ephemeral: true,
    });
  }
}
