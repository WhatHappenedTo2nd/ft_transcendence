import { MenuItem, Text } from '@chakra-ui/react';
import { useQuery } from "react-query";
import { useNavigate } from 'react-router-dom';
import { getWhereAreYou } from '../../../../api/api';
import { getCookie } from '../../../../api/cookieFunc';
import { socket } from '../../../../App';
import useWarningAlert from '../../../../hooks/useWarnigAlert';
import IChatListProps from '../../../interface/IChatListProps';

export default function GameSpectactorMenu({label, target}: {label: string; target: string;}) {
	const navigate = useNavigate();
	const { setError, WarningDialogComponent } = useWarningAlert();
	const { data: chat } = useQuery<IChatListProps>(['findroom', target], () => getWhereAreYou(target));

	const onJoinRoom = (roomName?: string) => () => {
		if (chat?.is_private) {
			setError({
				headerMessage: '입장 실패',
				bodyMessage: '비밀방은 입장할 수 없습니다.'
			})
		} else {
			socket.emit('join-room', {roomName, userIntraId: getCookie("intra_id")}, () => {
				navigate(`/room/${chat?.id}`);
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