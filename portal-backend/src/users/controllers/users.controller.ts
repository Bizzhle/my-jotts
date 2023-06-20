import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import {
  ApiBadGatewayResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiCreatedResponse({ description: 'User account registered' })
  @ApiBadGatewayResponse({ description: 'Cannot register user' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  public async registerUserAccount(@Body() dto: CreateUserDto) {
    return await this.usersService.registerUserAccount(dto);
  }
  // create(@Payload() createUserDto: CreateUserDto) {
  //   return this.usersService.create(createUserDto);
  // }

  // @MessagePattern('findAllUsers')
  // findAll() {
  //   return this.usersService.findAll();
  // }

  // @MessagePattern('findOneUser')
  // findOne(@Payload() id: number) {
  //   return this.usersService.findOne(id);
  // }

  // @MessagePattern('updateUser')
  // update(@Payload() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(updateUserDto.id, updateUserDto);
  // }

  // @MessagePattern('removeUser')
  // remove(@Payload() id: number) {
  //   return this.usersService.remove(id);
  // }
}
