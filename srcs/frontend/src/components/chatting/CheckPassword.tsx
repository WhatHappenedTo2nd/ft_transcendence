import { Button, InputGroup, Input, InputRightElement } from '@chakra-ui/react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from '@chakra-ui/react';
import { socket } from '../../App';
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

interface IFormInput {
	password: string | number;
}

function CheckPassword(props: any) {
	const { chatPassword } = props;
	const { chatTitle } = props;
	const { isOpen } = props;
	const { onClose } = props;
	const navigate = useNavigate();
	const [show, setShow] = useState(false);
	const handleClick = () => setShow(!show);
	const [check, setCheck] = useState(false);
	const { register, handleSubmit } = useForm<IFormInput>();
	const onJoinRoom = (roomName: string) => () => {
		console.log("          check..? :", check);
		if (check === true) {
			socket.emit('join-room', roomName, () => {
				navigate(`/room/${roomName}`);
			});
		}
	};
	const onSubmit = (data: IFormInput) => {
		if (data.password === chatPassword) {
			console.log("before onsubmit check..? :", check);
			setCheck(true);
			console.log("after onsubmit check..? :", check);
			alert('로그인 성공.');
		}
		else {
			alert('비밀번호를 다시 입력해주세요.');
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
			<form onSubmit={handleSubmit(onSubmit)}>
				<ModalHeader>password</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<InputGroup size='md' >
						<Input
							pr='4.5rem'
							type={show ? 'text' : 'password'}
							placeholder='Enter password'
							{...register('password', { required: true, maxLength: 20 })}
						/>
						<InputRightElement width='4.5rem'>
							<Button h='1.75rem' size='sm' onClick={handleClick}>
							{show ? 'Hide' : 'Show'}
							</Button>
						</InputRightElement>
					</InputGroup>
				</ModalBody>
				<ModalFooter>
					<Button
					type="submit"
					colorScheme='blue'
					mr={3}
					onClick={
						onJoinRoom(chatTitle)
						// onClose()
						}>
						Enter
					</Button>
					<Button type="reset" variant='ghost' onClick={onClose}>취소</Button>
				</ModalFooter>
			</form>
			</ModalContent>
		</Modal>
	);
}

export default CheckPassword;
