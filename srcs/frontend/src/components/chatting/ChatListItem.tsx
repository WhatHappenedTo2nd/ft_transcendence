import { Box, Text, Button, Container } from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/react';
import { UnlockIcon, LockIcon } from '@chakra-ui/icons'
import { getLoginUserData } from '../../api/api';
import IUserProps from '../interface/IUserProps';
import { useQuery } from 'react-query';
import { socket } from '../../App';
import { useState, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import CheckPassword from './CheckPassword';

function ChatListItem(props: any) {
	const { chat } = props;
	const { isLoading: amILoading, data: Mydata, error: amIError } = useQuery<IUserProps>('me', getLoginUserData);
	const navigate = useNavigate();
	const [name, setNickname] = useState<string>('');
	const { isOpen, onOpen, onClose } = useDisclosure();
	const onJoinRoom = (roomName: string) => () => {
		if (Mydata?.nickname)
			setNickname(Mydata.nickname);
		socket.emit('join-room', roomName, () => {
			navigate(`/room/${roomName}`);
		});
	};

	return (
		<Container key={chat?.id}>
			<Box p='4' display='flex' flex-basis={"auto"} alignItems='baseline'
			style={{border: '1px solid black',borderRadius: '5px'}}
			mx='4' my='4' width='100wh'>
				{chat.is_private ? <LockIcon/> : <UnlockIcon/>}
				<Text text-align="center" paddingX="2">
					{chat?.title}
				</Text>
				<Button onClick={chat.is_private?onOpen :onJoinRoom(chat.title)}>
					Join
				</Button>
				{chat.is_private? <CheckPassword chatPassword={chat.password} chatTitle={chat.title}
					isOpen={isOpen} onClose={onClose} />:null}
			</Box>
		</Container>
	);
}

export default ChatListItem;

