import React, { PropsWithChildren, useState } from "react";
import styled from "styled-components";
import { useQuery } from 'react-query';
import { getLoginUserData } from '../../api/api';
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
	FormErrorMessage,
	FormHelperText,
	Input,
	Image
} from '@chakra-ui/react';
import axios from "axios";

interface UserProps {
	id: number;
	intra_id: string;
	nickname: string;
	avatar: string;
	is_online: boolean;
	now_playing: boolean;
	email: string;
}

function MyPageModal() {
	const { isOpen, onOpen, onClose } = useDisclosure()
	const [inputValue, setInputValue] = useState('');

	const {data:Mydata} = useQuery<UserProps>('me', getLoginUserData);


	const handleSubmit = async () => {
		const formData = new FormData();
		formData.append("nickname", inputValue);
		// formData.append('avatar', inputAvatar);
		if (inputValue)
			await axios
				.patch('data/loginuserdata.json', formData)
				.then((res) => {
					alert(res.data.message);
					setInputValue('');
				return (res);
				// handleClose();
			})
			.catch((err) => {
					console.log(inputValue);
					console.log(formData.append);
					const errMsg = err.response.data.message;
					alert(errMsg);
			});
		else alert('빈칸으로 제출할 수 없습니다.')
	};

	return (
		<>
		<Button onClick={onOpen}>프로필 수정</Button>

		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
			<ModalHeader>프로필 정보 수정</ModalHeader>
			<ModalCloseButton />
			<ModalBody>
				<Image borderRadius='full' boxSize='150px' marginLeft='auto' marginRight='auto' src={Mydata?.avatar}/>
				<FormControl onSubmit={handleSubmit}>
					<FormLabel>아바타 변경</FormLabel>
					<Input type='file' />
					<FormLabel>닉네임 변경</FormLabel>
					<div>현재 닉네임 : {Mydata?.nickname} </div>
					<Input
						type='text'
						placeholder='변경할 닉네임을 입력해주세요.'
						onChange={(e) => setInputValue(e.target.value)}
					/>
				</FormControl>
			</ModalBody>

			<ModalFooter>
				<Button colorScheme='blue' mr={3} onClick={handleSubmit}>
					수정 완료
				</Button>
				<Button variant='ghost' onClick={onClose}>취소</Button>
			</ModalFooter>
			</ModalContent>
		</Modal>
		</>
	)
}

export default MyPageModal;