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
import { getCookie } from "../../api/cookieFunc";

export default function EditButton() {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [rooms, setRooms] = useState<string[]>([]);
	const [titleValue, setTitleValue] = useState('');
	const [password, setPassword] = useState('');
	const navigate = useNavigate();

	const onEditRoom = useCallback(() => {
		if (!titleValue)
		{
			alert('방 제목 입력은 필수입니다!!');
		}
		if (titleValue) {
			socket.emit('edit-room', { roomName: titleValue, password, userIntraId: getCookie("intra_id") }, (response: ICreateRoomResponse) => {
				if (!response.success)
				return alert(response.payload);
				navigate(`/room/${response.payload}`);
		})}
	}, [titleValue, password, navigate]);

	useEffect(() => {
		const roomListHandler = (rooms: string[]) => {
			setRooms(rooms);
		};
		const createRoomHandler = (newRoom: string) => {
			setRooms((prevRooms) => [...prevRooms, newRoom]);
		};

		socket.on('edit-room', createRoomHandler);

		return () => {
			socket.off('edit-room', createRoomHandler);
		};
	}, []);

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
					mr={2}
					onClick={() => {
						onEditRoom();
						onClose();
						setTitleValue("");
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
