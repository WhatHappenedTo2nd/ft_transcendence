import { canvasWidth, canvasHeigth, IBall, IPlayer, IRoom } from './GameInterface';

type Net = {
	x: number;
	y: number;
	width: number;
	hegiht: number;
};

/**
 * 클래스 내보내기
 *
 * HTMLCanvasElement: <canvas> 요소로 가능한 그래픽 처리, 미디어 처리 등과 관련한 다양한 API를 제공하는 인터페이스이다.
 * CanvasRenderingContext2D
 */
export default class GameData {
	canvas: HTMLCanvasElement;
	context: CanvasRenderingContext2D | null;
	room: any;
	ball: IBall;
	paddleOne: IPlayer;
	paddleTwo: IPlayer;
	degress: number;
	screenWidth: number;
	screenHeight: number;
	net: Net;

	constructor(roomProps: IRoom) {
		this.canvas = document.getElementById('pong-canvas') as HTMLCanvasElement;
		this.context = this.canvas.getContext('2d');
		this.degress = 0;
		this.screenWidth = canvasWidth;
		this.screenHeight = canvasHeigth;
		this.room = roomProps;
		this.ball = this.room.ball;
		this.paddleOne = this.room.paddleOne;
		this.paddleTwo = this.room.paddleTwo;
		this.net = {
			x: canvasWidth / 2 - 10,
			y: 0,
			width: 20,
			hegiht: 50,
		};
	}

	drawRectangle(x: number, y: number, width: number, hegiht: number, color: string)
	{
		console.log("drawRectangle: Net를 체우는 함수입니다");
		if (this.context) {
			this.context.save();
			this.context.fillStyle = color;
			this.context.fillRect(x, y, width, hegiht);
			this.context.restore();
		}
	}

	drawPaddle(paddleData: IPlayer)
	{
		console.log("drawPaddle: 패들을 그리는 함수입니다");
		if (this.context) {
			this.context.save();
			this.context.fillStyle = paddleData.color;
			this.context.fillRect(paddleData.x, paddleData.y, paddleData.width, paddleData.height);
			this.context.restore();
		}
	}

	drawBall(ballData: IBall)
	{
		console.log("drawBall: 공을 그리는 함수입니다");
		if (this.context) {
			this.context.save();
			this.context.beginPath();
			this.context.arc(ballData.x, ballData.y, ballData.r, 0, 2 * Math.PI);
			this.context.fillStyle = ballData.color;
			this.context.fill();
			this.context.stroke();
			this.context.restore();
		}
	}

	drawTexture(text:string, x:number, y:number, size: number, color: string)
	{
		console.log("drawTexture: Texture를 그리는 함수입니다");
		if (this.context) {
			this.context.save();
			this.context.fillStyle = color;
			this.context.font = `${size}px RetroGaming`;
			this.context.fillText(text, x, y);
			this.context.restore();
		}
	}

	drawCenteredTexture(text: string, x: number, y: number, size:number, color: string)
	{
		console.log("drawTexture: Texture를 중앙에 그리는 함수입니다");
		if (this.context) {
			this.context.save();
			this.context.fillStyle = color;
			this.context.font = `${size}px RetroGaming`;
			this.context.textAlign = 'center';
			this.context.fillText(text, x, y);
			this.context.restore();
		}
	}

	drawNet()
	{
		console.log("drawNet: Net를 그리는 함수입니다");
		for (let i = 0; i <= canvasHeigth / 2 - this.net.hegiht; i += this.net.hegiht) {
			this.net.y = i;
			this.drawRectangle(this.net.x, this.net.y, this.net.width, this.net.hegiht, 'black');
			this.drawRectangle(this.net.x, canvasHeigth - (this.net.hegiht + this.net.y), this.net.width, this.net.hegiht, 'black');
			i += 19;
		}
	}

	drawScore(playerOne: IPlayer, playerTwo: IPlayer)
	{
		console.log("drawScore: 점수를 나타내는 함수입니다");
		this.drawTexture(`${playerOne.goal}`, canvasWidth / 4, canvasHeigth / 10, 45, 'black');
		this.drawTexture(`${playerTwo.goal}`, 3 * (canvasWidth / 4), canvasHeigth / 10, 45, 'black');
	}

	drawStartCountDown(countDown: string)
	{
		this.drawCenteredTexture(`${countDown}`, this.screenWidth / 2, this.screenHeight / 2, 90, 'black');
	}

	drawWaiting()
	{
		this.drawCenteredTexture(`WATING`, this.screenWidth / 2, this.screenHeight / 2, 90, 'black');
	}

	drawPasuesState()
	{
		this.drawCenteredTexture(`PAUSED`, this.screenWidth / 2, this.screenHeight / 2, 90, 'black');
	}

	clear () {
		if (this.context)
			this.context.clearRect(0, 0, this.screenWidth, this.screenHeight);
	}
}

/**
 * GameData!!
 * 게임화면을 그릴 때 필요한 함수
 */
