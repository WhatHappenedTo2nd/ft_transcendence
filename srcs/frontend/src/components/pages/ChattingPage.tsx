import { useNavigate } from "react-router-dom";
import { Box, Grid, GridItem } from '@chakra-ui/react'
import SideBar from "../sidebar/SideBar";
import Chatting from "../chatting/Chatting";
import RandomButton from "../chatting/RandomButton";
/**
 * ChoicePage에서 채팅을 선택하면 나오는 선택 페이지

 */

function ChattingPage() {
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
			<GridItem area={'nav'}>
				<SideBar />
			</GridItem>
			<GridItem area={'main'}>
				<Grid gridTemplateRows={{
					md: "150px auto"
					}}
					gridTemplateAreas={{
						md: `'random'
							'chat'`
						}}
						gap={4}>
					<GridItem area={'random'}>
						<RandomButton
						title="Random"
						onClick={() => {
							navigate("/chatting");
							console.log("랜덤 매칭");
						}}/>
					</GridItem>
					<GridItem area={'chat'}>
						<Chatting
							onClick={() => {
								navigate("/chatting");
								console.log("채팅방 선택");
							}}
							/>
					</GridItem>
				</Grid>
			</GridItem>
		</Grid>
	);
}

export default ChattingPage;
