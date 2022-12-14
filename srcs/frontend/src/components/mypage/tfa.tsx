import { Button, Flex, Modal, ModalOverlay, ModalBody, ModalContent, ModalCloseButton, FormControl, FormLabel, Input, ModalHeader, useDisclosure, ModalFooter } from '@chakra-ui/react';
import axios from 'axios';
import { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { getLoginUserData } from '../../api/api';
import { CheckIcon, EmailIcon } from '@chakra-ui/icons';
import { getCookie } from '../../api/cookieFunc';
import UserProps from '../interface/IUserProps';

//tfa에 관한 모든 부분을 처리합니다.

export default function CheckTFA() {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [inputValue, setInputValue] = useState('');
	const queryClient = useQueryClient();

	const {data: Mydata} = useQuery<UserProps>('me', getLoginUserData, {refetchInterval: 1000});

	//메일주소 입력
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
				queryClient.invalidateQueries('Friend');
				queryClient.invalidateQueries('online');
				queryClient.invalidateQueries('roomuser');
				queryClient.invalidateQueries('usernick');
				queryClient.invalidateQueries('block');
				queryClient.invalidateQueries('chat');
				queryClient.invalidateQueries('findroom');
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

	//확인코드 입력
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
				queryClient.invalidateQueries('me');
				queryClient.invalidateQueries('Friend');
				queryClient.invalidateQueries('online');
				queryClient.invalidateQueries('roomuser');
				queryClient.invalidateQueries('usernick');
				queryClient.invalidateQueries('block');
				queryClient.invalidateQueries('chat');
				queryClient.invalidateQueries('findroom');
				return (res);
			})
			.catch((err) => {
				const errMsg = err.response.data.message;
				alert(errMsg);
			});
		else alert('빈칸으로 제출할 수 없습니다.')
	};

	//입력했던 메일주소, 확인 코드 삭제 및 tfa인증 false로 돌림
	const tfaBack = async () => {
		await axios({
			method: 'patch',
			headers: {
				'content-type': 'application/json',
				Authorization: 'Bearer ' + getCookie("accessToken")
			},
				url: '/user/me/cancleTFA',
				data: {
					"email" : null,
					"tfaCode" : null,
					"tfaAuthorized" : false,
				}
			})
			.then((res) => {
				alert(`2차 인증이 취소되었습니다.`);
				queryClient.invalidateQueries('me');
				queryClient.invalidateQueries('Friend');
				queryClient.invalidateQueries('online');
				queryClient.invalidateQueries('roomuser');
				queryClient.invalidateQueries('usernick');
				queryClient.invalidateQueries('block');
				queryClient.invalidateQueries('chat');
				queryClient.invalidateQueries('findroom');
				return (res);
			})
			.catch((err) => {
					const errMsg = err.response.data.message;
					alert(errMsg);
			});
	};

	// tfaAuthorized가 false면 EmailIcon
	// 메일주소와 확인코드를 받는 모달
	// 모두 제대로 들어갔으면 checkIcon으로 변환
	// checkIcon 버튼을 누르면 모든 입력값이 다 초기화
	return (
		<>
		{(!Mydata?.tfaAuthorized) ? <Button variant='outline' colorScheme='teal' marginLeft={'3'} onClick={onOpen}>{<EmailIcon />}</Button> : <Button alignSelf={'flex-start'} marginLeft={'3'} color="green.300" w={10} h={10} onClick={()=>{tfaBack()}}>{<CheckIcon />}</Button>}

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
