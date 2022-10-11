import { MenuItem, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useQuery } from "react-query";
import { useNavigate, useParams } from 'react-router-dom';
import { getBlockList, getWhereAreYou } from '../../../../api/api';
import { getCookie } from '../../../../api/cookieFunc';
import { socket } from '../../../../App';
import useWarningAlert from '../../../../hooks/useWarnigAlert';
import ICreateRoomResponse from '../../../interface/IChatProps';
import IChatListProps from '../../../interface/IChatListProps';
import IFriendProps from '../../../interface/IFriendProps';

export default function GameInviteMenu({label, target}: {label: string; target: string;}) {
	const navigate = useNavigate();
	const { setError, WarningDialogComponent } = useWarningAlert();
	const [password, setPassword] = useState('');
	const { data: chat } = useQuery<IChatListProps>(['findroom', target], () => getWhereAreYou(target));
	const { data: block } = useQuery<IFriendProps[]>('block', getBlockList);
	const roomId = Number(useParams<'roomName'>().roomName);
	const [userRes, setUserRes] = useState('');

	let blockCheck = false;
	for (let i = 0; i < block!.length; i++)
	{
		if (target === block![i].nickname)
			blockCheck = true;
	}

	console.log("label: ", label, "target: ", target);
	const onJoinRoom = (roomName?: string) => () => {
		if (blockCheck){
			setError({
				headerMessage: '입장 실패',
				bodyMessage: '차단한 사람은 게임에 초대할 수 없습니다.'
			})
		}
		else {
			console.log("게임 초대 버튼으로 게임 방을 만듭니다.");
			socket.emit('leave-room', { roomId, roomName, userIntraId: getCookie("intra_id") }, () => {
				console.log("기존에 있던 방을 나왔습니다.");
			});
			setPassword(target);
			console.log("password를 확인합니다.", password);
			socket.emit('create-room', { roomName: target, password, userIntraId: getCookie("intra_id") }, (response: ICreateRoomResponse) => {
				console.log("새로운 방을 만듭니다.");
				if (!response.success)
				return alert(response.payload);
				navigate(`/room/${response.payload}`);
			});
			console.log("새로 만든 방에 들어왔습니다.");
			console.log("==========================");
			socket.emit('invite-room', { roomId, roomName, name: target }, (response: ICreateRoomResponse) => {
				console.log("타겟이 기존에 있던 방을 나왔습니다.");
				if (!response.success)
				return alert(response.payload);
				setUserRes(response.payload);
				console.log("invite room 확인", response.payload);
			});

			console.log("userRes를 확인합니다.", userRes);
			socket.emit('join-room', {roomName, userIntraId: userRes}, (response: ICreateRoomResponse) => {
				console.log('join-room를 실행합니다.');
				if (!response.success)
				return alert(response.payload);
				console.log("joinRoom: payload", response.payload);
				navigate(`/room/${response.payload}`);
			});
		}
	};

	// useEffect(() => {
	// 	socket.on('invite-room', (res: ICreateRoomResponse) => {
	// 		console.log("payload: ", res.payload, "roomName: ", res.roomName);
	// 		socket.emit('join-room', {roomName: res.roomName, userIntraId: res.payload}, (response: ICreateRoomResponse) => {
	// 			console.log('join-room를 실행합니다.');
	// 			if (!response.success)
	// 			return alert(response.payload);
	// 			console.log("joinRoom: payload", response.payload);
	// 			navigate(`/room/${response.payload}`);
	// 		});
	// 	});
	// })

	return (
		<>
		<MenuItem onClick={onJoinRoom(chat?.title)}>
			<Text>{label}</Text>
		</MenuItem>
		{WarningDialogComponent}
		</>
	);
}
