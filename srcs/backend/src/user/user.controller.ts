import { UserService } from './user.service';
import { Controller, Get, Param } from '@nestjs/common';
import { User } from './user.entity';

@Controller('user')
export class UserController {
	constructor(private userService: UserService){}

	@Get('')
	getUserList(): Promise<User[]> {
		return this.userService.getUserList();
	}

	@Get('/:id')
	getUserById(@Param('id') id:number) {
		return this.userService.getUserById(id);
	}

}
