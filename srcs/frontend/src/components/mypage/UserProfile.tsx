import { Image, Container, SimpleGrid, Flex, Stack, Text, GridItem, Grid } from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { getUserByNickname, getLoginUserData } from '../../api/api';
import IUserProps from '../interface/IUserProps'
import { useNavigate, useParams } from 'react-router';
import { getGameHistory } from '../../api/api';
import { IMatch } from '../interface/IGameProps'
import styled from 'styled-components';
import './styles.css';
import DirectMessage from './DM';

const GameMatchBox = styled.div`
	grid-area: matchDiv;
	display: grid;
	grid-template-rows: repeat(1fr);
	text-align: center;
	grid-gap: 1rem;
	place-items: center;
	overflow: scroll;
`;

const InnerDiv = styled.div`
	border: 1px dashed white;
	width: 100%;
	border-radius: 10px;
	padding: 0.5rem;
	display: grid;
	place-items: center;
	grid-template-areas:
	'matchImgA winA vs winB matchImgB'
	'matchNicknameA matchScoreA . matchScoreB matchNicknameB';
`;

/**
 * 다른 유저 정보 리턴
 * profile/내닉네임 링크에 들어갈 경우 마이페이지(profile)로 리디렉션
 * 2차인증이 완료됐을 경우 Authorized 뱃지가 생김!
 */

function UserProfile() {
	const params = useParams();
	const navigate = useNavigate();
	const { isLoading: amILoading, data: Userdata, error: amIError } = useQuery<IUserProps>(['usernick', params.nickname], () => getUserByNickname(params.nickname));
	const { data: MyHistory } = useQuery<IMatch[] | undefined>(['matchHistory', Userdata?.id], () => getGameHistory(Userdata?.id));
	const { isLoading: MydataLoading, data:Mydata , error: MydataError } = useQuery<IUserProps>('me', getLoginUserData);
	if (amILoading || MydataLoading) return <h1>Loading</h1>;
	if (amIError || MydataError) return <div>Error</div>;
	const matchImgList = MyHistory?.map((history) => (
		<InnerDiv key={history?.id}>
			<div className="matchImgDiv" id="matchImgA">
				<img src={history?.winner.id === Userdata?.id ? history?.winner.avatar : history?.loser.avatar} alt="winner" className="matchImg"/>
			</div>
			<span className="innerSpan" id="matchNameA">
				{history?.winner.id === Userdata?.id ? history?.winner.nickname : history?.loser.nickname}
			</span>
			<span className="innerSpan" id="winA">
				{history?.winner.id === Userdata?.id ? "Win" : "Lose"}
			</span>
			<span className="innerSpan" id="matchScoreA">
				{history?.winner.id === Userdata?.id ? history?.win_score : history?.lose_score}
			</span>
			<p id="vs">VS</p>
			<div className="matchImgDiv" id="matchImgB">
				<img src={history?.winner.id === Userdata?.id ? history?.loser.avatar : history?.winner.avatar} alt="loser" className="matchImg"/>
			</div>
			<span className="innerSpan" id="matchNameB">
				{history?.winner.id === Userdata?.id ? history?.loser.nickname : history?.winner.nickname}
			</span>
			<span className="innerSpan" id="winB">
				{history?.winner.id === Userdata?.id ? "Lose" : "Win"}
			</span>
			<span className="innerSpan" id="matchScoreB">
				{history?.winner.id === Userdata?.id ? history?.lose_score : history?.win_score}
			</span>
		</InnerDiv>
	));

	if (Userdata?.nickname === Mydata?.nickname)
		navigate("/profile");

	return (
		<Grid gridTemplateColumns={{
			base: "9fr",
			md: "2fr 7fr"
			}}
			gridTemplateAreas={{
				md: `'nav main'`
			}}
			gap={4}>
			<GridItem area={'main'} marginTop={10}>
				<Grid gridTemplateRows={{
					md: "300px auto"
				}}
					gridTemplateAreas={{
						md: `'myprofile'
						'history'`
					}}
						gap={10}>
					<GridItem area={'myprofile'}>
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
										<DirectMessage
										target={Userdata!.nickname}
										/>
								</Stack>
							</SimpleGrid>
						</Container>
					</GridItem>
					<GridItem area={'history'}>
						<div>
							<GameMatchBox>{matchImgList}</GameMatchBox>
						</div>
					</GridItem>
				</Grid>
			</GridItem>
		</Grid>
  );
}

export default UserProfile;
