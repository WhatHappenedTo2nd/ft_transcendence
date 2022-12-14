import { Image, Container, Text, Flex, SimpleGrid, Stack } from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { getLoginUserData } from '../../api/api';
import MyPageModal from '../mypage/MyPageModal';
import CheckTFA from '../mypage/tfa';
import UserProps from '../interface/IUserProps';

//말 그대로 마이페이지에 들어가면 나오는 바로 그 부분!
//이미지와 닉네임과 승률이 뜨는 부분입니다. 낫 모달모달

function MyProfile(){
	const {isLoading: amILoading, data:Mydata, error: amIError} = useQuery<UserProps>('me', getLoginUserData, {refetchInterval: 1000});
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
						marginLeft={'130'}
					/>
				</Flex>
				<Stack spacing={4} marginTop={2}>
					<Text fontSize='50px' color='#53B7BA' fontFamily='Establish'>
						{Mydata?.nickname}
					</Text>
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
							{Mydata?.ratio}%
						</Text>
						<Text
							color={'gray.500'}
							fontWeight={600}
							fontSize={'30px'}
							fontFamily="welcomeRegular"
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

export default MyProfile;
