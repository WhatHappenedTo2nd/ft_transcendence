import { MenuItem, Text, useDisclosure, useToast } from '@chakra-ui/react';
import { useQuery, useQueryClient } from "react-query";
import { useNavigate } from 'react-router-dom';
import { getWhereAreYou } from '../../../../api/api';
import { getCookie } from '../../../../api/cookieFunc';
import { socket } from '../../../../App';
import CheckPassword from '../../../chatting/CheckPassword';
import IChatListProps from '../../../interface/IChatListProps';

export default function GameSpectactorMenu({label, target}: {label: string; target: string;}) {
	const navigate = useNavigate();
	const { data: chat } = useQuery<IChatListProps>(['findroom', target], () => getWhereAreYou(target));
	const { isOpen, onOpen, onClose } = useDisclosure();
	const onJoinRoom = (roomName?: string) => () => {
		socket.emit('join-room', {roomName, userIntraId: getCookie("intra_id")}, () => {
			navigate(`/room/${roomName}`);
		});
	};

	return (
		<>
		<MenuItem onClick={chat?.is_private? onOpen : onJoinRoom(chat?.title)}>
			<Text>{label}</Text>
		</MenuItem>
		{chat?.is_private ? <CheckPassword chatPassword={chat.password} chatTitle={chat.title}
					isOpen={isOpen} onClose={onClose} />:null}
		</>
	);
}