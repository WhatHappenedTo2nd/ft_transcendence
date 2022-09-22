export class ChatDto {
	id: number;

	title: string;

	password: string;

	is_private: boolean;

	now_playing: boolean;
}

export class ChatUserDto {
	id: number;

	is_muted:boolean;
}
