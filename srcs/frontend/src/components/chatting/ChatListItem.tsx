import { Box, Text, Button,  InputGroup, Input, InputRightElement, Container } from '@chakra-ui/react';
import { UnlockIcon, LockIcon } from '@chakra-ui/icons'
import { useState, useCallback } from "react";
import Password from './Password';

function ChatListItem(props: any) {
	const { chat } = props;
	const [show, setShow] = useState(false)
	const handleClick = () => setShow(!show)
	const [isOpenModal, setOpenModal] = useState<boolean>(false);
	const onClickToggleModal = useCallback(() => {
		setOpenModal(!isOpenModal);
	}, [isOpenModal]);

	return (
		<Container key={chat?.id}>
			<Box p='4' display='flex' flex-basis={"auto"} alignItems='baseline'
			style={{border: '1px solid black',borderRadius: '5px'}}
			mx='4' my='4' width='100wh'>
				{chat.is_private ? <LockIcon/> : <UnlockIcon/>}
				<Text text-align="center" paddingX="2">
					{chat?.title}
				</Text>
				<Button type= 'button' onClick={onClickToggleModal}>
					Join
				</Button>
				{chat.is_private && (isOpenModal === true) ?
				(<Password key={chat?.id} onClickToggleModal={onClickToggleModal} >
					<InputGroup size='md' >
						<Input
							pr='4.5rem'
							type={show ? 'text' : 'password'}
							placeholder='Enter password'
						/>
						<InputRightElement width='4.5rem'>
							<Button h='1.75rem' size='sm' onClick={handleClick}>
							{show ? 'Hide' : 'Show'}
							</Button>
						</InputRightElement>
					</InputGroup>
				</Password>): null}
			</Box>
		</Container>
	);
}

export default ChatListItem;
