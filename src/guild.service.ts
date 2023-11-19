import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Guild, Prisma } from '@prisma/client';

@Injectable()
export class GuildService {
  constructor(private prisma: PrismaService) {}

  async guild(
    guildWhereUniqueInput: Prisma.GuildWhereUniqueInput,
  ): Promise<Guild | null> {
    return this.prisma.guild.findUnique({
      where: guildWhereUniqueInput,
    });
  }

  async guilds(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.GuildWhereUniqueInput;
    where?: Prisma.GuildWhereInput;
    orderBy?: Prisma.GuildOrderByWithRelationInput;
  }): Promise<Guild[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.guild.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createGuild(data: Prisma.GuildCreateInput): Promise<Guild> {
    return this.prisma.guild.create({
      data,
    });
  }

  async updateGuild(params: {
    where: Prisma.GuildWhereUniqueInput;
    data: Prisma.GuildUpdateInput;
  }): Promise<Guild> {
    const { where, data } = params;
    return this.prisma.guild.update({
      data,
      where,
    });
  }

  async deleteGuild(where: Prisma.GuildWhereUniqueInput): Promise<Guild> {
    return this.prisma.guild.delete({
      where,
    });
  }
}
