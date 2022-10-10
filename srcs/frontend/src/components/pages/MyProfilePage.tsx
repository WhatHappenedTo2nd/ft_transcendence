import { Grid, GridItem, Divider } from '@chakra-ui/react';
import MyProfile from '../mypage/MyProfile';
import SideBar from "../sidebar/SideBar";
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
					md: "1fr 1fr"
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
