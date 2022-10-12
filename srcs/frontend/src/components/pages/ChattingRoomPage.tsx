import { useNavigate } from "react-router-dom";
import { Grid, GridItem } from '@chakra-ui/react'
import ChattingRoom from "../chatting/ChattingRoom";
import CreateButton from "../chatting/CreateButton";
import ICreateRoomResponse from '../interface/IChatProps';
import { socket } from "../../App";
import { useEffect } from "react";
/**
 * ChoicePage에서 채팅을 선택하면 나오는 선택 페이지
 */

function ChattingRoomPage() {
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
			<GridItem area={'main'}>
				<Grid gridTemplateRows={{
					md: "150px auto"
					}}
					gridTemplateAreas={{
						md: `'button'
							'chattingroom'`
						}}
						gap={4}>
					<GridItem area={'button'}
						marginLeft="auto"
						marginRight="auto"
						marginTop={30}>
						<CreateButton />
					</GridItem>
					<GridItem area={'chattingroom'}>
						<ChattingRoom />
					</GridItem>
				</Grid>
			</GridItem>
		</Grid>
	);
}

export default ChattingRoomPage;
