import React, { useCallback, useEffect, useState } from 'react';
import { Image, Button, Container, Box } from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { getLoginUserData } from '../../api/api';
import Modal from '../mypage/MyPageModal';
import styled from 'styled-components';

interface UserProps {
	id: number;
	intra_id: string;
	nickname: string;
	avatar: string;
	is_online: boolean;
	now_playing: boolean;
	email: string;
}

function MyPage() {
	
	const [isOpeenModal, setOpenModal] = useState<boolean>(false);
	
	const onClickToggleModal = useCallback(() => {
		setOpenModal(!isOpeenModal);
	}, [isOpeenModal]);

	const {isLoading: amILoading, data:Mydata, error: amIError} = useQuery<UserProps>('me', getLoginUserData);
	if (amILoading) return <h1>Loading</h1>;
	if (amIError) return <h1>Error</h1>;
	// const [users, setUsers] = useState<any>([]);

	// 	useEffect(() => {
	// 		axios.get('/data/userdata.json')
	// 			.then(response => {
	// 				setUsers(response.data);
	// 			});
	// 	}, []);

	return (
		<>
			<Image
				borderRadius='full'
				boxSize='300px'
				src='https://cdn.pixabay.com/photo/2018/05/14/21/43/british-shorthair-3401683_1280.jpg'
				alt='british short hair'
			/>
			<h1>{Mydata?.nickname}</h1>
			<Button onClick={onClickToggleModal}>별명 바꾸기</Button>
			{isOpeenModal && (
				<Modal onClickToggleModal={onClickToggleModal}>
					여기에 childeren이 들어간다고 합니다. 닉네임 수정을 할 수 있도록 해봅시다~
				</Modal>
			)}
			<h1>{Mydata?.email}</h1>
			<Button onClick={onClickToggleModal}>2차 인증</Button>
			{isOpeenModal && (
				<Modal onClickToggleModal={onClickToggleModal}>
					여기에 childeren이 들어간다고 합니다. 2차 인증을 할 수 있도록 해봅시다~
				</Modal>
			)}
		{/* <ul>
			{users.map((user: any) => (
				<li key={user.id}>
					{user.nickname}
				</li>
			))}
		</ul> */}
		</>
	);
}

const Main = styled.main`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h3`
  text-align: center;
`;

const DialogButton = styled.button`
  width: 160px;
  height: 48px;
  background-color: blueviolet;
  color: white;
  font-size: 1.2rem;
  font-weight: 400;
  border-radius: 4px;
  border: none;
  cursor: pointer;

  &:hover {
    transform: translateY(-1px);
  }
`;

export default MyPage;