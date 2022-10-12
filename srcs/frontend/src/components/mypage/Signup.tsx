import { useState } from 'react';
import { Image, Container, Flex, Stack, Text, Button } from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { getLoginUserData } from '../../api/api';
import IUserProps from '../interface/IUserProps'
import { useNavigate } from 'react-router';
import MyPageModal from './MyPageModal';
import axios from 'axios';
import { getCookie } from '../../api/cookieFunc';

function SignUp() {
	const [isFirst, setisFirst] = useState(true);
	const navigate = useNavigate();

	const {data: Mydata} = useQuery<IUserProps>('me', getLoginUserData);

	const handleSubmit = async () => {
		await axios({
			method: 'post',
			headers: {
				'content-type': 'application/json',
				Authorization: 'Bearer ' + getCookie("accessToken")
			},
				url: '/user/me/signup',
				data: {
					"is_first" : isFirst
				}
			})
			.then((res) => {
				alert(`즐거운 게임 되세요!👍`);
				setisFirst(Boolean);
				return (res);
			})
			.catch((err) => {
					const errMsg = err.response.data.message;
					alert(errMsg);
			});
	};

	return (
		<Container maxW={'5xl'} py={12} alignContent={'center'}>
			<Text fontFamily='welcomeBold' bg={'blue.50'} textAlign='center' fontSize='3xl' width={400} marginBottom={50} marginLeft='auto' marginRight='auto'>🥳 가입을 환영합니다! 🥳</Text>
				<Flex>
					<Image
					borderRadius={'full'}
					alt={'profile Picture'}
					src={Mydata?.avatar}
					boxSize={'300'}
					marginLeft='auto'
					marginRight='auto'
					/>
				</Flex>
				<Stack spacing={4} marginTop={5} marginLeft='auto' marginRight='auto'>
					<Text fontSize='50px' color='#53B7BA' as='b' fontFamily='Establish' marginRight='auto' marginLeft='auto'>{Mydata?.nickname}</Text>
				</Stack>
				<Flex>
					<Stack width={300} spacing={4} marginRight='auto' marginLeft='auto' marginTop={10}>
						<MyPageModal />
						<Button
							onClick={() => {
								setisFirst(false);
								handleSubmit();
								navigate("/home");
								console.log("게임 시작하기");
							}}
							>시작하기</Button>
					</Stack>
				</Flex>
		</Container>
  );
}

export default SignUp;
