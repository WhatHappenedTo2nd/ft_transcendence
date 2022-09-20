import { useNavigate } from "react-router-dom";
import { Divider, Grid, GridItem } from '@chakra-ui/react'
import ChoiceBox from "../login/ChoiceBox";
import SideBar from "../sidebar/SideBar";

/**
 * 로그인에 성공하면 나오는 프로필/채팅 선택 페이지
 *
 * @param {*} props
 * @returns 좌측 내비 바와 프로필/채팅 버튼을 묶고 있는 Grid
 */
function ChoicePage() {
	const navigate = useNavigate();
	const loginUser = "yjungpong"

	return (
		<Grid gridTemplateColumns={{
			base: "9fr",
			md: "2fr 7fr"
		  }}
		  gridTemplateAreas={{
			md: `'nav main'`
		  }}
		  gap={4}>
			<GridItem area={'nav'} className="test">
				<SideBar />
			</GridItem>
			<GridItem area={'main'}>
				<ChoiceBox
					title="Profile"
					onClick={() => {
						navigate("/choice");
						console.log("프로필 선택");
					}}
					/>
				<Divider borderColor="black" borderWidth="1px" />
				<ChoiceBox
					title="Chatting"
					onClick={() => {
						navigate("/chattingroom");
						console.log("채팅 선택");
					}}
					/>
			</GridItem>
		</Grid>
	);
}

export default ChoicePage;
