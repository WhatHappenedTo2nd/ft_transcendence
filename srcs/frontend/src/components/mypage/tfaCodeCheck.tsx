import { Button, IconButton, Icon, Modal, ModalOverlay, ModalBody, ModalContent, ModalCloseButton, FormControl, FormLabel, Input, ModalHeader, useDisclosure, ModalFooter } from '@chakra-ui/react';
import { Text } from '@chakra-ui/layout';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { getLoginUserData } from '../../api/api';
import { CheckIcon, EmailIcon } from '@chakra-ui/icons';
import { getCookie } from '../../api/cookieFunc';

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

export default function CheckTFACode() {
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
				url: '/user/me/tfa:code',
				data: {
					"tfaCode" : inputValue
				}
			})
			.then((res) => {
				alert(`2차인증이 완료되었습니다.`);
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
		{Mydata?.tfaAuthorized ? <CheckIcon color="green.300" w={6} h={6}/> : <Button variant='outline' colorScheme='teal' onClick={onOpen}>{<CheckIcon />}</Button>}

		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>인증 코드 입력</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<FormControl onSubmit={handleSubmit}>
						<FormLabel></FormLabel>
						<Input 
							type='text'
							placeholder='메일로 전달받은 2차인증 코드를 입력해주세요.'
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
						onClose()}}>
						인증 확인
					</Button>
					<Button variant='ghost' onClick={onClose}>취소</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
		</>
	)
}