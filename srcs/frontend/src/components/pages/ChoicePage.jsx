import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Divider } from '@chakra-ui/react'
import ChoiceBox from "../login/ChoiceBox";

/**
 * 선택 페이지에서 프로필/채팅 버튼(박스)을 함께 가지고 있는 스타일 태그
 */
const Wrapper = styled.div`
	padding: 16px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`;

/**
 * 로그인에 성공하면 나오는 프로필/채팅 선택 페이지
 * 
 * @param {*} props 
 * @returns 프로필/채팅 버튼을 묶고 있는 Wrapper
 */
function ChoicePage(props) {
	const {} = props;

	const navigate = useNavigate();

	return (
		<Wrapper>
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
		</Wrapper>
	);
}

export default ChoicePage;
