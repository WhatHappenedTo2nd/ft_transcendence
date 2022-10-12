import { MenuItem, Text } from '@chakra-ui/react';
import { useQuery } from "react-query";
import { getBlockList } from '../../../../api/api';
import { getCookie } from '../../../../api/cookieFunc';
import { socket } from '../../../../App';
import useWarningAlert from '../../../../hooks/useWarnigAlert';
import IFriendProps from '../../../interface/IFriendProps';
import ICreateRoomResponse from '../../../interface/IChatProps';

export default function GameInviteMenu({label, target}: {label: string; target: string;}) {
	const { setError, WarningDialogComponent } = useWarningAlert();
	const { isLoading, data: block } = useQuery<IFriendProps[]>('block', getBlockList, {refetchInterval: 1000});

	if (isLoading) return <div>Loading</div>

	let blockCheck = false;
	if (block && block.length) {
		for (let i = 0; i < block.length; i++)
		{
			if (target === block[i].nickname)
				blockCheck = true;
		}
	}

	const onJoinRoom = () => () => {
		if (blockCheck){
			setError({
				headerMessage: '입장 실패',
				bodyMessage: '차단한 사람은 게임에 초대할 수 없습니다.'
			})
		}
		else {
			socket.emit('invite-room', { name: target, userIntraId: getCookie("intra_id")}, (response: ICreateRoomResponse) => {
				if (!response.success){
					setError({
						headerMessage: '입장 실패',
						bodyMessage: '현재 상대를 게임에 초대할 수 없습니다.'
					})
				}
			});
		}
	};

	return (
		<>
		<MenuItem onClick={onJoinRoom()}>
			<Text>{label}</Text>
		</MenuItem>
		{WarningDialogComponent}
		</>
	);
}
