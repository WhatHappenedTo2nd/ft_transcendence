import React, {useEffect, useState, useCallback } from "react";
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
	Flex,
	Input
} from '@chakra-ui/react';
import { socket } from '../../App';
import ICreateRoomResponse from '../interface/IChatProps';
import { useNavigate } from 'react-router-dom';

function CreateButton() {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [rooms, setRooms] = useState<string[]>([]);
	const [titleValue, setTitleValue] = useState('');
	const [password, setPassword] = useState('');
	const navigate = useNavigate();

	const onCreateRoom = useCallback(() => {
		console.log(titleValue);
		if (titleValue) {
			socket.emit('create-room', titleValue, password, (response: ICreateRoomResponse) => {
				if (!response.success)
					return alert(response.payload);
				navigate(`/room/${response.payload}`);
		})}
	}, [navigate]);

	useEffect(() => {
		const roomListHandler = (rooms: string[]) => {
			setRooms(rooms);
		};
		const createRoomHandler = (newRoom: string) => {
			setRooms((prevRooms) => [...prevRooms, newRoom]);
		};

		socket.emit('room-list', roomListHandler);
		socket.on('create-room', createRoomHandler);

		return () => {
			socket.off('room-list', roomListHandler);
			socket.off('create-room', createRoomHandler);
		};
	}, []);

	return (
	<>
		<Button
			margin="30px"
			height="70px"
			width="200px"
			fontSize="36px"
			fontFamily="Establish"
			colorScheme="#53B7BA"
			textColor="black"
			backgroundColor="#53B7BA"
			border="2px"
			borderColor="#53B7BA"
			onClick={onOpen}
			>
			Create
		</Button>;
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>게임 방 생성</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<FormControl onSubmit={onCreateRoom}>
						<FormLabel as='legend'>방 제목</FormLabel>
							<Input
								type='text'
								placeholder='최대 20자 입력 가능합니다.'
								onChange={(e) => setTitleValue(e.target.value)}
							/>
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
					mr={3}
					onClick={() => {
						console.log(titleValue);
						console.log(">>>>>>>>>>>>>>>");
						onCreateRoom();
						onClose();}}>
						방 생성하기
					</Button>
					<Button variant='ghost' onClick={onClose}>취소</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
		</>
	)
}

export default CreateButton;
