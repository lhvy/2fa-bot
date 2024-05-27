import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Code, Prisma } from '@prisma/client';

@Injectable()
export class CodeService {
  constructor(private prisma: PrismaService) {}

  async code(codeWhereUniqueInput: Prisma.CodeWhereUniqueInput) {
    return this.prisma.code.findUnique({
      where: codeWhereUniqueInput,
      include: {
        roles: true,
      },
    });
  }

  async codes(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.CodeWhereUniqueInput;
    where?: Prisma.CodeWhereInput;
    orderBy?: Prisma.CodeOrderByWithRelationInput;
  }): Promise<Code[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.code.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createCode(data: Prisma.CodeCreateInput): Promise<Code> {
    return this.prisma.code.create({
      data,
    });
  }

  async updateCode(params: {
    where: Prisma.CodeWhereUniqueInput;
    data: Prisma.CodeUpdateInput;
  }): Promise<Code> {
    const { where, data } = params;
    return this.prisma.code.update({
      data,
      where,
    });
  }

  async deleteCode(where: Prisma.CodeWhereUniqueInput): Promise<Code> {
    await this.prisma.code.update({
      where,
      data: {
        roles: {
          deleteMany: {},
        },
      },
      include: {
        roles: true,
      },
    });

    return this.prisma.code.delete({
      where,
    });
  }

  async addRoleToCode(params: {
    where: Prisma.CodeWhereUniqueInput;
    roleId: string;
  }): Promise<Code> {
    const { where, roleId } = params;
    return this.prisma.code.update({
      where,
      data: {
        roles: {
          connectOrCreate: {
            where: {
              codeGuildId_codeName_roleId: {
                codeGuildId: where.guildId_name?.guildId as string,
                codeName: where.guildId_name?.name as string,
                roleId,
              },
            },
            create: {
              roleId,
            },
          },
        },
      },
    });
  }

  async removeRoleFromCode(params: {
    where: Prisma.CodeWhereUniqueInput;
    roleId: string;
  }): Promise<Code> {
    const { where, roleId } = params;
    return this.prisma.code.update({
      where,
      data: {
        roles: {
          delete: {
            codeGuildId_codeName_roleId: {
              codeGuildId: where.guildId_name?.guildId as string,
              codeName: where.guildId_name?.name as string,
              roleId,
            },
          },
        },
      },
    });
  }

  async transferCodeOwnership(params: {
    where: Prisma.CodeWhereUniqueInput;
    ownerId: string;
  }): Promise<Code> {
    const { where, ownerId } = params;
    return this.prisma.code.update({
      where,
      data: {
        owner: ownerId,
      },
    });
  }

  async deleteRole(params: { roleId: string }) {
    const { roleId } = params;
    return this.prisma.permission.deleteMany({
      where: {
        roleId,
      },
    });
  }
}
