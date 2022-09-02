import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/user/user.repository';

@Injectable()
export class AuthService {
	constructor(
		private userRepository: UserRepository
	) { }
}
