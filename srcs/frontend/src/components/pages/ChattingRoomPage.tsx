import { useNavigate } from "react-router-dom";
import { Box, Grid, GridItem } from '@chakra-ui/react'
import SideBar from "../sidebar/SideBar";
import ChattingRoom from "../chatting/ChattingRoom";
import RandomButton from "../chatting/RandomButton";
/**
 * ChoicePage에서 채팅을 선택하면 나오는 선택 페이지

 */

function ChattingRoomPage() {
	const navigate = useNavigate();

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
						md: `'random'
							'chattingroom'`
						}}
						gap={4}>
					<GridItem area={'random'}>
						<RandomButton
						title="Random"
						onClick={() => {
							navigate("/chattingroom");
							console.log("랜덤 매칭");
						}}/>
					</GridItem>
					<GridItem area={'chattingroom'}>
						<ChattingRoom
							onClick={() => {
								navigate("/chattingroom");
								console.log("채팅방 선택");
							}}
							/>
					</GridItem>
				</Grid>
			</GridItem>
		</Grid>
	);
}

export default ChattingRoomPage;
