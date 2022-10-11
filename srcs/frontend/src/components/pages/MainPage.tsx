import LoginButton from "../login/Login";
import { Container, Spacer } from '@chakra-ui/react';

const login = () => {
	window.location.href = `${process.env.REACT_APP_FT_LOGIN_URI}`;
};

/**
 * 메인 페이지
 *
 * @returns 로고와 로그인 버튼을 묶고 있는 Container
 */
function MainPage() {
	const fontStyle = {
		fontFamily : "Establish",
		fontSize : "72px",
	}

	return (
		<Container>
			<Container h="3xs" />
			<p style={fontStyle}>2기무슨일이고</p>
			<Spacer margin="48px" />
			{/* 로그인 버튼 누르면 42 로그인 화면으로 이동함 */}
			<LoginButton
				title="Login"
				onClick={login}
				/>
			<Container h="3xs" />
		</Container>
	);
}

export default MainPage;
