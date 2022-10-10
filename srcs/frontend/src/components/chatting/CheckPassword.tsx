import { Button, InputGroup, Input, InputRightElement } from '@chakra-ui/react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from '@chakra-ui/react';
import { socket } from '../../App';
import { useState, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import ICreateRoomResponse from '../interface/IChatProps';
import { getCookie } from "../../api/cookieFunc";

function CheckPassword(props: any) {
	const { chatTitle } = props;
	const { isOpen } = props;
	const { onClose } = props;
	const navigate = useNavigate();
	const [show, setShow] = useState(false);
	const handleClick = () => setShow(!show);
	const [password, setPassword] = useState('');
	const onJoinRoom = useCallback(() => {
		socket.emit('join-room', { roomName: chatTitle, password, userIntraId: getCookie("intra_id") }, (response: ICreateRoomResponse) => {
			if (!response.success)
			return alert("비밀번호가 틀렸습니다.");
			navigate(`/room/${response.payload}`);
		});
	}, [chatTitle, password, navigate]);

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>password</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<form onSubmit={onJoinRoom}>
						<InputGroup size='md' >
							<Input
								pr='4.5rem'
								type={show ? 'text' : 'password'}
								placeholder='Enter password'
								onChange={(e) => setPassword(e.target.value)}
							/>
							<InputRightElement width='4.5rem'>
								<Button h='1.75rem' size='sm' onClick={handleClick}>
								{show ? 'Hide' : 'Show'}
								</Button>
							</InputRightElement>
						</InputGroup>
					</form>
				</ModalBody>
				<ModalFooter>
					<Button
					colorScheme='blue'
					mr={3}
					onClick={() => {
						onJoinRoom();
						onClose();
						setPassword("");
						}}>
						Enter
					</Button>
					<Button variant='ghost' onClick={onClose}>취소</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}

export default CheckPassword;
