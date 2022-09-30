import React, { useCallback, useEffect, useState } from 'react';
import { Image, Container, SimpleGrid, Flex, Stack, Text } from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { getUserByNickname, getLoginUserData } from '../../api/api';
import styled from 'styled-components';
import IUserProps from '../interface/IUserProps'
import { useParams } from 'react-router';
import MyProfile from './MyProfile';
import AchieveBadge from './Badge';

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
		<Container maxW={'5xl'} py={12} alignContent={'center'}>
			<SimpleGrid columns={{ base: 1, md: 2 }}>
				<Flex>
					<Image
					borderRadius={'full'}
					alt={'profile Picture'}
					src={Userdata?.avatar}
					boxSize={'250'}
					marginLeft={'150'}
					/>
				</Flex>
				<Stack spacing={4} marginTop={5}>
					<Text fontSize='50px' color='#53B7BA' as='b'>{Userdata?.nickname}</Text>
					<Flex>
					<Text
						color={'blue.400'}
						fontWeight={600}
						fontSize={'35px'}
						bg={'blue.50'}
						p={2}
						alignSelf={'flex-start'}
						rounded={'md'}>
						{Userdata?.ratio}%
					</Text>
					<Text
						color={'gray.500'}
						fontWeight={600}
						fontSize={'30px'}
						p={2}
						alignSelf={'flex-start'}
						marginLeft={'4'}>
						{Userdata?.wins}승 {Userdata?.losses}패
					</Text>
					</Flex>
					<AchieveBadge />
				</Stack>
			</SimpleGrid>
		</Container>
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
