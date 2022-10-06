import { useNavigate } from "react-router-dom";
import { Grid, GridItem } from '@chakra-ui/react'
import ChattingRoom from "../chatting/ChattingRoom";
import RandomButton from "../chatting/RandomButton";
import CreateButton from "../chatting/CreateButton";
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
						md: `'button'
							'chattingroom'`
						}}
						gap={4}>
					<GridItem area={'button'}>
						<Grid gridTemplateColumns={{
							md: "1fr 1fr"
							}}
							gridTemplateAreas={{
								md: `'random create'`
								}}>
							<GridItem area={'random'}>
								<RandomButton
								title="Random"
								onClick={() => {
									navigate("/chattingroom");
									console.log("랜덤 매칭");
								}}/>
							</GridItem>
							<GridItem area={'create'}>
								<CreateButton />
							</GridItem>
						</Grid>
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
