import { Grid, GridItem } from '@chakra-ui/react';
import MyProfile from '../mypage/MyProfile';
import History from '../mypage/History';
import { useNavigate } from 'react-router-dom';
import { socket } from '../../App';
import ICreateRoomResponse from '../interface/IChatProps';
import { useEffect } from 'react';

function MyProfilePage () {
	const navigate = useNavigate();
	useEffect(() => {
		socket.on('invite-room-end', (response: ICreateRoomResponse) => {
			navigate(`/room/${response.payload}`);
		});
	})

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
