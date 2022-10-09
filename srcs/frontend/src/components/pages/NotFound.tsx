import React from 'react';
import { Box, Image, Text } from '@chakra-ui/react';

/**
 * 404 NotFound
 */

function NotFound() {

	return (
		<Box alignContent={'center'}  py={12} opacity={20}>
			<Text fontSize="7xl"
				fontFamily="welcomeBold"
				bg={'yellow.200'} width={800}
				marginRight='auto'
				marginLeft='auto'
				textAlign='center'
				marginBottom={10}>
					없는 페이지입니다!
			</Text>
			<Image
				src={'https://images.unsplash.com/photo-1589652717521-10c0d092dea9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3270&q=80'}
				width={700}
				marginLeft='auto'
				marginRight='auto'
			/>
			<Text fontSize="7xl"
				fontFamily="welcomeBold"
				bg={'yellow.200'} width={800}
				marginRight='auto'
				marginLeft='auto'
				textAlign='center'
				marginTop={10}
				marginBottom={10}
				>
					주소를 확인하세요!
			</Text>
		</Box>
  );
}

export default NotFound;
