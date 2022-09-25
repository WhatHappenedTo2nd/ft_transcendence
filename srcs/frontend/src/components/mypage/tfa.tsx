import { Button, IconButton, Icon, Modal, ModalOverlay, ModalBody, ModalContent, ModalCloseButton, FormControl, FormLabel, Input, ModalHeader, useDisclosure, ModalFooter } from '@chakra-ui/react';
import { Text } from '@chakra-ui/layout';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { getLoginUserData } from '../../api/api';
import { CheckIcon, EmailIcon } from '@chakra-ui/icons';
import { getCookie } from '../../api/cookieFunc';
import CheckTFACode from './tfaCodeCheck';

interface UserProps {
	id: number;
	intra_id: string;
	nickname: string;
	avatar: string;
	is_online: boolean;
	now_playing: boolean;
	email: string;
	tfaCode: string;
	tfaAuthorized: boolean;
}


export default function CheckTFA() {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [inputValue, setInputValue] = useState('');

	const {data: Mydata} = useQuery<UserProps>('me', getLoginUserData);

	const handleSubmit = async() => {
		if (inputValue)
			await axios({
				method: 'post',
				headers: {
					'content-type': 'application/json',
					Authorization: 'Bearer ' + getCookie("accessToken")
				},
				url: '/user/me/tfa',
				data: {
					"email" : inputValue
				}
			})
			.then((res) => {
				alert(`메일이 발송되었습니다. 2차인증을 진행해주세요.`);
				setInputValue('');
				return (res);
			})
			.catch((err) => {
				const errMsg = err.response.data.message;
				alert(errMsg);
			});
		else alert('빈칸으로 제출할 수 없습니다.')
	};

	return (
		<>
		{Mydata?.tfaAuthorized ? <CheckIcon color="green.300" w={6} h={6}/> : <Button variant='outline' colorScheme='teal' onClick={onOpen}>{<EmailIcon />}</Button>}
		
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>2차 인증</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<FormControl onSubmit={handleSubmit}>
						<FormLabel></FormLabel>
						<Input 
							type='text'
							placeholder='2차인증을 진행할 메일주소를 입력해주세요.'
							onChange={(e) => setInputValue(e.target.value)}
						/>
					</FormControl>
				</ModalBody>

				<ModalFooter>
					<Button
					colorScheme='blue'
					mr={3}
					onClick={() => {
						handleSubmit();
						onClose();
						// <CheckTFACode />
						}}>
						메일 전송
					</Button>
					<Button variant='ghost' onClick={onClose}>취소</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
		</>
	)
}