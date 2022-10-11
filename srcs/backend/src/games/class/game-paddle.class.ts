import { GameUser } from "./game-user.class";
import {
	CANVAS_HEIGHT,
	PADDLE_WIDTH,
	PADDLE_HEIGHT,
	PADDLE_SPEED,
} from '../constant/games.constant';
import { GameMode } from "../enum/games.enum";
import { Logger } from "@nestjs/common";

export interface IPaddle {
	gameuser: GameUser;
	x: number;
	y: number;
	width: number;
	height: number;
	goal: number;
	color: string;
	speed: number;
	mode: GameMode;
}

export class Paddle implements IPaddle {
	private logger: Logger = new Logger('Paddle');
	gameuser: GameUser;
	x: number;
	default_x: number;
	y: number;
	width: number;
	height: number;
	speed: number;
	goal: number;
	color: string;
	up: boolean;
	down: boolean;
	flash: boolean;
	step: number;
	mode: GameMode;

	constructor(gameuser: GameUser, x: number, mode:GameMode) {
		this.gameuser = gameuser;
		this.width = PADDLE_WIDTH;
		if (mode === GameMode.HARD){
			this.height = PADDLE_HEIGHT / 2;
		}
		else {
			this.height = PADDLE_HEIGHT;
		}
		this.x = x;
		this.default_x = x;
		this.y = CANVAS_HEIGHT / 2 - this.height / 2;
		this.speed = PADDLE_SPEED;
		this.goal = 0;
		this.up = false;
		this.down = false;
		this.color = 'white';
		this.mode = mode;
	}

	/** position reset */
	reset(): void {
		this.y = CANVAS_HEIGHT / 2 - this.height / 2;
		this.x = this.default_x;
	}

	update(secondPassed: number): void {
		if (this.up && !this.down) {
			// if (!this.up) {
			// 	this.y -= this.speed * 0;
			// }
			if (this.y <= 0) {
				this.y = 0;
			}
			else {
				this.y -= this.speed * secondPassed;
			}
		}
		else if (this.down && !this.up) {
			// if (!this.down) {
			// 	this.y = this.speed * 0;
			// }
			if (this. y + this.height >= CANVAS_HEIGHT) {
				this.y = CANVAS_HEIGHT - this.height;
			}
			else {
				this.y += this.speed * secondPassed;
			}
		}
	}
}

/**
 * GamePaddle class
 */
