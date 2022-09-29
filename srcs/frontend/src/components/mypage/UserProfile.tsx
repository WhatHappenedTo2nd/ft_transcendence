import React, { useCallback, useEffect, useState } from 'react';
import { Image, Button, Container, Box, useDisclosure, Text } from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { getUserByNickname, getLoginUserData } from '../../api/api';
import styled from 'styled-components';
import IUserProps from '../interface/IUserProps'
import { useParams } from 'react-router';
import MyProfile from './MyProfile';

type Props = {
	data: IUserProps;
};

/**
 * 다른 유저 정보 리턴
 * 내 닉네임이 들어갈 경우 마이페이지로 리디렉션
 */

function UserProfile() {
	const params = useParams();
	const {isLoading: amILoading, data: Userdata, error: amIError} = useQuery<IUserProps>(['usernick', params.nickname], () => getUserByNickname(params.nickname));
	const {data:Mydata} = useQuery<IUserProps>('me', getLoginUserData);
	if (amILoading) return <h1>Loading</h1>;
	if (amIError) return <h1>Error</h1>;

	if (Userdata?.nickname == Mydata?.nickname)
		return <MyProfile />;

	return (
    <Main>
			<Image
				borderRadius='full'
				boxSize='200px'
				src={Userdata?.avatar}
				alt='intra profile avatar'
        />
			<Text fontSize='30px' color='#53B7BA' as='b'>{Userdata?.nickname}</Text>
		</Main>
	);
}


const Main = styled.main`
  width: 100%;
  height: 50vh;
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

export default UserProfile;
