import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ResponceUserDto } from './dto/response-user.dto';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: 'Создать пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Созданный пользователь',
    type: ResponceUserDto
  })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить всех пользователей' })
  @ApiResponse({
    status: 200,
    description: 'Список пользователей',
    type: [ResponceUserDto]
  })
  findAll() {
    return this.userService.findAll();
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Get(':id')
  @ApiOperation({ summary: 'Получить пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Пользователь',
    type: ResponceUserDto
  })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @ApiOperation({ summary: 'Редактирование  пользователя - обработка если не указан ИД' })
  @Patch()
  updateWithoutId() {
    throw new BadRequestException('ID param is required')
  }

  @ApiOperation({ summary: 'Редактирование  пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Пользователь',
    type: ResponceUserDto
  })
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @ApiOperation({ summary: 'Удаление пользователя - обработка если не указан ИД' })
  @Delete()
  removeWithoutId() {
    throw new BadRequestException('ID param is required')
  }

  @ApiOperation({ summary: 'Удаление пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Пользователь',
    type: ResponceUserDto
  })

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.userService.remove(+id);
  }
}
