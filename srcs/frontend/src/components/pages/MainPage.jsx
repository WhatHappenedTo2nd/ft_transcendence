import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import LoginButton from "../login/Login";

/**
 * 메인 페이지에서 로고와 로그인 버튼을 함께 가지고 있는 스타일 태그
 */
const Wrapper = styled.div`
	padding: 16px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`;

/**
 * 메인 페이지
 * 
 * @param {*} props 
 * @returns 로고와 로그인 버튼을 묶고 있는 Wrapper
 */
function MainPage(props) {
	const {} = props;

	const navigate = useNavigate();

	return (
		<Wrapper>
			{/* <Logo/> */}
			2기무슨일이고
			<LoginButton
				title="Login"
				onClick={() => {
					navigate("/");
					console.log("login success");
				}}
			/>
		</Wrapper>
	);
}

export default MainPage;
