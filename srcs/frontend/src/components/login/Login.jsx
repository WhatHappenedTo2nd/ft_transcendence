import React from "react";
import { Button } from '@chakra-ui/react';

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
