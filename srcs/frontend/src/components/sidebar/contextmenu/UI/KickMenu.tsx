import { MenuItem, Text, useToast } from '@chakra-ui/react';
import { useQueryClient } from "react-query";
import { useLocation } from 'react-router-dom';
import { socket } from '../../../../App';
import useWarningAlert from "../../../../hooks/useWarnigAlert";
import ICreateRoomResponse from "../../../interface/IChatProps";

export default function KickMenu({label, target}: {label: string; target: string;}) {
	const queryClient = useQueryClient();
	const { setError, WarningDialogComponent } = useWarningAlert();
	const toast = useToast();
	const location = useLocation();
	const roomname = location.pathname.substring(6);
	const onClickHandler = () => {
		socket.emit('kick-room', {roomname, userIntraId: target}, (response: ICreateRoomResponse) => {
			if (!response.success) {
				setError({
					headerMessage: '추방 실패',
					bodyMessage: response.message,
				})
			} else {
				queryClient.invalidateQueries('roomuser');
				toast({
					title: `${label}`,
					description: `${target} 님을 추방하였습니다.`,
					status: 'success',
					duration: 1000,
					isClosable: true,
				});
			}
		});
	}

	return (
		<>
		<MenuItem onClick={onClickHandler}>
			<Text>{label}</Text>
		</MenuItem>
		{WarningDialogComponent}
		</>
	);
}
