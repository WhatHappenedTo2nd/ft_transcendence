import { MenuItem, Text } from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { useQuery } from "react-query";
import { useNavigate, useParams } from 'react-router-dom';
import { getBlockList, getWhereAreYou } from '../../../../api/api';
import { getCookie } from '../../../../api/cookieFunc';
import { socket } from '../../../../App';
import ICreateRoomResponse from '../../../interface/IChatProps';
import useWarningAlert from '../../../../hooks/useWarnigAlert';
import IFriendProps from '../../../interface/IFriendProps';

export default function GameInviteMenu({label, target}: {label: string; target: string;}) {
	const navigate = useNavigate();
	const { setError, WarningDialogComponent } = useWarningAlert();
	const { data: block } = useQuery<IFriendProps[]>('block', getBlockList);

	let blockCheck = false;
	for (let i = 0; i < block!.length; i++)
	{
		if (target === block![i].nickname)
			blockCheck = true;
	}

	// console.log("label: ", label, "target: ", target);
	const onJoinRoom = () => () => {
		if (blockCheck){
			setError({
				headerMessage: '입장 실패',
				bodyMessage: '차단한 사람은 게임에 초대할 수 없습니다.'
			})
		}
		else {
			socket.emit('invite-room', { name: target, userIntraId: getCookie("intra_id")}, () => {});
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
