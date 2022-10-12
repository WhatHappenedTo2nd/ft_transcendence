import { Grid, GridItem } from '@chakra-ui/react';
import MyProfile from '../mypage/MyProfile';
import History from '../mypage/History';

function MyProfilePage (){
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
						<MyProfile/>
					</GridItem>
					<GridItem area={'history'}>
						<History/>
					</GridItem>
				</Grid>
			</GridItem>
		</Grid>
	);
}

export default MyProfilePage;
