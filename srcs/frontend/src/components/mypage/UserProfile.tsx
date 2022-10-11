import { Image, Container, SimpleGrid, Flex, Stack, Text } from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { getUserByNickname, getLoginUserData } from '../../api/api';
import IUserProps from '../interface/IUserProps'
import { useNavigate, useParams } from 'react-router';

/**
 * 다른 유저 정보 리턴
 * profile/내닉네임 링크에 들어갈 경우 마이페이지(profile)로 리디렉션
 * 2차인증이 완료됐을 경우 Authorized 뱃지가 생김!
 */

function UserProfile() {
	const params = useParams();
	const navigate = useNavigate();
	const {isLoading: amILoading, data: Userdata, error: amIError} = useQuery<IUserProps>(['usernick', params.nickname], () => getUserByNickname(params.nickname));
	const {data:Mydata} = useQuery<IUserProps>('me', getLoginUserData);
	if (amILoading) return <h1>Loading</h1>;
	if (amIError) return <h1>Error</h1>;

	if (Userdata?.nickname === Mydata?.nickname)
		navigate("/profile");

	return (
		<Container maxW={'5xl'} py={12} alignContent={'center'}>
			<SimpleGrid columns={{ base: 1, md: 2 }}>
				<Flex>
					<Image
					borderRadius={'full'}
					alt={'profile Picture'}
					src={Userdata?.avatar}
					boxSize={'250'}
					marginLeft={'130'}
					/>
				</Flex>
				<Stack spacing={4} marginTop={5}>
					<Text fontSize='50px' color='#53B7BA' as='b' fontFamily='Establish'>{Userdata?.nickname}</Text>
					<Flex>
					<Text
						color={'blue.400'}
						fontWeight={600}
						fontSize={'35px'}
						fontFamily="welcomeBold"
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
						fontFamily="welcomeRegular"
						p={2}
						alignSelf={'flex-start'}
						marginLeft={'4'}>
						{Userdata?.wins}승 {Userdata?.losses}패
					</Text>
					</Flex>
				</Stack>
			</SimpleGrid>
		</Container>
  );
}

export default UserProfile;
