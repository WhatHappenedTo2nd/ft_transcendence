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

import { GameState, IRoom, IUser } from '../interface/IGameProps';
import GameScreen from './GameScreen';
import GameRooms from './GameRoom';
import { getLoginUserData } from '../../api/api'
/**
 * Game Start
 * Socket: 실시간 통신을 위해 사용
 */
let socket: Socket;

const ChatContainer = styled.div`
	display: flex;
	flex-direction: column;
	border: 1px solid #000;
	padding: 1rem;

	min-height: 360px;
	max-height: 600px;
	width: 100%
	overflow: auto;

	background-color: black;
`;

const QueueButtonStyleC = styled.button`
	height: 50px;
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
	/**
	 * @func useQuery
	 * @see https://velog.io/@dkdlel102/React-%EB%A6%AC%EC%95%A1%ED%8A%B8-%EC%BF%BC%EB%A6%AC-useQuery-%EC%82%AC%EC%9A%A9%EB%B2%95
	 * @see https://kyounghwan01.github.io/blog/React/react-query/basic/
	 *
	 * 서버의 값을 클라이언트로 가져온다.
	 * @param first : unique key
	 * @param second : api call func(promise)
	 * @retrun
	 *  api의 성공, 실패여부, api return 값을 포함한 객체
	 *  loading : 데이터 fetch 중인 상태
	 *  error : 데이터 fetch에 실패한 상태
	 */
	const { isLoading, data: userData, error } = useQuery<IUser>('me', getLoginUserData);

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
	 * client에서 server로 메세지를 보내고, server에서 client로 메세지를 받는다.
	 * socket.on: receive a message from the server
	 * socket.emit: send a message to the server
	 */
	useEffect(() => {
		if (isLoading || !userData || error) return () => {};
		/**
		 * 연결할 서버를 설정
		 * on/emit : 서버와 연결된 이벤트 처리, 서버에게 메세지 전송
		 */
		socket = io('http://localhost:9633/api/games');
		if (socket)
		{
			// console.log("server socket good");
		}
		socket = socket.on('connect', () => {
			socket.emit('handleUserConnect', userData);
			socket.emit('getCurrentGames');
		});
		//서버로부터 updateCurrentGames 데이터를 받아서 이벤트 처리
		socket.on('updateCurrentGames', (currentGamesData: IRoom[]) => {
			updateCurrentGames(currentGamesData);
		});
		socket.on('newRoom', (newRoomData: IRoom) => {
			if (newRoomData.gameState === GameState.WAITING && userData.nickname !== newRoomData.paddleOne.gameuser.nickname){
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
	/**
	 * 서버와 연동 전이라 데이터를 가져올 수 없음.
	 * return NULL에서 걸림 -> 해결
	 */
	if (isLoading || error) {
		return null;
	}

	return (
		<div>
			{isDisplayGame ?
				(
					<>
						<GameScreen socketProps={socket} roomDataProps={room} userDataProps={userData} />
					</>
				) :
				(
					<>
						{queue ?
						(
							<QueueButtonStyleC type="button" onClick={leaveQueue}>
								게임 매칭 취소
							</QueueButtonStyleC>
						) :
						(
							<div>
								<QueueButtonStyleC type="button" onClick={joinQueue} value="HARD">
									ACTIVE MODE
								</QueueButtonStyleC>
								<QueueButtonStyleC type="button" onClick={joinQueue} value="DEFAULT">
									BASIC MODE
								</QueueButtonStyleC>
							</div>
						)}
						{/* <GameRooms gameRooms={gameRooms} socket={socket} /> */}
					</>
				)}
		</div>
	);
}

export default Game;

/**
 * GameRooms 주석처리 및 주석추가
 * GameRooms 테스트 필요
 */
