import { MenuItem, Text } from '@chakra-ui/react';
import { useQuery } from "react-query";
import { useNavigate } from 'react-router-dom';
import { getBlockList, getWhereAreYou } from '../../../../api/api';
import { getCookie } from '../../../../api/cookieFunc';
import { socket } from '../../../../App';
import useWarningAlert from '../../../../hooks/useWarnigAlert';
import CreateButton from '../../../chatting/CreateButton';
import IChatListProps from '../../../interface/IChatListProps';
import IFriendProps from '../../../interface/IFriendProps';

export default function GameInviteMenu({label, target}: {label: string; target: string;}) {
	const navigate = useNavigate();
	const { setError, WarningDialogComponent } = useWarningAlert();
	const { data: chat } = useQuery<IChatListProps>(['findroom', target], () => getWhereAreYou(target));
	const { data: block } = useQuery<IFriendProps[]>('block', getBlockList);
	let blockCheck = false;

	for (let i = 0; i < block!.length; i++)
	{
		if (target === block![i].nickname)
			blockCheck = true;
	}

	console.log("label: ", label, "target: ", target);
	const onJoinRoom = (roomName?: string) => () => {
		console.log("게임 초대버튼입니다.");
		if (blockCheck){
			console.log("blockCheck의 값은? ", blockCheck);
			setError({
				headerMessage: '입장 실패',
				bodyMessage: '차단한 사람은 게임에 초대할 수 없습니다.'
			})
		}
		else {
			console.log("게임 초대 버튼으로 게임 방을 만듭니다.");
			socket.emit('create-room', { roomName: target, target, userIntraId: getCookie("intra_id") }, () => {
				navigate(`room/${target}`);
			});
		}
	};

	return (
		<>
		<MenuItem onClick={onJoinRoom(chat?.title)}>
			<Text>{label}</Text>
		</MenuItem>
		{WarningDialogComponent}
		</>
	);
}
