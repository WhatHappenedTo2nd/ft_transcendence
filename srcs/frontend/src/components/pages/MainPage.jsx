import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import LoginButton from "../login/Login";

const Wrapper = styled.div`
	padding: 16px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`;

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
