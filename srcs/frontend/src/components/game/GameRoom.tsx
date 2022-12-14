import React from 'react';
import { Socket } from 'socket.io-client';
import styled from 'styled-components';

/**
 * GameInterface를 이용해 플레이어의 정보를 가져온다.
 * IRoom: GameInterface안에 있는 Room interface
 */
import PlayerInfo from './GamePlayerInfo';
import { IRoom } from '../interface/IGameProps';

const GameRoomliStyleC = styled.div`
	margin: 30px;
	padding: 20px;
	border: 2px solid white;
	width: 600px;
	text-align: center;
`;

const SpectateButtonStyleC = styled.button`
	margin-top: 10px;
	border: none;
	color: white;
	background-color: black;
`;

interface IGameRoomProps {
	gameRooms: IRoom[];
	socket: Socket;
}

const GameRoomListStyledC = styled.ul`
	/* background-color: red*/
`;

function GameRooms({ gameRooms, socket }: IGameRoomProps) {
	const onEnterGameRoom = (event: React.MouseEvent<HTMLButtonElement>) => {
		socket.emit('spectateRoom', event.currentTarget.value);
	};
	return (
		<GameRoomListStyledC>
			{
				gameRooms.map((gameRoom) => {
				return (
					<GameRoomliStyleC key={gameRoom.roomId}>
						<SpectateButtonStyleC onClick={onEnterGameRoom} type="button" value={gameRoom.roomId}>
							관전하기
						</SpectateButtonStyleC>
						<PlayerInfo leftPlayer={gameRoom.paddleOne} rightPlayer={gameRoom.paddleTwo} />
					</GameRoomliStyleC>
				);
			})}
		</GameRoomListStyledC>
	);
}

export default GameRooms;

/**
 * Player Info 주석처리 -> 게임방에 유저 정보 표시
 */
