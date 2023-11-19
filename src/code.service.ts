import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Code, Prisma } from '@prisma/client';

@Injectable()
export class CodeService {
  constructor(private prisma: PrismaService) {}

  async code(
    codeWhereUniqueInput: Prisma.CodeWhereUniqueInput,
  ): Promise<Code | null> {
    return this.prisma.code.findUnique({
      where: codeWhereUniqueInput,
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
    return this.prisma.code.delete({
      where,
    });
  }
}
