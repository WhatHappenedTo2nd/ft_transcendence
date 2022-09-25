import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Head, Table } from '../../styles/waiting.styles';
import { io } from 'socket.io-client';

export const socket = io('http://localhost:9633/api/chat');

interface CreateRoomResponse {
	success: boolean;
	payload: string;
}

const WaitingRoom = () => {
	const [rooms, setRooms] = useState<string[]>([]);
	const navigate = useNavigate();

	useEffect(() => {
		const roomListHandler = (rooms: string[]) => {
			setRooms(rooms);
		};
		const createRoomHandler = (newRoom: string) => {
			setRooms((prevRooms) => [...prevRooms, newRoom]);
		};
		const deleteRoomHandler = (roomId: string) => {
			setRooms((prevRooms) => prevRooms.filter((room) => room !== roomId));
		};

		socket.emit('room-list', roomListHandler);
		socket.on('create-room', createRoomHandler);
		socket.on('delete-room', deleteRoomHandler);

		return () => {
			socket.off('room-list', roomListHandler);
			socket.off('create-room', createRoomHandler);
			socket.off('delete-room', deleteRoomHandler);
		};
	}, []);

	const onCreateRoom = useCallback(() => {
		const roomId = prompt('방 이름을 입력해 주세요.');
		if (!roomId)
			return alert('방 이름은 반드시 입력해야 합니다.');

		socket.emit('create-room', roomId, (response: CreateRoomResponse) => {
			if (!response.success)
				return alert(response.payload);
			navigate(`/room/${response.payload}`);
		});
	}, [navigate]);

	const onJoinRoom = useCallback(
		(roomId: string) => () => {
			socket.emit('join-room', roomId, () => {
				navigate(`/room/${roomId}`);
			});
		}, [navigate]
	);

	return (
		<>
		<Head>
			<div>채팅방 목록</div>
			<button onClick={onCreateRoom}>채팅방 생성</button>
		</Head>


		<Table>
			<thead>
			<tr>
				<th>방번호</th>
				<th>방이름</th>
				<th>입장</th>
			</tr>
			</thead>
			<tbody>
			{rooms.map((room, index) => (
				<tr key={room}>
				<td>{index + 1}</td>
				<td>{room}</td>
				<td>
					<button onClick={onJoinRoom(room)}>입장하기</button>
				</td>
				</tr>
			))}
			</tbody>
		</Table>
		</>
	);

};

export default WaitingRoom;