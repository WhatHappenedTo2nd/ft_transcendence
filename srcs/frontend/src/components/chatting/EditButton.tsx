import { useState, useCallback } from "react";
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	Button,
	useDisclosure,
	FormControl,
	FormLabel,
	Input
} from '@chakra-ui/react';
import { socket } from '../../App';
import { useNavigate } from 'react-router-dom';
import { getCookie } from "../../api/cookieFunc";
import { useQuery } from "react-query";
import IUserProps from "../interface/IUserProps";
import IChatListProps from "../interface/IChatListProps";
import { getLoginUserData, getWhereAreYou } from "../../api/api";

export default function EditButton() {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [password, setPassword] = useState('');
	const navigate = useNavigate();
	const { data: Mydata } = useQuery<IUserProps>('me', getLoginUserData);
	const { data: chat } = useQuery<IChatListProps>(['findroom', Mydata?.nickname], () => getWhereAreYou(Mydata?.nickname));
	const roomId = chat?.id;
	const roomName = chat?.title;

	const onEditRoom = useCallback(() => {
		socket.emit('edit-room', { roomId, roomName, password, userIntraId: getCookie("intra_id")})
	}, [roomId, roomName, password, navigate]);

	return (
	<>
		<Button
			margin="15px"
			height="70px"
			width="200px"
			fontSize="36px"
			fontFamily="Establish"
			colorScheme="#53B7BA"
			textColor="black"
			backgroundColor="#53B7BA"
			border="2px"
			borderColor="#53B7BA"
			_hover={{ bg: '#ebedf0' }}
			_active={{
			  bg: '#dddfe2',
			  transform: 'scale(0.98)',
			  borderColor: '#bec3c9',
			}}
			onClick={onOpen}
			>
			Edit
		</Button>
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>게임 방 세팅 수정</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<FormControl onSubmit={onEditRoom}>
						<FormLabel as='legend' marginTop={3}>비밀번호</FormLabel>
						<Input
							type='text'
							placeholder='영문, 숫자로 최대 20자까지 입력 가능합니다.'
							onChange={(e) => setPassword(e.target.value)}
						/>
					</FormControl>
				</ModalBody>
				<ModalFooter>
					<Button
					colorScheme='blue'
					mr={2}
					onClick={() => {
						onEditRoom();
						onClose();
						setPassword("");}}>
						방 설정 변경
					</Button>
					<Button variant='ghost' onClick={onClose}>취소</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
		</>
	)
}
