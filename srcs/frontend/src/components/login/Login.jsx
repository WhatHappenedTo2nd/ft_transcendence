import React from "react";
import { Button } from '@chakra-ui/react';

/**
 * 로그인 버튼 만드는 함수
 * 
 * @param title : 버튼 텍스트
 * @param onClick : 버튼 눌렀을 때 발생시킬 이벤트
 * @returns 로그인 버튼
 */

function LoginButton(props) {
	const { title, onClick } = props;

	return <Button
			size='lg'
			height='48px'
			width='200px'
			border='2px'
			borderColor='green.500'
			onClick={onClick}
			>
				{title}
			</Button>;
}

export default LoginButton;
