import { useNavigate } from "react-router-dom";
import { Container, Divider, Box } from '@chakra-ui/react'
import ChoiceBox from "../login/ChoiceBox";
import SideBar from "../sidebar/SideBar";

/**
 * 로그인에 성공하면 나오는 프로필/채팅 선택 페이지
 * 
 * @param {*} props 
 * @returns 프로필/채팅 버튼을 묶고 있는 Wrapper
 */
function ChoicePage() {

	const navigate = useNavigate();

	return (
		<Container maxH="-webkit-max-content" maxW='full' display="flex" flexDirection="row" justifyContent="flex-start" className="test11">
			<Box display="flex" >
				<SideBar />
			</Box>
			<Container display="flex" flexDirection='column'>
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
						navigate("/choice");
						console.log("채팅 선택");
					}}
					/>
			</Container>
		</Container>
	);
}

export default ChoicePage;
