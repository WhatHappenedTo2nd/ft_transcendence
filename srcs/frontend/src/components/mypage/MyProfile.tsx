import React from 'react';
import { Image, Container, Text, Flex, SimpleGrid, Stack } from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { getLoginUserData } from '../../api/api';
import MyPageModal from '../mypage/MyPageModal';
import styled from 'styled-components';
import CheckTFA from '../mypage/tfa';
import UserProps from '../interface/IUserProps';

interface FeatureProps {
	text: number | undefined;
  }

function MyProfile(){

	const {isLoading: amILoading, data:Mydata, error: amIError} = useQuery<UserProps>('me', getLoginUserData);
	if (amILoading) return <h1>Loading</h1>;
	if (amIError) return <h1>Error</h1>;
  
	return (

	<Container maxW={'5xl'} py={12} alignContent={'center'}>
		<SimpleGrid columns={{ base: 1, md: 2 }}>
				<Flex>
					<Image
						borderRadius={'full'}
						alt={'profile Picture'}
						src={Mydata?.avatar}
						boxSize={'250'}
						marginLeft={'150'}
					/>
				</Flex>
				<Stack spacing={4} marginTop={5}>
					<Text fontSize='50px' color='#53B7BA' as='b'>{Mydata?.nickname}</Text>
					<Flex>
						<Text
							color={'blue.400'}
							fontWeight={600}
							fontSize={'35px'}
							bg={'blue.50'}
							p={2}
							alignSelf={'flex-start'}
							rounded={'md'}>
							{Mydata?.ratio}%
						</Text>
						<Text
							color={'gray.500'}
							fontWeight={600}
							fontSize={'30px'}
							p={2}
							alignSelf={'flex-start'}
							marginLeft={'4'}>
							{Mydata?.wins}승 {Mydata?.losses}패
						</Text>
					</Flex>
					<Flex>
						<MyPageModal />
						<CheckTFA />
					</Flex>
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

export default MyProfile;
