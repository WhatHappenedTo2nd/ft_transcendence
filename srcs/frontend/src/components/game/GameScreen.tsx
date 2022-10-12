/**
 * Game Screen: 게임화면 설정 및 띄위기
 */
import { useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import styled from 'styled-components';

import PlayerInfo from './GamePlayerInfo';
import GameData from './GameData';
import { IRoom, IUser, IKey, GameState } from '../interface/IGameProps';

/**
 * 게임화면에 대한 Props
 *
 * any type : 사용한다고 꼭 좋은 것만은 아니다.
 *  Typescript의 모든 타입은 any 는 모든 타입을 할당받을 수 있는 타입.
 *  사용자로부터 받은 데이터 혹은 써드 파티 라이브러리 같은 동적인 컨텐츠로 오는 불특정한 값을 컴파일 검사를 하지 않고 사용하고자 할 때 사용한다.
 * 컴파일 중 타입검사를 하지 않으므로 기존의 Javascript와 같이 작업하기에 용이합니다.
 */
interface IGameScreenProps {
	socketProps: Socket;
	roomDataProps: any;
	userDataProps: any;
}

const LeaveButton = styled.button`
	display: inline-block;
	color: white;
	width: 30%;
	font-size: 1em;
	margin: 1em;
	padding: 0.25em 1em;
	border: 2px solid white;
	border-radius: 3px;
	display: block;
`;

const Canvas = styled.canvas`
	width: 100%;
	box-size: border-box;
	border: 3px solid white;
	background-color: black;
`;

/**
 * @function GameScreen
 */
function GameScreen({ socketProps, roomDataProps, userDataProps }: IGameScreenProps) {
	const socket: Socket = socketProps;
	const userData: IUser = userDataProps;
	const room = useRef<IRoom>(roomDataProps);
	/**
	 * JSON.parse
	 *  JSON을 객체로 바꿔준다.
	 *  JSON.parse(text[, reviver])
	 *  text: JSON으로 변환할 문자열.
	 *  reviver: 함수라면, 변환 결과를 반환하기 전에 이 인수에 전달해 변형함.
	 */
	/**
	 * 레퍼런스에서 인증페이지에서 UserData를
	 * localStorage.setItem('user', JSON.stringify(user)); 를 이용해
	 * key:user, value:JSON.stringify(user) 를 저장한 것을 가져온다.
	 *
	 * !!우리가 UserData 저장이 어떻게 되어있는지 확인하고 어떻게 가져올 것인지 수정이 필요하다.
	 */
	const isPlayer: boolean = (userData.id === room.current.paddleOne.gameuser.id || userData.id === room.current.paddleTwo.gameuser.id);

	/**
	 * 게임화면 그리기
	 * GameData에 각 함수 정의
	 */
	const drawGame = (gameData: GameData, roomData: IRoom) => {
		gameData.clear();
		gameData.drawPaddle(roomData.paddleOne);
		gameData.drawPaddle(roomData.paddleTwo);
		gameData.drawNet();
		gameData.drawBall(roomData.ball);
		gameData.drawScore(roomData.paddleOne, roomData.paddleTwo);
	};

	/**
	 * 게임 종료 시 화면
	 * drawCenteredTexture는 GameData에 정의된 함수
	 */
	const gameEnd = (
		roomId: string,
		playerOneName: string,
		playerTwoName: string,
		gameState: GameState,
		gameData: GameData,
	) => {
		if (gameState === GameState.PLAYER_ONE_WIN || gameState === GameState.GAME_SAVED_TWO_OUT || gameState === GameState.GAME_SAVED_ONE_WIN) {
			gameData.drawCenteredTexture(
				`${playerOneName} Won!`,
				gameData.screenWidth / 2,
				gameData.screenHeight / 2,
				100,
				'white'
				);
			}
		else if (gameState === GameState.PLAYER_TWO_WIN || gameState === GameState.GAME_SAVED_ONE_OUT || gameState === GameState.GAME_SAVED_TWO_WIN) {
			gameData.drawCenteredTexture(
				`${playerTwoName} Won!`,
				gameData.screenWidth / 2,
				gameData.screenHeight / 2,
				100,
				'white'
			);
		}
	};

	useEffect(() => {
		let animationFrameId: number;

		//Key Arrow Down Event
		const keyDownEvent = (event: KeyboardEvent) => {
			const keyData: IKey = {
				roomId: room.current.roomId,
				key: event.key,
				id: userData.id,
			};
			if (event.repeat) return;
			socket.emit('keyDown', keyData);
		};

		//Key Arrow UP Event
		const keyUpEvent = (event: KeyboardEvent) => {
			const keyData: IKey = {
				roomId: room.current.roomId,
				key: event.key,
				id: userData.id,
			};
			if (event.repeat) return;
			socket.emit('keyUp', keyData);
		};

		const gameData = new GameData(room.current);
		if (isPlayer) {
			window.addEventListener('keyup', keyUpEvent);
			window.addEventListener('keydown', keyDownEvent);
		}

		/**
		 * 서버외 소켓통신
		 * socket.on : receive a message from the server
		 * socket.emit: send a message to the server
		 */
		socket.on('updateRoom', (updatedRoom: string) => {
			const roomData: IRoom = JSON.parse(updatedRoom);
			room.current = roomData;
		});

		/**
		 * 게임의 상태를 확인하여 각 이벤트를 처리하면서 게임 루프를 계속해서 돌린다.
		 */
		const gameLoop = () => {
			if (room.current.gameState !== GameState.PLAYER_ONE_WIN && room.current.gameState !== GameState.PLAYER_TWO_WIN && isPlayer)
				socket.emit('requestUpdate', room.current.roomId);
			drawGame(gameData, room.current);
			if (room.current.gameState === GameState.WAITING) {
				gameData.drawWaiting();
			}
			else if (room.current.gameState === GameState.STARTING) {
				gameData.drawStartCountDown('READY');
			}
			else if (room.current.gameState === GameState.PAUSED) {
				gameData.drawPasuesState();
			}
			else if (room.current.gameState === GameState.RESUMED) {
				gameData.drawStartCountDown('READY');
			}
			else if (room.current.gameState === GameState.PLAYER_ONE_WIN || room.current.gameState ===  GameState.GAME_SAVED_ONE_OUT || room.current.gameState === GameState.PLAYER_TWO_WIN || room.current.gameState === GameState.GAME_SAVED_TWO_OUT || room.current.gameState === GameState.GAME_SAVED_ONE_WIN || room.current.gameState === GameState.GAME_SAVED_TWO_WIN) {
				gameData.clear();
				gameEnd(room.current.roomId, room.current.paddleOne.gameuser.nickname, room.current.paddleTwo.gameuser.nickname, room.current.gameState, gameData);
			}
			animationFrameId = window.requestAnimationFrame(gameLoop);
		}

		gameLoop();

		/**
		 * @function window
		 * requestAnimationFrame
		 * cancelAnimationFrame
		 * removeEventListener
		 */
		return () => {
			if (animationFrameId) window.cancelAnimationFrame(animationFrameId);
			if (isPlayer) {
				window.removeEventListener('keydown', keyDownEvent);
				window.removeEventListener('keyup', keyUpEvent);
			}
		};
	}, [isPlayer, socket, userData.id]);

	const leaveRoom = () => {
		socket.emit('leaveRoom', room.current.roomId);
	};

	return (
		<div>
			<>
			<LeaveButton onClick={leaveRoom} type="button">
				게임 방 나가기
			</LeaveButton>
			<PlayerInfo leftPlayer={room.current.paddleOne} rightPlayer={room.current.paddleTwo} />
			</>
			<Canvas id="pong-canvas" width="1920" height="1080" />
		</div>
	);
}

export default GameScreen;

/**
 * Player Info 주석처리 -> 게임 화면 위에 유저 정보표시
 */
