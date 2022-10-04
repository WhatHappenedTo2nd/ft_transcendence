import { Grid, GridItem } from '@chakra-ui/react';
import MyProfile from '../mypage/MyProfile';
import SideBar from "../sidebar/SideBar";
import History from "../mypage/History";

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
			<GridItem area={'main'}>
				<Grid gridTemplateRows={{
					md: "1fr 1fr"
					}}
					gridTemplateAreas={{
						md: `'myprofile'
							'history'`
						}}
						gap={4}>
					<GridItem area={'myprofile'}
					style={{border: '1px solid black',borderRadius: '5px'}}>
						<MyProfile/>
					</GridItem>
					<GridItem area={'history'}
					style={{border: '1px solid black',borderRadius: '5px'}}>
						<History/>
					</GridItem>
				</Grid>
			</GridItem>
		</Grid>
	);
}

export default MyProfilePage;
