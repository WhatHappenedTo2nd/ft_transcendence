import { useNavigate } from "react-router-dom";
import { Divider, Grid, GridItem } from '@chakra-ui/react'
import ChoiceBox from "../login/ChoiceBox";
import ICreateRoomResponse from '../interface/IChatProps';
import { socket } from "../../App";
import { useEffect } from "react";

/**
 * 로그인에 성공하면 나오는 프로필/채팅 선택 페이지
 *
 * @param {*} props
 * @returns 좌측 내비 바와 프로필/채팅 버튼을 묶고 있는 Grid
 */
function ChoicePage() {
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
		  gap={20}>
			<GridItem area={'main'}
			marginRight="auto"
			marginLeft="auto"
			marginTop={180}
			>
				<ChoiceBox
					title="Profile"
					onClick={() => {
						navigate("/profile");
					}}
					/>
				<Divider borderColor="white" borderWidth="50px" />
				<ChoiceBox
					title="Chatting"
					onClick={() => {
						navigate("/chatting");
					}}
					/>
			</GridItem>
		</Grid>
	);
}

export default ChoicePage;
