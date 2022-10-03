import { Button, Flex, Modal, ModalOverlay, ModalBody, ModalContent, ModalCloseButton, FormControl, FormLabel, Input, ModalHeader, useDisclosure, ModalFooter } from '@chakra-ui/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { getLoginUserData } from '../../api/api';
import { CheckIcon, EmailIcon } from '@chakra-ui/icons';
import { getCookie } from '../../api/cookieFunc';
import UserProps from '../interface/IUserProps';


export default function CheckTFA() {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [inputValue, setInputValue] = useState('');
	const queryClient = useQueryClient();

	const {data: Mydata} = useQuery<UserProps>('me', getLoginUserData);

	const mailSubmit = async() => {
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
				queryClient.invalidateQueries('me');
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

	const codeSubmit = async() => {
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
		{(!Mydata?.tfaAuthorized) ? <Button variant='outline' colorScheme='teal' marginLeft={'3'} onClick={onOpen}>{<EmailIcon />}</Button> : <CheckIcon alignSelf={'flex-start'} marginLeft={'3'} color="green.300" w={8} h={8}/>}
		
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>2차 인증</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<FormControl onSubmit={mailSubmit} isRequired>
						<FormLabel as='legend'>메일 주소 입력</FormLabel>
						<Flex>
							<Input
								type='email'
								placeholder='2차인증을 진행할 메일주소를 입력해주세요.'
								onChange={(e) => setInputValue(e.target.value)}
							/>
							<Button
								marginLeft={'3'}
								marginBottom={'5'}
								colorScheme='blue'
								mr={3}
								onClick={() => {
									mailSubmit();
								}}>
									메일 전송
							</Button>
						</Flex>
					</FormControl>
					<FormControl onSubmit={codeSubmit} isRequired>
					<FormLabel as='legend'>인증 코드 입력</FormLabel>
					<Flex>
						<Input 
							type='text'
							placeholder='2차인증 코드를 입력해주세요.'
							onChange={(e) => setInputValue(e.target.value)}
						/>
						<Button
							marginLeft={'3'}
							marginBottom={'5'}
							colorScheme='blue'
							mr={3}
							onClick={() => {
								codeSubmit();
								onClose();
							}}>
							코드 확인
						</Button>
					</Flex>
					</FormControl>
				</ModalBody>
				<ModalFooter>
					<Button variant='ghost' onClick={onClose}>취소</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
		</>
	)
}