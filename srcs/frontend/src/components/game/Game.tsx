/**
 * useState, useEffect Hook을 사용
 * styled: JS 안에 CSS를 작성하는 CSS in JS라는 기술.
 * socket.io : node.js 기반 실시간 웹 애플리케이션 지원 라이브러리
 *
 * @install
 * npm install socket.io-client
 * npm install react-query
 * npm install styled-components
 */

import React, { useState, useEffect } from 'react';
import { Socket, io } from 'socket.io-client';
import { useQuery } from 'react-query';
import styled from 'styled-components';

import { GameState, IRoom } from './GameInterface';
import GameScreen from './GameScreen';
import GameRooms from './GameRoom';
import { IMyData } from '../../modules/Interface/chatInterface';
import { getUserData } from '../../modules/api';

/**
 * Game Start
 * Socket: 실시간 통신을 위해 사용
 */
let socket: Socket;

const QueueButtonStyleC = styled.button`
	width: 100%
`;

/**
 * Game Main Function
 */
function Game() {
	const [isDisplayGame, setIsDisplayGame] = useState(false);
	const [room, setRoom] = useState<IRoom | null>(null);
	const [queue, setQueue] = useState(false);
	const [gameRooms, setGameRooms] = useState<IRoom[]>([]);
	const { isLoading, data: userData, error } = useQuery<IMyData>('me', getUserData);
	const joinQueue = (event: React.MouseEvent<HTMLButtonElement>) => {
		socket.emit('joinQueue', event.currentTarget.value);
	};

	const leaveQueue = () => {
		socket.emit('leaveQueue');
	};

	const updateCurrentGames = (currentGameRooms: IRoom[]) => {
		setGameRooms(() => {
			return [...currentGameRooms];
		});
	};

	/**
	 * useEffect라는 Hook을 사용하여 컴포넌트가 마운트 됐을 때(처음 나타났을 때),
	 * 언마운트 됐을 때 (사라질 때), 그리고 업데이트 될 때 (특정 props가 바뀔 때) 특정 작업을 처리
	 */

	/**
	 * socket.io method
	 * client에서 server로 메세지를 보내고
	 * server에서 client로 메세지를 받는다.
	 * socket.on : receive a message from the server
	 * socket.emit: send a message to the server
	 */
	useEffect(() => {
		if (isLoading || !userData || error) return () => {};
		//연결할 서버를 설정
		socket = io('http://localhost:3000/api/games');
		/**
		 * 서버와 연결된 이벤트 처리
		 * 서버에게 메세지 전송
		 */
		socket = socket.on('connect', () => {
			socket.emit('handleUserConnect', userData);
			socket.emit('getCurrentGames');
		});
		//서버로부터 updateCurrentGames 데이터를 받아서 이벤트 처리
		socket.on('updateCurrentGames', (currentGamesData: IRoom[]) => {
			updateCurrentGames(currentGamesData);
		});
		socket.on('newRoom', (newRoomData: IRoom) => {
			if (newRoomData.gameState === GameState.WAITING && userData.nickname !== newRoomData.paddleOne.user.nickname){
				return ;
			}
			socket.emit('joinRoom', newRoomData.roomId);
			setRoom(newRoomData);
			setQueue(false);
		});
		socket.on('joinedQueue', () => {
			setQueue(true);
		});
		socket.on('leavedQueue', () => {
			setQueue(false);
			setRoom(null);
		});
		socket.on('joinedRoom', () => {
			setIsDisplayGame(true);
		});
		socket.on('leavedRoom', () => {
			setIsDisplayGame(false);
		});
		return () => {
			if (socket) {
				socket.off('updateCurrentGames');
				socket.off('newRoom');
				socket.off('joinedQueue');
				socket.off('leavedQueue');
				socket.off('joinedRoom');
				socket.off('leavedRoom');
				socket.disconnect();
			}
			setGameRooms([]);
		};
	}, [userData]);
	if (isLoading || error)
		return null;
	return (
		<div>
			{isDisplayGame ? (
				<GameScreen socketProps={socket} roomDataProps={room} />
			) : (
				<>
					{queue ? (
							<QueueButtonStyleC type="button" onClick={leaveQueue}>
								LEAVE QUEUE
							</QueueButtonStyleC>
						): (
							<div>
								<QueueButtonStyleC type="button" onClick={joinQueue} value="BIG">
									ACTIVE MODE
								</QueueButtonStyleC>
								<QueueButtonStyleC type="button" onClick={joinQueue} value="DEFAULT">
									BASIC MODE
								</QueueButtonStyleC>
							</div>
						)}
						<GameRooms gameRooms={gameRooms} socket={socket} />
				</>
			)}
		</div>
	);
}

export default Game;
