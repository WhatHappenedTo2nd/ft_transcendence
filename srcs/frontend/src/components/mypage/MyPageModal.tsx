import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from 'react-query';
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
	Input,
	Image
} from '@chakra-ui/react';
import axios from "axios";
import { getCookie } from "../../api/cookieFunc";

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

// 마이페이지에서 프로필 사진과 닉네임을 수정할 수 있는 모달창입니다

function MyPageModal() {
	const { isOpen, onOpen, onClose } = useDisclosure()
	const [inputValue, setInputValue] = useState('');
	const [previewPhoto, setPreviewPhoto] = useState('');
	const [inputPhoto, setInputPhoto] = useState('');
	const queryClient = useQueryClient();

	const { data: Mydata } = useQuery<UserProps>('me', getLoginUserData);

	useEffect(() => {
		if (Mydata?.avatar) setPreviewPhoto(Mydata.avatar);
	}, [Mydata?.avatar]);

	const handleFile = (e: any) => {
		setInputPhoto(e.target.files[0]);
		setPreviewPhoto(URL.createObjectURL(e.target.files[0]));
	};

	const handleSubmit = async () => {

		if (inputValue || inputPhoto)
			await axios({
				method: 'post',
				headers: {
					'content-type': 'multipart/form-data',
					Authorization: 'Bearer ' + getCookie("accessToken")
				},
				url: '/user/me',
				data: {
					"nickname" : inputValue,
					"file" : inputPhoto
				}
			})
			.then((res) => {
				queryClient.invalidateQueries('me');
				alert(`성공적으로 업데이트 되었습니다.`);
				setInputValue('');
				setInputPhoto('');
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
		<Button onClick={onOpen}>프로필 수정</Button>

		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
			<ModalHeader>프로필 정보 수정</ModalHeader>
			<ModalCloseButton />
			<ModalBody>
				<Image borderRadius='full' boxSize='150px' marginLeft='auto' marginRight='auto' src={previewPhoto}/>
				<FormControl onSubmit={handleSubmit}>
					<FormLabel>아바타 변경</FormLabel>
					<Input
						type='file'
						accept="image/*"
						onChange={(e) => {
							handleFile(e);
						}} />
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
				<Button
				colorScheme='blue'
				mr={3}
				onClick={() => {
					handleSubmit();
					onClose();}}>
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
