import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Param } from '@nestjs/common';


@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) { }


  async create(createUserDto: CreateUserDto) {
    try {
      const user = await this.prisma.user.create({ data: createUserDto });
      return user
    } catch (error) {
      if (error.code === 'P2002') {
        const fields = error.meta.target.join(', ');
        throw new ConflictException(`Duplicate user data: [${fields}]`)
      }
      throw new InternalServerErrorException('Internal Server Error')
    }

  }

  async findAll() {
    return await this.prisma.user.findMany();
  }

  async findOne(@Param('id') id: number) {
    const user = await this.prisma.user.findUnique({ where: { id: id } });
    if (!user) {
      throw new NotFoundException(`User with id (${id}) not found!`)
    }
    return user
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.prisma.user.update({ where: { id: id }, data: updateUserDto });
      return user;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`User with id (${id}) not found!`)
      }
      throw new InternalServerErrorException('Internal Server Error')
    }
  }

  async remove(id: number) {
    try {
      const deleted = await this.prisma.user.delete({ where: { id: id } });
      return deleted;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`User with id (${id}) not found!`)
      }
      throw new InternalServerErrorException('Internal Server Error')
    }
  }
}
